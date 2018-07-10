'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl
 * @description
 * # BancosSaldosInicialesCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('BancosSaldosInicialesCtrl', function ($scope, $translate, uiGridConstants, financieraRequest, $location, $route) {
        var self = this;
        self.nueva_fecha = {};
        self.cargando = false;
        self.hayData = true;
        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl#cargar_vigencia
         * @methodOf financieraClienteApp.controller:BancosSaldosInicialesCtrl
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
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
                },
                {
                    field: 'Mes',
                    displayName: $translate.instant('MES'),
                    width: '20%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
                    cellFilter: 'filtro_nombres_meses:row.entity'
                },
                {
                    field: 'CuentaContable.Codigo',
                    displayName: $translate.instant('CUENTA_CONTABLE'),
                    width: '20%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
                },
                {
                    field: 'CuentaContable.Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '30%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
                },
                {
                    field: 'Saldo',
                    displayName: $translate.instant('SALDO'),
                    cellClass: 'input_right',
                    cellFilter: 'currency',
                    width: '20%',
                    headerCellClass: 'encabezado',
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '5%',
                    visible: false
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
         * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl#cargar_saldos_full
         * @methodOf financieraClienteApp.controller:BancosSaldosInicialesCtrl
         * @description
         * Carga todo el listado de saldos creados hasta la fecha
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna los saldos tributarios
         */
        self.cargar_saldos_full = function() {

          self.gridOptions.data = [];
          self.cargando = true;
          self.hayData = true;

            financieraRequest.get('saldo_cuenta_contable', $.param({
                limit: -1
            })).then(function(response) {
                if (response.data === null) {
                    self.hayData = false;
                    self.cargando = false;
                    self.gridOptions.data = [];
                } else {
                  self.hayData = true;
                  self.cargando = false;
                  self.gridOptions.data = response.data;
                }
            });
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl#cargar_saldos_vigencia
         * @methodOf financieraClienteApp.controller:BancosSaldosInicialesCtrl
         * @param {var} vigencia Vigencia en la que se encuentran los saldos a obtener
         * @description
         * Carga el listado de saldos creados en una vigencia determinada
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest}
         * que retorna los saldos tributarios
         */
        self.cargar_saldos_vigencia = function(vigencia) {

          self.gridOptions.data = [];
          self.cargando = true;
          self.hayData = true;

            financieraRequest.get('saldo_cuenta_contable', $.param({
                limit: -1,
                query: 'Anio:' + vigencia
            })).then(function(response) {
                if (response.data === null) {
                  self.hayData = false;
                  self.cargando = false;
                  self.gridOptions.data = [];
                } else {
                  self.hayData = true;
                  self.cargando = false;
                  self.gridOptions.data = response.data;
                }
            });
        };

      /**
         * @ngdoc function
         * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl#crear_saldo
         * @methodOf financieraClienteApp.controller:BancosSaldosInicialesCtrl
         * @description
         * Redirecciona a la interfaz de creación
         * {@link financieraService.service:financieraRequest financieraRequest}  y si es de actualizar el servicio PUT
         */

        self.crear_saldo = function() {

          $location.path('/bancos/agregar_saldos_iniciales');
          $route.reload();

        };

      /**
         * @ngdoc event
         * @name financieraClienteApp.controller:BancosSaldosInicialesCtrl#watch_on_vigencia_saldos
         * @eventOf financieraClienteApp.controller:BancosSaldosInicialesCtrl
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
  }).filter('filtro_nombres_meses', function($filter, $translate) {
        return function(input, entity) {
            var output;
            if (undefined === input || null === input) {
                return "";
            }

            if (entity.Mes === 1) {
                output = $translate.instant('ENERO');
            }
            if (entity.Mes === 2) {
                output = $translate.instant('FEBRERO');
            }
            if (entity.Mes === 3) {
                output = $translate.instant('MARZO');
            }
            if (entity.Mes === 4) {
                output = $translate.instant('ABRIL');
            }
            if (entity.Mes === 5) {
                output = $translate.instant('MAYO');
            }
            if (entity.Mes === 6) {
                output = $translate.instant('JUNIO');
            }
            if (entity.Mes === 7) {
                output = $translate.instant('JULIO');
            }
            if (entity.Mes === 8) {
                output = $translate.instant('AGOSTO');
            }
            if (entity.Mes === 9) {
                output = $translate.instant('SEPTIEMBRE');
            }
            if (entity.Mes === 10) {
                output = $translate.instant('OCTUBRE');
            }
            if (entity.Mes === 11) {
                output = $translate.instant('NOVIEMBRE');
            }
            if (entity.Mes === 12) {
                output = $translate.instant('DICIEMBRE');
            }
            return output;
        };
});
