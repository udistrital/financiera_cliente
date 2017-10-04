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
        inputdataliquidacion: '=?',
        inputpestanaabierta: '=?',
        outputliquidacion: '=?',
        outputliquidacionid: '=?'
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
              cellClass: 'input_center',
              cellTemplate: '<span>{{row.entity.FechaLiquidacion | date:"yyyy-MM-dd":"UTC"}}</span>'
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
          if (data.TipoNomina != undefined) {
            if (self.query.length == 0) {
              self.query = self.query + 'Nomina.TipoNomina.Nombre:' + data.TipoNomina
            } else {
              self.query = self.query + ',Nomina.TipoNomina.Nombre:' + data.TipoNomina
            }
          }
          if (data.Vigencia != undefined && data.Mes != undefined) {
            if (self.query.length == 0) {
              self.query = self.query + 'FechaLiquidacion__startswith:' + data.Vigencia + '-' + data.Mes
            } else {
              self.query = self.query + ',FechaLiquidacion__startswith:' + data.Vigencia + '-' + data.Mes
            }
          }
        }

        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta){
          $scope.a = true;
          }
        })
        $scope.$watch('inputdataliquidacion', function() {
          if ($scope.inputdataliquidacion != undefined) {
            self.construirQuery($scope.inputdataliquidacion)
            titanRequest.get('liquidacion',
              $.param({
                query: self.query, //"Nomina.Periodo:2017,Nomina.TipoNomina.Nombre:FP",
              })).then(function(response) {
              self.refresh();
              self.gridOptions_liquid.data = response.data;
            });
          }
        },true)

        //
        self.gridOptions_liquid.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputliquidacion = row.entity;
            $scope.outputliquidacionid = row.entity.Id;
          });
        };
        self.gridOptions_liquid.multiSelect = false;
        self.gridOptions_liquid.enablePaginationControls = true;

        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
