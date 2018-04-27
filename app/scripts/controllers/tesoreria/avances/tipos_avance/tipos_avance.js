'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TiposAvanceCtrl
 * @description
 * # TiposAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('TiposAvanceCtrl', function($scope, financieraRequest, $translate) {
        var ctrl = this;
        ctrl.requisitos_tipo = {};
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.tipo_avance = {};
        ctrl.requisito_select = [];
        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
            { clase_color: "configuracion", clase_css: "fa fa-cog fa-lg faa-spin animated-hover", titulo: $translate.instant('BTN.CONFIGURAR'), operacion: 'config', estado: true },
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true }
        ];

        ctrl.grid_option_requisito = {

            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'IdTipo',
                    visible: false
                },
                {
                    field: 'RequisitoAvance.CodigoAbreviacion',
                    displayName: $translate.instant('CODIGO_ABREVIACION'),
                    width: '10%',
                }, {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    cellTemplate: '<div align="left">{{row.entity.RequisitoAvance.Nombre}}</div>',
                    width: '20%',
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    cellTemplate: '<div align="left">{{row.entity.RequisitoAvance.Descripcion}}</div>',
                    width: '50%',
                },
                {
                    field: 'Estado',
                    displayName: $translate.instant('ESTADO'),
                    cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.RequisitoAvance.Activo" class="blue"></md-checkbox></div>',
                    width: '10%',
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '10%',
                }
            ]
        };

        ctrl.gridOptions = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'IdTipo',
                    visible: false
                },
                {
                    field: 'CodigoAbreviacion',
                    displayName: $translate.instant('CODIGO_ABREVIACION'),
                    width: '10%',
                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '15%',
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    width: '45%',
                },
                {
                    field: 'Activo',
                    displayName: $translate.instant('ACTIVO'),
                    cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
                    width: '10%',
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '12%',
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',

                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ]
        };
        ctrl.gridOptions.enablePaginationControls = true;
        ctrl.gridOptions.multiSelect = false;
        ctrl.get_all_avances = function() {
            financieraRequest.get("tipo_avance", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.gridOptions.data = response.data;
                });
        };

        ctrl.gridOptions.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {});
        };

        ctrl.get_requisito_tipo_avance = function(id) {
            financieraRequest.get("requisito_tipo_avance", $.param({
                    query: "TipoAvance.Id:" + id,
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.grid_option_requisito.data = response.data;
                });
        };

        ctrl.update_config = function() {
            financieraRequest.get("requisito_avance", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.requisito_select = [];
                    ctrl.requisito_avance = response.data;
                    financieraRequest.get("requisito_tipo_avance", $.param({
                            query: "TipoAvance.Id:" + ctrl.row_entity.Id,
                            limit: -1,
                            sortby: "Id",
                            order: "asc"
                        }))
                        .then(function(response) {
                            ctrl.grid_option_requisito.data = response.data;
                            console.log(ctrl.grid_option_requisito);
                            ctrl.requisito_tipo_avance = response.data;
                            angular.forEach(ctrl.requisito_avance, function(ra) {
                                var distint = 0;
                                angular.forEach(ctrl.requisito_tipo_avance, function(rta) {
                                    if (rta.RequisitoAvance.Id === ra.Id) {
                                        distint++;
                                    }
                                });
                                if (distint === 0) {
                                    ctrl.requisito_select.push(ra);
                                }
                            });
                        });
                });
        };
        ctrl.get_all_avances();

        ctrl.anadir_requisito = function() {
            var data = {
                TipoAvance: {
                    Id: parseInt(ctrl.row_entity.Id)
                },
                RequisitoAvance: {
                    Id: parseInt(ctrl.requisito)
                }
            };
            console.log(data);
            financieraRequest.post("requisito_tipo_avance", data)
                .then(function(info) {
                    console.log(info);
                    ctrl.update_config();
                });
        };

        ctrl.eliminar_requisito = function(id) {
            financieraRequest.delete("requisito_tipo_avance", id)
                .then(function(info) {
                    console.log(info);
                    ctrl.update_config();
                });
        };

        $scope.loadrow = function(row, operacion) {
            ctrl.operacion = operacion;
            switch (operacion) {
                case "ver":
                    ctrl.row_entity = row.entity;
                    console.log(ctrl.row_entity);
                    ctrl.get_requisito_tipo_avance(ctrl.row_entity.Id);
                    $('#modalVer').modal('show');
                    break;
                case "add":
                    ctrl.tipo_avance.CodigoAbreviacion = "";
                    ctrl.tipo_avance.Nombre = "";
                    ctrl.tipo_avance.Descripcion = "";
                    $('#myModal').modal('show');
                    break;
                case "edit":
                    ctrl.row_entity = row.entity;
                    ctrl.tipo_avance.CodigoAbreviacion = ctrl.row_entity.CodigoAbreviacion;
                    ctrl.tipo_avance.Nombre = ctrl.row_entity.Nombre;
                    ctrl.tipo_avance.Descripcion = ctrl.row_entity.Descripcion;
                    ctrl.tipo_avance.Activo = ctrl.row_entity.Activo;
                    ctrl.tipo_avance.FechaRegistro = ctrl.row_entity.FechaRegistro;
                    console.log(ctrl.tipo_avance);
                    $('#myModal').modal('show');
                    break;
                case "delete":
                    ctrl.row_entity = row.entity;
                    ctrl.delete_tipo();
                    break;
                case "config":
                    ctrl.row_entity = row.entity;
                    ctrl.update_config();
                    $('#modalConf').modal('show');
                    break;
                default:
            }
        };

        ctrl.delete_tipo = function() {
            swal({
                title: 'Está seguro ?',
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.CodigoAbreviacion,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR')
            }).then(function() {
                financieraRequest.delete("tipo_avance", ctrl.row_entity.Id)
                    .then(function(response) {
                        if (response.status === 200) {
                            swal(
                                $translate.instant('ELIMINADO'),
                                ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ELIMINADO'),
                                'success'
                            );
                            ctrl.get_all_avances();
                        }
                    });
            });
        };

        ctrl.add_edit = function() {
            var data = {};
            switch (ctrl.operacion) {
                case 'edit':
                    data = {
                        Id: ctrl.row_entity.Id,
                        CodigoAbreviacion: ctrl.tipo_avance.CodigoAbreviacion,
                        Nombre: ctrl.tipo_avance.Nombre,
                        Descripcion: ctrl.tipo_avance.Descripcion,
                        Activo: ctrl.tipo_avance.Activo,
                        FechaRegistro: ctrl.tipo_avance.FechaRegistro,
                    };
                    console.log(data);
                    financieraRequest.put("tipo_avance", data.Id, data)
                        .then(function(response) {
                            if (response.status === 200) {
                                swal(
                                    $translate.instant('ACTUALIZADO'),
                                    ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                                    'success'
                                );
                                ctrl.get_all_avances();
                            }
                        });
                    break;
                case 'add':
                    data = {
                        CodigoAbreviacion: ctrl.tipo_avance.CodigoAbreviacion,
                        Nombre: ctrl.tipo_avance.Nombre,
                        Descripcion: ctrl.tipo_avance.Descripcion,
                        Activo: true
                    };
                    financieraRequest.post("tipo_avance", data)
                        .then(function(info) {
                            console.log(info);
                            ctrl.get_all_avances();
                        });
                    break;
                default:
            }
            ctrl.tipo_avance = {};
            $("#myModal").modal('hide');
        };
    });