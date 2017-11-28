'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl
 * @description
 * # OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpSeguridadSocialCrearCtrl', function($scope, financieraRequest, $window, $translate, financieraMidRequest, titanRequest, agoraRequest, coreRequest) {
    var self = this;
    self.PestanaAbierta = true;
    self.OrdenPago = {};
    self.dataSeguridadSocial = {};
    self.registroPresupuestal = {};

    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
      });
    // unidad ejecutora
    financieraRequest.get('unidad_ejecutora',
      $.param({
        query: 'Id:1', //llega por rol de usuario
      })
    ).then(function(response) {
      self.OrdenPago.UnidadEjecutora = response.data[0];
    });
    //forma de pago
    financieraRequest.get('forma_pago',
      $.param({
        limit: 0
      })
    ).then(function(response) {
      self.formaPagos = response.data;
    });
    // subtipo op porveedor
    $scope.$watch('opSeguridadSocialCrear.dataSeguridadSocial', function() {
      if (Object.keys(self.dataSeguridadSocial).length > 0) {
        if (self.dataSeguridadSocial.idNomina.TipoNomina.Nombre == 'HCS') {
          //hora catedra salarios
          var sub_tipo_op = "OP-SS-SALA";
        } else {
          // hora catedra honorarios
          var sub_tipo_op = "OP-SS-HONO";
        }
        // docente  // falta
        // planta   // falta

        // get sub_tipo_orden_pago
        financieraRequest.get('sub_tipo_orden_pago',
          $.param({
            query: 'TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:' + sub_tipo_op,
            limit: -1,
          })
        ).then(function(response) {
          self.OrdenPago.SubTipoOrdenPago = response.data[0];
        });
      }
    }, true);

    $scope.$watch('opSeguridadSocialCrear.registroPresupuestal', function() {
      if (Object.keys(self.registroPresupuestal).length > 0) {
        financieraRequest.get('registro_presupuestal/ValorTotalRp/' + self.registroPresupuestal.Id)
          .then(function(response) {
            self.registroPresupuestal.Valor = response.data;
          });
        // beneficiario rp
        self.asignar_proveedor(self.registroPresupuestal.Beneficiario);
      }
    })

    // Function buscamos datos del proveedor que esta en el rp
    self.asignar_proveedor = function(beneficiario_id) {
      agoraRequest.get('informacion_proveedor',
        $.param({
          query: "Id:" + beneficiario_id,
        })
      ).then(function(response) {
        self.proveedor = response.data;
        console.log(response.data);
        // datos banco
        self.get_info_banco(self.proveedor[0].IdEntidadBancaria);
        //datos telefono
        self.get_tel_provee(self.proveedor[0].Id)
      });
    }
    //
    self.get_info_banco = function(id_banco) {
      coreRequest.get('banco',
        $.param({
          query: "Id:" + id_banco,
        })).then(function(response) {
        self.banco_proveedor = response.data[0];
      });
    }
    //
    self.get_tel_provee = function(id_prove) {
      agoraRequest.get('proveedor_telefono',
        $.param({
          query: "Id:" + id_prove,
        })).then(function(response) {
        self.tel_proveedor = response.data[0];
      });
    }


    // ***************
    // Funciones
    // ***************
    // self.validar_campos = function() {
    //   self.MensajesAlerta = '';
    //   if (self.OrdenPago.UnidadEjecutora == undefined) {
    //     self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_UNIDAD') + "</li>"
    //   }
    //   if (self.OrdenPago.RegistroPresupuestal == undefined) {
    //     self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>"
    //   }
    //   if (self.DataSeguridadSocial.Mes == undefined) {
    //     self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_MES_SS') + "</li>"
    //   }
    //   // Operar
    //   if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
    //     // insertc
    //     console.log("Insertar DATA");
    //     console.log(self.dataSend);
    //     console.log("Insertar DATA");
    //     financieraMidRequest.post("orden_pago_nomina/CrearOPSeguridadSocial", self.dataSend)
    //       .then(function(data) {
    //         self.resultado = data;
    //         //mensaje
    //         swal({
    //           title: 'Orden de Pago',
    //           text: self.resultado.data.Type == 'success' ? $translate.instant(self.resultado.data.Code) + self.resultado.data.Body : $translate.instant(self.resultado.data.Code),
    //           type: self.resultado.data.Type,
    //         }).then(function() {
    //           $window.location.href = '#/orden_pago/ver_todos';
    //         })
    //         //
    //       })
    //   } else {
    //     // mesnajes de error
    //     swal({
    //       title: 'Error!',
    //       html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
    //       type: 'error'
    //     })
    //   }
    // }
    //
    self.addOpPlantaSsCrear = function() {
      console.log("funcion");
      if (self.OrdenPago.RegistroPresupuestal) {
        self.OrdenPago.ValorBase = self.OrdenPago.RegistroPresupuestal.ValorTotal; // se obtendra del rp
      }
      self.OrdenPago.PersonaElaboro = 1;
      // Data para enviar al servicio
      self.dataSend = {};
      self.dataSend.OrdenPago = self.OrdenPago;
      self.dataSend.SeguridadSocial = self.DataSeguridadSocial;
      self.validar_campos();
    }
  });
