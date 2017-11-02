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
        ouputdatanominaselect: '=?'
      },

      templateUrl: 'views/directives/nomina/liquidacion/ver_todas.html',
      controller: function($scope) {
        var self = this;
        $scope.ouputdatanominaselect = {};
        self.gridOptions_preliquidacion = {
          expandableRowHeight: 250,
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
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
              width: '15%',
              cellClass: 'input_center'
            },
            {
              field: 'infoPersona.nombre_completo',
              displayName: $translate.instant('NOMBRE'),
              width: '30%',
            },
            {
              field: 'infoPersona.Documento.numero',
              displayName: $translate.instant('NO_DOCUMENTO'),
              width: '40%',
              cellClass: 'input_center'
            },
          ]
        };
        //
        titanRequest.get('nomina',
          $.param({
            limit: '-1',
          })).then(function(response) {
          self.nomina = response.data;
        })
        self.consultar = function() {
          if ($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined && $scope.anoSelect.length == 4) {
            $scope.ouputdatanominaselect.idNomina = $scope.nominaSelect;
            $scope.ouputdatanominaselect.mesLiquidacion = $scope.mesSelect;
            $scope.ouputdatanominaselect.anioLiquidacion = $scope.anoSelect;
            self.refresh();
            financieraMidRequest.get('orden_pago_nomina/ListaLiquidacionNominaHomologada',
              $.param({
                idNomina: $scope.nominaSelect.Id,
                mesLiquidacion: $scope.mesSelect,
                anioLiquidacion: $scope.anoSelect,
              })
              ).then(function(response) {
                if(response.data != null){
                  self.gridOptions_preliquidacion.data = response.data.Contratos_por_preliq;
                  self.IdLiquidacion = response.data.Id_Preliq;

                  angular.forEach(self.gridOptions_preliquidacion.data, function(iterador){
                    iterador.subGridOptions = {
                      enableRowHeaderSelection: false,
                      multiSelect: false,
                      columnDefs: [{
                          field: 'Concepto.Id',
                          visible: false
                        },
                        {
                          field: 'Concepto.Codigo',
                          displayName: $translate.instant('CONCEPTO') + " " + $translate.instant('CODIGO'),
                        },
                        {
                          field: 'Concepto.Nombre',
                          displayName: $translate.instant('NOMBRE'),
                        },
                        {
                          field: 'Concepto.Descripcion',
                          displayName: $translate.instant('DESCRIPCION'),
                        },
                        {
                          field: 'Concepto.TipoConcepto.Nombre',
                          displayName: $translate.instant('TIPO'),
                        },
                        {
                          field: 'Valor',
                          displayName: $translate.instant('AFECTACION'),
                          cellFilter: 'currency',
                          cellClass: 'input_right'
                        },
                      ]
                    };
                    // subGrid
                    financieraMidRequest.get('orden_pago_nomina/ListaConceptosNominaHomologados',
                      $.param({
                        nContrato:iterador.NumeroContrato,
                        vigenciaContrato:iterador.VigenciaContrato,
                        idLiquidacion:self.IdLiquidacion,
                      })
                      ).then(function(response) {
                        iterador.subGridOptions.data = response.data;
                    })
                  })//forEach

                }else{
                  self.gridOptions_preliquidacion.data = {};
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

        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
