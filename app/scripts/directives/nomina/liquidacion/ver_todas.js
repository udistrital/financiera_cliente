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
        inputnecesidad: '=?',
        ouputpreliquidacion: '=?'
      },

      templateUrl: 'views/directives/nomina/liquidacion/ver_todas.html',
      controller: function($scope) {
        var self = this;
        self.gridOptions_preliquidacion = {
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
              field: 'infoPersona.informacion_contratista.nombre_completo',
              displayName: $translate.instant('NOMBRE'),
              width: '30%',
            },
            {
              field: 'infoPersona.informacion_contratista.Documento.numero',
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
        // para desarrollo
        financieraMidRequest.get('orden_pago_nomina/ListaLiquidacionNominaHomologada',
          $.param({
            idNomina: 4,
            mesLiquidacion: 5,
            anioLiquidacion: 2017,
          })
          ).then(function(response) {
            self.gridOptions_preliquidacion.data = response.data;
        })
        // para desarrollo
        self.consultar = function() {
          if ($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined && $scope.anoSelect.length == 4) {
            self.refresh();
            financieraMidRequest.get('orden_pago_nomina/ListaLiquidacionNominaHomologada',
              $.param({
                idNomina: $scope.nominaSelect.Id,
                mesLiquidacion: $scope.mesSelect,
                anioLiquidacion: $scope.anoSelect,
              })
              ).then(function(response) {
                if(response.data != null){
                  self.gridOptions_preliquidacion.data = response.data;
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
