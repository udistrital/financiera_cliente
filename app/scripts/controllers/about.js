'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AboutCtrl', function($scope, configuracionRequest, $rootScope) {

    var self = this;


    //self.hijosess=configuracionRequest.get_acciones("plan_cuentas/nuevo",$rootScope.my_menu);
  $rootScope.$watch("my_menu",function(){
      self.hijosess=configuracionRequest.get_acciones("plan_cuentas/nuevo",$rootScope.my_menu);
  },true)

  /*  self.get_elemento = function(item, a) {
      console.log(item, a);
      for (var i = 0; i < a.length; i++) {
        if (a[i].Nombre === item) {
          return true;
        } else if (a[i].Opciones.length > 0) {
          if (self.get_elemento(item,a[i].Opciones)) {
            return true;
          }
        }
      }
      return false;
    };*/


    self.prueba_rolcli = [{
        Nombre: "gestion_item",
        Url: "",
        TipoOpcion: "actividad",
        Opciones: [{
            Id: 4,
            Nombre: "aprobar",
            Url: "",
            TipoOpcion: "btn",
            Opciones: []
          },
          {
            Id: 4,
            Nombre: "rechazar",
            Url: "",
            TipoOpcion: "btn",
            Opciones: []
          }
        ]
      },
      {
        Nombre: "gestion_tipos",
        Url: "",
        TipoOpcion: "actividad",
        Opciones: [{
            Id: 4,
            Nombre: "lista_tipos",
            Url: "",
            TipoOpcion: "grid",
            Opciones: [{
              Id: 4,
              Nombre: "editar",
              Url: "",
              TipoOpcion: "btn",
              Opciones: []
            }, {
              Id: 4,
              Nombre: "eliminar",
              Url: "",
              TipoOpcion: "btn",
              Opciones: []
            }]
          },
          {
            Id: 4,
            Nombre: "agregar",
            Url: "",
            TipoOpcion: "btn",
            Opciones: []
          }
        ]
      }
    ];
  });
