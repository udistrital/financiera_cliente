'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:homologacionRubro/crearRubro
 * @description
 * # homologacionRubro/crearRubro
 */
angular.module('financieraClienteApp')
  .directive('homologacionRubroCrearRubro', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/homologacion_rubro/crear_rubro.html',
      controller:function($scope,$translate,financieraMidRequest,financieraRequest){
        var ctrl = this;
        ctrl.getLists=function(){
          financieraMidRequest.get('organizaciones_core_new/getOrganizacion', $.param({
              limit: -1,
              query: "CodigoAbreviacion:TE_2"
          })).then(function(response) {
              ctrl.entidades=response.data;
          });

          financieraRequest.get('unidad_ejecutora', $.param({
              limit: -1
          })).then(function(response) {
              ctrl.unidadesejecutoras = response.data;
          });
        }
        ctrl.getLists();
        ctrl.validateFields = function(){
          var validationClear = true;
          if($scope.datosRubro.$invalid){
            angular.forEach($scope.datosRubro.$error,function(controles,error){
              angular.forEach(controles,function(control){
                control.$setDirty();
              });
            });
            validationClear = false;
          }
          return validationClear;
        }
        ctrl.registrar = function(){
          if  (!ctrl.validateFields()){
            swal("", $translate.instant("CAMPOS_OBLIGATORIOS"),"error");
            return;
          }
        }
      },
      controllerAs:'d_homologacionRubroCrearRubro'
    };
  });
