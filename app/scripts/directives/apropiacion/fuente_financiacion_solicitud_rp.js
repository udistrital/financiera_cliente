'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuenteFinanciacionSolicitudRp
 * @description
 * # apropiacion/fuenteFinanciacionSolicitudRp
 */
angular.module('financieraClienteApp')
  .directive('fuenteFinanciacionSolicitudRp', function (financieraRequest,argoRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          solrp:'=',
          afectacion: '='
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_solicitud_rp.html',
      controller:function($scope){
        var self = this;
        self.resumen_afectacion_presupuestal = [];
        console.log("sol");
        $scope.$watch('apropiacion', function(){
          self.resumen_afectacion_presupuestal = [];

          if ($scope.solrp != undefined && $scope.apropiacion != undefined){

            
              argoRequest.get('disponibilidad_apropiacion_solicitud_rp',$.param({
                query: "SolicitudRp:"+$scope.solrp,
                limit: -1
              })).then(function(response) {
                console.log(response.data)
                angular.forEach(response.data, function(rubros_dispo_data) {
                  financieraRequest.get('disponibilidad_apropiacion',$.param({
                    query: "Id:"+rubros_dispo_data.DisponibilidadApropiacion,
                    limit: 1
                  })).then(function(res) {
                    //console.log(res.data)
                    self.rubros_afectados = res.data;

                    angular.forEach(self.rubros_afectados, function(rubros_data) {
                      financieraRequest.get('apropiacion',$.param({
                        query: "Id:"+rubros_data.Apropiacion.Id,
                        limit: 1
                      })).then(function(response) {
                        rubros_data.Apropiacion = response.data[0];
                      });
                        rubros_data.Valor = rubros_dispo_data.Monto;
                    });

                    self.resumen_afectacion_presupuestal.push(self.rubros_afectados);
                    //console.log(self.resumen_afectacion_presupuestal);
                  });
                });




              });
              $scope.afectacion = self.resumen_afectacion_presupuestal;
console.log(self.resumen_afectacion_presupuestal);
          
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionSolicitudRp'
    };
  });
