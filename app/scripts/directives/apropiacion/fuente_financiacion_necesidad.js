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
                query: "SolicitudNecesidad.Id:"+$scope.necesidad+",Apropiacion:"+apropiacion_data,
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
                  financieraRequest.get('fuente_financiacion',$.param({
                    query: "Id:"+rubros_data.FuenteFinanciacion,
                    limit: 1
                  })).then(function(response) {
                    rubros_data.FuenteFinanciacion = response.data[0];
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
