'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudRegistroCtrl
 * @description
 * # RubroModificacionSolicitudRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudRegistroCtrl', function ($scope, $translate, $window, financieraRequest, financieraMidRequest) {
    var self = this;
    self.modificaciones = [];
    self.descripcion = '';
    self.UnidadEjecutora = 1;
    self.selected = 1;
    self.balanceado = false;
    console.log(self.descripcion.length);
    self.botones = [
      //{ clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];
    self.botonesccr = [
      //{ clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
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
    	if ( self.rubroCuentaCreditosel == undefined || self.rubroCuentaCreditosel == null ||
          self.tipoModificacion == undefined || self.tipoModificacion == null ||
          self.valor == undefined || self.valor == null || self.valor <= 0 ||
          self.tipoModificacion.CuentaContraCredito && (self.rubrosel == undefined || self.rubrosel == null)
      ){
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
    		if ((self.tipoModificacion.Id == 1 || self.tipoModificacion.Id == 2 || self.tipoModificacion.Id == 4)){
          if(self.saldomov >= self.valor){
            self.modificaciones.push(modificacion);
            if (self.tipoModificacion.Id === 2) {
              self.rubroCuentaCredito.InfoSaldo.saldo = self.rubroCuentaCredito.InfoSaldo.saldo - self.valor;
              self.saldomov = self.rubroCuentaCredito.InfoSaldo.saldo;
            }
            self.limpiarRubrosSelec();
          } else {
            swal('', $translate.instant("E_MODP004"), "error").then(function () {
            });
          }

        } else {
          self.modificaciones.push(modificacion);
          self.limpiarRubrosSelec();
        }



      }
    };

    self.limpiarRubrosSelec = function () {
      self.rubrosel = null;
      //self.rubroCuentaCreditosel = null;
      self.rubro = null;
      //self.rubroCuentaCredito = null;
      self.valor = null;
      //self.tipoModificacion = null;
      //self.saldomov = null;
    };

    self.registrarModificacion = function () {
      var dataRegistroModificacion = {};
      dataRegistroModificacion.MovimientoApropiacion = {};
      dataRegistroModificacion.MovimientoApropiacion.Descripcion = self.descripcion;
      dataRegistroModificacion.MovimientoApropiacion.Noficio = parseInt(self.oficio);
      dataRegistroModificacion.MovimientoApropiacion.Foficio = self.fechaOficio;
      dataRegistroModificacion.MovimientoApropiacion.UnidadEjecutora = self.UnidadEjecutora;
      dataRegistroModificacion.MovimientoApropiacionDisponibilidadApropiacion = self.modificaciones;
      console.log(dataRegistroModificacion);
      financieraRequest.post('movimiento_apropiacion/RegistroSolicitudMovimientoApropiacion', dataRegistroModificacion).then(function (response) {
        console.log(response.data);
        if (response.data.Type !== undefined) {
          if (response.data.Type === "error") {
            swal('', $translate.instant(response.data.Code), response.data.Type);
          } else {
            swal('', $translate.instant(response.data.Code) + response.data.Body.MovimientoApropiacion.NumeroMovimiento, response.data.Type).then(function () {
              $window.location.href = "#/rubro/modificacion_solicitud_consulta"
            });
          }

        }
      });
    };

    self.quitarModificacion = function (index) {
      self.modificaciones.splice(index, 1);
    };

    $scope.$watch("rubroModificacionSolicitudRegistro.rubroCuentaCreditosel", function () {

      if (self.rubroCuentaCreditosel != null && self.rubroCuentaCreditosel != undefined) {
        console.log("Apr ", self.rubroCuentaCreditosel);
        //   financieraRequest.get("apropiacion", $.param({
        //           query: "Rubro.Id:"+self.rubroCuentaCreditosel.Id + ",Vigencia:"+self.Vigencia
        // })).then(function(response) {
        //             console.log("Apr: ",response.data);

        // if (response.data !== null) {
        self.rubroCuentaCredito = self.rubroCuentaCreditosel;
        financieraMidRequest.get("apropiacion/SaldoApropiacion/" + self.rubroCuentaCredito.Codigo + "/" + self.rubroCuentaCredito.UnidadEjecutora + "/" + self.Vigencia, "").then(function (response) {

          if (response.data !== null) {
            self.rubroCuentaCredito.InfoSaldo = response.data;
            angular.forEach(self.modificaciones, function (data) {
              if (data.CuentaCredito !== undefined && data.CuentaCredito !== null && data.CuentaCredito.Id === self.rubroCuentaCredito.Id && data.TipoMovimientoApropiacion.Id === 2) {
                self.rubroCuentaCredito.InfoSaldo.saldo = self.rubroCuentaCredito.InfoSaldo.saldo - data.Valor;
              }

            });
            self.saldomov = self.rubroCuentaCredito.InfoSaldo.saldo;
            console.log("Saldo: ", response.data);
          } else {
            self.rubroCuentaCredito.InfoSaldo = {};
            self.rubroCuentaCredito.InfoSaldo.saldo = 0;
            self.saldomov = 0;
          }
        });
        // }else{
        //   self.rubroCuentaCredito = {};
        //   self.rubroCuentaCredito.InfoSaldo = {};
        //   self.rubroCuentaCredito.InfoSaldo.saldo = 0;
        //   self.saldomov = 0;
        // }
        //		});
      }



    }, true);

    $scope.$watch('rubroModificacionSolicitudRegistro.modificaciones', function () {
      console.info("cambio ", self.modificaciones);
      if (self.modificaciones.length > 0) {
        const comprobacion = {
          MovimientoApropiacionDisponibilidadApropiacion: self.modificaciones,
        }

        financieraMidRequest.post('movimiento_apropiacion/ComprobarMovimientoApropiacion/' + self.UnidadEjecutora + '/' + self.Vigencia, comprobacion).then(function (response) {
          try {
            if (response.data.Type === 'success'){
              self.saldoArbol = response.data.Body.Saldo
              self.Diff = response.data.Body.Diff
              self.balanceado = response.data.Body.Comp
            }else{

            }
          } catch (error) {
            
          }
        })
      }

    }, true);

    $scope.$watch("rubroModificacionSolicitudRegistro.rubrosel", function () {

      if (self.rubrosel != null && self.rubrosel != undefined) {
        //  	financieraRequest.get("apropiacion", $.param({
        //           query: "Rubro.Id:"+self.rubrosel.Id + ",Vigencia:"+self.Vigencia
        // })).then(function(response) {

        // if (response.data !== null) {

        self.rubro = self.rubrosel;
        financieraRequest.get("apropiacion/SaldoApropiacion/" + self.rubro.Id, "").then(function (response) {

          if (response.data !== null) {
            self.rubro.InfoSaldo = response.data;
            angular.forEach(self.modificaciones, function (data) {
              if (data.CuentaContraCredito != undefined && data.CuentaContraCredito != null && data.CuentaContraCredito.Id === self.rubro.Id) {
                self.rubro.InfoSaldo.saldo = self.rubro.InfoSaldo.saldo - data.Valor;
              }
              if (data.CuentaCredito != undefined && data.CuentaCredito != null && data.CuentaCredito.Id === self.rubro.Id && data.TipoMovimientoApropiacion.Id === 2) {
                console.log("Data1: ", data.CuentaCredito.Id);
                console.log("Data1: ", self.rubro.Id);
                self.rubro.InfoSaldo.saldo = self.rubro.InfoSaldo.saldo - data.Valor;
              }

            });
            self.saldomov = self.rubro.InfoSaldo.saldo;

          } else {
            self.rubro.InfoSaldo = {};
            self.rubro.InfoSaldo.saldo = 0;
            self.saldomov = 0;
          }
        });
        // }else{
        //   self.rubro = {};
        //   self.rubro.InfoSaldo = {};
        //   self.rubro.InfoSaldo.saldo = 0;
        //   self.saldomov = 0;
        // }
        // });
      }



    }, true);

  });
