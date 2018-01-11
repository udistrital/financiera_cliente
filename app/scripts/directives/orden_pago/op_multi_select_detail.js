'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelectDetail
 * @description
 * # ordenPago/opMultiSelectDetail
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelectDetail', function(financieraRequest, agoraRequest, $timeout, $translate, uiGridConstants, coreRequest) {
    return {
      restrict: 'E',
      scope: {
        inputopselect: '=?',
        inputvisible: '=?'
      },

      templateUrl: 'views/directives/orden_pago/op_multi_select_detail.html',
      controller: function($scope) {
        var self = this;
        //
        self.regresar = function() {
          $scope.inputvisible = !$scope.inputvisible;
        }
        self.gridOptions_op_detail = {
          showColumnFooter: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,

          paginationPageSizes: [15, 30, 45],
          paginationPageSize: null,

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
              cellClass: 'input_center'
            },
            {
              field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
              width: '8%',
              displayName: $translate.instant('TIPO'),
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '8%',
            },
            {
              field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'FormaPago.CodigoAbreviacion',
              width: '5%',
              displayName: $translate.instant('FORMA_PAGO')
            },
            {
              field: 'Proveedor.Tipopersona',
              width: '10%',
              displayName: $translate.instant('TIPO_PERSONA')
            },
            {
              field: 'Proveedor.NomProveedor',
              displayName: $translate.instant('NOMBRE')
            },
            {
              field: 'Proveedor.NumDocumento',
              width: '10%',
              cellClass: 'input_center',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'ValorTotal',
              width: '10%',
              cellFilter: 'currency',
              cellClass: 'input_right',
              displayName: $translate.instant('VALOR'),

              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellFilter: 'currency',
              footerCellClass: 'input_right'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO')
            },
          ]
        };
        self.gridOptions_op_detail.multiSelect = true;
        self.gridOptions_op_detail.enablePaginationControls = true;
        self.gridOptions_op_detail.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = row.entity;
          });
        };
        // cuentas bancarias
        self.gridOptions_cuenta_bancaria = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          paginationPageSizes: [15, 30, 45],
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
            },
            {
              field: 'TipoCuentaBancaria.Nombre',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center'
            },
            {
              field: 'SucursalData[0].Nombre',
              displayName: $translate.instant('SUCURSAL'),
              cellClass: 'input_center'
            },
            {
              field: 'SucursalData[0].Banco.DenominacionBanco',
              displayName: $translate.instant('BANCO'),
              cellClass: 'input_center'
            },
          ]
        };
        self.gridOptions_cuenta_bancaria.multiSelect = false;
        self.gridOptions_cuenta_bancaria.onRegisterApi = function(gridApi) {
          self.gridApi2 = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if (self.gridApi2.selection.getSelectedRows()[0] != undefined) {
              $scope.cuentaBancariaSelect = self.gridApi2.selection.getSelectedRows()[0];
            } else {
              console.log("banco no definido ");
            }
          });
        };
        financieraRequest.get('cuenta_bancaria',
          $.param({
            query: "EstadoActivo:true", //unidad ejecutora entra por usuario logueado
            limit: -1,
          })).then(function(response) {
          self.gridOptions_cuenta_bancaria.data = response.data;
          //data sucursal, banco
          angular.forEach(self.gridOptions_cuenta_bancaria.data, function(iterador) {
            coreRequest.get('sucursal',
              $.param({
                query: "Id:" + iterador.Sucursal,
                limit: -1,
              })).then(function(response) {
              iterador.SucursalData = response.data;
            })
          })
        });
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // data
        $scope.$watch('inputopselect', function() {
          if (Object.keys($scope.inputopselect).length > 0) {
            self.gridOptions_op_detail.data = [];
            self.gridOptions_op_detail.data = $scope.inputopselect;
            self.total = 0;
            self.formaPago = self.gridOptions_op_detail.data[0].FormaPago.CodigoAbreviacion;
            // calculo totales
            angular.forEach(self.gridOptions_op_detail.data, function(iterador) {
              self.total = self.total + iterador.ValorTotal;
            })
          }
        }, true)
        // fin
      },
      controllerAs: 'd_opMultiSelectDetail'
    };
  });
