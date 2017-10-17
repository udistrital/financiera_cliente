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
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        self.gridOptions_preliquidacion = {
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          enableRowHeaderSelection: false,
          multiSelect: false,
          //inicio sub grid
          onRegisterApi: function(gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
              if (row.isExpanded) {
                row.entity.subGridOptions = {
                  enableRowHeaderSelection: false,
                  multiSelect: false,
                  columnDefs: [{
                      field: 'Id',
                      visible: true
                    },
                    {
                      field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
                      displayName: $translate.instant('NO_CDP'),
                      width: '10%',
                      cellClass: 'input_center'
                    }
                  ]
                };
                //consulta
                administrativaRequest.get('detalle_preliquidacion',
                  $.param({
                    query: 'Preliquidacion.Id:' + row.entity.Id,
                  })).then(function(response) {
                  row.entity.subGridOptions.data = response.data;
                });
              }; //if

            });
          },
          //fin sub grid
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
          self.refresh();
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
          } else {
            self.gridOptions_preliquidacion.data = {};
          };
        })
        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
