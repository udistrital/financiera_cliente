'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorUpdatePorId
 * @description
 * # ordenPago/opProveedorUpdatePorId
 */
angular.module('financieraClienteApp')
  .directive('opProveedorUpdatePorId', function(financieraRequest, agoraRequest, coreRequest) {
    return {
      restrict: 'E',
      scope: {
        opproveedorid: '='
      },

      templateUrl: 'views/directives/orden_pago/op_proveedor_update_por_id.html',
      controller: function($scope) {
        var self = this;
        self.rubros = [];
        self.Concepto = [];
        //
        self.RubrosIds = [];
        self.RubrosObjIds = null;
        self.Concepto = [];
        self.ConceptoOrdenPago = [];
        self.Data_OrdenPago_Concepto = {};
        self.MovimientoContableConceptoOrdenPago = [];
        self.MensajesAlerta = null;
        self.TotalAfectacion = null;
        // paneles
        $scope.panelUnidadEjecutora = true;
        $scope.panelProveedor = true;
        $scope.panelRp = true;
        $scope.panelDetallePagoProveedor = true;
        $scope.panelDetalleRubro = true;
        $scope.panelDetalleConceptos = true;
        $scope.panelDetalleCuentas = true;
        //orden de pago
        $scope.$watch('opproveedorid', function() {
          if ($scope.opproveedorid != undefined) {
            financieraRequest.get('orden_pago',
              $.param({
                query: "Id:" + $scope.opproveedorid,
              })).then(function(response) {
              self.orden_pago = response.data;
              // proveedor
              self.asignar_proveedor(self.orden_pago[0].RegistroPresupuestal.Beneficiario)
              // detalle rp
              self.detalle_rp(self.orden_pago[0].RegistroPresupuestal.Id)
              //Iva
              self.calcularIva(self.orden_pago[0].ValorBase, self.orden_pago[0].Iva.Valor)
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
            self.proveedor = response.data;
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
        // Function detalle rp
        self.detalle_rp = function(rp_id) {
          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
            $.param({
              query: "RegistroPresupuestal.Id:" + rp_id,
            })).then(function(response) {
            self.rp_detalle = response.data;
          });
          //Valor total del Rp
          financieraRequest.get('registro_presupuestal/ValorTotalRp/' + rp_id)
            .then(function(response) {
              self.valor_total_rp = response.data;
            });
        }
        // Function calcular iva
        self.calcularIva = function(valor_base, iva) {
          self.ValorIva = (parseInt(valor_base) * (parseInt(iva) / 100));
          self.ValorBruto = parseInt(valor_base) + parseInt(self.ValorIva);
        }
        //Funciones de validacion y update data
        self.estructura_orden_pago_conceptos = function(conceptos) {
          angular.forEach(conceptos, function(concepto) {
            if (concepto.validado == true) { // tiene cuentas y se hace afectacion
              // data conceptos para orden de pago
              self.ConceptoOrdenPago.push({
                'OrdenDePago': {
                  'Id': 0
                },
                'Concepto': {
                  'Id': concepto.Id
                },
                'Valor': concepto.Afectacion
              });
              //total afectacion
              self.TotalAfectacion = self.TotalAfectacion + concepto.Afectacion;
              // recorrer novimiento
              angular.forEach(concepto.movs, function(movimiento) {
                if (movimiento.Debito > 0 || movimiento.Credito > 0) {
                  // data movimientos contables
                  self.MovimientoContableConceptoOrdenPago.push(movimiento);
                }
              })
            } else {
              //almacenamos el concepto para reportar
              console.log("concepto sin sin cuentas contables para hacer movimientos")
            }
          })
        }
        // Insert Orden Pago
        self.addOpProveedor = function() {
          // trabajar estructura de conceptos
          self.Data_OrdenPago_Concepto = {};
          self.ConceptoOrdenPago = [];
          self.MovimientoContableConceptoOrdenPago = [];
          self.TotalAfectacion = 0;
          //
          if (self.Concepto != undefined) {
            self.estructura_orden_pago_conceptos(self.Concepto);
          }
          //construir data send
          self.Data_OrdenPago_Concepto.OrdenPago = self.OrdenPago;
          self.Data_OrdenPago_Concepto.ConceptoOrdenPago = self.ConceptoOrdenPago;
          self.Data_OrdenPago_Concepto.MovimientoContable = self.MovimientoContableConceptoOrdenPago;
          //console.log("Estructura para enviar")
          //console.log(self.Data_OrdenPago_Concepto)
          // validar campos obligatorios en el formulario orden Pago y se inserta registro
          self.validar_campos()
        }

        // Funcion encargada de validar la obligatoriedad de los campos
        self.validar_campos = function() {
          self.MensajesAlerta = '';
          if (self.OrdenPago.TipoOrdenPago == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>Debe seleccionar el tipo de Documento en la Sección Valor del Pago</li>"
          }
          if (self.OrdenPago.Iva == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>Debe Indicar el Valor del Iva en la Sección Valor del Pago</li>"
          }
          if (self.OrdenPago.ValorBase == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>Debe Indicar el Valor Base en la Sección Valor del Pago</li>"
          }
          if (self.RubrosIds == undefined || self.RubrosIds.length == 0) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>Debe Seleccionar por lo minimo un Rubro</li>"
          }
          if (self.Concepto == undefined || self.Concepto.length == 0) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>Debe Seleccionar por lo minimo un Comcepto</li>"
          }
          if (self.TotalAfectacion != self.OrdenPago.ValorBase) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>El valor total de la afectacion es distinto al valor de la orden de pago. <br> <b>Afectacion: " + self.TotalAfectacion + "<br>Valor Orden: " + self.OrdenPago.ValorBase + "</b></li>"
          }
          // Operar
          if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
            // insert
            financieraRequest.post("orden_pago/RegistrarOp", self.Data_OrdenPago_Concepto)
              .then(function(data) { //error con el success
                self.resultado = data;
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


        //fin
      },
      controllerAs: 'd_opProveedorUpdatePorId'
    };
  });
