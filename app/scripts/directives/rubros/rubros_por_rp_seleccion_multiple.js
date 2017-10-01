'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/rubrosPorRpSeleccionMultiple
 * @description
 * # rubros/rubrosPorRpSeleccionMultiple
 */
angular.module('financieraClienteApp')
  .directive('rubrosPorRpSeleccionMultiple', function(financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?'
        inputrpid: '=?',
        outputconceptos: '=?'
      },

      templateUrl: 'views/directives/rubros/rubros_por_rp_seleccion_multiple.html',
      controller: function($scope) {
        var self = this;

        self.gridOptions_rubros = {
          enableRowSelection: false,
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
                  multiSelect: true,
                  columnDefs: [{
                      field: 'Id',
                      visible: false,
                      enableCellEdit: false
                    },
                    {
                      field: 'Codigo',
                      displayName: $translate.instant('CODIGO'),
                      enableCellEdit: false,
                      width: '10%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Nombre',
                      displayName: $translate.instant('NOMBRE'),
                      enableCellEdit: false
                    },
                    {
                      field: 'Descripcion',
                      displayName: $translate.instant('DESCRIPCION'),
                      enableCellEdit: false
                    },
                    {
                      field: 'TipoConcepto.Nombre',
                      displayName: $translate.instant('TIPO'),
                      enableCellEdit: false,
                      width: '10%',
                    },
                  ],
                  onRegisterApi: function(gridApi) {
                    self.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope, function(row2) {
                      $scope.outputconceptos = self.gridApi.selection.getSelectedRows();
                    });
                  }
                };
                //
                financieraRequest.get('concepto',
                  $.param({
                    query: "Rubro.Id:" + row.entity.DisponibilidadApropiacion.Apropiacion.Rubro.Id,
                    limit: 0
                  })
                ).then(function(response) {
                  row.entity.subGridOptions.data = response.data;
                });
              } // if
            });
          },
          // fin sub tabla
          columnDefs: [{
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Id',
              visible: false
            },
            {
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
              displayName: $translate.instant('CODIGO'),
              cellClass: 'input_center'
            },
            {
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '5%',
              cellClass: 'input_center'
            },
            {
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',
              displayName: $translate.instant('DESCRIPCION')
            },
            {
              field: 'Valor',
              displayName: $translate.instant('VALOR'),
              cellFilter: 'currency',
              width: '14%',
              cellClass: 'input_right'
            },
            {
              field: 'Saldo',
              displayName: $translate.instant('SALDO'),
              cellFilter: 'currency',
              width: '14%',
              cellClass: 'input_right'
            }, //obtenido por servicio financieraRequest.post('registro_presupuestal/SaldoRp',rpData)
            {
              field: 'DisponibilidadApropiacion.FuenteFinanciamiento.Descripcion',
              displayName: $translate.instant('FUENTES_FINANCIACION')
            },
            {
              field: 'DisponibilidadApropiacion.FuenteFinanciamiento.Codigo',
              displayName: $translate.instant('FUENTE_FINANCIACION_CODIGO'),
              width: '7%',
              cellClass: 'input_center'
            },
          ]
        };
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        //
        $scope.$watch('inputrpid', function() {
          if ($scope.inputrpid != undefined) {
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
              $.param({
                query: "RegistroPresupuestal.Id:" + $scope.inputrpid,
                limit: 0
              })
            ).then(function(response) {
              self.gridOptions_rubros.data = response.data;
              // get saldos de lor rp
              angular.forEach(self.gridOptions_rubros.data, function(data) {
                var rpData = {
                  Rp: data.RegistroPresupuestal,
                  Apropiacion: data.DisponibilidadApropiacion.Apropiacion,
                  FuenteFinanciacion: data.DisponibilidadApropiacion.FuenteFinanciamiento
                };
                financieraRequest.post('registro_presupuestal/SaldoRp', rpData).then(function(response) {
                  data.Saldo = response.data.saldo;
                });
              });
              //fin get saldos de lor rp
            });
          }
        })
        // fin
      },
      controllerAs: 'd_rubrosPorRpSeleccionMultiple'
    };
  });
