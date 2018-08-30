'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesGestionChequeCtrl
 * @description
 * # TesoreriaChequesGestionChequeCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesGestionChequeCtrl', function ($scope,$translate,financieraRequest,gridApiService,financieraMidRequest,$interval,uiGridConstants,$window,$q,agoraRequest) {
    var ctrl = this;
    ctrl.totalChequesOP = 0;
    ctrl.cheque={};
    ctrl.encontrado_ben=true;
    ctrl.chequeraSel = undefined;
    ctrl.OPSeleccionada = undefined;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true }
    ];
    $scope.botonesChequera = [
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg faa-shake animated-hover", titulo: $translate.instant('VER'), operacion: 'ver', estado: true }
    ];
    ctrl.cheque.fechaCreacion = new Date();
    ctrl.cheque.FechaVencimiento = new Date();
    ctrl.OPValidada = true;
    ctrl.cheque.Consecutivo = 0;
    ctrl.gridCheque = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'CodigoHomologado',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('CHEQUERA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('ORDEN_PAGO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('BENEFICIARIO'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('FECHA_VENCIMIENTO'),
              headerCellClass:'text-info',
              width: '17%',
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
            width: '12%'
          }
      ]
    }

    ctrl.gridChequeras = {
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
      columnDefs: [
          {
              field: 'Chequera.Consecutivo',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '20%'
          },
          {
              field: 'Chequera.UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'Chequera.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '20%'
          },
          {
              field: 'Chequera.CuentaBancaria.Nombre',
              displayName: $translate.instant('CUENTA_BANCARIA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrowChequera(fila,operacion)" grupobotones="grid.appScope.botonesChequera" fila="row"></btn-registro>',
            width: '20%'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiChequeras = gridApi;
        ctrl.gridApiChequeras = gridApiService.pagination(gridApi,ctrl.ObtenerChequeras,$scope);
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          if(row.isSelected){
            ctrl.chequeraSel = row.entity.Chequera;
            ctrl.getChequeNumber(ctrl.chequeraSel.Id,ctrl.chequeraSel.NumeroChequeInicial);
          }else{
            ctrl.chequeraSel = undefined;
            ctrl.cheque.Consecutivo = 0;
          }
        });
      },
      isRowSelectable: function(row){
        return row.entity.Chequera.ChequesDisponibles > 0;
      }
    }


    ctrl.gridOrdenesDePago = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      multiSelect: false,
      enableRowHeaderSelection: false,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: null,

      enableFiltering: true,
      minRowsToShow: 10,
      useExternalPagination: true,

      columnDefs:[
        {
          name: $translate.instant('CONSECUTIVO'),
          width: '14%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellTemplate:'<div class="ngCellText"><a href="" ng-click="grid.appScope.tesoreriaGestionCheque.opDetalle(row)">{{row.entity.Consecutivo}}</a></div>'
        },
        {
          field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
          width: '17%',
          displayName: $translate.instant('TIPO'),
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '17%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '17%',
        },
        {
          field: 'ValorBase',
          width: '17%',
          cellFilter: 'currency',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('VALOR')
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '17%',
          displayName: $translate.instant('ESTADO'),
          filter: {
            //term: 'Elaborado',
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.estado_select

          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        }
      ],

      onRegisterApi: function(gridApi) {
        ctrl.gridApiOP = gridApiService.pagination(gridApi,ctrl.cargarOp,$scope);
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          if(row.isSelected){
            ctrl.getSumValue(row.entity);
          }
        });
      }

    };

    ctrl.getSumValue = function (row){
      ctrl.validandoOP = true;
      ctrl.consultaSumaOP = financieraRequest.get("cheque/GetChequeSumaOP/"+row.Id)
      .then(function(response){
        ctrl.validandoOP = false;
        if (angular.equals(response.data.Type,"success")) {
          ctrl.totalChequesOP  = response.data.Body;
          if(ctrl.totalChequesOP < row.ValorBase){
            ctrl.OPValidada = true;
            ctrl.OPSeleccionada = row;
          }else{
            ctrl.OPValidada = false;
            ctrl.OPSeleccionada = undefined;
          }
        }else{
          ctrl.OPValidada = false;
          ctrl.totalChequesOP = -1;
        }
      });
    }
    ctrl.getChequeNumber = function(IdChequera,chequeInicial){
      ctrl.numeroCheque = financieraRequest.get("cheque/GetNextChequeNumber/"+IdChequera)
      .then(function(response){
        if (angular.equals(response.data.Type,"success")) {
          ctrl.cheque.Consecutivo=response.data.Body + chequeInicial;
        }else{
          ctrl.cheque.Consecutivo = 0;
        }
      });
    }


    ctrl.ObtenerChequeras = function(offset,query){
      financieraMidRequest.cancel();

      if (angular.isUndefined(query) || query === ""){
        query = "Estado.NumeroOrden:1";
      }else {
        query = query + ",Estado.NumeroOrden:1";
      }

      financieraMidRequest.get("gestion_cheques/GetAllChequera",$.param({
        limit: ctrl.gridChequeras.paginationPageSize,
        offset:offset,
        query:query,
        bDisponibles:true
      })).then(function(response){
          ctrl.gridChequeras.data=response.data;
    });
  }
  ctrl.ObtenerChequeras(0,'');

  ctrl.cargarOp = function(offset,query){
    financieraRequest.get('orden_pago', $.param({
      query:query,
      limit: ctrl.gridOrdenesDePago.paginationPageSize,
      offset:offset
    })).then(function(response) {
    if(response.data === null){
      ctrl.hayDataOP = false;
      ctrl.cargandoOP = false;
      ctrl.gridOrdenesDePago.data = [];
    }else{
      ctrl.hayDataOP = true;
      ctrl.cargandoOP = false;
      ctrl.gridOrdenesDePago.data = response.data;
    }
    });
  }
