'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaVerPorIdCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaVerPorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaVerPorIdCtrl', function (financieraRequest, agoraRequest, coreRequest, $scope, $routeParams, financieraMidRequest) {
    var self = this;
    self.ordenPagoPlantaId = $routeParams.Id;
    // paneles
    $scope.panelUnidadEjecutora = true;
    $scope.panelProveedor = true;
    $scope.panelRp = true;
    $scope.pestana_abierta = true;
    $scope.panelDetalleCuentas = true;
    // get data OP
    financieraRequest.get('orden_pago',
      $.param({
        query: "Id:" + self.ordenPagoPlantaId,
      })).then(function(response) {
        self.OrdenPago = response.data[0];
        // proveedor
        self.get_info_proveedor(self.OrdenPago.RegistroPresupuestal.Beneficiario)
        // detalle rp
        self.detalle_rp(self.OrdenPago.RegistroPresupuestal.Id)
    });

    // ***********
    // Funciones
    // ***********

    // Function buscamos datos del proveedor que esta en el rp
    self.get_info_proveedor = function(beneficiario_id) {
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


  // fin
  });
