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
                    field: 'Codigo',
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

        ctrl.add_edit_practicas = function() {
            switch (ctrl.operacion) {
                case 'edit':
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'add':
                    ctrl.gridOptionsPracticas.data.push(ctrl.LegalizacionPracticaAcademica);
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

        ctrl.add_edit_compras = function() {
            switch (ctrl.operacion) {
                case 'edit':
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'add':
                    ctrl.gridOptionsPracticas.data.push(ctrl.LegalizacionPracticaAcademica);
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

        ctrl.add_edit = function() {
            var data = {};
            switch (ctrl.operacion) {
                case 'edit':
                    data = {
                        Id: ctrl.row_entity.Id,
                        CodigoAbreviacion: ctrl.row_entity.CodigoAbreviacion,
                        Nombre: ctrl.row_entity.Nombre,
                        Descripcion: ctrl.row_entity.Descripcion,
                        Activo: ctrl.row_entity.Activo,
                        EtapaAvance: ctrl.row_entity.EtapaAvance,
                        FechaRegistro: ctrl.row_entity.FechaRegistro
                    };
                    financieraRequest.put("requisito_avance", data.Id, data)
                        .then(function(info) {
                            console.log(info);
                            ctrl.get_all_avances();
                        });
                    break;
                case 'add':
                    data = {
                        CodigoAbreviacion: ctrl.row_entity.CodigoAbreviacion,
                        Nombre: ctrl.row_entity.Nombre,
                        Descripcion: ctrl.row_entity.Descripcion,
                        EtapaAvance: ctrl.row_entity.EtapaAvance
                    };
                    console.log(data);
                    financieraRequest.post("requisito_avance", data)
                        .then(function(info) {
                            console.log(info);
                            ctrl.get_all_avances();
                        });
                    break;
                case 'delete':
                    ctrl.delete_tipo();
                    break;
                default:
            }
            ctrl.row_entity = {};
            $("#myModal").modal('hide');
        };
    });