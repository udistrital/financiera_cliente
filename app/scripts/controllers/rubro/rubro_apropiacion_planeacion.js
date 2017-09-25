'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroRubroApropiacionPlaneacionCtrl
 * @description
 * # RubroRubroApropiacionPlaneacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroRubroApropiacionPlaneacionCtrl', function (financieraRequest,financieraMidRequest,$translate,$scope){
    var self = this;
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];
    self.botonespadre = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.Vigencia =  parseInt(response.data)-1;
      financieraMidRequest.get("rubro/InformacionAsignacionInicial",$.param({
        UnidadEjecutora: 1,
        Vigencia: self.Vigencia
      })) 
      .then(function(response) { //error con el success
        self.InfoAprobacion =  response.data;
        console.log(self.InfoAprobacion);
        console.log(self.comprobarSuma(self.InfoAprobacion));
      });
    });

    self.comprobarSuma = function(infosaldos){
      if (infosaldos !== undefined){
        for(var i = 1; i < infosaldos.length; i++)
        {
            if(infosaldos[i].SaldoInicial !== infosaldos[0].SaldoInicial){
              return false;
            }
                
        }
    
        return true;
      }
     return false;
    };

    $scope.$watch("datachangeevent", function() {  
      if (self.Vigencia !== undefined && self.Vigencia !== null){
        financieraMidRequest.get("rubro/InformacionAsignacionInicial",$.param({
          UnidadEjecutora: 1,
          Vigencia: self.Vigencia
        })) 
        .then(function(response) { //error con el success
          self.InfoAprobacion =  response.data;
          console.log(self.comprobarSuma(self.InfoAprobacion));
        });
      }
      
    }, true);

  });
