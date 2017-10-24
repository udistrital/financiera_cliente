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
        $scope.consultar = false;
        //
        titanRequest.get('nomina',
          $.param({
            limit: '-1',
          })).then(function(response) {
          self.nomina = response.data;
        })

        self.consultar = function(){
          if($scope.nominaSelect != undefined && $scope.mesSelect != undefined && $scope.anoSelect != undefined && $scope.anoSelect.length == 4){
            console.log($scope.nominaSelect);
            console.log($scope.mesSelect);
            console.log($scope.anoSelect);
          }
        }

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
        //
        //
        titanRequest.get('preliquidacion',
          $.param({
            query: 'EstadoPreliquidacion.CodigoAbreviacion:EPN_04', //+ ',Nomina.TipoNomina.in'self.NecesidadProcesoExterno.ProcesoExterno,
          })).then(function(response) {
          self.gridOptions_preliquidacion.data = response.data;
          // subGrid
          angular.forEach(self.gridOptions_preliquidacion.data, function(iterador) {
            iterador.subGridOptions = {
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
            //data subgrid
            titanRequest.get('detalle_preliquidacion',
              $.param({
                query: 'Preliquidacion.Id:' + iterador.Id,
              })).then(function(response) {
              iterador.subGridOptions.data = response.data;
            });
          }) //forEach

          // subGrid
        });

        // fin
      },
      controllerAs: 'd_liquidacionVerTodas'
    };
  });
