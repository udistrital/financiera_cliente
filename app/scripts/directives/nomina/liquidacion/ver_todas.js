'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/verTodas
 * @description
 * # nomina/liquidacion/verTodas
 */
angular.module('financieraClienteApp')
  .directive('liquidacionVerTodas', function(financieraRequest,financieraMidRequest, administrativaRequest, titanRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        ouputdatanominaselect: '=?',
        ouputdataresumencarge: '=?'
      },

      templateUrl: 'views/directives/nomina/liquidacion/ver_todas.html',
      controller: function($scope) {
        var self = this;
        $scope.ouputdatanominaselect = {};
        //
        titanRequest.get('nomina',
          $.param({
            limit: '-1',
          })).then(function(response) {
          self.nomina = response.data;
        })

        //

        financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
            .then(function(response) { //error con el success
                self.vigenciaActual = parseInt(response.data);
                var dif = self.vigenciaActual - 1995;
                var range = [];
                range.push(self.vigenciaActual);
                for (var i = 1; i < dif; i++) {
                    range.push(self.vigenciaActual - i);
                }
                self.years = range;
                
            });

        // Resumen
        self.gridOptionsResumenMovimientosContables = {
          enableRowHeaderSelection: false,
          showColumnFooter: true,
          multiSelect: false,
          minRowsToShow: 6,
          columnDefs: [{
              field: 'CuentaContable.Id',
              visible: false
            },
            {
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CUENTAS_CONTABLES'),
              width: '20%',
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CUENTA'),
            },
            {
              field: 'Debito',
              displayName: $translate.instant('DEBITO'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div class="input_right">{{col.getAggregationValue() | currency}}</div>',
              width: '15%',

            },
            {
              field: 'Credito',
              displayName: $translate.instant('CREDITO'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div class="input_right">{{col.getAggregationValue() | currency}}</div>',
              width: '15%',
            },
            {
              field: 'CuentaContable.Naturaleza',
              displayName: $translate.instant('NATURALEZA'),
              width: '10%',
            },
          ]
        };
        self.gridOptionsResumenConceptos = {
          enableRowHeaderSelection: false,
          showColumnFooter: true,
          multiSelect: false,
          minRowsToShow: 6,
          columnDefs: [{
              field: 'Rubro.Id',
              visible: false
            },
            {
              field: 'Rubro.Codigo',
              displayName: $translate.instant('RUBRO') + " " + $translate.instant('CODIGO'),
              width: '30%',
            },
            {
              field: 'Rubro.Nombre',
              displayName: $translate.instant('NOMBRE'),
              width: '50%',
            },
            {
              field: 'Afectacion',
              displayName: $translate.instant('AFECTACION'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div class="input_right">{{col.getAggregationValue() | currency}}</div>',
              width: '20%',
            },
          ]
        };
        //
        self.gridOptionsConceptos = {
          enableRowHeaderSelection: false,
          multiSelect: false,
          minRowsToShow: 6,
          columnDefs: [{
              field: 'Concepto.Id',
              visible: false
            },
            {
              field: 'Concepto.Codigo',
              displayName: $translate.instant('CONCEPTO') + " " + $translate.instant('CODIGO'),
              width: '20%',
            },
            {
              field: 'Concepto.Nombre',
              displayName: $translate.instant('NOMBRE'),
            },
            {
              field: 'Concepto.TipoConcepto.Nombre',
              displayName: $translate.instant('TIPO'),
              width: '10%',
            },
            {
              field: 'Valor',
              displayName: $translate.instant('AFECTACION'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '15%',
            },
          ]
        };
        //
        self.gridOptionsMovimientosContables = {
          enableRowHeaderSelection: false,
          showColumnFooter: true,
          multiSelect: false,
          minRowsToShow: 6,
          columnDefs: [{
              field: 'CuentaContable.Id',
              visible: false
            },
            {
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CUENTAS_CONTABLES'),
              width: '20%',
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CUENTA'),
            },
            {
              field: 'Debito',
              displayName: $translate.instant('DEBITO'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div class="input_right">{{col.getAggregationValue() | currency}}</div>',
              width: '15%',

            },
            {
              field: 'Credito',
              displayName: $translate.instant('CREDITO'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div class="input_right">{{col.getAggregationValue() | currency}}</div>',
              width: '15%',
            },
            {
              field: 'CuentaContable.Naturaleza',
              displayName: $translate.instant('NATURALEZA'),
              width: '10%',
            },
          ]
        };
        //
        self.gridOptionsPreliquidacionPersonas = {
          enableRowHeaderSelection: false,
          multiSelect: false,
          minRowsToShow: 13,
          columnDefs: [{
              field: 'Contrato',
              displayName: $translate.instant('CONTRATO'),
              width: '15%',
              headerCellClass: 'encabezado',
              cellClass: function(_, row) {
                if (row.entity.Aprobado == false) {
                  return 'input_center text-danger';
                } else {
                  return 'input_center';
                }
              }
            },
            {
              field: 'VigenciaContrato',
              displayName: $translate.instant('VIGENCIA') + ' ' + $translate.instant('CONTRATO'),
              width: '15%',
              headerCellClass: 'encabezado',
              cellClass: function(_, row) {
                if (row.entity.Aprobado == false) {
                  return 'input_center text-danger';
                } else {
                  return 'input_center';
                }
              }
            },
            {
              field: 'infoPersona.nombre_completo',
              displayName: $translate.instant('NOMBRE'),
              width: '40%',
              headerCellClass: 'encabezado',
              cellClass: function(_, row) {
                if (row.entity.Aprobado == false) {
                  return 'input_center text-danger';
                } else {
                  return 'input_center';
                }
              }
            },
            {
              field: 'infoPersona.Documento.numero',
              displayName: $translate.instant('NO_DOCUMENTO'),
              width: '30%',
              headerCellClass: 'encabezado',
              cellClass: function(_, row) {
                if (row.entity.Aprobado == false) {
                  return 'input_center text-danger';
                } else {
                  return 'input_center';
                }
              }
            },
          ]
        };
        self.gridOptionsPreliquidacionPersonas.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.personaSelect = row.entity;
            if ($scope.personaSelect.Aprobado) {
              $scope.mostrar = true;
              $scope.mostraDetalleError = false;
              self.gridOptionsConceptos.data = $scope.personaSelect.ConceptoOrdenPago;
              self.gridOptionsMovimientosContables.data = $scope.personaSelect.MovimientoContable;
            } else {
              $scope.errorPersona = $scope.personaSelect.Code;
              $scope.mostrar = false;
              $scope.mostraDetalleError = true;
            }
          });
        };

        //para desarrollo

        // para desarrollo
        self.consultar = function() {
          
          console.log($scope.nominaSelect, $scope.anoSelect, $scope.mesSelect)
          if ($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined) {
            self.gridOptionsPreliquidacionPersonas.data = [];
            $scope.ouputdatanominaselect.idNomina = $scope.nominaSelect;
            $scope.ouputdatanominaselect.mesLiquidacion = $scope.mesSelect;
            $scope.ouputdatanominaselect.anioLiquidacion = $scope.anoSelect;
            self.cargando = true;
            self.hayData  = true;
            self.fue_consultado = true;
            $scope.mostrar = false;
            $scope.mostraDetalleError = false;
            self.gridOptionsConceptos.data = {};
            self.gridOptionsMovimientosContables.data = {};
            self.refresh();
            financieraMidRequest.get('orden_pago_nomina/PreviewCargueMasivoOp',
              $.param({
                idNomina: $scope.nominaSelect.Id,
                mesLiquidacion: $scope.mesSelect,
                anioLiquidacion: $scope.anoSelect,
              })
            ).then(function(response) {
              if (response.data == null) {
                self.cargando = false;
                self.hayData  = false;
                self.gridOptionsPreliquidacionPersonas.data = {};
                $scope.ouputdataresumencarge = {};
                self.gridOptionsResumenMovimientosContables.data = {};
                self.gridOptionsResumenConceptos.data = {};
              } else {
                self.cargando = false;
                self.hayData  = true;
                self.gridOptionsPreliquidacionPersonas.data = response.data.DetalleCargueOp;
                $scope.ouputdataresumencarge = response.data;
                self.gridOptionsResumenMovimientosContables.data = response.data.ResumenCargueOp.ResumenContable;
                self.gridOptionsResumenConceptos.data = response.data.ResumenCargueOp.ResumenPresupuestal;
              }
            })
          }
        }

        

        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
            $scope.b = true;
          }
        });

      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
