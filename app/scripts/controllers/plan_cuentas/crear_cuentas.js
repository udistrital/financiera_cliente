'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
 * @alias crearCuentas
 * @requires $scope
 * @requires financieraService.service:financieraRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {injector} $scope scope del controlador
 * @description
 * # PlanCuentasCrearCuentasCtrl
 * Controlador para la creación de nuevas cuentas contables en el plan maestro de cuentas.
 *
 * **Nota:** El plan de cuentas maestro debe estar creado
 */

angular.module('financieraClienteApp')
  .controller('PlanCuentasCrearCuentasCtrl', function(financieraRequest, $scope, $translate) {
    // Instanciación del scope local a variable self
    var self = this;
    self.cuentas = [];
    self.naturalezas = ["debito", "credito"];
    self.nueva_cuenta = {};
    self.niveles = [];

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl#cargar_plan_maestro
     * @methodOf financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
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
     * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl#crear_cuenta
     * @methodOf financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
     * @param {object} form formulario que es enviado desde la vista para el control de limpieza o envio de errores
     * @description
     * Se genera alerta en la cual se notifica al usuario si desea crear una nueva cuenta, luego se construye el objeto que
     * será enviado por el método post del servicio {@link financieraService.service:financieraRequest financieraRequest} el cual retornará un mensaje en
     * el que se especifica si existen errores o si la transacción tuvo éxito. Si la transacción fue exitosa se limpia el formulario de lo contrario se
     * deja con los datos y se notifica el error devuelto por el servicio.
     */
    self.crear_cuenta = function() {
      // Se implementa sweet alert 2 para mostrar la alerta de confirmacion
      swal({
        title: $translate.instant('NUEVA_CUENTA')+'!',
        text: $translate.instant('DESEA_CREAR_CUENTA'),
        type: 'info',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
        cancelButtonText: $translate.instant('BTN.CANCELAR'),
        buttonsStyling: false
      }).then(function() {
        //Se verifica si existe una cuenta padre seleccionada
        var tr_cuenta = {
          Cuenta: angular.copy(self.nueva_cuenta),
          PlanCuentas: self.plan_maestro
        };
        if (self.padre != undefined) {
          tr_cuenta.Cuenta.Codigo = self.padre.Codigo.concat("-", self.nueva_cuenta.Codigo); //Realiza una concatenacion del codigo para la cuenta a crearse
          tr_cuenta.CuentaPadre = self.padre; //Se instancia la cuenta padre en otra variable para ser enviada por el servicio
        } else {
          tr_cuenta.CuentaPadre  = {};
        }
        //Se consume servicio por el metodo post
        financieraRequest.post('tr_cuentas_contables', tr_cuenta).then(function(response) {
          if (response.data.Type == 'success') {
            swal($translate.instant(response.data.Code), $translate.instant("CUENTA") + " " + response.data.Body, response.data.Type);
            $scope.cuentas_form.$setPristine();
            $scope.cuentas_form.$setUntouched();
            self.nueva_cuenta = {};
            self.padre = undefined;
          } else {
            swal("", $translate.instant(response.data.Code), response.data.Type);
          }
          // limpia el formulario si la creacion de la cuena fue exitosA
        });
      });
    };

    self.cargar_plan_maestro();

    /**
     * @ngdoc event
     * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl#watch_on_padre
     * @eventOf financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
     * @param {object} padre cuenta padre
     * @description Si la cuenta padre sufre un cambio el evento se activa para determinar el nivel de clasificación que tendra la cuenta a crearse por medio del servicio
     * obtenido de {@link financieraService.service:financieraRequest financieraRequest}, si no existe nivel se retorna el primer nivel y se deselecciona la cuenta padre
     */
    $scope.$watch('crearCuentas.padre', function() {
      if (self.padre == undefined) {
        financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
          self.nivel = response.data;
          self.nueva_cuenta.NivelClasificacion = response.data;
        });
      } else {
        financieraRequest.get('estructura_niveles_clasificacion', $.param({
          query: "NivelPadre:" + self.padre.NivelClasificacion.Id
        })).then(function(response) {
          if (response.data == null) {
            financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
              alert("El nivel de clasificación siguiente no existe");
              self.nivel = response.data;
              self.nueva_cuenta.NivelClasificacion = response.data;
              self.padre = {};
            });
          } else {
            self.nivel = response.data[0].NivelHijo;
            self.nueva_cuenta.NivelClasificacion = self.nivel;
            self.nueva_cuenta.Naturaleza=self.padre.Naturaleza;
          }
        });
      }
    }, true);

  });
