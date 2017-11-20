'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasEditarCuentaCtrl
 * @description
 * # PlanCuentasEditarCuentaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('EditarCuentaCtrl', function ($scope, $routeParams, financieraRequest, $translate) {
    var self = this;

    self.cargar_cuenta=function(){
      financieraRequest.get("cuenta_contable",$.param({
        query:"Codigo:"+$routeParams.Id
      })).then(function(response){
        self.cuenta=response.data[0];
        self.e_cuenta=angular.copy(self.cuenta);
        self.e_cuenta.Codigo1=self.e_cuenta.Codigo.substring(0,self.e_cuenta.Codigo.length-self.e_cuenta.NivelClasificacion.Longitud);
        self.e_cuenta.Codigo2=self.e_cuenta.Codigo.substring(self.e_cuenta.Codigo.length-self.e_cuenta.NivelClasificacion.Longitud);
      });
    };

    self.editar_cuenta=function(){
      swal({
        title: $translate.instant('EDITAR_CUENTA')+'!',
        text: $translate.instant('DESEA_ACTUALIZAR_CUENTA'),
        type: 'info',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
        cancelButtonText: $translate.instant('BTN.CANCELAR'),
        buttonsStyling: false
      }).then(function() {
        //Se verifica si existe una cuenta padre seleccionada
        self.cuenta.Nombre=self.e_cuenta.Nombre;
        self.cuenta.Descripcion=self.e_cuenta.Descripcion;
        self.cuenta.Codigo=self.e_cuenta.Codigo;

        //Se consume servicio por el metodo post
        financieraRequest.put('cuenta_contable', self.cuenta.Id,self.cuenta).then(function(response) {
          if (response.data.Type == 'success') {
            swal($translate.instant(response.data.Code), $translate.instant("CUENTA") + " " + response.data.Body, response.data.Type);
            window.location = "http://127.0.0.1:9000/#/plan_cuentas/editar_cuenta/"+response.data.Body;
          } else {
            swal("", $translate.instant(response.data.Code), response.data.Type);
          }
          // limpia el formulario si la creacion de la cuena fue exitosA
        });
      });
    };

    self.cargar_cuenta();

  });
