'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacCierrePeriodoCtrl', function ($scope, $translate,financieraMidRequest) {
  	var ctrl = this;
    
    ctrl.generarCierre = function(){

      var consulta = {
        inicio: ctrl.fechaInicio,
        fin: new Date(ctrl.fechaInicio.getFullYear(),ctrl.fechaInicio.getMonth() + 1,0),
        codigo:'2'
      };
      console.log("fecha fin "+ consulta.fin);
      financieraMidRequest.post('rubro/GenerarCierre', consulta).then(function(response){
    });  
    }



    });

  

 
