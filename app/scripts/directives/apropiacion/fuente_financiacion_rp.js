'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuenteFinanciacionRp
 * @description
 * # apropiacion/fuenteFinanciacionRp
 */
angular.module('financieraClienteApp')
  .directive('fuenteFinanciacionRp', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          rp: '='
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_rp.html',
      controller:function($scope){
        var self = this;
        self.resumen_afectacion_presupuestal = [];

        $scope.$watch('apropiacion', function(){
          self.resumen_afectacion_presupuestal = [];
          console.log($scope.rp);
          if ($scope.rp != undefined && $scope.apropiacion != undefined){
            console.log($scope.rp);
            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',$.param({
                query: "RegistroPresupuestal.Id:"+$scope.rp+",DisponibilidadApropiacion.Apropiacion.Id:"+apropiacion_data,
                limit: -1
              })).then(function(response) {
                self.rubros_afectados = response.data;
                console.log(self.rubros_afectados);
                angular.forEach(self.rubros_afectados, function(rubros_data) {
                  financieraRequest.get('apropiacion',$.param({
                    query: "Id:"+rubros_data.DisponibilidadApropiacion.Apropiacion.Id,
                    limit: 1
                  })).then(function(response) {
                    rubros_data.Apropiacion = response.data[0];
                  });
                  
                  rubros_data.FuenteFinanciamiento = rubros_data.DisponibilidadApropiacion.FuenteFinanciamiento;
                  var rpdata = {
                    Rp : rubros_data.RegistroPresupuestal,
                    Apropiacion : rubros_data.DisponibilidadApropiacion.Apropiacion
                  };
                  financieraRequest.post('registro_presupuestal/SaldoRp',rpdata).then(function(response){
                    rubros_data.Saldo  = response.data;
                  });
                });

                self.resumen_afectacion_presupuestal.push(self.rubros_afectados);
              });

            });
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionRp'
    };
  });
