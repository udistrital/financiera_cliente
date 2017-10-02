'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuenteFinanciacionNecesidad
 * @description
 * # apropiacion/fuenteFinanciacionNecesidad
 */
angular.module('financieraClienteApp')
  .directive('fuenteFinanciacionNecesidad', function (administrativaRequest,financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          necesidad: '='
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_necesidad.html',
      controller:function($scope){
        var self = this;
        self.resumen_afectacion_presupuestal = [];
        $scope.$watch('apropiacion', function(){
          self.resumen_afectacion_presupuestal = [];
          if ($scope.necesidad != undefined && $scope.apropiacion != undefined){
            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              administrativaRequest.get('fuente_financiacion_rubro_necesidad',$.param({
                query: "Necesidad.Id:"+$scope.necesidad+",Apropiacion:"+apropiacion_data,
                limit: -1
              })).then(function(response) {
                self.rubros_afectados = response.data;
                angular.forEach(self.rubros_afectados, function(rubros_data) {
                  financieraRequest.get('apropiacion',$.param({
                    query: "Id:"+rubros_data.Apropiacion,
                    limit: 1
                  })).then(function(response) {
                    rubros_data.Apropiacion = response.data[0];
                  });
                  financieraRequest.get('fuente_financiamiento',$.param({
                    query: "Id:"+rubros_data.FuenteFinanciamiento,
                    limit: 1
                  })).then(function(response) {
                    if (response.data === null){
                      rubros_data.FuenteFinanciamiento = response.data;
                      console.log("fuente dev ")
                      console.log(rubros_data.FuenteFinanciamiento);
                    }else{
                      rubros_data.FuenteFinanciamiento = response.data[0];
                      console.log("fuente dev ")
                      console.log(response.data);
                    }
                    
                  });
                });
                self.resumen_afectacion_presupuestal.push(self.rubros_afectados);
              });

            });
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionNecesidad'
    };
  });
