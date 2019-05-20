'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudRegistroCtrl
 * @description
 * # RubroModificacionSolicitudRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudRegistroCtrl', function ($scope, $translate, $window, token_service, presupuestoRequest, presupuestoMidRequest) {
    var self = this;
    self.modificaciones = [];
    self.descripcion = '';
    self.UnidadEjecutora = parseInt(token_service.getUe());
    self.selected = 1;
    self.balanceado = false;
    self.botones = [
      //{ clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];
    self.botonesccr = [
      //{ clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];


    presupuestoRequest.get("date/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function (response) { //error con el success
        self.Vigencia = parseInt(response.data);
        self.vigenciaActual = parseInt(response.data);
        var dif = 2;
        var range = [];
        range.push(self.vigenciaActual);
        for (var i = 1; i < dif; i++) {
          range.push(self.vigenciaActual + i);
        }
        self.years = range;
        self.Vigencia = self.vigenciaActual;
        presupuestoMidRequest.get("aprobacion_apropiacion/Aprobado", $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          Vigencia: self.Vigencia
        }))
          .then(function (response) { //error con el success
            self.Aprobado = response.data.Body;

            presupuestoRequest.get("tipo_movimiento_apropiacion", $.param({
              limit: -1
            }))
              .then(function (response) { //error con el success
                self.tiposModificaciones = response.data;
              }).catch(function (e) {
                console.log('error', e);
                swal('', $translate.instant('E_MODP009'), 'error');
              });
          }).catch(function (e) {
            console.log('error', e);
            swal('', $translate.instant('E_0461'), 'error');
          })
      });
    self.Aprobado = false;

    self.saldoApr = function () {
      presupuestoMidRequest.get("apropiacion/SaldoApropiacion/" + self.rubrosel.Codigo + "/" + self.rubrosel.UnidadEjecutora + "/" + self.Vigencia, "").then(function (response) {

        if (response.data !== null) {
          self.rubro.InfoSaldo = response.data.Body;
          angular.forEach(self.modificaciones, function (data) {
            if (data.CuentaCredito != undefined && data.CuentaCredito != null && data.CuentaCredito.Id === self.rubro.Id) {
              if (data.TipoMovimientoApropiacion.Id === 2 || data.TipoMovimientoApropiacion.Id === 1) {
                self.rubro.InfoSaldo.saldo = self.rubro.InfoSaldo.saldo - data.Valor;
              } else if (data.TipoMovimientoApropiacion.Id === 3) {
                self.rubro.InfoSaldo.saldo = self.rubro.InfoSaldo.saldo + data.Valor;
              }

            }
            if (data.CuentaContraCredito != undefined && data.CuentaContraCredito != null && data.CuentaContraCredito.Id === self.rubro.Id) {
              if (data.TipoMovimientoApropiacion.Id === 2) {
                self.rubro.InfoSaldo.saldo = self.rubro.InfoSaldo.saldo - data.Valor;
              } else if (data.TipoMovimientoApropiacion.Id === 3 || data.TipoMovimientoApropiacion.Id === 1) {
                self.rubro.InfoSaldo.saldo = self.rubro.InfoSaldo.saldo + data.Valor;
              }
            }

          });
          self.saldomov = self.rubro.InfoSaldo.saldo;

        } else {
          self.rubro.InfoSaldo = {};
          self.rubro.InfoSaldo.saldo = 0;
          self.saldomov = 0;
        }
      }).catch(function (e) {
        console.log('Error ', e);
        swal('', $translate.instant('E_MODP005'), 'error');

      });
    };

    self.agregarRubro = function () {
      if (self.rubroCuentaCreditosel == undefined || self.rubroCuentaCreditosel == null ||
        self.tipoModificacion == undefined || self.tipoModificacion == null ||
        self.valor == undefined || self.valor == null || self.valor <= 0 ||
        self.tipoModificacion.CuentaContraCredito && (self.rubrosel == undefined || self.rubrosel == null)
      ) {
        swal('', $translate.instant("E_MODP002"), "error").then(function () {
        });
      } else if (self.saldomov == undefined || self.saldomov == null) {
        swal('', $translate.instant("E_MODP003"), "error").then(function () {
        });
      } else {
        var modificacion = {};
        modificacion.TipoMovimientoApropiacion = self.tipoModificacion;
        modificacion.Valor = self.valor;
        modificacion.CuentaCredito = self.rubroCuentaCredito;
        modificacion.CuentaContraCredito = self.rubrosel;
        if (self.rubrosel == null || self.rubrosel == undefined) {
          //modificacion.CuentaContraCredito = modificacion.CuentaCredito;
        } else {
          modificacion.CuentaContraCredito = self.rubro;
        }
        if ((self.tipoModificacion.Id == 1 || self.tipoModificacion.Id == 2 || self.tipoModificacion.Id == 4)) {
          if (self.saldomov >= self.valor) {
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
      presupuestoRequest.post('movimiento_apropiacion/RegistroSolicitudMovimientoApropiacion', dataRegistroModificacion).then(function (response) {
        if (response.data.Type !== undefined) {
          if (response.data.Type === "error") {
            swal('', $translate.instant(response.data.Code), response.data.Type);
          } else {
            swal('', $translate.instant(response.data.Code) + response.data.Body.MovimientoApropiacion.NumeroMovimiento, response.data.Type).then(function () {
              $window.location.href = "#/rubro/modificacion_solicitud_consulta"
            });
          }

        }
      }).catch(function (e) {
        console.log('Error ', e);
        swal('', $translate.instant('E_MODP011'), 'error');

      });
    };

    self.quitarModificacion = function (index) {
      self.modificaciones.splice(index, 1);
    };

    $scope.$watch("rubroModificacionSolicitudRegistro.rubroCuentaCreditosel", function () {

      if (self.rubroCuentaCreditosel != null && self.rubroCuentaCreditosel != undefined) {
        self.rubroCuentaCredito = self.rubroCuentaCreditosel;
        presupuestoMidRequest.get("apropiacion/SaldoApropiacion/" + self.rubroCuentaCredito.Codigo + "/" + self.rubroCuentaCredito.UnidadEjecutora + "/" + self.Vigencia, "").then(function (response) {

          if (response.data !== null) {
            self.rubroCuentaCredito.InfoSaldo = response.data.Body;
            angular.forEach(self.modificaciones, function (data) {
              if (data.CuentaCredito != undefined && data.CuentaCredito != null && data.CuentaCredito.Id === self.rubroCuentaCredito.Id) {
                
                if (data.TipoMovimientoApropiacion.Id === 2 || data.TipoMovimientoApropiacion.Id === 1) {
                console.log('cuentaCredito', data, self.rubroCuentaCredito);
                  
                  self.rubroCuentaCredito.InfoSaldo.saldo = self.rubroCuentaCredito.InfoSaldo.saldo - data.Valor;
                } else if (data.TipoMovimientoApropiacion.Id === 3) {
                  self.rubroCuentaCredito.InfoSaldo.saldo = self.rubroCuentaCredito.InfoSaldo.saldo + data.Valor;
                }

              }
              if (data.CuentaContraCredito != undefined && data.CuentaContraCredito != null && data.CuentaContraCredito.Id === self.rubroCuentaCredito.Id) {
                if (data.TipoMovimientoApropiacion.Id === 2) {
                  self.rubroCuentaCredito.InfoSaldo.saldo = self.rubroCuentaCredito.InfoSaldo.saldo - data.Valor;
                } else if (data.TipoMovimientoApropiacion.Id === 3 || data.TipoMovimientoApropiacion.Id === 1) {
                  self.rubroCuentaCredito.InfoSaldo.saldo = self.rubroCuentaCredito.InfoSaldo.saldo + data.Valor;
                }
              }


            });
            self.saldomov = self.rubroCuentaCredito.InfoSaldo.saldo;
          } else {
            self.rubroCuentaCredito.InfoSaldo = {};
            self.rubroCuentaCredito.InfoSaldo.saldo = 0;
            self.saldomov = 0;
          }
        }).catch(function (e) {
          console.log('Error ', e);
          swal('', $translate.instant('E_MODP005'), 'error');

        });
      }



    }, true);

    $scope.$watch('rubroModificacionSolicitudRegistro.modificaciones', function () {
      console.info("cambio ", self.modificaciones);
      if (self.modificaciones.length > 0) {
        const comprobacion = {
          MovimientoApropiacionDisponibilidadApropiacion: self.modificaciones,
        }

        presupuestoMidRequest.post('movimiento_apropiacion/ComprobarMovimientoApropiacion/' + self.UnidadEjecutora + '/' + self.Vigencia, comprobacion).then(function (response) {
          try {
            if (response.data.Type === 'success') {
              self.saldoArbol = response.data.Body.Saldo
              self.Diff = response.data.Body.Diff
              self.balanceado = response.data.Body.Comp
            } else {

            }
          } catch (error) {

          }
        }).catch(function (e) {
          console.log('Error', e);
          swal('', $translate.instant('E_MODP010'), 'error');

        })
      }

    }, true);

    $scope.$watch("rubroModificacionSolicitudRegistro.rubrosel", function () {

      if (self.rubrosel != null && self.rubrosel != undefined) {
        self.rubro = self.rubrosel;
        self.saldoApr();
      }



    }, true);

  });


