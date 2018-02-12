'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudRegistroCtrl
 * @description
 * # RubroModificacionSolicitudRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudRegistroCtrl', function ($scope,$translate,$window,financieraRequest) {
    var self = this;
    self.modificaciones = [];
    self.descripcion = '';
    self.UnidadEjecutora = 1;
    console.log(self.descripcion.length);
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];
    self.botonesccr = [
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
    	}else if(self.saldomov == undefined || self.saldomov == null){
    		swal('', $translate.instant("E_MODP003") , "error").then(function() {
                        });
    	}else{
    		var modificacion = {};
    		modificacion.TipoMovimientoApropiacion = self.tipoModificacion;
    		modificacion.Valor = self.valor;
    		modificacion.CuentaCredito = self.rubroCuentaCredito;
    		modificacion.CuentaContraCredito = self.rubrosel;
    		if (self.rubrosel == null || self.rubrosel == undefined){
    			//modificacion.CuentaContraCredito = modificacion.CuentaCredito;
    		}else{
    			modificacion.CuentaContraCredito = self.rubro;
    		}
    		if ((self.tipoModificacion.Id == 1 || self.tipoModificacion.Id == 2)){
          if(self.saldomov >= self.valor){
            self.modificaciones.push(modificacion);
            self.limpiarRubrosSelec();
          }else{
          swal('', $translate.instant("E_MODP004") , "error").then(function() {
                        });
          }
    			
    		}else{
           self.modificaciones.push(modificacion);
            self.limpiarRubrosSelec();
        }
    		

    		
    	}
    };

    self.limpiarRubrosSelec = function(){
    	self.rubrosel = null;
    	self.rubroCuentaCreditosel = null;
    	self.rubro = null;
    	self.rubroCuentaCredito = null;
    	self.valor = null;
    	self.tipoModificacion = null;
    	self.saldomov = null;
    };

    self.registrarModificacion = function(){
    	var dataRegistroModificacion = {};
    	dataRegistroModificacion.MovimientoApropiacion = {};
    	dataRegistroModificacion.MovimientoApropiacion.Descripcion = self.descripcion;
      dataRegistroModificacion.MovimientoApropiacion.Noficio = parseInt(self.oficio);
      dataRegistroModificacion.MovimientoApropiacion.Foficio = self.fechaOficio;
      dataRegistroModificacion.MovimientoApropiacion.UnidadEjecutora = self.UnidadEjecutora;
    	dataRegistroModificacion.MovimientoApropiacionDisponibilidadApropiacion = self.modificaciones;
    	console.log(dataRegistroModificacion);
    	financieraRequest.post('movimiento_apropiacion/RegistroSolicitudMovimientoApropiacion', dataRegistroModificacion).then(function(response) {
    		console.log(response.data);
            if (response.data.Type !== undefined){
              if (response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
              }else{
                swal('',$translate.instant(response.data.Code)+ response.data.Body.MovimientoApropiacion.NumeroMovimiento,response.data.Type).then(function(){
                	$window.location.href = "#/rubro/modificacion_solicitud_consulta"
                });
              }

            }
    	});
    };

    self.quitarModificacion = function(index){
    	 self.modificaciones.splice(index,1);
    };

    $scope.$watch("rubroModificacionSolicitudRegistro.rubroCuentaCreditosel", function() {    
             
             if (self.rubroCuentaCreditosel != null && self.rubroCuentaCreditosel != undefined){
             	financieraRequest.get("apropiacion", $.param({
                      query: "Rubro.Id:"+self.rubroCuentaCreditosel.Id + ",Vigencia:"+self.Vigencia
            })).then(function(response) {
    			
    			 if (response.data !== null) {
                        console.log(response.data);
                        self.rubroCuentaCredito = response.data[0];
                        financieraRequest.get("apropiacion/SaldoApropiacion/"+self.rubroCuentaCredito.Id, "").then(function(response) {
                          
                          if (response.data !== null) {
                           self.rubroCuentaCredito.InfoSaldo = response.data;
                           self.saldomov = self.rubroCuentaCredito.InfoSaldo.saldo;
                           console.log(response.data);
                          }
                        });
                      }
    		});
             }
             
             
           
        }, true);


    $scope.$watch("rubroModificacionSolicitudRegistro.rubrosel", function() {    
             
             if (self.rubrosel != null && self.rubrosel != undefined){
             	financieraRequest.get("apropiacion", $.param({
                      query: "Rubro.Id:"+self.rubrosel.Id + ",Vigencia:"+self.Vigencia
            })).then(function(response) {
    			
    			 if (response.data !== null) {
                        console.log(response.data);
                        self.rubro = response.data[0];
                        financieraRequest.get("apropiacion/SaldoApropiacion/"+self.rubro.Id, "").then(function(response) {
                          
                          if (response.data !== null) {
                           self.rubro.InfoSaldo = response.data;
                           self.saldomov = self.rubro.InfoSaldo.saldo;

                          }
                        });
                      }
    		});
             }
             
             
           
        }, true);

  });
