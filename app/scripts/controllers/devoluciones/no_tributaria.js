'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesNoTributariaCtrl
 * @description
 * # DevolucionesNoTributariaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesNoTributariaCtrl', function ($scope,$translate,uiGridConstants,financieraRequest,agoraRequest,wso2Request,financieraMidRequest,coreRequest,$location,$window,gridApiService,$interval,$filter) {

    var ctrl = this;

    ctrl.seleccionMov = true;
    ctrl.fechaDocumento = new Date();
    $scope.concepto=[];
    ctrl.pestOpen = true;

    ctrl.cuentasAsociadas = [];

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
    };

    ctrl.gridCuentasAsociadas = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: false,
      multiSelect:false,
      showColumnFooter: true,
      enableCellEditOnFocus: true,
      columnDefs: [
          {
              field: 'OrdenPago.Consecutivo',
              displayName: $translate.instant('ORDEN_DE_PAGO'),
              headerCellClass:'text-info',
              enableCellEdit:false,
              width: '14%'
            },
          {
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CUENTA_CONTABLE'),
              headerCellClass:'text-info',
              enableCellEdit:false,
              width: '14%'
          },
          {
              field: 'Credito',
              displayName: $translate.instant('VALOR'),
              headerCellClass:'text-info',
              enableCellEdit:false,
              cellFilter: "currency",
              width: '20%',
          },
          {
              field: 'ValorBase',
              displayName: $translate.instant('VALOR_BASE'),
              headerCellClass:'text-info',
              enableCellEdit:false,
              cellFilter: "currency",
              width: '14%'
          },
          {
              field: 'CuentaContable.Naturaleza',
              displayName: $translate.instant('NATURALEZA'),
              headerCellClass:'text-info',
              enableCellEdit:false,
              width: '20%',
          },
          {
              field: 'ValorDevolucion',
              displayName: $translate.instant('VALOR_DEVOLUCION'),
              headerCellClass:'text-info',
              cellTemplate: '<div>{{row.entity.ValorDevolucion | currency:undefined:0}}</div>',
              width: '17%',
              enableCellEdit:true,
              cellFilter: "number",
              type: 'number',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
              footerCellClass: 'input_right'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiCtasAsociadas = gridApi;
        ctrl.gridApiCtasAsociadas = gridApiService.pagination(gridApi,ctrl.consultarCuentasAsociadas,$scope);
      },
    }

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

      coreRequest.get('documento',
        $.param({
          query: "TipoDocumento.DominioTipoDocumento.CodigoAbreviacion:DD-FINA,Activo:True,TipoDocumento.CodigoAbreviacion:TD-ING",
          limit: -1
        })
      ).then(function(response) {
        ctrl.documentos = response.data;
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
     if(afectacionTotal === ctrl.valorSolicitado){
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
          ctrl.Op = row.entity;
          ctrl.pestOpen = true;
          $("#modalCuentas").modal();
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
  var respuesta;
  ctrl.MensajesAlerta='';

  if($scope.datosSolicitante.$invalid){
    angular.forEach($scope.datosSolicitante.$error,function(controles,error){
      angular.forEach(controles,function(control){
        control.$setDirty();
      });
    });
    ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS_BENEFICIARIO") + "</li>";
  }

  if($scope.datosDocumento.$invalid){
    angular.forEach($scope.datosDocumento.$error,function(controles,error){
      angular.forEach(controles,function(control){
        control.$setDirty();
      });
    });
    ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS_BENEFICIARIO") + "</li>";
  }

  if($scope.datosDevolucion.$invalid){
    angular.forEach($scope.datosDevolucion.$error,function(controles,error){
      angular.forEach(controles,function(control){
        control.$setDirty();
      });
    });
    ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
  }

  if(ctrl.gridCuentasAsociadas.data.length===0){
    ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_DEBE_ASOCIAR_CUENTAS") + "</li>";
  }

  if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
    respuesta = true;
  } else {
    respuesta =  false;
  }

  return respuesta;

}
  $scope.$watch('devolucionesnoTributaria.gridApiCtasAsociadas.grid.columns[5].getAggregationValue()',function(value){
    ctrl.valorSolicitado = value;
  },true);

ctrl.crearDevolucion = function(){
  var templateAlert;
  var cuentaAsociada;
  if  (!ctrl.validateFields()){
    swal({
      title:"!Error!",
      html:'<ol aling="left">'+ctrl.MensajesAlerta+'</ol>',
      type:"error"
    });
    return;
  }
  ctrl.DevolucionTributaria={
    DevolucionTributaria:{
        FormaPago:ctrl.formaPago,
        Vigencia:ctrl.vigencia,
        UnidadEjecutora:ctrl.unidadejecutora,
        CuentaBancariaEnte:{
          Banco:ctrl.banco.Id,
          TipoCuenta:ctrl.tipocuenta.Id,
          NumeroCuenta:ctrl.numeroCuenta.toString()
        },
        Justificacion:ctrl.observaciones,
        Acta:ctrl.soporte.Id,
        Oficio:ctrl.oficio,
        Solicitante:ctrl.numdocSoli
      },
      DocumentoGenerador:{
          NumDocumento:ctrl.numDocDevol,
          FechaDocumento:ctrl.fechaDocumento,
          TipoDocumento:ctrl.documentoSelec.Id
      },
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
     ctrl.DevolucionTributaria.MovimientosAsociados=[];
     angular.forEach(ctrl.gridCuentasAsociadas.data,function(cuenta){
       cuentaAsociada = {MovimientoContable:{Id:cuenta.Id},
                          ValorDevolucion:cuenta.ValorDevolucion}
      ctrl.DevolucionTributaria.MovimientosAsociados.push(cuentaAsociada);

     });
     console.log(ctrl.DevolucionTributaria);

    financieraRequest.post('devolucion_tributaria/AddDevolucionTributaria',ctrl.DevolucionTributaria).then(function(response) {
      if(response.data.Type != undefined){
            if(response.data.Type != "error"){
              templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
              templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>" ;
              templateAlert = templateAlert + "</table>";
              ctrl.DevolucionTributaria.DevolucionTributaria.Id = response.data.Body.Id;
              $location.path('/devoluciones/consulta_devoluciones_tributarias');
            }else{
              templateAlert=$translate.instant(response.data.Code);
            }
            swal('',templateAlert,response.data.Type);
       }
    });
  }

  ctrl.aceptar = function(){
    angular.forEach(ctrl.cuentasAsociadas,function(cuenta){
      if (cuenta.CuentaEspecial!=null){
        financieraRequest.get('orden_pago_cuenta_especial',$.param({
          query:"OrdenPago.Id:"+cuenta.CodigoDocumentoAfectante+",CuentaEspecial.Id:"+cuenta.CuentaEspecial.Id,
          fields:"ValorBase,OrdenPago",
          limit:1
        })).then(function(response){
          if(!angular.isUndefined(response.data) &&  response.data.length > 0){
              cuenta.ValorBase = response.data[0].ValorBase;
              cuenta.OrdenPago = response.data[0].OrdenPago;
          }
          $("#modalCuentas").modal('hide');
          ctrl.pestOpen=false;
        });
      }
      cuenta.OrdenPago = ctrl.Op;
      cuenta.ValorDevolucion = 0;
    });
    angular.forEach(ctrl.gridCuentasAsociadas.data,function(cuenta){
      ctrl.cuentasAsociadas = $filter('filter')(ctrl.cuentasAsociadas,function(item) {
        if (item.Id === cuenta.Id){
          return false;
        }
          return true;
        },true);
    })

    angular.forEach(ctrl.cuentasAsociadas,function(cuenta){
      ctrl.gridCuentasAsociadas.data.push(cuenta);
    });
    $("#modalCuentas").modal('hide');
    ctrl.pestOpen=false;
  }

  $scope.$watch('d', function(newvalue) {
      if(newvalue){
        $interval( function() {
            ctrl.gridApiCtasAsociadas.core.handleWindowResize();
          }, 500, 2);
      }
    },true);

  });
