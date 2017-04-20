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
          cdp: '='
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_cdp.html',
      controller:function($scope){
        var self = this;
        self.resumen_afectacion_presupuestal = [];
        console.log("entro");
        $scope.$watch('apropiacion', function(){
          self.resumen_afectacion_presupuestal = [];
          console.log("entro");
          if ($scope.cdp != undefined && $scope.apropiacion != undefined){

            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              financieraRequest.get('disponibilidad_apropiacion',$.param({
                query: "Disponibilidad.Id:"+$scope.cdp+",Apropiacion.Id:"+apropiacion_data,
                limit: -1
              })).then(function(response) {
                self.rubros_afectados = response.data;
                console.log(self.rubros_afectados);
                angular.forEach(self.rubros_afectados, function(rubros_data) {
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
                    Apropiacion : rubros_data.Apropiacion
                  };
                  financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                    rubros_data.Saldo  = response.data;
                    console.log(rubros_data.Saldo);
                  });
                });

                self.resumen_afectacion_presupuestal.push(self.rubros_afectados);
              });

            });
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionCdp'
    };
  });
