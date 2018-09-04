'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesNoTributariaCtrl
 * @description
 * # DevolucionesNoTributariaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesNoTributariaCtrl', function ($scope,$translate,uiGridConstants,financieraRequest,agoraRequest,wso2Request,financieraMidRequest,coreRequest,$location,$window) {

    var ctrl = this;

    ctrl.seleccionMov = true;
    ctrl.FechaOficio = new Date();
    $scope.concepto=[];

    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-check fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.SELECCIONAR'), operacion: 'seleccionar', estado: true },
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];

    ctrl.gridOrdenesDePago = {
      showColumnFooter: true,
      paginationPageSizes: [10, 50, 100],
      paginationPageSize: null,

      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      minRowsToShow: 10,
      useExternalPagination: false,

      columnDefs: [
        {
          field: 'Consecutivo',
          displayName: $translate.instant('CODIGO'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
        },
        {
          field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
          width: '8%',
          displayName: $translate.instant('TIPO'),
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
          },
          headerCellClass: 'encabezado',
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '8%',
          headerCellClass: 'encabezado',
        },
        {
          field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
          displayName: $translate.instant('NO_CRP'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
        },
        {
          field: 'FormaPago.CodigoAbreviacion',
          width: '5%',
          displayName: $translate.instant('FORMA_PAGO'),
          headerCellClass: 'encabezado',
        },
        {
          field: 'Proveedor.Tipopersona',
          width: '10%',
          displayName: $translate.instant('TIPO_PERSONA'),
          headerCellClass: 'encabezado',
        },
        {
          field: 'Proveedor.NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: 'encabezado',
        },
        {
          field: 'Proveedor.NumDocumento',
          width: '10%',
          cellClass: 'input_center',
          displayName: $translate.instant('NO_DOCUMENTO'),
          headerCellClass: 'encabezado',
        },
        {
          field: 'ValorBase',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
          displayName: $translate.instant('VALOR'),
          headerCellClass: 'encabezado',
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: 'encabezado',
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '5%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'encabezado',
        },

      ],
      //onRegisterApi: function(gridApi) {
        //ctrl.gridApi = gridApi;
        //gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          //$scope.estado = row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago;
        //});
      //}
    };

    ctrl.consultarListas= function(){
      financieraRequest.get('forma_pago',
        $.param({
          limit:'-1'
        })
      ).then(function(response){
        ctrl.formasPago = response.data;
      });
      financieraRequest.get('tipo_cuenta_bancaria',
        $.param({
          limit:'-1'
        })
      ).then(function(response){
        ctrl.tiposCuenta = response.data;
      });

      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        var year = parseInt(response.data);
        ctrl.anos = [];
        for (var i = 0; i < 5; i++) {
          ctrl.anos.push(year - i);
        }
      });

      financieraRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });

      coreRequest.get('documento', $.param({
        query:"TipoDocumento.CodigoAbreviacion:TD-DEV",
          limit: -1
      })).then(function(response) {
          ctrl.actas = response.data;
      });

      financieraRequest.get('razon_devolucion', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.razonesDevolucion = response.data;
      });

      agoraRequest.get('parametro_estandar',$.param({
        query:"ClaseParametro:Tipo Documento",
        limit:-1
      })).then(function(response){
        ctrl.tiposdoc = response.data;
      });

      agoraRequest.get('informacion_persona_juridica_tipo_entidad',$.param({
        query:"TipoEntidadId:1",
        limit:-1
      })).then(function(response){
        ctrl.bancos = response.data;
      });
   };

   ctrl.consultarListas();

   $scope.$watch('concepto[concepto.length-1]',function(newvalue,oldvalue){
     if (!angular.isUndefined(newvalue)) {
         financieraRequest.get('concepto', $.param({
             query: "Id:" + newvalue.Id,
             fields: "Rubro",
             limit: -1
         })).then(function(response) {
             newvalue.Rubro = response.data[0].Rubro;
         });
     }
   },true);

   $scope.$watch('[concepto,devolucionesnoTributaria.sumacreditos]',function(){
     var afectacionTotal = 0;
     ctrl.validaDevolPr = false;
     angular.forEach($scope.concepto,function(concepto){
       afectacionTotal += concepto.valorAfectacion;
     });
     if(afectacionTotal === ctrl.sumacreditos){
       ctrl.validaDevolPr = true;
     }
   },true);

ctrl.cargarOrdenesPago = function (){

    financieraRequest.get('orden_pago', $.param({
        limit: -1
    })).then(function(response) {
      ctrl.gridOrdenesDePago.data = response.data;
      // data proveedor
      angular.forEach(ctrl.gridOrdenesDePago.data, function(iterador) {
        agoraRequest.get('informacion_proveedor',
          $.param({
            query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
          })
        ).then(function(response) {
          iterador.Proveedor = response.data[0];
        });
      });
    });
};

ctrl.cargarOrdenesPago();


$scope.loadrow = function(row, operacion) {
  ctrl.operacion = operacion;
  switch (operacion) {
      case "seleccionar":
          $("#modalCuentas").modal();
          ctrl.IdOrden = row.entity.Id;
          break;
      case "ver":
          $window.open('#/orden_pago/proveedor/ver/'+row.entity.Id, '_blank', 'location=yes');
          break;
      default:
          break;
  }
};

