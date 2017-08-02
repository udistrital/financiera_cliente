'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AboutCtrl', function($scope) {
    var self = this;
    self.algo = "prueba";

    self.cosa= angular.element("cosa_prueba");
    console.log(self.cosa);



    self.get_cosa=function(item){
      console.log(item);
      for (var i = 0; i < self.prueba_menu.length; i++) {
        if (self.prueba_menu[i].Nombre===item) {
          return true;
        }
      }
      return false;
    };


    self.prueba_menu = [{
      "Id": 1,
      "Nombre": "cosa_pruebae",
      "Url": "",
      "TipoOpcion": "Actividad",
      "Opciones": [{
        "Id": 4,
        "Nombre": "Gestion cuentas",
        "Url": "",
        "TipoOpcion": "Actividad",
        "Opciones": [{
          "Id": 6,
          "Nombre": "Definición de Rubros Presupuestales",
          "Url": "rubro/rubro_registro",
          "TipoOpcion": "r_ver",
          "Opciones": null
        },
        {
          "Id": 6,
          "Nombre": "Definición de Rubros Presupuestales",
          "Url": "rubro/rubro_registro",
          "TipoOpcion": "r_editar",
          "Opciones": null
        },
        {
          "Id": 6,
          "Nombre": "Definición de Rubros Presupuestales",
          "Url": "rubro/rubro_registro",
          "TipoOpcion": "b_crear",
          "Opciones": null
        }]
      }]
    }];



  });
