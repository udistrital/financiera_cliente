'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelectDetail
 * @description
 * # ordenPago/opMultiSelectDetail
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelectDetail', function(financieraRequest, financieraMidRequest, agoraRequest, $timeout, $translate, uiGridConstants, coreRequest, $window, $interval) {
    return {
      restrict: 'E',
      scope: {
        inputopselect: '=?',
        inputvisible: '=?'
      },

      templateUrl: 'views/directives/orden_pago/op_multi_select_detail.html',
      controller: function($scope) {
        var ctrl = this;
        ctrl.giro = {};
        var currentTime = new Date();
        var year = currentTime.getFullYear()
        ctrl.hayData_detalle = true;
        ctrl.cargando_detalle = true;
        ctrl.hayData_cb = true;
        ctrl.cargando_cb = true;
        //

        ctrl.regresar = function() {
          ctrl.ajustarGrid(ctrl.gridApi);
          $scope.inputvisible = !$scope.inputvisible;
        }
        ctrl.gridOptions_op_detail = {
          showColumnFooter: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,

          paginationPageSizes: [15, 30, 45],
          paginationPageSize: 10,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 15,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Consecutivo',
              displayName: $translate.instant('CODIGO'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
              width: '8%',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '8%',
            },
            {
              field: 'OrdenPagoRegistroPresupuestal[0].RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'FormaPago.CodigoAbreviacion',
              width: '5%',
              displayName: $translate.instant('FORMA_PAGO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.Tipopersona',
              width: '10%',
              displayName: $translate.instant('TIPO_PERSONA'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.NomProveedor',
              displayName: $translate.instant('NOMBRE'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.NumDocumento',
              width: '10%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'ValorTotal',
              width: '10%',
              cellFilter: 'currency',
              cellClass: 'input_right',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('VALOR'),

              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellFilter: 'currency',
              footerCellClass: 'input_right'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
            },
          ]
        };
        ctrl.gridOptions_op_detail.enablePaginationControls = true;
        ctrl.gridOptions_op_detail.onRegisterApi = function(gridApi) {
          ctrl.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = row.entity;
          });
        };
        // cuentas bancarias
        ctrl.gridOptions_cuenta_bancaria = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          paginationPageSizes: [15, 30, 45, 100, 200],
          enableFiltering: true,
          minRowsToShow: 8,
          useExternalPagination: false,
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'NumeroCuenta',
              //width: '8%',
              displayName: $translate.instant('NUMERO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'TipoCuentaBancaria.Nombre',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'SucursalData[0].Nombre',
              displayName: $translate.instant('SUCURSAL'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'SucursalData[0].Banco.DenominacionBanco',
              displayName: $translate.instant('BANCO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
          ]
        };
        ctrl.gridOptions_cuenta_bancaria.multiSelect = false;
        ctrl.gridOptions_cuenta_bancaria.onRegisterApi = function(gridApi) {
          ctrl.gridApi2 = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if (ctrl.gridApi2.selection.getSelectedRows()[0] != undefined) {
              ctrl.giro.CuentaBancaria = ctrl.gridApi2.selection.getSelectedRows()[0];
            } else {
              delete ctrl.giro['CuentaBancaria']
            }
          });
        };
        financieraRequest.get('cuenta_bancaria',
          $.param({
            query: "EstadoActivo:true", //unidad ejecutora entra por usuario logueado
            limit: -1,
          })).then(function(response) {

          if(response.data === null){
            ctrl.gridOptions_cuenta_bancaria.data = [];
            ctrl.hayData_cb = false;
            ctrl.cargando_cb = false;
          }
          else{
          ctrl.gridOptions_cuenta_bancaria.data = response.data;
          ctrl.hayData_cb = true;
          ctrl.cargando_cb = false;
          //data sucursal, banco
          angular.forEach(ctrl.gridOptions_cuenta_bancaria.data, function(iterador) {
            coreRequest.get('sucursal',
              $.param({
                query: "Id:" + iterador.Sucursal,
                limit: -1,
              })).then(function(response) {
              iterador.SucursalData = response.data;
            })
          })
        }
        });
        // refrescar
        ctrl.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // data
        $scope.$watch('inputopselect', function() {
          if (Object.keys($scope.inputopselect).length > 0) {

            ctrl.hayData_detalle = true;
            ctrl.cargando_detalle = false;
            ctrl.gridOptions_op_detail.data = [];
            ctrl.gridOptions_op_detail.data = $scope.inputopselect;
            ctrl.giro.ValorTotal = 0;
            ctrl.giro.FormaPago = ctrl.gridOptions_op_detail.data[0].FormaPago;
            ctrl.giro.Vigencia = ctrl.gridOptions_op_detail.data[0].Vigencia;
            // calculo totales
            angular.forEach(ctrl.gridOptions_op_detail.data, function(iterador) {
              ctrl.giro.ValorTotal = ctrl.giro.ValorTotal + iterador.ValorTotal;
            })
          }else{

              ctrl.hayData_detalle = false;
              ctrl.cargando_detalle = false;
            ctrl.gridOptions_op_detail.data = [];

          }
        }, true)
        // Funcion encargada de validar la obligatoriedad de los campos
        ctrl.camposObligatorios = function() {
          var respuesta;
          ctrl.MensajesAlerta = '';
          if (ctrl.giro.CuentaBancaria == undefined) {
            ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_NOMINA') + "</li>";
          }
          // Operar
          if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
            respuesta =  true;
          } else {
            respuesta =  false;
          }

          return respuesta;
        }

        ctrl.confirmar = function() {
          if (ctrl.camposObligatorios()) {
            ctrl.dataGiroSend = {};
            ctrl.dataGiroSend.Giro = ctrl.giro;
            ctrl.dataGiroSend.OrdenPago = $scope.inputopselect;
            financieraMidRequest.post('giro/CreateGiro', ctrl.dataGiroSend)
              .then(function(response) {
                ctrl.resultado = response.data;
                var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') +' '+ $translate.instant('GIRO')+ "</th><th>" + $translate.instant('VIGENCIA') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
                templateAlert = templateAlert + "<tr class='success'><td>" + ctrl.resultado.Body + "</td>" + "<td>" + year + "</td><td>" + $translate.instant(ctrl.resultado.Code) + "</td></tr>" ;
                templateAlert = templateAlert + "</table>";
                swal({
                  title: '',
                  html: templateAlert,
                  type: ctrl.resultado.Type,
                }).then(function() {
                  $window.location.href = '#/orden_pago/giros/ver_todos';
                })
              })
          } else {
            swal({
              title: 'Error!',
              html: '<ol align="left">' + ctrl.MensajesAlerta + '</ol>',
              type: 'error'
            })
          }
        }
        ctrl.ajustarGrid = function(gridApi) {
          $interval( function() {
            gridApi.core.handleWindowResize();
          }, 500, 2);
      };
      $scope.$watch('inputvisible', function() {
        if($scope.inputvisible && ctrl.gridApi != undefined){
          $interval( function() {
              ctrl.gridApi.core.handleWindowResize();
            }, 500, 2);
        }
      });
        // fin
      },
      controllerAs: 'd_opMultiSelectDetail'
    };
  });
