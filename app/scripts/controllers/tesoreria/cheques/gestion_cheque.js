'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesGestionChequeCtrl
 * @description
 * # TesoreriaChequesGestionChequeCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesGestionChequeCtrl', function ($scope,$translate,financieraRequest,gridApiService,financieraMidRequest,$interval,uiGridConstants,$window,$q,agoraRequest,$localStorage) {
    var ctrl = this;
    ctrl.totalChequesOP = 0;
    ctrl.cheque={};
    ctrl.encontrado_ben=true;
    ctrl.chequeraSel = undefined;
    ctrl.OPSeleccionada = undefined;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg faa-shake animated-hover", titulo: $translate.instant('VER'), operacion: 'ver', estado: true }
    ];
    $scope.botonesChequera = [
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg faa-shake animated-hover", titulo: $translate.instant('VER'), operacion: 'ver', estado: true }
    ];
    $scope.estado_select = [];
    $scope.estados = [];
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
      multiSelect:false,
      columnDefs: [
          {
              field: 'Consecutivo',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'Chequera.Consecutivo',
              displayName: $translate.instant('CHEQUERA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'OrdenPago.Consecutivo',
              displayName: $translate.instant('ORDEN_DE_PAGO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'Beneficiario.Nombre',
              displayName: $translate.instant('BENEFICIARIO'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'FechaVencimiento',
              displayName: $translate.instant('FECHA_VENCIMIENTO'),
              headerCellClass:'text-info',
              width: '17%',
              cellFilter: "date:'yyyy-MM-dd'"
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
            width: '12%'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiCheques = gridApi;
        ctrl.gridApiCheques = gridApiService.pagination(gridApi,ctrl.consultarCheques,$scope);
      },
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
      enableRowHeaderSelection: true,
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
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrowChequera(fila,operacion)" grupobotones="grid.appScope.botonesChequera" fila="row"></btn-registro>',
            width: '15%'
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
      enableRowHeaderSelection: true,
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
          width: '13%',
          displayName: $translate.instant('ESTADO'),
          filter: {
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
      ctrl.cargandoChequera = true;
      ctrl.hayDataChequera = true;

      if (angular.isUndefined(query) || query === ""){
        query = "Estado.NumeroOrden:2";
      }else {
        query = query + ",Estado.NumeroOrden:1";
      }

      financieraMidRequest.get("gestion_cheques/GetAllChequera",$.param({
        limit: ctrl.gridChequeras.paginationPageSize,
        offset:offset,
        query:query,
        bDisponibles:true
      })).then(function(response){
          if(response.data==null){
            ctrl.cargandoChequera = false;
            ctrl.hayDataChequera = false;
          }else{
            ctrl.cargandoChequera = false;
            ctrl.hayDataChequera = true;
            ctrl.gridChequeras.data=response.data;
          }

    });
  }
  ctrl.ObtenerChequeras(0,'');

  ctrl.consultarCheques = function(offset,query){
    ctrl.cargandoCheque = true;
    ctrl.hayDataCheque = true;

    financieraRequest.get("cheque/GetChequeRecordsNumber",$.param({
      query:query
    })).then(function(response){
        ctrl.gridCheque.totalItems = response.data.Body;
    });

    //Tarda debido a servicio de administrativa_amazon_api en el crud
    financieraMidRequest.get("gestion_cheques/GetAllCheque",$.param({
      limit: ctrl.gridCheque.paginationPageSize,
      offset:offset,
      query:query
    })).then(function(response){
      if(response.data == null){
        ctrl.hayDataCheque = false;
        ctrl.cargandoCheque = false;
      }else{
        ctrl.hayDataCheque = true;
        ctrl.cargandoCheque = false;
        ctrl.gridCheque.data = response.data;
      }

    });

  }

    ctrl.consultarCheques(0,'');

    $scope.loadrow = function(row, operacion) {
        $scope.solicitud = row.entity;
        switch (operacion) {
            case "proceso":
                $scope.estado = $scope.solicitud.Estado ;
                $scope.informacion = $translate.instant('CHEQUE')+ ' '+ 'No'+' '+row.entity.Consecutivo;
                $scope.mostrar_direc = true;
                break;
            case "ver":
                $scope.cheque = row.entity;
                console.log("Cheque",$scope.cheque);
                $("#datosCheque").modal();
                break;
            default:
        }
    }

  ctrl.cargarOp = function(offset,query){
    ctrl.hayDataOP = true;
    ctrl.cargandoOP = true;
    query = query + ',FormaPago.CodigoAbreviacion:CH'
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
ctrl.cargarOp(0,'');

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
        ctrl.cheque.FechaVencimiento = new Date(ctrl.cheque.fechaCreacion);
        ctrl.cheque.FechaVencimiento.setDate(ctrl.cheque.FechaVencimiento.getDate() + newValue);
        ctrl.cheque.FechaVencimiento = new Date(ctrl.cheque.FechaVencimiento);
      }
    },true)

    $scope.loadrowChequera = function(row, operacion) {
        $scope.chequera = row.entity.Chequera;
        switch (operacion) {
            case "otro":

            break;
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
            agoraRequest.get('informacion_proveedor',$.param({
              query:"NumDocumento:" + ctrl.cheque.numdocBeneficiario,
              limit:1
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
          request.Cheque.Beneficiario = parseInt(request.Cheque.Beneficiario);
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
                    ctrl.limpiarCheque();
                    ctrl.consultarCheques(0,'');
                    ctrl.ObtenerChequeras(0,'');
                }
            }
          });
        }else{
          swal({
            title:'¡Error!',
            html:'<ol align="left">'+ctrl.MensajesAlerta+"</ol>",
            type:'error'
          });
        }
      });


    }


    ctrl.limpiarCheque = function(){
      $scope.cheque.$setPristine();
      $scope.datosBeneficiario.$setPristine();
      ctrl.cheque = {};
      ctrl.encontrado_ben=true;
      ctrl.chequeraSel = undefined;
      ctrl.OPSeleccionada = undefined;
      ctrl.totalChequesOP = 0;
      ctrl.cheque.Consecutivo = 0;
      ctrl.gridApiOP.selection.clearSelectedRows();
      ctrl.gridApiChequeras.selection.clearSelectedRows();
      ctrl.cheque.fechaCreacion = new Date();
      ctrl.cheque.FechaVencimiento = new Date();
    }

    ctrl.ajustarGrid = function() {
      $interval( function() {
          ctrl.gridApiChequeras.core.handleWindowResize();
        }, 500, 2);
    }

    ctrl.cargarEstados = function() {
        financieraRequest.get("estado_cheque", $.param({
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {

              $scope.estados = [];
              $scope.aristas = [];
              ctrl.estados = response.data;
              angular.forEach(ctrl.estados, function(estado) {
                  $scope.estados.push({
                      id: estado.NumeroOrden,
                      label: estado.Nombre
                  });
                  $scope.estado_select.push({
                      value: estado.NumeroOrden,
                      label: estado.Nombre,
                      estado: estado
                  });
              });

                $scope.aristas = [{
                        from: 1,
                        to: 2
                    },
                    {
                        from: 2,
                        to: 3
                    },
                    {
                        from: 3,
                        to: 4
                    },
                    {
                        from: 2,
                        to: 5
                    },
                    {
                        from: 3,
                        to: 7
                    },
                    {
                        from: 3,
                        to: 6
                    },
                ];
            });
    }

    ctrl.cargarEstados();

    $scope.funcion = function(element) {
        $scope.estadoclick = $localStorage.nodeclick;
        ctrl.Request = {
          ChequeEstadoCheque:{Estado:$scope.estadoclick.estado,
                                  Usuario:111111,
                                  Activo:true
                                },
          Cheque:$scope.solicitud
        };
        ctrl.Request.Cheque.Beneficiario = ctrl.Request.Cheque.Beneficiario.Id;
        ctrl.Request.Cheque.Chequera = {Id:ctrl.Request.Cheque.Chequera.Id};
            financieraRequest.post('cheque_estado_cheque/AddEstadoCheque', ctrl.Request).then(function(response) {
                if(response.data.Type != undefined){
                  if(response.data.Type === "error"){
                      swal('',$translate.instant(response.data.Code),response.data.Type);
                    }else{
                      swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                        ctrl.consultarCheques(0,'');
                        $scope.estado = $scope.estadoclick.estado;
                      })
                    }
                  }
                });
  }

    ctrl.opDetalle = function(row) {
      $window.open('#/orden_pago/proveedor/ver/'+row.entity.Id, '_blank', 'location=yes');
    }

  });
