'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelect
 * @description
 * # ordenPago/opMultiSelect
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelect', function(financieraRequest, agoraRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        inputestado: '=?',
        outputopselect: '=?',
        outputvisible: '=?'
      },
      templateUrl: 'views/directives/orden_pago/op_multi_select.html',
      controller: function($scope) {
        var self = this;
        $scope.outputvisible = true;
        self.confirmar = function() {
          $scope.outputvisible = false;
        }
        //
        financieraRequest.get('tipo_orden_pago',
          $.param({
            limit: -1,
          })
        ).then(function(response) {
          self.tipoOrdenPagoData = response.data;
        })
        financieraRequest.get('forma_pago',
          $.param({
            limit: -1,
          })
        ).then(function(response) {
          self.formaPagoData = response.data;
        })
        //
        self.consultar = function() {
          if (self.tipoOrdenPagoSelect != undefined && self.formaPagoSelect != undefined && $scope.inputestado != undefined) {
            financieraRequest.get('orden_pago',
              $.param({
                query: "SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion:" + self.tipoOrdenPagoSelect.CodigoAbreviacion + ",OrdenPagoEstadoOrdenPago.EstadoOrdenPago.CodigoAbreviacion:" + $scope.inputestado + ",FormaPago.CodigoAbreviacion:" + self.formaPagoSelect.CodigoAbreviacion
              })).then(function(response) {
              self.refresh();
              self.gridOptions_op.data = response.data;
              // data proveedor
              angular.forEach(self.gridOptions_op.data, function(iterador) {
                agoraRequest.get('informacion_proveedor',
                  $.param({
                    query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
                  })
                ).then(function(response) {
                  iterador.Proveedor = response.data[0];
                });
                financieraRequest.post('orden_pago/ValorTotal/' + iterador.Id).then(function(response) {
                  iterador.ValorTotal = response.data;
                });
              })
              // data proveedor
            });
          } else {
            self.gridOptions_op.data = null;
            self.refresh();
          }
        }
        //
        self.gridOptions_op = {
          showColumnFooter: false,
          enableRowSelection: true,
          enableRowHeaderSelection: true,

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
              displayName: $translate.instant('VALOR')
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO')
            },
          ]
        };
        self.gridOptions_op.multiSelect = true;
        self.gridOptions_op.enablePaginationControls = true;
        self.gridOptions_op.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = self.gridApi.selection.getSelectedRows();
          });
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };

        // fin
      },
      controllerAs: 'd_opMultiSelect'
    };
  });
