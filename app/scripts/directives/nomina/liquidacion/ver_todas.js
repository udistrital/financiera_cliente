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
        inputnecesidad: '=?',
        ouputpreliquidacion: '=?'
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
                      visible: false
                    },
                    {
                      field: 'NumeroContrato',
                      displayName: $translate.instant('CONTRATO'),
                      width: '10%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Concepto.AliasConcepto',
                      displayName: $translate.instant('CONCEPTOS'),
                      width: '15%'
                    },
                    {
                      field: 'Concepto.NaturalezaConcepto.Nombre',
                      displayName: $translate.instant('NATURALEZA'),
                      width: '15%'
                    },
                    {
                      field: 'TipoPreliquidacion.Nombre',
                      displayName: $translate.instant('TIPO'),
                      width: '15%'
                    },
                    {
                      field: 'ValorCalculado',
                      displayName: $translate.instant('VALOR'),
                      cellFilter: 'currency',
                      width: '14%',
                      cellClass: 'input_right'
                    }
                  ]
                };
                //consulta
                titanRequest.get('detalle_preliquidacion',
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
              displayName: $translate.instant('DESCRIPCION') + ' ' + $translate.instant('LIQUIDACION'),
              cellClass: 'input_center'
            },
            {
              field: 'Mes',
              displayName: $translate.instant('MES'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'Ano',
              displayName: $translate.instant('ANO'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'EstadoPreliquidacion.Nombre',
              displayName: $translate.instant('ESTADO'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'FechaRegistro',
              displayName: $translate.instant('FECHA'),
              width: '8%',
              cellClass: 'input_center',
              cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>'
            },
            {
              field: 'Nomina.TipoNomina.Nombre',
              displayName: $translate.instant('NOMINA'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'Nomina.Descripcion',
              displayName: $translate.instant('DESCRIPCION') + ' ' + $translate.instant('NOMINA'),
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
              titanRequest.get('preliquidacion',
                $.param({
                  query: 'Id:' + self.NecesidadProcesoExterno.ProcesoExterno,
                })).then(function(response) {
                self.gridOptions_preliquidacion.data = response.data;
                $scope.ouputpreliquidacion = response.data;
              });
            });
          } else {
            self.gridOptions_preliquidacion.data = {};
            $scope.ouputpreliquidacion = {};
          };
        })
        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
