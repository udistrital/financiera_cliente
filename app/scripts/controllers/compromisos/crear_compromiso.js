'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CompromisosCrearCompromisoCtrl
 * @description
 * # CompromisosCrearCompromisoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearCompromisoCtrl', function (financieraRequest) {
    var self = this;
    self.test="test....";

    self.nueva_categoria={};
    self.nuevo_compromiso={};
    self.nuevo_tipo={
      EstadoActivo:false
    };

    self.categorias=[];
    self.tipos=[];
    self.compromisos=[];

    self.crear_categoria=function(){
      //financieraRequest.post('categoria_compromiso',self.nueva_categoria);//.then(function(){});
      self.categorias.push(self.nueva_categoria);
      self.nueva_categoria={};
    };

    self.crear_tipo=function(){
      //financieraRequest.post('categoria_compromiso',self.nueva_categoria);//.then(function(){});
      self.tipos.push(self.nuevo_tipo);
      self.nuevo_tipo={
        EstadoActivo:false
      };
    };

    self.crear_compromiso=function(){
      //financieraRequest.post('categoria_compromiso',self.nueva_categoria);//.then(function(){});
      self.compromisos.push(self.nuevo_compromiso);
      self.nuevo_compromiso={};
    };

    self.cancelar=function(form){
      form.$setPristine();
      form.$setUntouched();
    };




  });