ctrl.cargarOp(0,'FormaPago.CodigoAbreviacion:CH');

ctrl.cargarTiposDoc = function(){
     agoraRequest.get('parametro_estandar',$.param({
       query:"ClaseParametro:Tipo Documento",
       limit:-1
     })).then(function(response){
       ctrl.tiposdoc = response.data;
     });
};
ctrl.cargarTiposDoc();
    $scope.$watch('tesoreriaGestionCheque.cheque.diasVencimiento',function(newValue){
      if(!angular.isUndefined(newValue)){
        ctrl.cheque.FechaVencimiento = new Date(ctrl.cheque.FechaVencimiento.setDate(ctrl.cheque.fechaCreacion.getDate() + newValue));
      }
    },true)

    $scope.loadrowChequera = function(row, operacion) {
        $scope.chequera = row.entity.Chequera;
        switch (operacion) {
            case "ver":
                $("#datosChequera").modal();
                break;
            default:
        }
    }

    ctrl.consultaBen = function(){
      ctrl.nombreBeneficiario = undefined;
      ctrl.encontrado_ben = false;
       ctrl.cargando_ben = true;
      agoraRequest.get('informacion_persona_natural',$.param({
        query:"Id:" + ctrl.cheque.numdocBeneficiario +",TipoDocumento.Id: " + ctrl.cheque.tipoDocBen.Id,
        limit:-1
      })).then(function(response){
        if(!angular.isUndefined(response.data) &&  typeof(response.data) !== "string"){
           ctrl.encontrado_ben = true;
            ctrl.cargando_ben = false;
            ctrl.cheque.Beneficiario = response.data[0].Id;
            ctrl.cheque.nombreBeneficiario = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
          }else{
            agoraRequest.get('informacion_persona_juridica',$.param({
              query:"Id:" + ctrl.cheque.numdocBeneficiario,
              limit:-1
            })).then(function(response){
                if(!angular.isUndefined(response.data) && typeof(response.data) !== "string"){
                   ctrl.encontrado_ben = true;
                    ctrl.cargando_ben = false;
                    ctrl.cheque.nombreBeneficiario = response.data[0].NomProveedor;
                    ctrl.cheque.Beneficiario = response.data[0].Id;
                }
            });
          }
      });
    }


    ctrl.camposObligatorios = function() {
      var respuesta;
      ctrl.MensajesAlerta = '';

      if($scope.cheque.$invalid){
        angular.forEach($scope.cheque.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
      }

      if(angular.isUndefined(ctrl.cheque.nombreBeneficiario)|| ctrl.cheque.nombreBeneficiario.length === 0){
          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_RESP_NO_ENC") + "</li>";
          ctrl.encontrado_ben=false;
      }

      if (angular.isUndefined(ctrl.chequeraSel)){
          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_DEBE_CHEQUERA") + "</li>";
      }

      if(angular.isUndefined(ctrl.OPSeleccionada)){
            ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("ORDEN_PAGO_SELECCIOANR") + "</li>";
      }

      if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
        respuesta = true;
      } else {
        respuesta =  false;
      }

      return respuesta;
    }

    ctrl.crearCheque = function(){
      $q.all([ctrl.consultaSumaOP,ctrl.numeroCheque]).then(function(){
        if(ctrl.camposObligatorios()){
          var request = {
            Cheque:ctrl.cheque,
            Usuario:111111
          }
          request.Cheque.OrdenPago = ctrl.OPSeleccionada;
          request.Cheque.Chequera = ctrl.chequeraSel;
          financieraMidRequest.post('gestion_cheques/CreateCheque',request).then(function(response){
            if (response.data.Type != undefined) {
                if (response.data.Type === "error") {
                    swal('', $translate.instant(response.data.Code), response.data.Type);
                } else {
                  var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
                  templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Cheque.Consecutivo + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>" ;
                  templateAlert = templateAlert + "</table>";
                    swal({title:'',
                          html:templateAlert,
                          type:response.data.Type
                    });
                    $('#creacionCheque').modal('hide');
                    //ctrl.limpiarCheque();
                }
            }
          });
          console.log("request cheque",request);
        }else{
          swal({
            title:'¡Error!',
            html:'<ol align="left">'+ctrl.MensajesAlerta+"</ol>",
            type:'error'
          });
        }
      });


    }

    ctrl.ajustarGrid = function() {
      $interval( function() {
          ctrl.gridApiChequeras.core.handleWindowResize();
        }, 500, 2);
    }

    ctrl.opDetalle = function(row) {
      $window.open('#/orden_pago/proveedor/ver/'+row.entity.Id, '_blank', 'location=yes');
    }

  });
