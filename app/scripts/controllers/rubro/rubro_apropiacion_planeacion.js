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
    self.UnidadEjecutora = 1;
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editapr', estado: true },
    ];
    self.botonespadre = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.Vigencia =  parseInt(response.data);
      financieraMidRequest.get("aprobacion_apropiacion/InformacionAsignacionInicial",$.param({
        UnidadEjecutora: self.UnidadEjecutora,
        Vigencia: parseInt(response.data)
      })) 
      .then(function(response) { //error con el success
        self.InfoAprobacion =  response.data.Data;
        self.Aprobado = response.data.Aprobado;
        console.log(self.InfoAprobacion);
      });
    });

    self.AprobarPresupuesto = function(){
      
      financieraMidRequest.post("aprobacion_apropiacion/AprobacionAsignacionInicial?UnidadEjecutora=1&Vigencia="+self.Vigencia,self.InfoAprobacion)
      .then(function(response) { //error con el success
        console.log(response.data);
        if (response.data.Type !== undefined){
          
            swal('',$translate.instant(response.data.Code),response.data.Type);
          

        }
      });
    };

    $scope.$watch("datachangeevent", function() {  
      if (self.Vigencia !== undefined && self.Vigencia !== null){
        financieraMidRequest.get("aprobacion_apropiacion/InformacionAsignacionInicial",$.param({
          UnidadEjecutora: self.UnidadEjecutora,
          Vigencia: self.Vigencia
        })) 
        .then(function(response) { //error con el success
          console.log(response);
          self.InfoAprobacion =  response.data.Data;
          self.Aprobado = response.data.Aprobado;
        });
      }
      
    }, true);

  });
