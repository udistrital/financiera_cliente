'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpViewAllCtrl
 * @description
 * # OrdenPagoOpViewAllCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('OrdenPagoOpViewAllCtrl', function($scope, financieraRequest, $localStorage, agoraRequest, $location, $translate, uiGridConstants, $window) {

        var ctrl = this;
        $scope.estados = [];
        $scope.estado_select = [];
        $scope.aristas = [];
        $scope.estadoclick = {};
        $scope.senDataEstado = {};
        $scope.senDataEstado.Usuario = {
            'Id': 1
        }

        ctrl.gridOrdenesDePago = {
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            multiSelect: true,
            enableRowHeaderSelection: true,
            showColumnFooter: true,
            paginationPageSizes: [10, 50, 100],
            paginationPageSize: null,

            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            minRowsToShow: 10,
            useExternalPagination: false,

            onRegisterApi: function(gridApi) {
                ctrl.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    $scope.estado = row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago;
                });
            }

        };

        $scope.funcion = function() {
            $scope.estadoclick = $localStorage.nodeclick;
            var data = ctrl.gridApi.selection.getSelectedRows();
            var numero = data.length;
            if (numero > 0) {
                $scope.senDataEstado.OrdenPago = data;
                $scope.senDataEstado.NuevoEstado = $localStorage.nodeclick;
                financieraRequest.post("orden_pago_estado_orden_pago/WorkFlowOrdenPago", $scope.senDataEstado)
                    .then(function(data) {
                        $scope.resultado = data;
                        swal({
                            title: 'Orden de Pago',
                            text: $translate.instant($scope.resultado.data.Code),
                            type: $scope.resultado.data.Type,
                        }).then(function() {
                            $window.location.reload();
                            //$window.location.href = '#/orden_pago/ver_todos';
                        })
                    })
            } else {
                swal(
                    '',
                    'Debe seleccionar almenos una orden de pago',
                    'warning'
                );
            }
        };

        $scope.$watch('estado_select', function() {
            ctrl.gridOrdenesDePago.columnDefs = [{
                    field: 'Id',
                    visible: false
                },
                {
                    field: 'Consecutivo',
                    displayName: $translate.instant('CODIGO'),
                    width: '7%',
                    cellClass: 'input_center'
                },
                {
                    field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
                    width: '8%',
                    displayName: $translate.instant('TIPO'),
                    filter: {
                        //term: 'OP-PROV',
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{
                            value: 'OP-PROV',
                            label: 'OP-PROV'
                        }, {
                            value: 'OP-PLAN',
                            label: 'OP-PLAN'
                        }]
                    }
                },
                {
                    field: 'Vigencia',
                    displayName: $translate.instant('VIGENCIA'),
                    width: '7%',
                    cellClass: 'input_center'
                },
                {
                    field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
                    displayName: $translate.instant('FECHA_CREACION'),
                    cellClass: 'input_center',
                    cellFilter: "date:'yyyy-MM-dd'",
                    width: '8%',
                },
                {
                    field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
                    displayName: $translate.instant('NO_CRP'),
                    width: '7%',
                    cellClass: 'input_center'
                },
                {
                    field: 'FormaPago.CodigoAbreviacion',
                    width: '5%',
                    displayName: $translate.instant('FORMA_PAGO')
                },
                {
                    field: 'Proveedor.Tipopersona',
                    width: '10%',
                    displayName: $translate.instant('TIPO_PERSONA')
                },
                {
                    field: 'Proveedor.NomProveedor',
                    displayName: $translate.instant('NOMBRE')
                },
                {
                    field: 'Proveedor.NumDocumento',
                    width: '10%',
                    cellClass: 'input_center',
                    displayName: $translate.instant('NO_DOCUMENTO')
                },
                {
                    field: 'ValorBase',
                    width: '10%',
                    cellFilter: 'currency',
                    cellClass: 'input_right',
                    displayName: $translate.instant('VALOR')
                },
                {
                    field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
                    width: '7%',
                    displayName: $translate.instant('ESTADO'),
                    filter: {
                        term: 'Elaborado',
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.estado_select

                    }
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPERACION'),
                    enableFiltering: false,
                    width: '5%',
                    cellTemplate: '<center>' +
                        '<a class="ver" ng-click="grid.appScope.opViewAll.op_detalle(row)">' +
                        '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
                        '<a class="editar" ng-click="grid.appScope.d_opListarTodas.op_editar(row);" data-toggle="modal" data-target="#myModal">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
                        '</center>'
                }
            ];
        });

        // OP Proveedores
        ctrl.op_detalle = function(row) {
            if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'SEGURIDAD SOCIAL') {
                var path = "/orden_pago/seguridad_social/ver/";
                $location.url(path + row.entity.Id);
            }
            if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'OP-PROV') {
                var path = "/orden_pago/proveedor/ver/";
                $location.url(path + row.entity.Id);
            }
            if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'OP-PLAN') {
                var path = "/orden_pago/planta/ver/";
                $location.url(path + row.entity.Id);
            }
        }
        ctrl.op_editar = function(row) {
                if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'OP-PROV') {
                    var path_update = "/orden_pago/proveedor/actualizar/";
                    $location.url(path_update + row.entity.Id);
                }
            }
            // data OP
        financieraRequest.get('orden_pago', 'limit=-1').then(function(response) {
            ctrl.gridOrdenesDePago.data = response.data;
            // data proveedor
            angular.forEach(ctrl.gridOrdenesDePago.data, function(iterador) {
                agoraRequest.get('informacion_proveedor',
                    $.param({
                        query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
                    })
                ).then(function(response) {
                    iterador.Proveedor = response.data[0];
                });
            });
            // data proveedor
        });




        financieraRequest.get("estado_orden_pago", $.param({
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {
                $scope.estados = [];
                $scope.aristas = [];
                ctrl.estados = response.data;
                angular.forEach(ctrl.estados, function(estado) {
                    $scope.estados.push({
                        id: estado.Id,
                        label: estado.Nombre
                    });
                    $scope.estado_select.push({
                        value: estado.Nombre,
                        label: estado.Nombre,
                        estado: estado
                    });
                });
                $scope.aristas = [{
                        from: 1,
                        to: 2
                    },
                    {
                        from: 1,
                        to: 3
                    },
                    {
                        from: 2,
                        to: 4
                    },
                    {
                        from: 2,
                        to: 5
                    },
                    {
                        from: 4,
                        to: 6
                    },
                    {
                        from: 6,
                        to: 7
                    }
                ];
            });
    });