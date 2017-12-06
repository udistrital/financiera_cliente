'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudRegistroCtrl
 * @description
 * # RubroModificacionSolicitudRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudRegistroCtrl', function ($translate) {
    var self = this;
    self.tiposModificaciones = [
    	{
    		Nombre: "Reducción"
    	},
    	{
    		Nombre: "Adición"
    	},
    	{
    		Nombre: "Traslado"
    	}
    ];
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      //{ clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
    ];
    self.Vigencia = 2017;
  });
