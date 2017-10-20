'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/opNominaRubrosHomologadoPorRp
 * @description
 * # rubros/opNominaRubrosHomologadoPorRp
 */
angular.module('financieraClienteApp')
  .directive('opNominaRubrosHomologadoPorRp', function (financieraMidRequest, financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope:{
        inputpestanaabierta: '=?',
        inputprocesoexternoid: '=?',
        outputconceptos: '=?'
        },

      templateUrl: 'views/directives/rubros/op_nomina_rubros_homologado_por_rp.html',
      controller:function($scope){
        var self = this;
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        $scope.$watch('inputprocesoexternoid', function() {
          if ($scope.inputprocesoexternoid) {
            console.log("homologar");
            console.log($scope.inputprocesoexternoid);

            financieraMidRequest.get('homologacion/MidHomologacionLiquidacion/' + $scope.inputprocesoexternoid + '/2017','')
            .then(function(response) {
              $scope.salida = response.data;
              console.log("AAAAAAA");
              console.log($scope.salida);
            })

          }
        })
      },
      controllerAs:'d_opNominaRubrosHomologadoPorRp'
    };
  });
