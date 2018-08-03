'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
 * @description
 * # BancosAgregarSaldosInicialesCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('BancosAgregarSaldosInicialesCtrl', function ($scope, $translate, uiGridConstants, financieraRequest, $location, $route) {
        var self = this;
        self.nueva_fecha = {};
        self.cargando = false;
        self.hayData = true;
        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#cargar_vigencia
         * @methodOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @description
         * Carga la vigencia en la que se situa la fecha y realiza un arreglo con 3 vigencias atras y una arriba
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna la vigencia calculada con la fecha del api
         */
        self.cargar_vigencia = function() {
            financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
                self.vigencia_saldos = parseInt(response.data);
                var year = parseInt(response.data) + 1;
                self.vigencias = [];
                for (var i = 0; i < 5; i++) {
                    self.vigencias.push(year - i);
                }
            });
        };

        self.cargar_vigencia();

        self.cargar_plan_maestro = function() {
          financieraRequest.get("plan_cuentas", $.param({
            query: "PlanMaestro:" + true
          })).then(function(response) {
            self.plan_maestro = response.data[0];
            financieraRequest.get("estructura_cuentas", $.param({
                query: "PlanCuentas.Id:" + self.plan_maestro.Id +",CuentaPadre.Nombre:ACTIVOS,CuentaHijo.Nombre:Efectivo",
                fields: "CuentaPadre,CuentaHijo"
            })).then(function(response) {
               self.filtro_padre = response.data[0];
               console.log(self.filtro_padre);
            }) //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
          });
        };

        self.cargar_plan_maestro();

        $scope.$watch("agregarSaldosIniciales.padre", function(){
            if (self.padre !== undefined){
                financieraRequest.get("saldo_cuenta_contable", $.param({
                    query: "CuentaContable.Id:" + self.padre.Id + ",Anio:" + self.vigencia_saldos ,
                })).then(function(response) {
                    if (response.data !== null) {
                        self.Modificable = false;
                        console.log("true", response.data);
                    }
                    else{
                        console.log("false");
                        self.Modificable = false;
                    }

                })
          }
        },true);

        $scope.$watch('agregarSaldosIniciales.registroExitoso',function (){
            if (self.registroExitoso === true){
                self.valor_inicial = '$' + self.valor_inicial.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

             var templateAlert = "<table class='table table-bordered'><th>" +'<center>' +$translate.instant('SALDO')+' '+$translate.instant('INICIAL') + "</center></th><th><center>" + $translate.instant('CUENTA_CONTABLE') + "</center></th><th><center>" + $translate.instant('CUENTA_BANCARIA') + "</center></th>";
             templateAlert = templateAlert + "<tr class='success'><td>"+self.valor_inicial+"</td>" + "<td>" +self.padre.Codigo + "</td>"+ "<td>" + self.padre.Nombre + "</td></tr>" ;
             templateAlert = templateAlert + "</table>";

              swal({
                title: $translate.instant("S_543"),
                type: "success",
                width: 800,
                html: templateAlert,
                showCloseButton: true,
                confirmButtonText: 'Cerrar'
              }).then(function(){
                 $location.path('/bancos/saldos_iniciales');
                 $route.reload()
              });
            }

            if (self.registroExitoso === false){

            swal(
                '',
                $translate.instant("E_SI1"),
                'error'
              ).then(function(){
                 $location.path('/bancos/saldos_iniciales');
                 $route.reload()
              });
            }
         });

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#modo_editar
         * @methodOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @param {object} calendario caendario que se cargara en el formulario para ser editado
         * @description
         * Función para cargar el calendario a editar en el formulario, realizando una copia del mismo y
         * ajustando el formato de las fechas programadas del calendario
         */
        self.modo_editar = function(calendario) {
            self.nueva_fecha = angular.copy(calendario);
            self.nueva_fecha.FechaInicio = new Date(self.nueva_fecha.FechaInicio);
            self.nueva_fecha.FechaFin = new Date(self.nueva_fecha.FechaFin);
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#crear_saldo
         * @methodOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @description
         * Comprueba si es un saldo a editar o a crear, si la accion es para crear consume el servicio POST de
         * {@link financieraService.service:financieraRequest financieraRequest}  y si es de actualizar el servicio PUT
         */
        self.crear_saldo = function() {


          var validar_campos =self.validateFields();
         if(validar_campos != false){
            console.log("Cuenta:", self.padre.Codigo);
            console.log("Saldo:", self.valor_inicial);
            console.log("Vigencia", self.nueva_fecha.Vigencia );
            console.log("FechaInicio", self.nueva_fecha.FechaInicio);
            console.log("Mes", self.nueva_fecha.FechaInicio.getMonth() +1);
            console.log("FechaFin", self.nueva_fecha.FechaFin);
            console.log("Obj Seleccionado", self.padre);

        /*
        TODO: - generar y/o conectar al servicio que registre la transacción del movimiento
              - limpiar variables
              - generar sweet alert
              - redireccionar

        */
            if ($scope.editar === true) {
/*                financieraRequest.put('saldo_cuenta_contable', self.nueva_fecha.Id, self.nueva_fecha).then(function(response) {
                    console.log(response);
                    if (self.vigencia_saldos === null) {
                        self.cargar_saldos_full();
                    } else {
                        self.cargar_saldos_vigencia(self.vigencia_saldos);
                    }
                });*/
            } else {
                var nuevo = {
                    Saldo: self.valor_inicial,
                    Anio: parseInt(self.nueva_fecha.Vigencia),
                    Mes: self.nueva_fecha.FechaInicio.getMonth() +1,
                    CuentaContable: {Id: self.padre.Id }
                };

                financieraRequest.post('saldo_cuenta_contable', nuevo).then(function(response) {

                    console.log("response", response.data, typeof(response.data))
                    if(typeof(response.data) === "object"){
                      self.registroExitoso = true;
                    }

                    if(typeof(response.data) === "string"){
                        self.registroExitoso = false;
                    }


                });

            }

          }
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#validateFields
         * @methodOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @description
         * Valida los campos del formulario de crear el saldo
         * {@link financieraService.service:financieraRequest financieraRequest}  y si es de actualizar el servicio PUT
         */

        self.validateFields= function(){

          if($scope.saldoForm.$invalid){


            angular.forEach($scope.saldoForm.$error,function(controles,error){
              angular.forEach(controles,function(control){
                control.$setDirty();
              });
            });
            return false;
          }
        };


        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#watch_on_vigencia
         * @eventOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @param {var} Vigencia vigencia del nuevo calendario
         * @description
         * Valida en base a la vigencia seleccionada el rango de la fecha inicio y la fecha fin
         */
        $scope.$watch('agregarSaldosIniciales.nueva_fecha.Vigencia', function() {
            if (self.nueva_fecha.FechaInicio !== undefined) {
                console.log("reset fecha inicio");
                self.nueva_fecha.FechaInicio = undefined;
                self.nueva_fecha.FechaFin = undefined;
            }
            self.fechamin = new Date(
                self.nueva_fecha.Vigencia,
                0, 1
            );
            self.fechamax = new Date(
                self.nueva_fecha.Vigencia,
                12, 0
            );
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#watch_on_fecha_inicio
         * @eventOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @param {date} FechaInicio fecha inicial del calendario
         * @description
         * Valida en base a la fecha inicial registrada el rango minimo de la fecha fin
         */
        $scope.$watch('agregarSaldosIniciales.nueva_fecha.FechaInicio', function() {
            if (self.nueva_fecha.FechaInicio >= self.nueva_fecha.FechaFin || self.nueva_fecha.FechaInicio === undefined ) {
                self.nueva_fecha.FechaFin = undefined;
            }
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl#watch_on_editar
         * @eventOf financieraClienteApp.controller:BancosAgregarSaldosInicialesCtrl
         * @param {boolean} editar bandera para llenar el formulario con los datos de un calendario
         * @description
         * Observa si la variable editar es falsa limpia la variable utilizada en el formulario para crear un calendario
         */
        $scope.$watch('editar', function() {
            if ($scope.editar === false) {
                self.nueva_fecha = {};
            }
        });

  });
