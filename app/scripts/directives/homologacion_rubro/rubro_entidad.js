'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:homologacionRubro/rubroEntidad
 * @description
 * # homologacionRubro/rubroEntidad
 */
angular.module('financieraClienteApp')
  .directive('homologacionRubroEntidad', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/homologacion_rubro/rubro_entidad.html',
      controller:function($scope,financieraMidRequest,$translate){
        var ctrl = this;
        ctrl.getList = function(){
          financieraMidRequest.get('organizaciones_core_new', $.param({
              limit: -1,
              query: "CodigoAbreviacion:TE_2"
          })).then(function(response) {

          });
        }
        ctrl.getList();
    },
      controllerAs:'d_homologacionRubroRubroEntidad'
    };
  });
