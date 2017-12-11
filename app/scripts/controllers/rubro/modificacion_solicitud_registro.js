'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudRegistroCtrl
 * @description
 * # RubroModificacionSolicitudRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudRegistroCtrl', function ($translate,financieraRequest) {
    var self = this;
    self.modificaciones = [];
    self.descripcion = '';
    console.log(self.descripcion.length);
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];


    self.Vigencia = 2017;
    financieraRequest.get("orden_pago/FechaActual/2006",'') //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.Vigencia = parseInt(response.data);
    });

    financieraRequest.get("tipo_movimiento_apropiacion/",$.param({
                    limit: -1
                }))
    .then(function(response) { //error con el success
      self.tiposModificaciones = response.data;
    });

    self.agregarRubro = function(){
    	if (self.rubroCuentaCreditosel == undefined || self.rubroCuentaCreditosel == null){
    		swal('', $translate.instant("E_MODP002") , "error").then(function() {
                        });
    	}else if (self.tipoModificacion == undefined || self.tipoModificacion == null){
    		swal('', $translate.instant("E_MODP002") , "error").then(function() {
                        });
    	}else if (self.valor == undefined || self.valor == null || self.valor <= 0){
    		swal('', $translate.instant("E_MODP002") , "error").then(function() {
                        });
    	}else if (self.tipoModificacion.CuentaContraCredito && (self.rubrosel == undefined || self.rubrosel == null)){
    		swal('', $translate.instant("E_MODP002") , "error").then(function() {
                        });
    	}else{
    		var modificacion = {};
    		modificacion.TipoMovimientoApropiacion = self.tipoModificacion;
    		modificacion.Valor = self.valor;
    		modificacion.CuentaCredito = self.rubroCuentaCreditosel;
    		modificacion.CuentaContraCredito = self.rubrosel;
    		if (self.rubrosel == null || self.rubrosel == undefined){
    			modificacion.CuentaContraCredito = modificacion.CuentaCredito;
    		}
    		self.modificaciones.push(modificacion);
    		self.limpiarRubrosSelec();
    	}
    };

    self.limpiarRubrosSelec = function(){
    	self.rubrosel = null;
    	self.rubroCuentaCreditosel = null;
    	self.valor = null;
    	self.tipoModificacion = null;
    };

    self.registrarModificacion = function(){
    	var dataRegistroModificacion = {};
    	dataRegistroModificacion.MovimientoApropiacion = {};
    	dataRegistroModificacion.MovimientoApropiacion.Descripcion = self.descripcion;
    	dataRegistroModificacion.MovimientoApropiacionDisponibilidadApropiacion = self.modificaciones;
    	console.log(dataRegistroModificacion);
    };

    self.quitarModificacion = function(index){
    	 self.modificaciones.splice(index,1);
    };

  });
