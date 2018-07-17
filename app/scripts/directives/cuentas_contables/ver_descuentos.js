'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verDescuentos
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires $scope
 * @param {object} seldesc descuento seleccionado
 * @param {boolean} noheader bandera para poner o quitar el panel head
 * @param {object} cuentasel cuenta seleccionada asociada al decuento
 * @description
 * # verDescuentos
 * Directiva en la cual se muestra la estructura de cuentas de cualquier plan de cuentas que sea pasado por el scope de la misma
 */

angular.module('financieraClienteApp')
    .directive('verDescuentos', function(financieraRequest, administrativaRequest, $translate) {
        return {
            restrict: 'E',
            //variables del scope de la directiva
            scope: {
                seldesc: '=?',
                cuentasel: '=?',
                noheader: '=?'
            },
            templateUrl: 'views/directives/cuentas_contables/ver_descuentos.html',
            controller: function($scope, $attrs) {
                $scope.vhead = 'noheader' in $attrs;
                var self = this;

                //grid que muestra los descuentos e impuestos
                self.gridOptions = {
                    paginationPageSizes: [5, 10, 15],
                    paginationPageSize: 5,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    enableFiltering: true,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    useExternalPagination: false,
                    enableSelectAll: false,
                    columnDefs: [{
                            field: 'Id',
                            displayName: $translate.instant('ID'),
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                            width: '7%'
                        },
                        {
                            field: 'Descripcion',
                            displayName: $translate.instant('DESCRIPCION'),
                            width: '35%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        },
                        {
                            field: 'TarifaUvt',
                            displayName: $translate.instant('UVT'),
                            width: '5%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        },
                        {
                            field: 'Porcentaje',
                            displayName: $translate.instant('PORCENTAJE'),
                            width: '7%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        },
                        {
                            field: 'Deducible',
                            displayName: $translate.instant('DEDUCIBLE'),
                            cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.Deducible" disabled></center>',
                            width: '8%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        },
                        {
                            field: 'CuentaContable.Codigo',
                            displayName: $translate.instant('CODIGO_CUENTA'),
                            width: '13%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        },
                        {
                            field: 'proveedor.NomProveedor',
                            displayName: $translate.instant('PROVEEDOR'),
                            width: '17%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        },
                        {
                            field: 'TipoCuentaEspecial.Nombre',
                            displayName: $translate.instant('TIPO'),
                            width: '8%',
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                        }
                    ]
                };

                //opciones para el control del grid
                self.gridOptions.multiSelect = false;
                self.gridOptions.modifierKeysToMultiSelect = false;
                self.gridOptions.enablePaginationControls = true;
                self.gridOptions.onRegisterApi = function(gridApi) {
                    self.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function() {
                        $scope.seldesc = self.gridApi.selection.getSelectedRows()[0];
                        if ('cuentasel' in $attrs) {
                            financieraRequest.get('cuenta_contable', $.param({
                                query: 'Codigo:' + $scope.seldesc.CuentaContable.Codigo
                            })).then(function(response) {
                                $scope.cuentasel = response.data[0];
                            });
                        }
                    });
                };

                /**
                 * @ngdoc function
                 * @name financieraClienteApp.directive:verDescuentos#cargar
                 * @methodOf financieraClienteApp.directive:verDescuentos
                 * @description carga en el grid el listado de impuestos y descuentos
                 */
                self.cargar = function() {
                    financieraRequest.get("cuenta_especial", $.param({
                        limit: -1
                    })).then(function(response) {
                        self.gridOptions.data = response.data;
                        angular.forEach(self.gridOptions.data, function(value) {
                            administrativaRequest.get("informacion_proveedor", $.param({
                                query: "Id:" + value.InformacionPersonaJuridica,
                                fields: "Id,Tipopersona,NumDocumento,NomProveedor"
                            })).then(function(response) {
                                value.proveedor = response.data[0];
                            });
                        });
                    });
                };

                self.cargar();

            },
            controllerAs: 'd_verDescuentos'
        };
    });
