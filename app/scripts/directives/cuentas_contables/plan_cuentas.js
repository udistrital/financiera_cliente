'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/planCuentas
 * @description
 * # cuentasContables/planCuentas
 */
angular.module('financieraClienteApp')
  .directive('planCuentas', function() {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: '/views/directives/cuentas_contables/plan_cuentas.html',
      controller: function() {
        var self = this;

        self.cuenta_estructura={};

        self.treeOptions = {
          nodeChildren: "subcuentas",
          dirSelectable: true,
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        };

        self.plan_cuentas = [{
          "Codigo": "12",
          "Nombre": "fafsd",
          "Descripcion": "sfafas",
          "Naturaleza": "Debito",
          subcuentas: [{
            "Codigo": "13",
            "Nombre": "fafsd",
            "Descripcion": "sfafas",
            "Naturaleza": "Debito",
            subcuentas: [{
              "Codigo": "14",
              "Nombre": "fafsd",
              "Descripcion": "sfafas",
              "Naturaleza": "Debito",
              subcuentas: []
            }]
          }]
        }];





      },
      controllerAs: 'd_planCuentas'
    };
  });
