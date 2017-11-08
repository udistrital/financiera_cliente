'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/verTodas
 * @description
 * # nomina/liquidacion/verTodas
 */
angular.module('financieraClienteApp')
  .directive('liquidacionVerTodas', function(financieraMidRequest, administrativaRequest, titanRequest, $timeout, $translate) {
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
          multiSelect: false,
          minRowsToShow: 6,
          columnDefs: [{
              field: 'CuentaContable.CuentaContable.Id',
              visible: false
            },
            {
              field: 'CuentaContable.CuentaContable.Codigo',
              displayName: $translate.instant('CUENTAS_CONTABLES'),
              width: '20%',
            },
            {
              field: 'CuentaContable.CuentaContable.Nombre',
              displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CUENTA'),
            },
            {
              field: 'Debito',
              displayName: $translate.instant('DEBITO'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '15%',
            },
            {
              field: 'Credito',
              displayName: $translate.instant('CREDITO'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '15%',
            },
            {
              field: 'CuentaContable.CuentaContable.Naturaleza',
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
        // financieraMidRequest.get('orden_pago_nomina/PreviewCargueMasivoOp',
        //   $.param({
        //     idNomina: 5,
        //     mesLiquidacion: 9,
        //     anioLiquidacion: 2017,
        //   })
        // ).then(function(response) {
        //   if (response.data != null) {
        //     self.gridOptionsPreliquidacionPersonas.data = response.data.DetalleCargueOp;
        //     self.IdLiquidacion = response.data.Id_Preliq;
        //   } else {
        //     self.gridOptionsPreliquidacionPersonas.data = {};
        //   }
        // })
        // para desarrollo
        self.consultar = function() {
          if ($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined && $scope.anoSelect.length == 4) {
            $scope.ouputdatanominaselect.idNomina = $scope.nominaSelect;
            $scope.ouputdatanominaselect.mesLiquidacion = $scope.mesSelect;
            $scope.ouputdatanominaselect.anioLiquidacion = $scope.anoSelect;
            self.refresh();
            financieraMidRequest.get('orden_pago_nomina/PreviewCargueMasivoOp',
              $.param({
                idNomina: $scope.nominaSelect.Id,
                mesLiquidacion: $scope.mesSelect,
                anioLiquidacion: $scope.anoSelect,
              })
            ).then(function(response) {
              if (response.data.Type == 'error') {
                self.gridOptionsPreliquidacionPersonas.data = {};
                $scope.ouputdataresumencarge = {};
              } else {
                self.gridOptionsPreliquidacionPersonas.data = response.data.DetalleCargueOp;
                $scope.ouputdataresumencarge = response.data.ResumenCargueOp;
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
          }
        });
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
