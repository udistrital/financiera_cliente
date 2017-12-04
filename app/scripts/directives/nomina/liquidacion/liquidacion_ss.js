'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/liquidacionSs
 * @description
 * # nomina/liquidacion/liquidacionSs
 */
angular.module('financieraClienteApp')
  .directive('liquidacionSs', function(financieraMidRequest, administrativaRequest, titanRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        ouputdatanominaselect: '=?',
        outputerrorop: '=?',
        outputdataopss: '=?'
      },
      templateUrl: 'views/directives/nomina/liquidacion/liquidacion_ss.html',
      controller: function($scope) {
        var self = this;
        $scope.mostrarPanelError = false;
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
        titanRequest.get('nomina',
          $.param({
            limit: '-1',
          })).then(function(response) {
          self.nomina = response.data;
        })
        //
        self.gridOptionsPreliquidacionPersonas = {
          enableRowHeaderSelection: false,
          multiSelect: false,
          columnDefs: [{
              field: 'NumeroContrato',
              displayName: $translate.instant('CONTRATO'),
              width: '15%',
              cellClass: 'input_center'
            },
            {
              field: 'VigenciaContrato',
              displayName: $translate.instant('VIGENCIA') + ' ' + $translate.instant('CONTRATO'),
              width: '12%',
              cellClass: 'input_center'
            },
            {
              field: 'infoPersona.nombre_completo',
              displayName: $translate.instant('NOMBRE'),
              width: '40%',
            },
            {
              field: 'infoPersona.Documento.numero',
              displayName: $translate.instant('NO_DOCUMENTO'),
              width: '33%',
              cellClass: 'input_center'
            },
          ]
        };
        self.gridOptionsPreliquidacionPersonas.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            //console.log(row.entity.DetallePagos);
            self.gridOptionsPreliquidacionPagos.data = row.entity.DetallePagos;
          });
        };
        //
        self.gridOptionsPreliquidacionPagos = {
          enableRowHeaderSelection: false,
          multiSelect: false,
          columnDefs: [{
              field: 'TipoPago.AliasConcepto',
              displayName: $translate.instant('PAGO'),
              width: '40%',
            },
            {
              field: 'Valor',
              displayName: $translate.instant('VALOR'),
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '20%',
            },
            {
              field: 'EntidadPago',
              displayName: $translate.instant('ENTIDAD'),
              width: '40%',
            },
          ]
        };
        // ver movimeintos
        self.gridOptionsConceptos = {
          enableRowHeaderSelection: false,
          showColumnFooter: true,
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
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div class="input_right">{{col.getAggregationValue() | currency}}</div>',
              width: '15%',
            },
          ]
        };
        //
        self.gridOptionsMovimientosContables = {
          enableRowHeaderSelection: false,
          showColumnFooter: true,
          multiSelect: true,
          minRowsToShow: 6,
          columnDefs: [{
              field: 'CuentaContable.Id',
              visible: false
            },
            {
              field: 'Concepto.Codigo',
              displayName: $translate.instant('CONCEPTO'),
              width: '10%',
            },
            {
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CUENTAS_CONTABLES'),
              width: '10%',
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

        self.gridOptionsMovimientosContablesTemporal = {
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

        // // para desarrollo

        // // para desarrollo
        self.consultar = function() {
          if ($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined && $scope.anoSelect.length == 4) {
            $scope.ouputdatanominaselect.idNomina = $scope.nominaSelect;
            $scope.ouputdatanominaselect.mesLiquidacion = $scope.mesSelect;
            $scope.ouputdatanominaselect.anioLiquidacion = $scope.anoSelect;
            //
            self.refresh();
            self.gridOptionsPreliquidacionPersonas.data = {};
            self.gridOptionsPreliquidacionPagos.data = {};
            self.gridOptionsConceptos.data = {};
            self.gridOptionsMovimientosContables.data = {};
            self.gridOptionsMovimientosContablesTemporal.data = {};
            $scope.outputdataopss = {};


            financieraMidRequest.get('orden_pago_ss/GetConceptosMovimeintosContablesSs',
              $.param({
                idNomina: $scope.nominaSelect.Id,
                mesLiquidacion: $scope.mesSelect,
                anioLiquidacion: $scope.anoSelect,
              })
            ).then(function(response) {
              if (response.data.Type != 'error') {
                self.gridOptionsPreliquidacionPersonas.data = response.data.DetalleCargueOp[0].ViewPagosPorPersona;
                if (response.data.DetalleCargueOp[0].Aprobado == false) {
                  $scope.mostrarPanelError = true;
                  $scope.outputerrorop = response.data.DetalleCargueOp[0].Code;
                }
                self.gridOptionsConceptos.data = response.data.DetalleCargueOp[0].ConceptoOrdenPago;
                self.gridOptionsMovimientosContables.data = response.data.DetalleCargueOp[0].MovimientoContable;
                self.gridOptionsMovimientosContablesTemporal.data = response.data.DetalleCargueOp[0].MovimientosDeDescuento;
                $scope.outputdataopss = response.data;
              }
            })
          }
        }
      },
      //
      controllerAs: 'd_liquidacionSs'
    };
  });
