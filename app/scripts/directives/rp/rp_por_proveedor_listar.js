'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rp/rpPorProveedorListar
 * @description
 * # rp/rpPorProveedorListar
 */
angular.module('financieraClienteApp')
  .directive('rpPorProveedorListar', function(financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        beneficiaroid: '=?',
        rpselect: '=?'
      },

      templateUrl: 'views/directives/rp/rp_por_proveedor_listar.html',
      controller: function($scope) {
        var self = this;
        self.gridOptions_rp = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [5, 10, 15],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 12,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP')
            },
            {
              field: 'Estado.Nombre',
              displayName: $translate.instant('ESTADO')
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA')
            }
          ]
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };

        $scope.$watch('beneficiaroid', function() {
          self.refresh();
          if ($scope.beneficiaroid != undefined) {
            financieraRequest.get('registro_presupuestal',
              $.param({
                query: "Beneficiario:" + $scope.beneficiaroid,
              })).then(function(response) {
              self.gridOptions_rp.data = response.data;
            });
          }
        })
        // control de paginacion
        $scope.$watch('[d_rpPorProveedorListar.gridOptions_rp.paginationPageSize, d_rpPorProveedorListar.gridOptions_rp.data]', function() {
          if ((self.gridOptions_rp.data.length <= self.gridOptions_rp.paginationPageSize || self.gridOptions_rp.paginationPageSize == null) && self.gridOptions_rp.data.length > 0) {
            $scope.gridHeight = self.gridOptions_rp.rowHeight * 2 + (self.gridOptions_rp.data.length * self.gridOptions_rp.rowHeight);
            if (self.gridOptions_rp.data.length <= 5) {
              self.gridOptions_rp.enablePaginationControls = false;
            }
          } else {
            $scope.gridHeight = self.gridOptions_rp.rowHeight * 3 + (self.gridOptions_rp.paginationPageSize * self.gridOptions_rp.rowHeight);
            self.gridOptions_rp.enablePaginationControls = true;
          }
        }, true);
        //
        self.gridOptions_rp.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.rpselect = row.entity;
            //consulta datos del rp
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', //en el futuro será una servició con calculo de suma total
              $.param({
                query: "RegistroPresupuestal.Id:" + $scope.rpselect.Id,
                limit: 0,
              })).then(function(response) {
              self.rp_select_de_consulta = response.data;
            });
            //Valor total del Rp
            financieraRequest.get('registro_presupuestal/ValorTotalRp/' + $scope.rpselect.Id)
              .then(function(response) {
                self.valor_total_rp = response.data;
              });
          });
        };
        self.gridOptions_rp.multiSelect = false;
        //
      },
      controllerAs: 'd_rpPorProveedorListar'
    };
  });
