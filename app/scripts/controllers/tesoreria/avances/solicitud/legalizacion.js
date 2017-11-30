'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesLegalizacionCtrl
 * @description
 * # TesoreriaAvancesLegalizacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('LegalizacionCtrl', function($scope, financieraRequest, $translate, $localStorage, wso2Request) {
        var ctrl = this;
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.row_entity = {};
        $scope.encontrado = false;
        $scope.solicitud = $localStorage.avance;
        $scope.botones = [
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true }
        ];
        $scope.clase_load = {
            clase: "fa fa-spinner",
            animacion: "faa-spin animated"
        };
        ctrl.gridOptionsCompras = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'Id',
                    visible: false
                },
                {
                    field: 'FechaCompra',
                    displayName: $translate.instant('CODIGO_ABREVIACION'),
                    width: '10%',
                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '20%',
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    width: '37%',
                },
                {
                    field: 'Activo',
                    displayName: $translate.instant('ACTIVO'),
                    cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
                    width: '6%',
                },
                {
                    field: 'Etapa.Nombre',
                    displayName: $translate.instant('ETAPA'),
                    cellTemplate: '<div align="center">{{row.entity.EtapaAvance.Nombre}}</div>',
                    width: '9%',
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA_REGISTRO'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '10%',
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrowcompras(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ]
        };

        ctrl.gridOptionsPracticas = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'Id',
                    visible: false
                },
                {
                    field: 'Tercero',
                    displayName: $translate.instant('CODIGO'),
                    width: '12%',
                },
                {
                    field: 'Estudiante.numero_documento',
                    displayName: $translate.instant('DOCUMENTO'),
                    width: '12%',
                },
                {
                    field: 'Estudiante.nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '40%',
                },
                {
                    field: 'Valor',
                    displayName: $translate.instant('VALOR'),
                    cellFilter: 'currency',
                    width: '12%',
                },
                {
                    field: 'Dias',
                    displayName: $translate.instant('Dias'),
                    width: '12%',
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrowpracticas(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ]
        };

        $scope.loadrowpracticas = function(row, operacion) {
            ctrl.row_entity = row.entity;
            ctrl.operacion = operacion;
            switch (operacion) {
                case "add":
                    ctrl.limpiar_practica();
                    $('#modal_practicas_academicas').modal('show');
                    break;
                case "edit":
                    console.log(ctrl.row_entity);
                    ctrl.LegalizacionPracticaAcademica = ctrl.row_entity;
                    $('#modal_practicas_academicas').modal('show');
                    break;
                case "delete":
                    ctrl.delete_requisito();
                    break;
            }
        };

        $scope.loadrowcompras = function(row, operacion) {
            ctrl.row_entity = row.entity;
            ctrl.operacion = operacion;
            switch (operacion) {
                case "add":
                    $('#modal_legalizacion_compras').modal('show');
                    break;
                case "edit":
                    console.log(ctrl.row_entity);
                    ctrl.LegalizacionPracticaAcademica = ctrl.row_entity;
                    $('#modal_legalizacion_compras').modal('show');
                    break;
                case "delete":
                    ctrl.delete_requisito();
                    break;
            }
        };

        ctrl.limpiar_practica = function() {
            ctrl.LegalizacionPracticaAcademica = null;
        };

        ctrl.cargar_estudiante = function() {
            $scope.encontrado = false;
            ctrl.LegalizacionPracticaAcademica.Estudiante = null;
            if (ctrl.LegalizacionPracticaAcademica.Tercero.length === 11) {
                $scope.estudiante_cargado = true;
                var parametros = [{
                    name: "Información básica",
                    value: "info_basica"
                }, {
                    name: "codigo estudiante",
                    value: ctrl.LegalizacionPracticaAcademica.Tercero
                }];
                wso2Request.get("bienestarProxy", parametros).then(function(response) {
                    $scope.estudiante_cargado = false;
                    if (!angular.isUndefined(response.data.datosCollection.datos)) {
                        console.log(response.data.datosCollection.datos[0]);
                        ctrl.LegalizacionPracticaAcademica.Estudiante = response.data.datosCollection.datos[0];
                    } else {
                        $scope.encontrado = "true";
                    }
                });
            }
        };

        ctrl.cargar_proveedor = function() {
            $scope.encontrado = false;
            ctrl.LegalizacionPracticaAcademica.Estudiante = null;
            if (ctrl.LegalizacionPracticaAcademica.Codigo.length === 11) {
                $scope.estudiante_cargado = true;
                var parametros = [{
                    name: "Información básica",
                    value: "info_basica"
                }, {
                    name: "codigo",
                    value: ctrl.LegalizacionPracticaAcademica.Codigo
                }];
                wso2Request.get("bienestarProxy", parametros).then(function(response) {
                    $scope.estudiante_cargado = false;
                    if (!angular.isUndefined(response.data.datosCollection.datos)) {
                        console.log(response.data.datosCollection.datos[0]);
                        ctrl.LegalizacionPracticaAcademica.Estudiante = response.data.datosCollection.datos[0];
                    } else {
                        $scope.encontrado = "true";
                    }
                });
            }
        };
        ctrl.delete_compra = function() {
            swal({
                title: 'Está seguro ?',
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.CodigoAbreviacion,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR')
            }).then(function() {
                financieraRequest.delete("requisito_avance", ctrl.row_entity.Id)
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
            })
        };

        ctrl.delete_requisito = function() {
            swal({
                title: 'Está seguro ?',
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.Estudiante.nombre,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR')
            }).then(function() {
                financieraRequest.delete("avance_legalizacion", ctrl.row_entity.Id)
                    .then(function(response) {
                        if (response.status === 200) {
                            swal(
                                $translate.instant('ELIMINADO'),
                                ctrl.row_entity.Estudiante.nombre + ' ' + $translate.instant('FUE_ELIMINADO'),
                                'success'
                            );
                            ctrl.get_all_avances();
                        }
                    });
            })
        };

        ctrl.get_all_avance_legalizacion_practica = function() {
            financieraRequest.get("avance_legalizacion", $.param({
                    query: "avance.Id:" + $scope.solicitud.Id + ",TipoAvanceLegalizacion.Id:1",
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.gridOptionsPracticas.data = response.data;
                    console.log(ctrl.gridOptionsPracticas.data);
                    angular.forEach(ctrl.gridOptionsPracticas.data, function(estudiante) {
                        var parametros = [{
                            name: "Información básica",
                            value: "info_basica"
                        }, {
                            name: "codigo",
                            value: estudiante.Tercero
                        }];
                        wso2Request.get("bienestarProxy", parametros).then(function(response) {
                            $scope.estudiante_cargado = false;
                            if (!angular.isUndefined(response.data.datosCollection.datos)) {
                                estudiante.Estudiante = response.data.datosCollection.datos[0];
                            }
                        });
                    });
                });
        };

        ctrl.get_all_avance_legalizacion_practica();

        ctrl.get_all_avance_legalizacion_compra = function() {
            financieraRequest.get("avance_legalizacion", $.param({
                    query: "avance.Id:" + $scope.solicitud.Id + ",TipoAvanceLegalizacion.Id:2",
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.gridOptionsCompras = response.data;
                });
        };

        ctrl.add_edit_compras = function() {
            switch (ctrl.operacion) {
                case 'edit':
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'add':
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'delete':
                    ctrl.delete_tipo();
                    break;
                default:
            }
            ctrl.row_entity = {};
            $("#myModal").modal('hide');
        };

        ctrl.add_edit_practicas = function() {
            ctrl.LegalizacionPracticaAcademica.TipoAvanceLegalizacion = { Id: 1 };
            ctrl.LegalizacionPracticaAcademica.Avance = { Id: $scope.solicitud.Id };
            ctrl.LegalizacionPracticaAcademica.Valor = parseFloat(ctrl.LegalizacionPracticaAcademica.Valor);
            ctrl.LegalizacionPracticaAcademica.Dias = parseInt(ctrl.LegalizacionPracticaAcademica.Dias);
            switch (ctrl.operacion) {
                case 'edit':
                    financieraRequest.put("avance_legalizacion", ctrl.LegalizacionPracticaAcademica.Id, ctrl.LegalizacionPracticaAcademica)
                        .then(function(info) {
                            console.log(info);
                            ctrl.get_all_avance_legalizacion_practica();
                        });
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'add':
                    financieraRequest.post("avance_legalizacion", ctrl.LegalizacionPracticaAcademica)
                        .then(function(info) {
                            console.log(info);
                            ctrl.get_all_avance_legalizacion_practica();
                        });
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'delete':
                    ctrl.delete_tipo();
                    break;
                default:
            }
            ctrl.row_entity = {};
        };

    });