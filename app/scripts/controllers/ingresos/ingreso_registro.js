'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('IngresosIngresoRegistroCtrl', function($scope, financieraRequest, wso2Request, oikosRequest, $translate, $filter) {
        var ctrl = this;
        //prueba de codigos de facultad
        $scope.load = true;
        ctrl.filtro_ingresos = "Ingresos";
        $scope.datos = false;
        ctrl.homologacion_facultad = [{
            old: 33,
            new: 14
        }, {
            old: 23,
            new: 17
        }, {
            old: 23,
            new: 35
        }, {
            old: 23,
            new: 65
        }, {
            old: 23,
            new: 66
        }];

        ctrl.cargandoDatosPagos = false;
        ctrl.concepto = [];
        ctrl.gridOptions = {
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 1,
            paginationPageSizes: [10, 20, 30],
            paginationPageSize: 10,
            useExternalPagination: false,
            enableFiltering: true,
            rowHeight: 45
        };



        ctrl.ingreso = {};

        ctrl.cargarTiposIngreso = function() {
            financieraRequest.get('forma_ingreso', $.param({
                limit: -1
            })).then(function(response) {
                ctrl.tiposIngreso = response.data;
            });
        };

        ctrl.cargarTiposIngreso();

        ctrl.cargarUnidadesEjecutoras = function() {
            financieraRequest.get('unidad_ejecutora', $.param({
                limit: -1
            })).then(function(response) {
                ctrl.unidadesejecutoras = response.data;
            });
        };

        ctrl.cargar_facultades = function() {
            oikosRequest.get('dependencia', $.param({
                query: "DependenciaTipoDependencia.TipoDependenciaId.Id:2",
                fields: "Nombre,Id",
                limit: -1
            })).then(function(response) {
                ctrl.codigo_facultad = response.data;
            });
        };

        ctrl.cargar_facultades();
        ctrl.cargarUnidadesEjecutoras();

        ctrl.registrarIngreso = function() {
            if (ctrl.unidadejecutora == null) {
                swal("", "Debe seleccionar la unidad ejecutora", "error");
            } else if (ctrl.concepto == null) {
                swal("", "Debe seleccionar el concepto que afecta este ingreso", "error");
            } else {
                ctrl.ingreso = {
                    Ingreso: {
                        FormaIngreso: ctrl.tipoIngresoSelec,
                        FechaConsignacion: ctrl.fechaConsignacion,
                        Observaciones: ctrl.observaciones,
                        UnidadEjecutora: ctrl.unidadejecutora
                    },
                    IngresoBanco: ctrl.totalIngresos,
                    Concepto: ctrl.concepto[0]
                };

                angular.forEach(ctrl.movs, function(data) {
                    delete data.Id;
                });
                ctrl.ingreso.Movimientos = ctrl.movs;
                console.log(ctrl.ingreso);
                financieraRequest.post('ingreso/CreateIngresos', ctrl.ingreso).then(function(response) {
                    if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                        } else {
                            swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type);
                        }

                    }
                }).finally(function() {
                    // ctrl.pagos = undefined;
                    // ctrl.tipoIngresoSelec = undefined;
                    // ctrl.observaciones = undefined;
                    // ctrl.unidadejecutora = undefined;
                    // ctrl.concepto = undefined;
                });
            }


        };

        ctrl.consultarPagos = function() {
            if (ctrl.tipoIngresoSelec == null) {
                swal("", "Debe seleccionar la forma de ingreso", "error");
            } else if (ctrl.fechaInicio == null || ctrl.fechaFin == null) {
                swal("", "Debe seleccionar la fecha de consulta  de los ingresos", "error");
            } else if (ctrl.facultadSelec == null) {
                swal("", "Debe seleccionar la facultad", "error");
            } else {
                var tipo_recibo = ctrl.tipoIngresoSelec.Nombre;
                var codigo_facultad = ctrl.facultadSelec.Id;

                ctrl.rta = null;
                ctrl.pagos = null;
                ctrl.cargandoDatosPagos = true;

                switch (tipo_recibo) {
                    case "Inscripciones":
                        ctrl.gridOptions.columnDefs = [
                            { name: 'identificacion', displayName: 'Identificación', headerCellClass: 'text-info' },
                            { name: 'fecha', displayName: 'Fecha', headerCellClass: 'text-info' },
                            //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                            { name: 'valor', displayName: 'Valor', headerCellClass: 'text-info', cellFilter: 'currency' },
                            { name: 'codigo_banco', displayName: 'Codigo del Banco', headerCellClass: 'text-info' },
                            { name: 'oficina_banco', displayName: 'Oficina del Banco', headerCellClass: 'text-info' },
                            { name: 'referencia_pago', displayName: 'Referencia del Pago', headerCellClass: 'text-info', cellFilter: 'currency' }
                        ];
                        var inicio = $filter('date')(ctrl.fechaInicio, "yyyy-MM-dd");
                        var fin = $filter('date')(ctrl.fechaFin, "yyyy-MM-dd");
                        var parametros = [{
                            name: "tipo_recibo",
                            value: "ingresos_admisiones"
                        }, {
                            name: "fecha_inicio",
                            value: inicio
                        }, {
                            name: "fecha_fin",
                            value: fin
                        }];
                        angular.forEach(ctrl.homologacion_facultad, function(facultad) {
                            if (facultad.new == parametros[1].value) {
                                parametros[1].value = facultad.old;
                            }
                        });
                        wso2Request.get("admisionesProxyServer", parametros).then(function(response) {
                            if (response != null) {
                                $scope.datos = true;
                                ctrl.gridOptions.data = response.data.ingresosAdmisionesCollection.ingresoAdmisiones;
                                ctrl.total = 0;
                                angular.forEach(ctrl.gridOptions.data, function(ingreso) {
                                    ctrl.total += parseFloat(ingreso.referencia_pago);
                                });
                            } else {
                                $scope.datos = false;
                            }
                        });

                        break;
                    case "CODIGO DE BARRAS":
                        ctrl.gridOptions.columnDefs = [
                            { name: 'ano', displayName: 'Vigencia', headerCellClass: 'text-info' },
                            { name: 'identificacion', displayName: 'Identificación', headerCellClass: 'text-info' },
                            { name: 'nombre', displayName: 'Nombre', headerCellClass: 'text-info' },
                            //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                            { name: 'numero_cuenta', displayName: 'N° Cuenta', headerCellClass: 'text-info' },
                            { name: 'tipo_recibo', displayName: 'Tipo Recibo', headerCellClass: 'text-info' },
                            { name: 'pago_reportado', displayName: 'Pago Reportado', headerCellClass: 'text-info', cellFilter: 'currency' },
                            { name: 'matricula', displayName: 'Pago Matricula', headerCellClass: 'text-info', cellFilter: 'currency' },
                            { name: 'seguro', displayName: 'Pago Seguro', headerCellClass: 'text-info', cellFilter: 'currency' },
                            { name: 'carnet', displayName: 'Pago Carnet', headerCellClass: 'text-info', cellFilter: 'currency' }
                        ];
                        var inicio = $filter('date')(ctrl.fechaInicio, "dd-MM-yy");
                        var fin = $filter('date')(ctrl.fechaFin, "dd-MM-yy");
                        var parametros = [{
                            name: "tipo_recibo",
                            value: "ingresos_concepto/CODIGO%20DE%20BARRAS"
                        }, {
                            name: "facultad",
                            value: codigo_facultad
                        }, {
                            name: "fecha_inicio",
                            value: inicio
                        }, {
                            name: "fecha_fin",
                            value: fin
                        }];
                        angular.forEach(ctrl.homologacion_facultad, function(facultad) {
                            if (facultad.new == parametros[1].value) {
                                parametros[1].value = facultad.old;
                            }
                        });
                        wso2Request.get("academicaProxyService", parametros).then(function(response) {
                            if (response != null) {
                                $scope.datos = true;
                                ctrl.gridOptions.data = response.data.ingresosConceptoCollection.ingresoConcepto;
                                ctrl.total = 0;
                                angular.forEach(ctrl.gridOptions.data, function(ingreso) {
                                    ctrl.total += parseFloat(ingreso.pago_reportado);
                                });
                            } else {
                                $scope.datos = false;
                            }
                        });
                    default:
                        break;
                }
            }
        };
    });