ctrl.consultaPagos = function(){

    ctrl.encontrado = false;
    ctrl.cargando_sol = true;
    ctrl.nombreSolicitante = null;
    var parametros = [
   {
        name: "tipo_consulta",
        value: "consulta_pagos"
   },
   {
      name: "tipo_identificacion",
      value: ctrl.tipoDocSoli.Abreviatura
    },
    {
        name: "numeroIdentificacion",
        value: ctrl.numdocSoli
    }
  ];
     wso2Request.get("academicaProxy", parametros).then(function(response) {

       financieraMidRequest.post('devoluciones/GetTransformRequest/',response.data.pagosCollection).then(function(dataAcademica) {
         if(!angular.isUndefined(dataAcademica.data) && dataAcademica.data!=null){
           ctrl.nombreSolicitante = dataAcademica.data.InformacionEstudiante.Nombre;
           ctrl.encontrado = true;
           ctrl.cargando_sol = false;
         }else{
           agoraRequest.get('informacion_persona_natural',$.param({
             query:"Id:" + ctrl.numdocSoli +",TipoDocumento.Id: " + ctrl.tipoDocSoli.Id,
             limit:-1
           })).then(function(response){
             if(!angular.isUndefined(response.data) && response.data!=null){
                 ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                 ctrl.encontrado = true;
                 ctrl.cargando_sol = false;
               }else{
                 agoraRequest.get('informacion_persona_juridica',$.param({
                   query:"Id:" + ctrl.numdocSoli,
                   limit:-1
                 })).then(function(response){
                     if(!angular.isUndefined(response.data) && response.data!=null){
                         ctrl.nombreSolicitante = response.data[0].NomProveedor;
                         ctrl.encontrado = true;
                         ctrl.cargando_sol = false;
                     }else{
                       agoraRequest.get('supervisor_contrato',$.param({
                         query:"Documento:" + ctrl.numdocSoli,
                         limit:-1
                       })).then(function(response){
                           if(!angular.isUndefined(response.data) && response.data!=null){
                               ctrl.nombreSolicitante = response.data[0].Nombre;
                               ctrl.encontrado = true;
                               ctrl.cargando_sol = false;
                           }else{
                             ctrl.encontrado = false;
                             ctrl.cargando_sol = false;
                             ctrl.nombreSolicitante = $translate.instant('NO_ENCONTRADO');
                           }
                         });
                     }
                 });
               }
           });
         }

       });
     });

};

ctrl.validateFields = function(){
  var validationClear = true;

  if($scope.datosSolicitante.$invalid){
    angular.forEach($scope.datosSolicitante.$error,function(controles,error){
      angular.forEach(controles,function(control){
        control.$setDirty();
      });
    });
    validationClear = false;
  }

  if($scope.datosDevolucion.$invalid){
    angular.forEach($scope.datosDevolucion.$error,function(controles,error){
      angular.forEach(controles,function(control){
        control.$setDirty();
      });
    });
    validationClear = false;
  }
    return validationClear;

}
ctrl.crearDevolucion = function(){
  var templateAlert;
  if  (!ctrl.validateFields()){
    swal("", $translate.instant("CAMPOS_OBLIGATORIOS"),"error");
    return;
  }

  ctrl.DevolucionTributaria={
    DevolucionTributaria:{
        FormaPago:ctrl.formaPago,
        Vigencia:ctrl.vigencia,
        UnidadEjecutora:ctrl.unidadejecutora,
        CuentaDevolucion:{
          Banco:ctrl.banco.Id,
          TipoCuenta:ctrl.tipocuenta.Id,
          NumeroCuenta:ctrl.numeroCuenta.toString()
        },
        Observaciones:ctrl.observaciones,
        Acta:ctrl.soporte.Id,
        Oficio:ctrl.oficio,
        FechaOficio:ctrl.FechaOficio
      },
      EstadoDevolTribut:{
        EstadoDevolucion:{Id:8}
      },
      TotalInversion: ctrl.valorSolicitado,
      Concepto: $scope.concepto
    };

    if (angular.isUndefined(ctrl.IdSolicitante)){
      ctrl.IdSolicitante = ctrl.numdocSoli;
    }
    ctrl.DevolucionTributaria.Movimientos=[];
     ctrl.DevolucionTributaria.Solicitante = ctrl.IdSolicitante;
     angular.forEach($scope.concepto,function(conceptoMov){
       angular.forEach(conceptoMov.movimientos, function(data) {
         delete data.Id;
         ctrl.DevolucionTributaria.Movimientos.push(data);
       });
     });



    financieraRequest.post('devolucion_tributaria/AddDevolucionTributaria',ctrl.DevolucionTributaria).then(function(response) {
      if(response.data.Type != undefined){
            if(response.data.Type != "error"){
              templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
              templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>" ;
              templateAlert = templateAlert + "</table>";
              ctrl.DevolucionTributaria.DevolucionTributaria.Id = response.data.Body.Id;
              financieraRequest.post('devolucion_tributaria_estado_devolucion/AddEstadoDevolTributaria',ctrl.DevolucionTributaria).then(function(response) {
                    $location.path('/devoluciones/consulta_devoluciones_tributarias');
              });
            }else{
              templateAlert=$translate.instant(response.data.Code);
            }
            swal('',templateAlert,response.data.Type);
       }
    });
  }

  ctrl.aceptar = function(){
    $("#modalCuentas").modal('hide');
  }

  });
