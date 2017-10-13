'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/verTodas
 * @description
 * # nomina/liquidacion/verTodas
 */
angular.module('financieraClienteApp')
  .directive('liquidacionVerTodas', function(administrativaRequest, titanRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputnecesidad: '=?'
      },

      templateUrl: 'views/directives/nomina/liquidacion/ver_todas.html',
      controller: function($scope) {
        var self = this;

        self.gridOptions_preliquidacion = {
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Descripcion',
              displayName: $translate.instant('DESCRIPCION'),
              cellClass: 'input_center'
            },
            {
              field: 'EstadoPreliquidacion.Nombre',
              displayName: $translate.instant('ESTADO'),
              cellClass: 'input_center'
            },
            {
              field: 'FechaRegistro',
              displayName: $translate.instant('FECHA'),
              cellClass: 'input_center',
              cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>'
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
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        });
        $scope.$watch('inputnecesidad', function() {
          if (Object.keys($scope.inputnecesidad).length > 0) {
            administrativaRequest.get('necesidad_proceso_externo',
              $.param({
                query: 'Necesidad.Id:' + $scope.inputnecesidad.Id,
              })).then(function(response) {
              self.NecesidadProcesoExterno = response.data[0];
              //consultamos liquidacion
              administrativaRequest.get('preliquidacion',
                $.param({
                  query: 'Id:' + self.NecesidadProcesoExterno.ProcesoExterno,
                })).then(function(response) {
                self.gridOptions_preliquidacion.data = response.data;
              });
            });
          };
        })
        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
