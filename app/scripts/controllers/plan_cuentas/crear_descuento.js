'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasCrearDescuentoCtrl
 * @description
 * # PlanCuentasCrearDescuentoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearDescuentoCtrl', function (financieraRequest) {
    var self=this;
    self.descuento_nuevo={};

    self.tipos_cuentas=[
      {Id:1,Nombre:"Descuento"},{Id:2,Nombre:"Devengo"}
    ];


    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };

    self.cargar_plan_maestro();

  });
