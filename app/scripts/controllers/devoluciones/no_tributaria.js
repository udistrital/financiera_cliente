'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesNoTributariaCtrl
 * @description
 * # DevolucionesNoTributariaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesNoTributariaCtrl', function ($scope,$translate,uiGridConstants,financieraRequest,agoraRequest,wso2Request,financieraMidRequest) {
    var ctrl = this;

    ctrl.seleccionMov = true;
    ctrl.encontrado = false;
    ctrl.loadCircle = true;
    ctrl.FechaOficio = new Date();


    $scope.botones = [
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
          headerCellClass: 'text-info'
        },
        {
          field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
          width: '8%',
          displayName: $translate.instant('TIPO'),
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
          },
          headerCellClass: 'text-info'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '8%',
          headerCellClass: 'text-info'
        },
        {
          field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
          displayName: $translate.instant('NO_CRP'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'FormaPago.CodigoAbreviacion',
          width: '5%',
          displayName: $translate.instant('FORMA_PAGO'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Proveedor.Tipopersona',
          width: '10%',
          displayName: $translate.instant('TIPO_PERSONA'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Proveedor.NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Proveedor.NumDocumento',
          width: '10%',
          cellClass: 'input_center',
          displayName: $translate.instant('NO_DOCUMENTO'),
          headerCellClass: 'text-info'
        },
        {
          field: 'ValorBase',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
          displayName: $translate.instant('VALOR'),
          headerCellClass: 'text-info'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: 'text-info'
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '5%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'text-info'
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

      financieraRequest.get('acta_devolucion', $.param({
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

   $scope.$watch('devolucionesnoTributaria.numdocSoli', function(newValue){
     if (!angular.isUndefined(newValue)) {
        ctrl.consultaPag = true;
     }else{
       ctrl.consultaPag = false;
     }
   },true);

   $scope.$watch('devolucionesnoTributaria.tipoDocSoli', function(newValue){
     if (!angular.isUndefined(newValue) && ctrl.numdocSoli!= undefined) {
        ctrl.consultaPag = true;
     }else{
       ctrl.consultaPag = false;
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
      case "ver":
      $("#myModal").modal();
          ctrl.IdOrden = row.entity.Consecutivo;
          break;

      case "otro":

      break;
      default:
  }
};

ctrl.consultaPagos = function(){

  if (ctrl.consultaPag === true){

    ctrl.loadCircle = false;
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
         }else{
           agoraRequest.get('informacion_persona_natural',$.param({
             query:"Id:" + ctrl.numdocSoli +",TipoDocumento.Id: " + ctrl.tipoDocSoli.Id,
             limit:-1
           })).then(function(response){
             if(!angular.isUndefined(response.data) && response.data!=null){
                 ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                 ctrl.encontrado = true;
                 ctrl.loadCircle = true;
               }else{
                 agoraRequest.get('informacion_persona_juridica',$.param({
                   query:"Id:" + ctrl.numdocSoli,
                   limit:-1
                 })).then(function(response){
                     if(!angular.isUndefined(response.data) && response.data!=null){
                         ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                         ctrl.encontrado = true;
                     }else{
                       agoraRequest.get('supervisor_contrato',$.param({
                         query:"Documento:" + ctrl.numdocSoli,
                         limit:-1
                       })).then(function(response){
                           if(!angular.isUndefined(response.data) && response.data!=null){
                               ctrl.nombreSolicitante = response.data[0].Nombre;
                               ctrl.encontrado = true;
                           }else{
                             ctrl.encontrado = false;
                           }
                         });
                     }
                 });
               }
           });
         }

       });
       ctrl.loadCircle = true;
     });

     ctrl.consultaPag = false;
  }

};

ctrl.crearDevolucion = function(){
  ctrl.DevolucionTributaria={
    DevolucionTributaria:{
        Solicitante:{
          TipoIdentificacion:ctrl.tipoDocSoli.Id,
          Identificacion:ctrl.numdocSoli,
          Origen:9
        },
        FormaPago:ctrl.formaPago,
        Vigencia:ctrl.vigencia,
        UnidadEjecutora:ctrl.unidadejecutora,
        CuentaDevolucion:{
          Banco:1,
          TipoCuenta:1,
          NumeroCuenta:ctrl.numeroCuenta.toString()
        },
        Observaciones:ctrl.observaciones,
        Acta:ctrl.soporte,
        Oficio:ctrl.oficio,
        FechaOficio:ctrl.FechaOficio
      },
      EstadoDevolTribut:{
        EstadoDevolucion:{Id:8}
      },
      TotalInversion: ctrl.valorSolicitado,
      Concepto: ctrl.concepto[0]
    };

    angular.forEach(ctrl.movs, function(data) {
        delete data.Id;
    });

    ctrl.DevolucionTributaria.Movimientos = ctrl.movs;

    financieraRequest.post('devolucion_tributaria/AddDevolucionTributaria',ctrl.DevolucionTributaria).then(function(response) {
      if(response.data.Type != undefined){
            swal('',$translate.instant(response.data.Code),response.data.Type);
            if(response.data.Type != "error"){
              ctrl.DevolucionTributaria.DevolucionTributaria.Id = response.data.Body.Id;
              financieraRequest.post('devolucion_tributaria_estado_devolucion/AddEstadoDevolTributaria',ctrl.DevolucionTributaria).then(function(response) {
              });
            }
       }
    });
  }

  });
