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
    self.allDataOpSs = {};
    self.dataSeguridadSocialSelect = {}

    $scope.$watch('opSeguridadSocialCrear.allDataOpSs', function() {
      if (Object.keys(self.allDataOpSs).length > 0 && self.allDataOpSs.TipoLiquidacion != null) {
        // rp valor
        financieraRequest.get('registro_presupuestal/ValorTotalRp/' + self.allDataOpSs.DetalleCargueOp[0].RegistroPresupuestal.Id)
          .then(function(response) {
            self.allDataOpSs.DetalleCargueOp[0].RegistroPresupuestal.Valor = response.data;
          });
        // beneficiario rp
        self.asignar_proveedor(self.allDataOpSs.DetalleCargueOp[0].RegistroPresupuestal.Beneficiario);

        self.tipoNominaDeLiquidacion = {};
        self.tipoNominaDeLiquidacion.tipoNomina = self.allDataOpSs.TipoLiquidacion;
        self.tipoNominaDeLiquidacion.tipoOrdenPago = "SS";
      }else{
        self.proveedor = {};
        self.tipoNominaDeLiquidacion = {};
      }
    })

    // Function buscamos datos del proveedor que esta en el rp
    self.asignar_proveedor = function(beneficiario_id) {
      agoraRequest.get('informacion_proveedor',
        $.param({
          query: "Id:" + beneficiario_id,
        })
      ).then(function(response) {
        self.proveedor = response.data[0];
        // datos banco
        self.get_info_banco(self.proveedor.IdEntidadBancaria);
        //datos telefono
        self.get_tel_provee(self.proveedor.Id)
      });
    }
    //
    self.get_info_banco = function(id_banco) {
      coreRequest.get('banco',
        $.param({
          query: "Id:" + id_banco,
        })).then(function(response) {
        self.proveedor.banco = response.data[0];
      });
    }
    //
    self.get_tel_provee = function(id_prove) {
      agoraRequest.get('proveedor_telefono',
        $.param({
          query: "Id:" + id_prove,
        })).then(function(response) {
        self.proveedor.tel = response.data[0];
      });
    }


    // ***************
    // Funciones
    // ***************
    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      self.MensajesAlerta = '';
      if (Object.keys(self.dataSeguridadSocialSelect).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_LIQUIDACION') + "</li>";
      }
      if (self.OrdenPago.SubTipoOrdenPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TIPO_OP') + "</li>";
      }
      if (self.OrdenPago.FormaPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_PAGO_OP') + "</li>";
      }
      if (!self.checkVigencia(self.OrdenPago.Vigencia)) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_VIGENCIA') + "</li>";
      }
      if (self.errorOpMasivo != null) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant(self.errorOpMasivo) + "</li>";
      }

      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    self.checkVigencia = function(p_vigencia) {
      if (p_vigencia.length != 4) {
        return false;
      } else {
        return true;
      }
    }

    self.registrarOpSS = function() {
      if (self.camposObligatorios()) {
        console.log("Registrar");
        self.dataSen = {};
        self.dataSen = self.allDataOpSs;
        self.OrdenPago.Vigencia = parseInt(self.OrdenPago.Vigencia);
        self.dataSen.InfoGeneralOp = self.OrdenPago;
        console.log("Data Enviadad");
        console.log(self.dataSen);
        console.log("Data Enviadad");
        financieraMidRequest.post('orden_pago_nomina/RegistroCargueMasivoOp', self.dataSen)
          .then(function(response) {
            self.MensajesAlertaSend = '';
            self.resultado = response.data;
            console.log("Resultado");
            console.log(response);
            console.log("Resultado");
            angular.forEach(self.resultado, function(mensaje) {
              self.MensajesAlertaSend = self.MensajesAlertaSend + "<li>" + $translate.instant(mensaje.Code) + mensaje.Body + "</li>";
            })
            swal({
              title: 'Orden de Pago',
              html: '<ol align="left">' + self.MensajesAlertaSend + '</ol>',
              type: "success",
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
          })
      } else {
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }

    }


  });
