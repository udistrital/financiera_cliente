'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuenteFinanciacionCdp
 * @description
 * # apropiacion/fuenteFinanciacionCdp
 */
angular.module('financieraClienteApp')
  .directive('fuenteFinanciacionCdp', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          cdp: '=',
          resumen: '=?'
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_cdp.html',
      controller:function($scope){
        var self = this;
        self.resumen_afectacion_presupuestal = [];
        $scope.resumen = [];
        console.log("entro");
        $scope.$watch('apropiacion', function(){
          self.resumen_afectacion_presupuestal = [];
          $scope.resumen = [];
          console.log("entro");
          if ($scope.cdp != undefined && $scope.apropiacion != undefined){

            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              financieraRequest.get('disponibilidad_apropiacion',$.param({
                query: "Disponibilidad.Id:"+$scope.cdp+",Apropiacion.Id:"+apropiacion_data,
                limit: -1
              })).then(function(response) {
                self.rubros_afectados = response.data;
                angular.forEach(self.rubros_afectados, function(rubros_data) {
                  $scope.resumen.push(rubros_data);
                  console.log($scope.resumen);
                  financieraRequest.get('apropiacion',$.param({
                    query: "Id:"+rubros_data.Apropiacion.Id,
                    limit: 1
                  })).then(function(response) {
                    rubros_data.Apropiacion = response.data[0];
                  });
                  /*if (rubros_data.FuenteFinanciamiento != null){

                    financieraRequest.get('fuente_financiacion',$.param({
                      query: "Id:"+rubros_data.FuenteFinanciamiento,
                      limit: 1
                    })).then(function(response) {
                      rubros_data.FuenteFinanciamiento = response.data[0];
                      console.log(rubros_data.FuenteFinanciamiento);
                    });
                  }*/

                  var rp = {
                    Disponibilidad : rubros_data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                    Apropiacion : rubros_data.Apropiacion,
                    FuenteFinanciacion : rubros_data.FuenteFinanciamiento
                  };
                  financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                    rubros_data.Saldo  = response.data.saldo;
                    rubros_data.Comprometido = response.data.comprometido;
                    rubros_data.Anulado = response.data.anulado;
                    console.log(rubros_data.Saldo);
                  });
                });

                self.resumen_afectacion_presupuestal.push(self.rubros_afectados);
                console.log(self.resumen_afectacion_presupuestal);
              });

            });
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionCdp'
    };
  });
