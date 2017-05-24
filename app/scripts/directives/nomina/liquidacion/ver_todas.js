'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/verTodas
 * @description
 * # nomina/liquidacion/verTodas
 */
angular.module('financieraClienteApp')
  .directive('liquidacionVerTodas', function(financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputdataliquidacion: '='
      },

      templateUrl: 'views/directives/nomina/liquidacion/ver_todas.html',
      controller: function($scope) {
        var self = this;

        self.gridOptions_liquid = {
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
        self.construirQuery = function(data) {
          self.query = '';
          if (data.Vigencia != undefined) {
            if (self.query.length == 0) {
              self.query = self.query + 'Nomina.Periodo:' + data.Vigencia
            } else {
              self.query = self.query + ',Nomina.Periodo:' + data.Vigencia
            }
          }

        }

        $scope.$watch('inputdataliquidacion', function() {
          self.refresh();
          if ($scope.inputdataliquidacion != undefined) {
            console.log("AAAAAAA")
            console.log($scope.inputdataliquidacion)
            console.log("AAAAAAA")
            self.construirQuery($scope.inputdataliquidacion)
            console.log(self.query)

            financieraRequest.get('registro_presupuestal',
              $.param({
                query: "Beneficiario:" + $scope.beneficiaroid,
              })).then(function(response) {
              self.gridOptions_liquid.data = response.data;
            });
            // control de paginacion
            $scope.$watch('[d_liquidacionVerTodas.gridOptions_liquid.paginationPageSize, d_liquidacionVerTodas.gridOptions_liquid.data]', function() {
              if ((self.gridOptions_liquid.data.length <= self.gridOptions_liquid.paginationPageSize || self.gridOptions_liquid.paginationPageSize == null) && self.gridOptions_liquid.data.length > 0) {
                $scope.gridHeight = self.gridOptions_liquid.rowHeight * 2 + (self.gridOptions_liquid.data.length * self.gridOptions_liquid.rowHeight);
                if (self.gridOptions_liquid.data.length <= 5) {
                  self.gridOptions_liquid.enablePaginationControls = false;
                }
              } else {
                $scope.gridHeight = self.gridOptions_liquid.rowHeight * 3 + (self.gridOptions_liquid.paginationPageSize * self.gridOptions_liquid.rowHeight);
                self.gridOptions_liquid.enablePaginationControls = true;
              }
            }, true);
          }
        })

        //
        self.gridOptions_liquid.onRegisterApi = function(gridApi) {
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
        self.gridOptions_liquid.multiSelect = false;

        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
