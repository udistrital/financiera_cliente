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
        self.nuevo_saldo = {};
        $scope.btneditar=$translate.instant('BTN.EDITAR');
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
          $location.path('plan_cuentas/editar_cuenta/'+self.padre.Codigo);
          }       
        },true);
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
                    field: 'Vigencia',
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    },
                    displayName: $translate.instant('VIGENCIA'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '8%'
                },
                /*{
                  field: 'DenominacionBanco',
                  displayName: $translate.instant('DENOMINACION'),
                  headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                  width: '20%'
                },*/
                {
                    field: 'Entidad.Nombre',
                    displayName: $translate.instant('ENTIDAD'),
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
                    field: 'FechaInicio',
                    displayName: $translate.instant('FECHA_INICIO'),
                    cellFilter: "date:'yyyy-MM-dd'",
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '10%'
                },
                {
                    field: 'FechaFin',
                    displayName: $translate.instant('FECHA_FIN'),
                    cellFilter: "date:'yyyy-MM-dd'",
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '9%'
                },
                {
                    field: 'CuentaContable',
                    displayName: $translate.instant('CUENTA_CONTABLE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '14%'
                },
                {
                    field: 'EstadoSaldo.Nombre',
                    displayName: $translate.instant('ESTADO'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '7%'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '7%'
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
         * @name financieraClienteApp.controller:saldosInicialesCtrl#cargar_calendarios_full
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @description
         * Carga todo el listado de calendarios creados hasta la fecha
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna los calendarios tributarios
         */
        self.cargar_calendarios_full = function() {
            financieraRequest.get('calendario_tributario', $.param({
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
         * @name financieraClienteApp.controller:saldosInicialesCtrl#cargar_calendarios_vigencia
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {var} vigencia Vigencia en la que se encuentran los calendarios a obtener
         * @description
         * Carga el listado de calendarios creados en una vigencia determinada
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna los calendarios tributarios
         */
        self.cargar_calendarios_vigencia = function(vigencia) {
            financieraRequest.get('calendario_tributario', $.param({
                limit: -1,
                query: 'Vigencia:' + vigencia
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
         * @name financieraClienteApp.controller:saldosInicialesCtrl#modo_editar
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {object} calendario caendario que se cargara en el formulario para ser editado
         * @description
         * Función para cargar el calendario a editar en el formulario, realizando una copia del mismo y
         * ajustando el formato de las fechas programadas del calendario
         */
        self.modo_editar = function(calendario) {
            self.nuevo_saldo = angular.copy(calendario);
            self.nuevo_saldo.FechaInicio = new Date(self.nuevo_saldo.FechaInicio);
            self.nuevo_saldo.FechaFin = new Date(self.nuevo_saldo.FechaFin);
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:saldosInicialesCtrl#crear_calendario
         * @methodOf financieraClienteApp.controller:saldosInicialesCtrl
         * @description
         * Comprueba si es un calendario a editar o a crear, si la accion es para crear consume el servicio POST de
         * {@link financieraService.service:financieraRequest financieraRequest}  y si es de actualizar el servicio PUT
         */
        self.crear_calendario = function() {
            if ($scope.editar === true) {
                financieraRequest.put('calendario_tributario', self.nuevo_saldo.Id, self.nuevo_saldo).then(function(response) {
                    console.log(response);
                    if (self.vigencia_saldos === null) {
                        self.cargar_calendarios_full();
                    } else {
                        self.cargar_calendarios_vigencia(self.vigencia_saldos);
                    }
                });
            } else {
                var nuevo = {
                    Vigencia: self.nuevo_saldo.Vigencia,
                    Entidad: { Id: 1 },
                    Descripcion: self.nuevo_saldo.Descripcion,
                    FechaInicio: self.nuevo_saldo.FechaInicio,
                    FechaFin: self.nuevo_saldo.FechaFin,
                    EstadoCalendario: { Id: 1 },
                    Responsable: 546546556
                };

                financieraRequest.post('calendario_tributario', nuevo).then(function(response) {
                    if (self.vigencia_saldos === null) {
                        self.cargar_calendarios_full();
                    } else {
                        self.cargar_calendarios_vigencia(self.vigencia_saldos);
                    }
                });
            }
        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:saldosInicialesCtrl#watch_on_vigencia
         * @eventOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {var} Vigencia vigencia del nuevo calendario
         * @description
         * Valida en base a la vigencia seleccionada el rango de la fecha inicio y la fecha fin
         */
        $scope.$watch('saldosIniciales.nuevo_saldo.Vigencia', function() {
            if (self.nuevo_saldo.FechaInicio !== undefined && self.nuevo_saldo.Vigencia !== self.nuevo_saldo.FechaInicio.getFullYear()) {
                console.log("reset fecha inicio");
                self.nuevo_saldo.FechaInicio = undefined;
                self.nuevo_saldo.FechaFin = undefined;
            }
            self.fechamin = new Date(
                self.nuevo_saldo.Vigencia,
                0, 1
            );
            self.fechamax = new Date(
                self.nuevo_saldo.Vigencia,
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
        $scope.$watch('saldosIniciales.nuevo_saldo.FechaInicio', function() {
            if (self.nuevo_saldo.FechaInicio >= self.nuevo_saldo.FechaFin || self.nuevo_saldo.FechaInicio === undefined || self.nuevo_saldo.Vigencia !== self.nuevo_saldo.FechaFin.getFullYear()) {
                self.nuevo_saldo.FechaFin = undefined;
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
                self.nuevo_saldo = {};
            }
        });

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:saldosInicialesCtrl#watch_on_vigencia_saldos
         * @eventOf financieraClienteApp.controller:saldosInicialesCtrl
         * @param {var} vigencia_saldos Vigencia seleccionada para la carga de calendarios
         * @description
         * Comprueba si la variable vigencia cambia para volver a cargar el grid con los datos correspondientes
         */
        $scope.$watch('saldosIniciales.vigencia_saldos', function() {
            if (self.vigencia_saldos === null) { //Si no existe vigencia realiza la carga de todos los calendarios
                self.cargar_calendarios_full();
            } else {
                self.cargar_calendarios_vigencia(self.vigencia_saldos);
            }
        }, true);
  });
