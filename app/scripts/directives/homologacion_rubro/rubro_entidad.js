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
      scope:{
        seleccion: '=?',
        filtro: '=?',
        rubrosel: '=?',
        recargar: '=?',
        rubroid: '=?',
        arbol: '=?',
        noresumen: '@?',
        ramasel: '=?',
        botones: '=?',
        },

      templateUrl: 'views/directives/homologacion_rubro/rubro_entidad.html',
      controller:function($scope,financieraMidRequest,$translate){
        var ctrl = this;
        ctrl.expandedNodes = [];
        ctrl.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: $scope.ramasel,
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        };
        ctrl.getList = function(){
          financieraMidRequest.get('organizaciones_core_new/getOrganizacion', $.param({
              limit: -1,
              query: "CodigoAbreviacion:TE_2"
          })).then(function(response) {
              ctrl.entidades=response.data;
          });
        }
        ctrl.getList();
        ctrl.getRubros = function(){

        }
        ctrl.ArbolRubrosEntidad = function(){
          financieraMidRequest.get('rubro_homologado/GetArbolRubrosHomologado',$.param({
            idEntidad:ctrl.entidad.Id
          })).then(function(response){
            $scope.arbol = [];
            if (response.data !== null) {
              $scope.arbol = response.data;
            }
          });
        }
    },
      controllerAs:'d_homologacionRubroRubroEntidad'
    };
  });
