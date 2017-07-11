'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:necesidad/necesidaListar
 * @description
 * # necesidad/necesidaListar
 */
angular.module('financieraClienteApp')
  .directive('necesidaListar', function($translate, administrativaRequest, agoraRequest, financieraMidRequest, financieraRequest) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        outputrp: '=?',
      },

      templateUrl: 'views/directives/necesidad/necesida_listar.html',
      controller: function($scope) {
        var self = this;

        self.gridOptions_necesidad = {
          enableRowSelection: true,
          multiSelect: false,
          enableRowHeaderSelection: false,

          paginationPageSizes: [10, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 10,
          useExternalPagination: false,

          // inicio sub tabla
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          onRegisterApi: function(gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
              if (row.isExpanded) {
                gridApi.selection.clearSelectedRows();
                row.entity.subGridOptions = {
                  multiSelect: false,
                  columnDefs: [{
                      field: 'registro_presupuestal.Id',
                      visible: false
                    },
                    {
                      field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
                      displayName: $translate.instant('NO_CDP'),
                      width: '10%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Estado.Nombre',
                      displayName: $translate.instant('CDP') + " " + $translate.instant('ESTADO'),
                      width: '10%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'NumeroRegistroPresupuestal',
                      displayName: $translate.instant('NO_CRP'),
                      width: '11%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Vigencia',
                      displayName: $translate.instant('CRP') + " " + $translate.instant('VIGENCIA'),
                      width: '11%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Estado.Nombre',
                      displayName: $translate.instant('CRP') + " " + $translate.instant('ESTADO'),
                      width: '11%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Responsable',
                      displayName: $translate.instant('CRP') + " " + $translate.instant('RESPONSABLE'),
                      cellClass: 'input_center'
                    },
                    {
                      field: 'ValorTotal',
                      displayName: $translate.instant('CRP') + " " + $translate.instant('VALOR'),
                      cellFilter: 'currency',
                      cellClass: 'input_right'
                    },
                  ],
                  onRegisterApi: function(gridApi) {
                    gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope, function(row2) {
                      $scope.outputrp = null;
                      $scope.outputrp = row2.entity;
                    });
                  }
                };
                //
                financieraMidRequest.get("disponibilidad/DisponibilidadByNecesidad/" + row.entity.Necesidad.Id)
                  .then(function(data) {
                    row.entity.subGridOptions.data = data.data[0].registro_presupuestal;
                    // get valor rp
                    angular.forEach(row.entity.subGridOptions.data, function(dataCrp) {
                      financieraRequest.get('registro_presupuestal/ValorTotalRp/' + dataCrp.Id)
                        .then(function(response) {
                          dataCrp.ValorTotal = response.data;
                        });
                    })
                    // fin get valor rp
                  })
              } // if
            });
          },
          // fin sub tabla
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Necesidad.Numero',
              displayName: $translate.instant('DOCUMENTO'),
              cellClass: 'input_center',
              width: '11%',
            },
            {
              field: 'Necesidad.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center',
              width: '9%',
            },
            {
              field: 'Necesidad.Valor',
              displayName: $translate.instant('VALOR'),
              cellFilter: 'currency',
              width: '11%',
              cellClass: 'input_right',
            },
            {
              field: 'Necesidad.DiasDuracion',
              displayName: $translate.instant('DURACION'),
              width: '9%',
              cellClass: 'input_center',
            },
            {
              field: 'Necesidad.Estado.Nombre',
              displayName: $translate.instant('ESTADO'),
              width: '10%',
            },
            {
              field: 'Necesidad.Objeto',
              displayName: $translate.instant('OBJETO'),
            },
            {
              field: 'Necesidad.Justificacion',
              displayName: $translate.instant('JUSTIFICACION'),
            },
          ]
        };
        //
        administrativaRequest.get('solicitud_disponibilidad',
          $.param({
            query: "Expedida:true",
            limit: -1
          })).then(function(response) {
          self.gridOptions_necesidad.data = response.data;
        });

        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        // fin
      },
      controllerAs: 'd_necesidaListar'
    };
  });
