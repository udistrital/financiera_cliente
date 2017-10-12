'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorUpdatePorId
 * @description
 * # ordenPago/opProveedorUpdatePorId
 */
angular.module('financieraClienteApp')
  .directive('opProveedorUpdatePorId', function(financieraMidRequest, financieraRequest, agoraRequest, coreRequest, arkaRequest, $translate, $window) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=',
        opproveedorid: '=',
        outputopp: '='
      },

      templateUrl: 'views/directives/orden_pago/proveedor/op_proveedor_update_por_id.html',
      controller: function($scope) {
        var self = this;
        self.NewOrdenPago = {};
        self.Conceptos = {};
        self.MensajesAlerta = null;
        // paneles
        $scope.panelUnidadEjecutora = $scope.inputpestanaabierta;
        $scope.panelProveedor = $scope.inputpestanaabierta;
        $scope.panelRp = $scope.inputpestanaabierta;
        $scope.panelDetalleOrdenPago = false;
        $scope.panelDetalleRubro = false;
        $scope.panelDetalleCuentas = false;

        //orden de pago
        $scope.$watch('opproveedorid', function() {
          if ($scope.opproveedorid != undefined) {
            financieraRequest.get('orden_pago',
              $.param({
                query: "Id:" + $scope.opproveedorid + ',SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion:OP-PROV',
              })).then(function(response) {
              self.OrdenPagoRegistrada = response.data[0];
              //$scope.outputopp = response.data[0];
              // proveedor
              self.asignar_proveedor(self.OrdenPagoRegistrada.RegistroPresupuestal.Beneficiario);
              // detalle rp
              self.detalle_rp(self.OrdenPagoRegistrada.RegistroPresupuestal.Id);
              // entrada almacen
              if (self.OrdenPagoRegistrada.EntradaAlmacen != 0){
                self.entradaAlmacen(self.OrdenPagoRegistrada.EntradaAlmacen)
              }
            });
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
        // Function detalle rp
        self.detalle_rp = function(rp_id) {
          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
            $.param({
              query: "RegistroPresupuestal.Id:" + rp_id,
            })).then(function(response) {
            self.rp_detalle = response.data[0];
            //data necesidad
            financieraMidRequest.get('disponibilidad/SolicitudById/' + self.rp_detalle.DisponibilidadApropiacion.Disponibilidad.Solicitud, '')
              .then(function(response) {
                self.solicitud = response.data[0];
              });
          });
          //Valor total del Rp
          financieraRequest.get('registro_presupuestal/ValorTotalRp/' + rp_id)
            .then(function(response) {
              self.valor_total_rp = response.data;
            });
        }
        // Funcion entrada almacen
        self.entradaAlmacen = function(entrada_id){
          arkaRequest.get('entrada',
            $.param({
              query: 'Id:' + entrada_id,
            })
          ).then(function(response){
              self.entrada = response.data;
            });
        }

        // ** para registro  OP y control de campo
        // functions
        // **
        self.estructurarDatosParaRegistro = function(pConceptos) {
          self.ConceptoOrdenPago = [];
          self.MovimientoContable = [];
          angular.forEach(pConceptos, function(concepto) {
            if (concepto.validado == true && concepto.Afectacion != 0) {
              // estructurar los conceptos a ConceptoOrdenPago
              self.ConceptoOrdenPago.push({
                'OrdenDePago': {
                  'Id': 0
                },
                'Concepto': {
                  'Id': concepto.Id
                },
                'Valor': concepto.Afectacion,
                'RegistroPresupuestalDisponibilidadApropiacion': {
                  'Id': concepto.RegistroPresupuestalDisponibilidadApropiacion.Id
                }
              });
              //  data movimientos contables
              angular.forEach(concepto.movs, function(movimiento) {
                if (movimiento.Debito > 0 || movimiento.Credito > 0) {
                  self.MovimientoContable.push(movimiento);
                }
              })
            }
          })
        }

        //funcion calcularTotalAfectacion
        self.calcularTotalAfectacion = function(pConceptos) {
          self.TotalAfectacion = 0;
          angular.forEach(pConceptos, function(concepto) {
            if (concepto.validado == true && concepto.Afectacion != 0) {
              // total afectacion
              self.TotalAfectacion = self.TotalAfectacion + concepto.Afectacion;
            }
          });
        };

        // funcion agrupa la afectación de los conceptos por rubro y valida que no supere el saldo de rubro
        self.afectaciónPorConceptoNoSuperaSaldoRubro = function(pConceptos){
          self.afectacionEnRubros = {};
          self.saldoDeRubros = {};
          angular.forEach(pConceptos, function(concepto) {
            if (concepto.validado == true && concepto.Afectacion != 0) {
              // total afectacion
              if(self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] == undefined){
                self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] = concepto.Afectacion;
              }else{
                self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] = self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] + concepto.Afectacion;
              }
              // saldos
              if(self.saldoDeRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] == undefined){
                self.saldoDeRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] = concepto.RegistroPresupuestalDisponibilidadApropiacion.Saldo;
              }
            }
          });
        }

        // Insert Orden Pago
        self.registrarOpProveedor = function() {
          self.afectaciónPorConceptoNoSuperaSaldoRubro(self.Conceptos);
          self.calcularTotalAfectacion(self.Conceptos);
          if (self.camposObligatorios()) {
            // trabajar estructura de conceptos
            if (Object.keys(self.Conceptos).length > 0) {
              self.estructurarDatosParaRegistro(self.Conceptos);
              //construir data send
              self.dataOrdenPagoInsert = {};
              self.dataOrdenPagoInsert.OrdenPago = self.NewOrdenPago;
              self.dataOrdenPagoInsert.ConceptoOrdenPago = self.ConceptoOrdenPago;
              self.dataOrdenPagoInsert.MovimientoContable = self.MovimientoContable;
              self.dataOrdenPagoInsert.Usuario = {'Id': 1};   // Con autenticación llegara el objeto
            }
            // registrar OP Proveedor
            financieraRequest.post("orden_pago/ActualizarOpProveedor", self.dataOrdenPagoInsert)
              .then(function(data) {
                self.resultado = data;
                //mensaje
                swal({
                  title: 'Orden de Pago',
                  text: $translate.instant(self.resultado.data.Code) + self.resultado.data.Body,
                  type: self.resultado.data.Type,
                }).then(function() {
                  $window.location.href = '#/orden_pago/ver_todos';
                })
              })
          } else {
            // mesnajes de error campos obligatorios
            swal({
              title: 'Error!',
              html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
              type: 'error'
            })
          }
        }

        // Funcion encargada de validar la obligatoriedad de los campos
        self.camposObligatorios = function() {
          self.MensajesAlerta = '';
          if (self.NewOrdenPago.SubTipoOrdenPago == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TIPO_OP') + "</li>";
          }
          if (self.NewOrdenPago.FormaPago == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_PAGO_OP') + "</li>";
          }
          if (self.NewOrdenPago.ValorBase == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_VAL_BASE') + "</li>";
          }
          if (Object.keys(self.Conceptos).length == 0) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_CONCEPTO') + "</li>";
          }
          if (self.TotalAfectacion != self.NewOrdenPago.ValorBase) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TOTAL_AFECTACION') + "</li>" + self.TotalAfectacion + " != " + self.NewOrdenPago.ValorBase;
          }
          if(Object.keys(self.afectacionEnRubros).length != 0 && Object.keys(self.saldoDeRubros).length != 0){
            angular.forEach(self.afectacionEnRubros, function(afectacionValue, afectacionKey){
              angular.forEach(self.saldoDeRubros, function(saldoValue, saldoKey){
                if(saldoKey == afectacionKey && afectacionValue > saldoValue){
                  self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_TOTAL_AECTACION') + " "+ afectacionKey + " " + $translate.instant('MSN_SUPERA_SALDO') + "</li>";
                }
              })
            })
          }
          // Operar
          if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
            return true;
          } else {
            return false;
          }
        }

      //fin
      },
      controllerAs: 'd_opProveedorUpdatePorId'
    };
  });
