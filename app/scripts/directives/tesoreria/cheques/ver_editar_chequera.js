'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:tesoreria/cheques/verEditarChequera
 * @description
 * # tesoreria/cheques/verEditarChequera
 */
angular.module('financieraClienteApp')
  .directive('tesoreriaVerEditarChequera', function () {
    return {
      restrict: 'E',
      scope:{
          chequera:'=?'
        },

      templateUrl: 'views/directives/tesoreria/cheques/ver_editar_chequera.html',

      controller:function($scope,$attrs){
        var ctrl = this;
        $scope.ver = 'ver' in $attrs;
        $scope.$watch('chequera',function(newValue){
          console.log("chequerainformacion ",newValue);
        },true);
      },
      controllerAs:'d_tesoreriaVerEditarChequera'
    };
  });
