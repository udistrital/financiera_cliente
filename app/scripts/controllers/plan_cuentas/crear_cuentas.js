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
  .controller('PlanCuentasCrearCuentasCtrl', function(financieraRequest, $scope) {
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
    self.crear_cuenta = function(form) {
      // Se implementa sweet alert 2 para mostrar la alerta de confirmacion
      swal({
        title: 'Nueva Cuenta!',
        text: "Deseas crear la nueva cuenta?",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(function() {
        //Se verifica si existe una cuenta padre seleccionada
        if (self.padre != undefined) {
          self.nueva_cuenta.Codigo = self.padre.Codigo.concat("-", self.nueva_cuenta.Codigo); //Realiza una concatenacion del codigo para la cuenta a crearse
          self.tr_padre = self.padre; //Se instancia la cuenta padre en otra variable para ser enviada por el servicio
        } else {
          self.tr_padre = {};
        }
        self.tr_cuenta = {
          Cuenta: self.nueva_cuenta,
          CuentaPadre: self.tr_padre,
          PlanCuentas: self.plan_maestro
        };
        //Se consume servicio por el metodo post
        financieraRequest.post('tr_cuentas_contables', self.tr_cuenta).then(function(response) {
          self.alerta = "";
          for (var i = 1; i < response.data.length; i++) {
            self.alerta = self.alerta + response.data[i] + "\n";
          }
          swal("", self.alerta, response.data[0]);
          self.recargar_arbol = !self.recargar_arbol;
          // limpia el formulario si la creacion de la cuena fue exitosA
          if (response.data[0] == "success") {
            form.$setPristine();
            form.$setUntouched();
            self.nueva_cuenta = {};
            self.padre = undefined;
          }
        });
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl#resetear
     * @methodOf financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
     * @param {object} form formulario que es enviado desde la vista para la respectiva limpieza
     * @description Realiza una limpieza sobre los datos digitados en el formulario que es recibido como parámetro
     */
    self.resetear = function(form) {
      // alerta para confirmar la limpieza del formulario
      swal({
        text: "Deseas limpiar el formulario?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(function() {
        form.$setPristine();
        form.$setUntouched();
        self.nueva_cuenta = {};
        self.padre = undefined;
        financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
          self.nivel = response.data;
          self.nueva_cuenta.NivelClasificacion = response.data;
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
          }
        });
      }
    }, true);

  });
