'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/verTodas
 * @description
 * # nomina/liquidacion/verTodas
 */
angular.module('financieraClienteApp')
  .directive('liquidacionVerTodas', function(titanRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputdataliquidacion: '=',
        inputpestanaabierta: '=',
        outputliquidacion: '=?'
      },

      templateUrl: 'views/directives/nomina/liquidacion/ver_todas.html',
      controller: function($scope) {
        var self = this;

        self.gridOptions_liquid = {
          enableRowSelection: true,
          enableRowHeaderSelection: true,

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
              field: 'NombreLiquidacion',
              displayName: $translate.instant('NOMBRE'),
              cellClass: 'input_center'
            },
            {
              field: 'IdUsuario',
              displayName: $translate.instant('ELABORADO_POR'),
              cellClass: 'input_center'
            },
            {
              field: 'EstadoLiquidacion',
              displayName: $translate.instant('ESTADO'),
              cellClass: 'input_center'
            },
            {
              field: 'FechaLiquidacion',
              displayName: $translate.instant('FECHA'),
              cellClass: 'input_center'
            },
            {
              field: 'Nomina.Nombre',
              displayName: $translate.instant('NOMINA'),
              cellClass: 'input_center'
            },
            {
              field: 'Nomina.Descripcion',
              displayName: $translate.instant('DESCRIPCION'),
              cellClass: 'input_center'
            },
            {
              field: 'Nomina.Periodo',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center'
            },
            {
              field: 'Nomina.TipoNomina.Nombre',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center'
            },
            {
              field: 'Nomina.Vinculacion.Nombre',
              displayName: $translate.instant('VINCULACION'),
              cellClass: 'input_center'
            },
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
        $scope.$watch('inputpestanaabierta', function() {
          console.log($scope.inputpestanaabierta)
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
        })
        $scope.$watch('inputdataliquidacion', function() {
          self.refresh();
          if ($scope.inputdataliquidacion != undefined) {
            console.log("AAAAAAA")
            console.log($scope.inputdataliquidacion)
            console.log("AAAAAAA")
            self.construirQuery($scope.inputdataliquidacion)
            console.log(self.query)

            titanRequest.get('liquidacion',
              $.param({
                query: "Id:7",
              })).then(function(response) {
              self.gridOptions_liquid.data = response.data;
              console.log(response.data);
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
            $scope.outputliquidacion = row.entity;
          });
        };
        self.gridOptions_liquid.multiSelect = false;

        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
