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
        inputpestanaabierta: '=?',
        inputrpid: '=?',
        outputconceptos: '=?'
      },

      templateUrl: 'views/directives/rubros/rubros_por_rp_seleccion_multiple.html',
      controller: function($scope) {
        var self = this;
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        $scope.outputconceptos = [];
        self.gridOptions_rubros = {
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          columnDefs: [{
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Id',
              visible: false
            },
            {
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
              displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('RUBRO'),
              width: '15%',
              cellClass: 'input_center'
            },
            {
              field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Nombre',
              displayName: $translate.instant('NOMBRE')
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
              width: '10%',
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
          self.refresh();
          if ($scope.inputrpid != undefined) {
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
              $.param({
                query: "RegistroPresupuestal.Id:" + $scope.inputrpid,
                limit: 0
              })
            ).then(function(response) {
              self.gridOptions_rubros.data = response.data;
              angular.forEach(self.gridOptions_rubros.data, function(iterador) {
                // get saldos de lor rp
                var rpData = {
                  Rp: iterador.RegistroPresupuestal,
                  Apropiacion: iterador.DisponibilidadApropiacion.Apropiacion,
                  FuenteFinanciacion: iterador.DisponibilidadApropiacion.FuenteFinanciamiento
                };
                financieraRequest.post('registro_presupuestal/SaldoRp', rpData
                ).then(function(response) {
                  iterador.Saldo = response.data.saldo;
                  //se hace solicitud en este framento para obtener el saldo del rubro
                  financieraRequest.get('concepto',
                    $.param({
                      query: "Rubro.Id:" + iterador.DisponibilidadApropiacion.Apropiacion.Rubro.Id,
                      limit: 0
                    })
                  ).then(function(response) {
                    iterador.subGridOptions.data = response.data;
                    //asociar RegistroPresupuestalDisponibilidadApropiacion
                    angular.forEach(iterador.subGridOptions.data, function(subGridData) {
                      subGridData.RegistroPresupuestalDisponibilidadApropiacion = {
                        'Id': iterador.Id,
                        'RegistroPresupuestal': iterador.RegistroPresupuestal,
                        'DisponibilidadApropiacion': iterador.DisponibilidadApropiacion,
                        'Valor': iterador.Valor,
                        'Saldo': iterador.Saldo,
                      };
                    });
                  });
                  //se inclulle consulta para obtener saldo en el objeto
                });
                //fin get saldos de lor rp
                iterador.subGridOptions = {
                  multiSelect: true,
                  columnDefs: [{
                      field: 'Id',
                      visible: false,
                      enableCellEdit: false
                    },
                    {
                      field: 'Codigo',
                      displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('CONCEPTO'),
                      enableCellEdit: false,
                      width: '15%',
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
                      if (row2.isSelected) {
                        $scope.outputconceptos.push(row2.entity);
                      } else {
                        var i = $scope.outputconceptos.indexOf(row2.entity)
                        $scope.outputconceptos.splice(i, 1);
                      }
                    });
                  }
                }; //subGridOptions
              }); // iterador
            }); //tehen
          }else{
            self.gridOptions_rubros.data = {};
          }
        }) // watch

        // fin
      },
      controllerAs: 'd_rubrosPorRpSeleccionMultiple'
    };
  });
