'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rp/rpPorProveedorListar
 * @description
 * # rp/rpPorProveedorListar
 */
angular.module('financieraClienteApp')
  .directive('rpPorProveedorListar', function(financieraRequest, financieraMidRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputbeneficiaroid: '=?',
        outputrpselect: '=?',
      },

      templateUrl: 'views/directives/rp/rp_por_proveedor_listar.html',
      controller: function($scope) {
        var self = this;
        self.gridOptions_rp = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              cellClass: 'input_center'
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center'
            },
            {
              field: 'Estado.Nombre',
              displayName: $translate.instant('ESTADO')
            }
          ]
        };
        self.gridOptions_rp.multiSelect = false;
        self.gridOptions_rp.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if (self.gridApi.selection.getSelectedRows()[0] != undefined) {
              $scope.outputrpselect = self.gridApi.selection.getSelectedRows()[0];
              //Valor total del Rp
              financieraRequest.get('registro_presupuestal/ValorTotalRp/' + $scope.outputrpselect.Id)
                .then(function(response) {
                  self.valor_total_rp = response.data;
                });
              // detalle necesidad
              self.DisponibilidadProcesoExternoId = $scope.outputrpselect.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DisponibilidadProcesoExterno[0].ProcesoExterno
              financieraMidRequest.get('disponibilidad/SolicitudById/' + self.DisponibilidadProcesoExternoId, '')
                .then(function(response) {
                  self.necesidadInfo = response.data;
                });
            } else {
              $scope.outputrpselect = {};
              self.valor_total_rp = {};
              self.necesidadInfo = {};
            }
          });
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        //
        $scope.$watch('inputbeneficiaroid', function() {
          self.refresh();
          if ($scope.inputbeneficiaroid != undefined) {
            financieraRequest.get('registro_presupuestal',
              $.param({
                query: "Beneficiario:" + $scope.inputbeneficiaroid,
              })).then(function(response) {
              self.gridOptions_rp.data = response.data;
            });
          } else {
            self.gridOptions_rp.data = {};
          }
        })


        //
      },
      controllerAs: 'd_rpPorProveedorListar'
    };
  });
