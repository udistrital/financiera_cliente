'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorVerPorId
 * @description
 * # ordenPago/opProveedorVerPorId
 */
angular.module('financieraClienteApp')
  .directive('opProveedorVerPorId', function(financieraRequest, financieraMidRequest, agoraRequest, arkaRequest, coreRequest) {
    return {
      restrict: 'E',
      scope: {
        opproveedorid: '=',
        outputopp: '='
      },

      templateUrl: 'views/directives/orden_pago/op_proveedor_ver_por_id.html',
      controller: function($scope) {
        var self = this;
        self.rubros = [];
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
                query: "Id:" + $scope.opproveedorid + ',SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion:OP-PROV',
              })).then(function(response) {
              self.orden_pago = response.data[0];
              $scope.outputopp = response.data[0];
              // proveedor
              self.asignar_proveedor(self.orden_pago.RegistroPresupuestal.Beneficiario)
              // detalle rp
              self.detalle_rp(self.orden_pago.RegistroPresupuestal.Id)
              // entrada almacen
              if (self.orden_pago.EntradaAlmacen != 0){
                self.entradaAlmacen(self.orden_pago.EntradaAlmacen)
              }
              //detalle concepto
              self.detalle_concepto(self.orden_pago.Id)
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
            self.rp_detalle = response.data[0];
            //data necesidad
            financieraMidRequest.get('disponibilidad/SolicitudById/'+self.rp_detalle.DisponibilidadApropiacion.Disponibilidad.Solicitud,'')
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
              self.entrada = response.data[0];
            });
        }
        // Function detall concepto
        self.detalle_concepto = function(orden_pago_id) {
          financieraRequest.get('concepto_orden_pago',
            $.param({
              query: "OrdenDePago:" + orden_pago_id,
            })
          ).then(function(response) {
            self.conceptos = response.data;
            self.detalle_rubros(self.conceptos)
          });
        }
        //construir arreglo de rubros
        self.detalle_rubros = function(concepto_orden_pago) {
          angular.forEach(concepto_orden_pago, function(i) {
            self.rubros.push(i.RegistroPresupuestalDisponibilidadApropiacion)
          })
          // quitar repetidos
          var hash = {};
          self.rubros = self.rubros.filter(function(current) {
            var exists = !hash[current.Id] || false;
            hash[current.Id] = true;
            return exists;
          });
        }
        //
      },
      controllerAs: 'd_opProveedorVerPorId'
    };
  });
