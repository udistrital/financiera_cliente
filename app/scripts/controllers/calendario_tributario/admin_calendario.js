'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:AdminCalendarioCtrl
 * @alias adminCalendario
 * @requires $scope
 * @requires $routeParams
 * @requires uiGridConstants
 * @requires $translate
 * @requires financieraService.service:financieraRequest
 * @param {injector} $translate translate para internacionalización
 * @param {injector} $routeParams control para parametros del router
 * @param {service} financieraRequest servicio de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {injector} $scope scope del controlador
 * @param {injector} uiGridConstants Constantes para control de funciones en el grid
 * @description
 * # AdminCalendarioCtrl
 * Controlador en el que se genera el calendario tributario.
 */
angular.module('financieraClienteApp')
    .controller('AdminCalendarioCtrl', function($scope, $translate, $routeParams, uiGridConstants, financieraRequest) {
        var self = this;
        self.idCalendario = $routeParams.Id; //Captura valor proveniente del url

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:AdminCalendarioCtrl#cargar_calendario
         * @methodOf financieraClienteApp.controller:AdminCalendarioCtrl
         * @description
         * Carga el calendario tributario con el id pasado por url
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest} 
         * que retorna la información del calendario tributario
         */
        self.cargar_calendario = function() {
            financieraRequest.get('calendario_tributario', $.param({
                query: 'Id:' + self.idCalendario
            })).then(function(response) {
                self.calendario = response.data[0];
            });
        };

        self.cargar_calendario();

        self.expandableRowTemplate = '<div ui-grid="row.entity.subGridOptions"  ui-grid-auto-resize></div>'; //Se construye template para crear subgrids

        //parametros para el ui-grid
        self.gridOptions = {
            expandableRowTemplate: self.expandableRowTemplate,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            paginationPageSizes: [5, 10, 15, 20, 50],
            paginationPageSize: 5,
            enableFiltering: true
        };
        self.gridOptions.columnDefs = [{
                displayName: $translate.instant('CODIGO'),
                field: 'Impuesto.CuentaContable.Codigo',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellClass: 'text-success',
                width: '20%'
            },
            {
                displayName: $translate.instant('NOMBRE'),
                field: 'Impuesto.CuentaContable.Nombre',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellClass: 'text-success',
                width: '35%'
            },
            {
                displayName: $translate.instant('PROVEEDOR'),
                field: 'Impuesto.InformacionPersonaJuridica',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellClass: 'text-success',
                width: '43%'
            }
        ];

        /**
         * @ngdoc function
         * @name financieraClienteApp.controller:AdminCalendarioCtrl#cargar_movimientos
         * @methodOf financieraClienteApp.controller:AdminCalendarioCtrl
         * @description
         * Carga los movimientos afectados de transacciones giradas filtrado unicamente los que son impuestos
         * se consume el servicio {@link financieraService.service:financieraRequest financieraRequest} 
         * que retorna los impuestos afectados en las fechas del calendario con sus respectivos movimientos y los agrega al ui-grid
         * tambien realiza el calculo del valor del calendario y de cada uno de los impuestos 
         */
        self.cargar_movimientos = function() {
            financieraRequest.get('calendario_tributario/movimientos/' + self.idCalendario, "").then(function(response) {
                self.calendario_movimientos = response.data;
                self.gridOptions.data = self.calendario_movimientos;
                console.log(response.data);
                self.calendario.MontoCalendario = 0;
                angular.forEach(self.gridOptions.data, function(item) { //Construye un ui-grid para los movimientos realizados en cada uno de los impuestos 
                    item.subGridOptions = {
                        enableHorizontalScrollbar: 0,
                        enableVerticalScrollbar: 0,
                        showColumnFooter: true,
                        enablePaginationControls: false,
                        columnDefs: [{
                            displayName: $translate.instant('TIPO'),
                            field: "TipoDocumentoAfectante.Nombre",
                            width: '15%'
                        }, {
                            displayName: $translate.instant('NO'),
                            field: "CodigoDocumentoAfectante",
                            cellClass: "text-center",
                            cellTemplate: "<div><a href='#/orden_pago/planta/ver/{{row.entity.CodigoDocumentoAfectante}}'  target='_blank'>{{row.entity.CodigoDocumentoAfectante}}</a></div>",
                            width: '7%'
                        }, {
                            displayName: $translate.instant('FECHA'),
                            field: "Fecha",
                            cellFilter: "date:'yyyy-MM-dd'",
                            width: '10%'
                        }, {
                            displayName: $translate.instant('TERCERO'),
                            field: "tercero",
                            width: '36%'
                        }, {
                            displayName: $translate.instant('DEBITO'),
                            field: "Debito",
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            width: '15%'
                        }, {
                            displayName: $translate.instant('CREDITO'),
                            field: "Credito",
                            aggregationType: uiGridConstants.aggregationTypes.sum, //funcion del ui-grid para calcular la suma de la columna y mostrarla
                            width: '15%'
                        }],
                        data: item.Movimientos
                    };
                    item.MontoCuenta = 0; //monto de cada impuesto por separado
                    angular.forEach(item.Movimientos, function(movs) {
                        console.log("entro credito=", movs.Debito);
                        item.MontoCuenta += movs.Credito - movs.Debito;
                    });
                    self.calendario.MontoCalendario += item.MontoCuenta;
                });
                self.calendario.MontoRedondeado = Math.round(self.calendario.MontoCalendario);
                self.calendario.DiferenciaMonto = self.calendario.MontoCalendario - self.calendario.MontoRedondeado;
            });
        };
        self.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
        };

        self.cargar_movimientos();
    });