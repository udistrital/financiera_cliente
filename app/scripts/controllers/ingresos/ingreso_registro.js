'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('IngresosIngresoRegistroCtrl', function($scope, $location, financieraRequest, wso2Request, oikosRequest, $translate, $filter, ingresoDoc, $window) {
        var ctrl = this;
        //prueba de codigos de facultad
        ctrl.cargando = false;
        ctrl.hayData = true;
        ctrl.fechaInicio = new Date();
        ctrl.fechaFin = new Date();
        ctrl.filtro_ingresos = "Ingresos";
        $scope.otro = false;
        ctrl.homologacion_facultad = [{
            old: 33,
            new: 14 //FACULTAD ING
        }, {
            old: 24,
            new: 17 // CIENCIAS Y EDUCACION
        }, {
            old: 23,
            new: 35 //ASAB
        }, {
            old: 101,
            new: 65 //MEDIO AMB
        }, {
            old: 32,
            new: 66 //TECNOLOGICA
        }];


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
                ctrl.cargar_facultades();
                ctrl.cargarUnidadesEjecutoras();
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

        $scope.$watch('ingresoRegistro.tipoIngresoSelec', function() {

            if (ctrl.tipoIngresoSelec != undefined) {

                if (!angular.isUndefined(ctrl.tipoIngresoSelec) && (angular.equals("INSCRIPCIONES", ctrl.tipoIngresoSelec.Nombre) || angular.equals("CODIGO DE BARRAS", ctrl.tipoIngresoSelec.Nombre))) {
                    $scope.otro = false;
                } else {
                    $scope.otro = true;
                }

            }

            if (ctrl.facultadSelec != undefined && ctrl.tipoIngresoSelec != undefined) {
                if (ctrl.facultadSelec.Id !== null && ctrl.tipoIngresoSelec != null) {
                    ctrl.ejecutarIngresos();
                }

            }
        }, true);

        $scope.$watch('ingresoRegistro.facultadSelec.Id', function() {

            if (ctrl.facultadSelec != undefined && ctrl.tipoIngresoSelec != undefined) {
                if (ctrl.facultadSelec.Id !== null && ctrl.tipoIngresoSelec != null) {
                    ctrl.ejecutarIngresos();
                }
            }
        }, true);

        $scope.$watch('ingresoRegistro.fechaInicio', function() {

            if (ctrl.facultadSelec != undefined && ctrl.tipoIngresoSelec != undefined) {
                if (ctrl.facultadSelec.Id !== null && ctrl.tipoIngresoSelec != null) {
                    ctrl.ejecutarIngresos();
                }
            }
        }, true);

        $scope.$watch('ingresoRegistro.fechaFin', function() {

            if (ctrl.facultadSelec != undefined && ctrl.tipoIngresoSelec != undefined) {
                if (ctrl.facultadSelec.Id !== null && ctrl.tipoIngresoSelec != null) {
                    ctrl.ejecutarIngresos();
                }
            }
        }, true);

        $scope.$watch('ingresoRegistro.concepto[0]', function(oldValue, newValue) {
            if (!angular.isUndefined(newValue)) {
              ctrl.movs = undefined;
                financieraRequest.get('concepto', $.param({
                    query: "Id:" + newValue.Id,
                    fields: "Rubro",
                    limit: -1
                })).then(function(response) {
                    $scope.ingresoRegistro.concepto[0].Rubro = response.data[0].Rubro;
                });
            }
        }, true);

        ctrl.registrarIngreso = function() {
            if (ctrl.unidadejecutora == null) {
                swal("", $translate.instant('SELECCIONAR_UNIDAD_EJECUTORA'), "error");
            } else if (ctrl.concepto == null) {
                swal("", $translate.instant('SELECCIONAR_CONCEPTO_INGRESO'), "error");
            } else {
                ctrl.ingreso = {
                    Ingreso: {
                        FormaIngreso: ctrl.tipoIngresoSelec,
                        FechaInicio: ctrl.fechaInicio,
                        FechaFin: ctrl.fechaFin,
                        Observaciones: ctrl.observaciones,
                        UnidadEjecutora: ctrl.unidadejecutora,
                        Facultad: ctrl.facultadSelec.Id

                    },
                    IngresoBanco: ctrl.total,
                    Concepto: ctrl.concepto[0]
                };

                angular.forEach(ctrl.movs, function(data) {
                    delete data.Id;
                });
                ctrl.ingreso.Movimientos = ctrl.movs;
                console.log(ctrl.ingreso);
                financieraRequest.post('ingreso/CreateIngresos', ctrl.ingreso).then(function(response) {
                    if (response.data.Type != undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                            $window.location.reload()
                        } else {
                            var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('NO') + "</th><th>" + $translate.instant('VIGENCIA') + "</th>";

                            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Consecutivo + "</td>" + "<td>" + response.data.Body.Vigencia + "</td>";

                            swal('', templateAlert, response.data.Type);
                        }

                    }
                }).finally(function() {
                    ctrl.pagos = undefined;
                    ctrl.tipoIngresoSelec = undefined;
                    ctrl.observaciones = undefined;
                    ctrl.unidadejecutora = undefined;
                    ctrl.concepto = undefined;
                });
            }


        };

        ctrl.ejecutarIngresos = function() {
            if ($scope.otro) {
                ingresoDoc.set(ctrl.tipoIngresoSelec);
                $location.path('/ingresos/ingreso_registroG/' + ctrl.tipoIngresoSelec.Nombre);
            } else {
                ctrl.ver_grid = true;
                ctrl.consultarPagos();
            }

        }
        ctrl.consultarPagos = function() {
            var inicio;
            var fin;
            var parametros;

            ctrl.gridOptions.data = [];
            ctrl.cargando = true;
            ctrl.hayData = true;
            if (ctrl.tipoIngresoSelec == null) {
                swal("", $translate.instant('SELECCIONAR_FORMA_INGRESO'), "error");
            } else if (ctrl.fechaInicio == null || ctrl.fechaFin == null) {
                swal("", $translate.instant('SELECCIONAR_FECHA_INGRESO'), "error");
            } else if (ctrl.facultadSelec == null) {
                swal("", $translate.instant('SELECCIONAR_FACULTAD'), "error");
            } else {
                var tipo_recibo = ctrl.tipoIngresoSelec.Nombre.toUpperCase();
                var codigo_facultad = ctrl.facultadSelec.Id;

                ctrl.rta = null;
                ctrl.pagos = null;

                switch (tipo_recibo) {
                    case "INSCRIPCIONES":
                        ctrl.gridOptions.columnDefs = [{
                                name: 'identificacion',
                                displayName: $translate.instant('IDENTIFICACION'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',

                            },
                            {
                                name: 'fecha',
                                displayName: $translate.instant('FECHA'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',
                                cellTemplate: '<span>{{row.entity.fecha | date:"yyyy-MM-dd":"UTC"}}</span>',
                            },
                            //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                            {
                                name: 'valor',
                                displayName: $translate.instant('VALOR'),
                                headerCellClass: 'encabezado',
                                cellFilter: 'currency',
                                cellClass: 'input_right'
                            },
                            {
                                name: 'codigo_banco',
                                displayName: $translate.instant('CODIGO_BANCO'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center'
                            },
                            {
                                name: 'oficina_banco',
                                displayName: $translate.instant('SUCURSAL'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center'
                            },
                            {
                                name: 'referencia_pago',
                                displayName: $translate.instant('REFERENCIA_PAGO'),
                                headerCellClass: 'encabezado',
                                cellFilter: 'currency',
                                cellClass: 'input_right'
                            }
                        ];
                        inicio = $filter('date')(ctrl.fechaInicio, "yyyy-MM-dd");
                        fin = $filter('date')(ctrl.fechaFin, "yyyy-MM-dd");
                        parametros = [{
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

                            if (Object.keys(response.data.ingresosAdmisionesCollection).length != 0) {
                                ctrl.cargando = false;
                                ctrl.hayData = true;
                                ctrl.gridOptions.data = response.data.ingresosAdmisionesCollection.ingresoAdmisiones;
                                ctrl.total = 0;
                                angular.forEach(ctrl.gridOptions.data, function(ingreso) {
                                    ctrl.total += parseFloat(ingreso.referencia_pago);
                                });
                            } else {
                                ctrl.cargando = false;
                                ctrl.hayData = false;
                            }
                        });

                        break;

                    case "CODIGO DE BARRAS":
                        ctrl.gridOptions.columnDefs = [{
                                name: 'ano',
                                displayName: $translate.instant('VIGENCIA'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',
                                width: '10%'
                            },
                            {
                                name: 'identificacion',
                                displayName: $translate.instant('IDENTIFICACION'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',
                                width: '10%'
                            },
                            {
                                name: 'nombre',
                                displayName: $translate.instant('NOMBRE'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',
                                width: '20%'
                            },
                            //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                            {
                                name: 'numero_cuenta',
                                displayName: $translate.instant('NUMERO_CUENTA'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',
                                width: '10%'
                            },
                            {
                                name: 'tipo_recibo',
                                displayName: $translate.instant('TIPO_RECIBO'),
                                headerCellClass: 'encabezado',
                                cellClass: 'input_center',
                                width: '10%'
                            },
                            {
                                name: 'pago_reportado',
                                displayName: $translate.instant('PAGO_REPORTADO'),
                                headerCellClass: 'encabezado',
                                cellFilter: 'currency',
                                cellClass: 'input_right',
                                width: '10%'
                            },
                            {
                                name: 'matricula',
                                displayName: $translate.instant('PAGO_MATRICULA'),
                                headerCellClass: 'encabezado',
                                cellFilter: 'currency',
                                cellClass: 'input_right',
                                width: '10%'
                            },
                            {
                                name: 'seguro',
                                displayName: $translate.instant('PAGO_SEGURO'),
                                headerCellClass: 'encabezado',
                                cellFilter: 'currency',
                                cellClass: 'input_right',
                                width: '10%'
                            },
                            {
                                name: 'carnet',
                                displayName: $translate.instant('PAGO_CARNET'),
                                headerCellClass: 'encabezado',
                                cellFilter: 'currency',
                                cellClass: 'input_right',
                                width: '10%'
                            }
                        ];

                        inicio = $filter('date')(ctrl.fechaInicio, "dd-MM-yy");
                        fin = $filter('date')(ctrl.fechaFin, "dd-MM-yy");
                        parametros = [{
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

                            if (Object.keys(response.data.ingresosConceptoCollection).length != 0) {
                                ctrl.cargando = false;
                                ctrl.hayData = true;
                                ctrl.gridOptions.data = response.data.ingresosConceptoCollection.ingresoConcepto;
                                ctrl.total = 0;
                                angular.forEach(ctrl.gridOptions.data, function(ingreso) {
                                    ctrl.total += parseFloat(ingreso.pago_reportado);
                                });
                            } else {
                                ctrl.cargando = false;
                                ctrl.hayData = false;
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
        };
    });
