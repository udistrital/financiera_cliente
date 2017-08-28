'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:GestionCalendarioCtrl
 * @alias gestionCalendario
 * @requires $scope
 * @requires uiGridConstants
 * @requires $translate
 * @requires financieraService.service:financieraRequest
 * @param {injector} $translate translate para internacionalización
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {injector} $scope scope del controlador
 * @param {injector} uiGridConstants Constantes para control de funciones en el grid
 * @description
 * # GestionCalendarioCtrl
 * Controlador para la gestion de calendarios tributarios.
 */
angular.module('financieraClienteApp')
    .controller('GestionCalendarioCtrl', function($scope, $translate, uiGridConstants, financieraRequest) {
        var self = this;
        self.nuevo_calendario = {};

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#cargar_vigencia
         * @methodOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @description
         * Carga la vigencia en la que se situa la fecha y realiza un arreglo con 3 vigencias atras y una arriba
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna la vigencia calculada con la fecha del api
         */
        self.cargar_vigencia = function() {
            financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
                self.vigencia_calendarios = parseInt(response.data);
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
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
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
                    field: 'Responsable',
                    displayName: $translate.instant('RESPONSABLE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '14%'
                },
                {
                    field: 'EstadoCalendarioTributario.Nombre',
                    displayName: $translate.instant('ESTADO'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '7%'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '7%',
                    cellTemplate: '<center>' + '<a href="#/calendario_tributario/admin_calendario/{{row.entity.Id}}" class="ver">' +
                        '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
                        '<a href="" class="editar" ng-click="grid.appScope.gestionCalendario.modo_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
                        '</center>'
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
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#cargar_calendarios_full
         * @methodOf financieraClienteApp.controller:GestionCalendarioCtrl
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
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#cargar_calendarios_vigencia
         * @methodOf financieraClienteApp.controller:GestionCalendarioCtrl
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
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#modo_editar
         * @methodOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @param {object} calendario caendario que se cargara en el formulario para ser editado
         * @description
         * Función para cargar el calendario a editar en el formulario, realizando una copia del mismo y
         * ajustando el formato de las fechas programadas del calendario
         */
        self.modo_editar = function(calendario) {
            self.nuevo_calendario = angular.copy(calendario);
            self.nuevo_calendario.FechaInicio = new Date(self.nuevo_calendario.FechaInicio);
            self.nuevo_calendario.FechaFin = new Date(self.nuevo_calendario.FechaFin);
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#crear_calendario
         * @methodOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @description
         * Comprueba si es un calendario a editar o a crear, si la accion es para crear consume el servicio POST de
         * {@link financieraService.service:financieraRequest financieraRequest}  y si es de actualizar el servicio PUT
         */
        self.crear_calendario = function() {
            if ($scope.editar === true) {
                financieraRequest.put('calendario_tributario', self.nuevo_calendario.Id, self.nuevo_calendario).then(function(response) {
                    console.log(response);
                    if (self.vigencia_calendarios === null) {
                        self.cargar_calendarios_full();
                    } else {
                        self.cargar_calendarios_vigencia(self.vigencia_calendarios);
                    }
                });
            } else {
                var nuevo = {
                    Vigencia: self.nuevo_calendario.Vigencia,
                    Entidad: { Id: 1 },
                    Descripcion: self.nuevo_calendario.Descripcion,
                    FechaInicio: self.nuevo_calendario.FechaInicio,
                    FechaFin: self.nuevo_calendario.FechaFin,
                    EstadoCalendario: { Id: 1 },
                    Responsable: 546546556
                };

                financieraRequest.post('calendario_tributario', nuevo).then(function(response) {
                    if (self.vigencia_calendarios === null) {
                        self.cargar_calendarios_full();
                    } else {
                        self.cargar_calendarios_vigencia(self.vigencia_calendarios);
                    }
                });
            }
        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#watch_on_vigencia
         * @eventOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @param {var} Vigencia vigencia del nuevo calendario
         * @description
         * Valida en base a la vigencia seleccionada el rango de la fecha inicio y la fecha fin
         */
        $scope.$watch('gestionCalendario.nuevo_calendario.Vigencia', function() {
            if (self.nuevo_calendario.FechaInicio !== undefined && self.nuevo_calendario.Vigencia !== self.nuevo_calendario.FechaInicio.getFullYear()) {
                console.log("reset fecha inicio");
                self.nuevo_calendario.FechaInicio = undefined;
                self.nuevo_calendario.FechaFin = undefined;
            }
            self.fechamin = new Date(
                self.nuevo_calendario.Vigencia,
                0, 1
            );
            self.fechamax = new Date(
                self.nuevo_calendario.Vigencia,
                12, 0
            );
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#watch_on_fecha_inicio
         * @eventOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @param {date} FechaInicio fecha inicial del calendario
         * @description
         * Valida en base a la fecha inicial registrada el rango minimo de la fecha fin
         */
        $scope.$watch('gestionCalendario.nuevo_calendario.FechaInicio', function() {
            if (self.nuevo_calendario.FechaInicio >= self.nuevo_calendario.FechaFin || self.nuevo_calendario.FechaInicio === undefined || self.nuevo_calendario.Vigencia !== self.nuevo_calendario.FechaFin.getFullYear()) {
                self.nuevo_calendario.FechaFin = undefined;
            }
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#watch_on_editar
         * @eventOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @param {boolean} editar bandera para llenar el formulario con los datos de un calendario
         * @description
         * Observa si la variable editar es falsa limpia la variable utilizada en el formulario para crear un calendario
         */
        $scope.$watch('editar', function() {
            if ($scope.editar === false) {
                self.nuevo_calendario = {};
            }
        });

        /**
         * @ngdoc event
         * @name financieraClienteApp.controller:GestionCalendarioCtrl#watch_on_vigencia_calendarios
         * @eventOf financieraClienteApp.controller:GestionCalendarioCtrl
         * @param {var} vigencia_calendarios Vigencia seleccionada para la carga de calendarios
         * @description
         * Comprueba si la variable vigencia cambia para volver a cargar el grid con los datos correspondientes
         */
        $scope.$watch('gestionCalendario.vigencia_calendarios', function() {
            if (self.vigencia_calendarios === null) { //Si no existe vigencia realiza la carga de todos los calendarios
                self.cargar_calendarios_full();
            } else {
                self.cargar_calendarios_vigencia(self.vigencia_calendarios);
            }
        }, true);
    });
