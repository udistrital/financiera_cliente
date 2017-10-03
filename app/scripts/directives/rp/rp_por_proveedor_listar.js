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

          paginationPageSizes: [5, 10, 15],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 10,
          useExternalPagination: false,

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
          }
        })

        //
        self.gridOptions_rp.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputrpselect = row.entity;
            //consulta datos del rp
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
              $.param({
                query: "RegistroPresupuestal.Id:" + $scope.outputrpselect.Id,
                limit: 0,
              })).then(function(response) {
              self.rp_select_de_consulta = response.data;
              // detalle necesidad
              financieraMidRequest.get('disponibilidad/SolicitudById/' + self.rp_select_de_consulta[0].DisponibilidadApropiacion.Disponibilidad.Solicitud, '')
                .then(function(response) {
                  self.solicitud = response.data[0];
                });
            });
            //Valor total del Rp
            financieraRequest.get('registro_presupuestal/ValorTotalRp/' + $scope.outputrpselect.Id)
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
