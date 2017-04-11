'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorVerPorId
 * @description
 * # ordenPago/opProveedorVerPorId
 */
angular.module('financieraClienteApp')
  .directive('opProveedorVerPorId', function (financieraRequest, agoraRequest, coreRequest) {
    return {
      restrict: 'E',
      scope:{
          opproveedorid:'='
        },

      templateUrl: 'views/directives/orden_pago/op_proveedor_ver_por_id.html',
      controller:function($scope){
        var self = this;
        self.rubros = [];
        //orden de pago
        $scope.$watch('opproveedorid', function(){
          if($scope.opproveedorid != undefined){
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
                //detalle concepto
                self.detalle_concepto(self.orden_pago[0].Id)

            });
          }
        })
        // Function buscamos datos del proveedor que esta en el rp
        self.asignar_proveedor = function(beneficiario_id){
          agoraRequest.get('informacion_proveedor',
            $.param({ query: "Id:" + beneficiario_id,})
          ).then(function(response) {
              self.proveedor = response.data;
              // datos banco
              self.get_info_banco(self.proveedor[0].IdEntidadBancaria);
              //datos telefono
              self.get_tel_provee(self.proveedor[0].Id)
            });
        }
        //
        self.get_info_banco = function(id_banco){
          coreRequest.get('banco',
          $.param({query: "Id:" + id_banco,
          })).then(function(response) {
            self.banco_proveedor = response.data[0];
          });
        }
        //
        self.get_tel_provee = function(id_prove){
          agoraRequest.get('proveedor_telefono',
          $.param({query: "Id:" + id_prove,
          })).then(function(response) {
            self.tel_proveedor = response.data[0];
          });
        }
        // Function detalle rp
        self.detalle_rp = function(rp_id){
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
        self.calcularIva = function(valor_base, iva){
          self.ValorIva = ( parseInt(valor_base) * (parseInt(iva)/100) );
          self.ValorBruto = parseInt(valor_base) + parseInt(self.ValorIva);
        }
        // Function detall concepto
        self.detalle_concepto = function(orden_pago_id){
          financieraRequest.get('concepto_orden_pago',
            $.param({ query: "OrdenDePago:" + orden_pago_id,})
          ).then(function(response) {
              self.conceptos = response.data;
              self.detalle_rubros(self.conceptos)
            });
        }
        //construir arreglo de rubros
        self.detalle_rubros = function(concepto_orden_pago){
          angular.forEach(concepto_orden_pago, function(i){
            self.rubros.push(i.Concepto.Rubro)
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
      controllerAs:'d_opProveedorVerPorId'
    };
  });
