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
      scope:{
          rubrocreado:'=?'
        },

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

          financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
            var year = parseInt(response.data);
            ctrl.anos = [];
            for (var i = 0; i < 5; i++) {
              ctrl.anos.push(year - i);
            }
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
          var request = {
            CodigoHomologado:ctrl.codigoRubro,
            NombreHomologado:ctrl.nombreRubro,
            Organizacion:ctrl.entidad.Id,
            Vigencia:ctrl.vigencia
          }
          financieraMidRequest.post("rubro_homologado/CreateRubroHomologado",request).then(function(response){
            swal('',$translate.instant(response.data.Code),response.data.Type);
            $scope.rubrocreado = response.data.Type;
          });
        }
      },
      controllerAs:'d_homologacionRubroCrearRubro'
    };
  });
