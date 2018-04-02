'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl
 * @description
 * # BancosSaldosInicialesCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('BancosSaldosInicialesCtrl', function ($scope, $translate, uiGridConstants, financieraRequest, $location) {
        var self = this;
        self.nueva_fecha = {};

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:saldosInicialesCtrl#cargar_vigencia
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
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

        $scope.$watch("saldosIniciales.padre", function(){
            if (self.padre !== undefined){
                financieraRequest.get("saldo_cuenta_contable", $.param({
                    query: "CuentaContable.Id:" + self.padre.Id + ",Anio:" + self.vigencia_saldos ,
                })).then(function(response) {
                    if (response.data !== null) {
                        self.Modificable = true;
                        console.log("true", response.data);
                    }
                    else{
                        console.log("false");
                        self.Modificable = false;
                    }

                })
          }       
        },true);

        $scope.$watch('saldosIniciales.registroExitoso',function (){
            if (self.registroExitoso !== undefined){
             $location.path('/bancos/saldos_iniciales');
              swal(
                'Registro Existoso',
                'El registro del saldo inicial por un valor $' + self.valor_inicial + ' fue creado exitosamente en la cuenta '+ self.padre.Codigo + ' ' + self.padre.Nombre,
                'success'
              );                  
            }              
         });        


        //Se definen la opciones para el ui-grid
        self.gridOptions = {
            paginationPageSizes: [5, 10, 15, 20, 50],
            paginationPageSize: 5,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [{
                    field: 'Anio',
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    },
                    displayName: $translate.instant('VIGENCIA'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '20%'
                },
                {
                    field: 'Mes',
                    displayName: $translate.instant('MES'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '20%'
                },                
                {
                    field: 'CuentaContable.Codigo',
                    displayName: $translate.instant('CUENTA_CONTABLE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '10%'
                },,                
                {
                    field: 'CuentaContable.Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '15%'
                },                
                {
                    field: 'Saldo',
                    displayName: $translate.instant('SALDO'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '30%'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '5%'
                }
            ]
        };

        //opciones extras para el control del grid
        self.gridOptions.multiSelect = false;
        self.gridOptions.modifierKeysToMultiSelect = false;
        self.gridOptions.enablePaginationControls = true;
        self.gridOptions.onRegisterApi = function(gridApi) {
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {
                self.row_calndario = self.gridApi.selection.getSelectedRows()[0];
            });
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:saldosInicialesCtrl#cargar_saldos_full
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @description
         * Carga todo el listado de saldos creados hasta la fecha
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna los saldos tributarios
         */
        self.cargar_saldos_full = function() {
            financieraRequest.get('saldo_cuenta_contable', $.param({
                limit: -1
            })).then(function(response) {
                if (response.data === null) {
                    self.gridOptions.data = [];
                } else {
                    self.gridOptions.data = response.data;
                }
            });
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:saldosInicialesCtrl#cargar_saldos_vigencia
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {var} vigencia Vigencia en la que se encuentran los saldos a obtener
         * @description
         * Carga el listado de saldos creados en una vigencia determinada
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna los saldos tributarios
         */
        self.cargar_saldos_vigencia = function(vigencia) {
            financieraRequest.get('saldo_cuenta_contable', $.param({
                limit: -1,
                query: 'Anio:' + vigencia
            })).then(function(response) {
                if (response.data === null) {
                    self.gridOptions.data = [];
                } else {
                    self.gridOptions.data = response.data;
                    console.log(self.gridOptions.data);
                }
            });
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:saldosInicialesCtrl#modo_editar
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
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
         * @name financieraClienteApp.controller:saldosInicialesCtrl#crear_saldo
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @description
         * Comprueba si es un saldo a editar o a crear, si la accion es para crear consume el servicio POST de
         * {@link financieraService.service:financieraRequest financieraRequest}  y si es de actualizar el servicio PUT
         */
        self.crear_saldo = function() {

            $('#modalformP').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();            
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
                    Anio: self.nueva_fecha.Vigencia,
                    Mes: self.nueva_fecha.FechaInicio.getMonth() +1,
                    CuentaContable: {Id: self.padre.Id }
                };

                financieraRequest.post('saldo_cuenta_contable', nuevo).then(function(response) {
                    if (self.vigencia_saldos === null) {
                        self.cargar_saldos_full();
                    } else {
                        self.cargar_saldos_vigencia(self.vigencia_saldos);
                    }
                });
            }
            self.registroExitoso = true;            
        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:saldosInicialesCtrl#watch_on_vigencia
         * @eventOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {var} Vigencia vigencia del nuevo calendario
         * @description
         * Valida en base a la vigencia seleccionada el rango de la fecha inicio y la fecha fin
         */
        $scope.$watch('saldosIniciales.nueva_fecha.Vigencia', function() {
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
         * @name financieraClienteApp.controller:saldosInicialesCtrl#watch_on_fecha_inicio
         * @eventOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {date} FechaInicio fecha inicial del calendario
         * @description
         * Valida en base a la fecha inicial registrada el rango minimo de la fecha fin
         */
        $scope.$watch('saldosIniciales.nueva_fecha.FechaInicio', function() {
            if (self.nueva_fecha.FechaInicio >= self.nueva_fecha.FechaFin || self.nueva_fecha.FechaInicio === undefined ) {
                self.nueva_fecha.FechaFin = undefined;
            }
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:saldosInicialesCtrl#watch_on_editar
         * @eventOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {boolean} editar bandera para llenar el formulario con los datos de un calendario
         * @description
         * Observa si la variable editar es falsa limpia la variable utilizada en el formulario para crear un calendario
         */
        $scope.$watch('editar', function() {
            if ($scope.editar === false) {
                self.nueva_fecha = {};
            }
        });

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:saldosInicialesCtrl#watch_on_vigencia_saldos
         * @eventOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {var} vigencia_saldos Vigencia seleccionada para la carga de saldos
         * @description
         * Comprueba si la variable vigencia cambia para volver a cargar el grid con los datos correspondientes
         */
        $scope.$watch('saldosIniciales.vigencia_saldos', function() {
            if (self.vigencia_saldos === null) { //Si no existe vigencia realiza la carga de todos los saldos
                self.cargar_saldos_full();
            } else {
                self.cargar_saldos_vigencia(self.vigencia_saldos);
            }
        }, true);
  });
