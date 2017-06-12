'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:SolicitudAvanceCtrl
 * @description
 * # SolicitudAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('SolicitudAvanceCtrl', function ($scope, modelsRequest,financieraRequest) {
    var ctrl = this;
    $scope.info_terceros = true;
    $scope.info_desc_avances = true;
    $scope.info_detalle_avances = true;
    ctrl.tipos_avance = [];

    ctrl.get_tipos_avance = function(){
      financieraRequest.get("tipo_avance", $.param({
          query: "Estado:" + 'A',
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          ctrl.tipos_avance = response.data;
          console.log(ctrl.tipos_avance);
        });
    };

    ctrl.get_terceros = function(){
      modelsRequest.get("terceros_completo")
      .then(function(response){
        if (ctrl.documento === response.data.documento) {
          ctrl.terceros = response.data;
          ctrl.get_tipos_avance();
        }else{
          ctrl.documento = "";
          ctrl.terceros = [];
        }
        console.log(ctrl.terceros);
      });
    };



  });
