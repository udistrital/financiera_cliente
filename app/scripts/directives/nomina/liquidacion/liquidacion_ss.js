'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:nomina/liquidacion/liquidacionSs
 * @description
 * # nomina/liquidacion/liquidacionSs
 */
angular.module('financieraClienteApp')
  .directive('liquidacionSs', function(financieraMidRequest, administrativaRequest, titanRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        ouputdatanominaselect: '=?'
      },
      templateUrl: 'views/directives/nomina/liquidacion/liquidacion_ss.html',
      controller: function($scope) {
        var self = this;
        $scope.ouputdatanominaselect = {};
        //
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
        //
        self.gridOptions_preliquidacion = {
          expandableRowHeight: 250,
          expandableRowTemplate: 'expandableRowUpc.html',
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
        //
        titanRequest.get('nomina',
          $.param({
            limit: '-1',
          })).then(function(response) {
          self.nomina = response.data;
        })
        //
        self.consultar = function() {
          if ($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined && $scope.anoSelect.length == 4) {
            $scope.ouputdatanominaselect.idNomina = $scope.nominaSelect;
            $scope.ouputdatanominaselect.mesLiquidacion = $scope.mesSelect;
            $scope.ouputdatanominaselect.anioLiquidacion = $scope.anoSelect;
            //self.refresh();
            financieraMidRequest.get('orden_pago_ss/ListaPagoSsPorPersona',
              $.param({
                idNomina: $scope.nominaSelect.Id,
                mesLiquidacion: $scope.mesSelect,
                anioLiquidacion: $scope.anoSelect,
              })
            ).then(function(response){
              if(response.data != null){
                console.log(response.data);
                self.gridOptions_preliquidacion.data  = response.data.Pagos;
              }else{
                self.gridOptions_preliquidacion.data  = {};
              }
            })
            //
          }
        }

      },
      //
      controllerAs: 'd_liquidacionSs'
    };
  });
