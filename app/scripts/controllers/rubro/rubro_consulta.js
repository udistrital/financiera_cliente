'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroRubroConsultaCtrl
 * @description
 * # RubroRubroConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroRubroConsultaCtrl', function ($translate) {
    var self = this;
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];
  });
