'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaCrearCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaCrearCtrl', function($scope, financieraRequest, $window, $translate, financieraMidRequest, titanRequest, $http) {
    var self = this;
    self.PestanaAbierta = true;
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.OrdenPagoConsulta.Proveedor = {Id: 469};  // debe ser Registro de la UD
    self.dataLiquidacionConsulta = {};
    self.dataliquidacion = {};
    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
        self.dataLiquidacionConsulta.Vigencia = self.OrdenPago.Vigencia;
      })
    //
    self.dataSend = {};
    $http.get('detalle_liquidacion.json').then(function(data){
      self.dataSend.DetalleLiquidacion = data.data;
    })
    // ***************
    // Funciones
    // ***************
    self.get_liguidacion = function (){
      titanRequest.get('detalle_liquidacion',
        $.param({
          query:'Liquidacion:1',
          sortby:'Concepto',
          order:"desc",
          limit:-1,
        })).then(function(response){
          self.dataSend.DetalleLiquidacion = response.data;
        });
    }

    //self.dataSend = {};
    //self.get_liguidacion();

    self.validar_campos = function() {
      self.MensajesAlerta = '';
      if (self.OrdenPago.UnidadEjecutora == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_UNIDAD') + "</li>"
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>"
      }
      if (self.OrdenPago.Liquidacion == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_LIQUIDACION') + "</li>"
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        // insertc
        console.log("Insertar DATA");
        console.log(self.dataSend);
        console.log("Insertar DATA");
        financieraRequest.post("orden_pago/RegistrarOpPlanta", self.dataSend)
        //financieraMidRequest.post("Orden_pago_planta", self.OrdenPago)
          .then(function(data) { //error con el success
            self.resultado = data;
            console.log(self.resultado.data);
            //mensaje
            swal({
              title: 'Registro Exitoso',
              text: 'Orden de Pago Proveedo Registrado Exitosamente con Consecutivo No. ' + self.resultado.data,
              type: 'success',
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
            //
          })
      } else {
        // mesnajes de error
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }
    //
    self.addOpPlantaCrear = function() {

      //
      self.OrdenPago.Liquidacion = 1;
      self.OrdenPago.ValorBase = 0;
      self.OrdenPago.PersonaElaboro = 1;
      self.dataSend.OrdenPago = self.OrdenPago;
      //
      self.validar_campos();
    }
  });
