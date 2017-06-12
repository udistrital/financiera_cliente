'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:SolicitudAvanceCtrl
 * @description
 * # SolicitudAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('SolicitudAvanceCtrl', function ($scope, modelsRequest) {
    var ctrl = this;
    $scope.info_terceros = true;
    $scope.info_desc_avances = true;
    $scope.info_detalle_avances = true;
    ctrl.get_terceros = function(){
      modelsRequest.get("terceros_completo")
      .then(function(response){
        if (ctrl.documento === response.data.documento) {
          ctrl.terceros = response.data;
        }else{
          ctrl.documento = "";
          ctrl.terceros = [];
        }
        console.log(ctrl.terceros);
      });
    };

  });
