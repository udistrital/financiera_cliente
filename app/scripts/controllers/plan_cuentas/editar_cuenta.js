'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:EditarCuentaCtrl
 * @alias editarCuenta
 * @requires $scope
 * @requires $translate
 * @requires $location
 * @requires $routeParams
 * @requires financieraService.service:financieraRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {injector} $scope scope del controlador
 * @param {injector} $translate internacionalización
 * @param {injector} $location elemento control de path
 * @param {injector} $routeParams parametros de route
 * @description
 * # EditarCuentaCtrl
 * Controlador para la edición de cuentas contables en el plan maestro de cuentas.
 *
 * **Nota:** El plan de cuentas maestro debe estar creado
 */

angular.module('financieraClienteApp')
  .controller('EditarCuentaCtrl', function ($scope, $routeParams, financieraRequest, $translate, $location) {
    var self = this;

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarCuentaCtrl#cargar_cuenta
     * @methodOf financieraClienteApp.controller:EditarCuentaCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y obtener la información de la cuenta contable a editarse
     */
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

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarCuentaCtrl#cargar_plan_maestro
     * @methodOf financieraClienteApp.controller:EditarCuentaCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y obtener el plan de cuentas maestro vigente
     */
    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarCuentaCtrl#cambiar_padre
     * @methodOf financieraClienteApp.controller:EditarCuentaCtrl
     * @description Se encarga de activar la funcion para obener y cargar las cuentas del plan maestro
     */
    self.cambiar_padre=function(){
      if (self.plan_maestro == undefined) {
        self.cargar_plan_maestro();
      }
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarCuentaCtrl#cancelar_padre
     * @methodOf financieraClienteApp.controller:EditarCuentaCtrl
     * @description Se encarga de formatear el codigo, naturaleza y nivel de clasificación de la cuenta contable
     * en caso de que esta halla sido modificada
     */
    self.cancelar_padre=function(){
      self.e_cuenta.Codigo1=self.e_cuenta.Codigo.substring(0,self.e_cuenta.Codigo.length-self.e_cuenta.NivelClasificacion.Longitud);
      self.e_cuenta.Codigo2=self.e_cuenta.Codigo.substring(self.e_cuenta.Codigo.length-self.e_cuenta.NivelClasificacion.Longitud);
      self.e_cuenta.Naturaleza = self.cuenta.Naturaleza;
      self.e_cuenta.NivelClasificacion = self.cuenta.NivelClasificacion;
      console.log("ada");
    };


    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarCuentaCtrl#editar_cuenta
     * @methodOf financieraClienteApp.controller:EditarCuentaCtrl
     * @description Se encarga de validar los datos de la cuenta a editar y consume el servicio post de {@link financieraService.service:financieraRequest financieraRequest}
     * para actualizar la cuenta contable en el sistema.
     */
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
            $location.path('plan_cuentas/editar_cuenta/'+response.data.Body);
          } else {
            swal("", $translate.instant(response.data.Code), response.data.Type);
          }
          // limpia el formulario si la creacion de la cuena fue exitosA
        });
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarCuentaCtrl#padre
     * @methodOf financieraClienteApp.controller:EditarCuentaCtrl
     * @description Se encarga de validarsi se selecciona otra cuenta padre para  editar, consume el servicio post de {@link financieraService.service:financieraRequest financieraRequest}
     * para actualizar el nivel de clasificacion y naturaleza de la cuenta contable en el sistema.
     */
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
