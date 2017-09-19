'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroRubroApropiacionConsultaCtrl
 * @description
 * # RubroRubroApropiacionConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroRubroApropiacionConsultaCtrl', function (financieraRequest){
    var self = this;
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.vigenciaActual = parseInt(response.data);
      var dif = self.vigenciaActual - 1995 ;
      var range = [];
      range.push(self.vigenciaActual);
      for(var i=1;i<dif;i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = self.years[0];
    });
    
    
  });
