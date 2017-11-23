'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasEditarCuentaCtrl
 * @description
 * # PlanCuentasEditarCuentaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('EditarCuentaCtrl', function ($scope, $routeParams, financieraRequest, $translate, $location) {
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

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    self.cambiar_padre=function(){
      self.cargar_plan_maestro();
    };

    self.cancelar_padre=function(){
      self.e_cuenta.Codigo1=self.e_cuenta.Codigo.substring(0,self.e_cuenta.Codigo.length-self.e_cuenta.NivelClasificacion.Longitud);
      self.e_cuenta.Codigo2=self.e_cuenta.Codigo.substring(self.e_cuenta.Codigo.length-self.e_cuenta.NivelClasificacion.Longitud);
      self.e_cuenta.Naturaleza = self.cuenta.Naturaleza;
      self.e_cuenta.NivelClasificacion = self.cuenta.NivelClasificacion;
      console.log("ada");
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
        self.cuenta.Codigo=self.e_cuenta.Codigo1+self.e_cuenta.Codigo2;

        var tr_cuenta={
          Cuenta: self.cuenta,
          CuentaPadre:self.padre?self.padre:null,
          PlanCuentas:self.plan_maestro
        }

        //Se consume servicio por el metodo post
        financieraRequest.put('tr_cuentas_contables', self.cuenta.Id,tr_cuenta).then(function(response) {
          if (response.data.Type == 'success') {
            swal($translate.instant(response.data.Code), $translate.instant("CUENTA") + " " + response.data.Body, response.data.Type);
            $location.path('plan_cuentas/editar_cuenta/'+response.data.Bod);
          } else {
            swal("", $translate.instant(response.data.Code), response.data.Type);
          }
          // limpia el formulario si la creacion de la cuena fue exitosA
        });
      });
    };

    $scope.$watch('editarCuenta.padre', function() {
      if (self.padre != undefined ) {
        financieraRequest.get('estructura_niveles_clasificacion', $.param({
          query: "NivelPadre:" + self.padre.NivelClasificacion.Id
        })).then(function(response) {
          if (response.data == null) {
            swal("",$translate.instant('ITEM_NO_PUEDE_SELECCIONAR'),"error");
            self.padre=undefined;
          } else {
            var nivel = response.data[0].NivelHijo;
            self.e_cuenta.NivelClasificacion = nivel;
            self.e_cuenta.Naturaleza=self.padre.Naturaleza;
            self.e_cuenta.Codigo1=self.padre.Codigo+"-";
          }
        });
      }
    }, true);

    self.cargar_cuenta();

  });
