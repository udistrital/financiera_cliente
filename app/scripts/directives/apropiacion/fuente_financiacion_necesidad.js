'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuenteFinanciacionNecesidad
 * @description
 * # apropiacion/fuenteFinanciacionNecesidad
 */
angular.module('financieraClienteApp')
  .directive('fuenteFinanciacionNecesidad', function (argoRequest,financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          necesidad: '=',
          resumenafectacion: '='
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_necesidad.html',
      controller:function($scope){
        var self = this;
        $scope.resumenafectacion = [];
        $scope.$watch('apropiacion', function(){
          $scope.resumenafectacion = [];
          if ($scope.necesidad != undefined && $scope.apropiacion != undefined){
            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              argoRequest.get('fuente_financiacion_rubro_necesidad',$.param({
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
                      rubros_data.FuenteFinanciamiento = {Id:0};
                      console.log("fuente dev ")
                      console.log(rubros_data.FuenteFinanciamiento);
                    }else{
                      rubros_data.FuenteFinanciamiento = response.data[0];
                      console.log("fuente dev ")
                      console.log(response.data);
                    }
                    
                  });
                });
                $scope.resumenafectacion.push(self.rubros_afectados);
              });

            });
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionNecesidad'
    };
  });
