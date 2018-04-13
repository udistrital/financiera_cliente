'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('IngresosIngresoRegistroCtrl', function($scope, $location,financieraRequest, wso2Request, oikosRequest, $translate, $filter,ingresoDoc) {
        var ctrl = this;
        //prueba de codigos de facultad
        $scope.load = true;
        ctrl.fechaInicio = new Date();
        ctrl.fechaFin = new Date();
        ctrl.filtro_ingresos = "Ingresos";
        $scope.datos = false;
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

            if (angular.equals("INSCRIPCIONES",ctrl.tipoIngresoSelec.Nombre) || angular.equals("CODIGO DE BARRAS",ctrl.tipoIngresoSelec.Nombre)){
                $scope.otro = false;
            }else{
                $scope.otro = true;
            }

        }, true);


        $scope.$watch('ingresoRegistro.concepto[0]', function(oldValue, newValue) {
            if (!angular.isUndefined(newValue)) {
                financieraRequest.get('concepto', $.param({
                    query: "Id:" + newValue.Id,
                    fields: "Rubro",
                    limit: -1
                })).then(function(response) {

                    console.log(newValue);
                    console.log(response.data[0].Rubro);
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
                        } else {
                            var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('NO') + "</th><th>" + $translate.instant('VIGENCIA') + "</th>";

                            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Consecutivo + "</td>" + "<td>" + response.data.Body.Vigencia + "</td>" ;

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

        ctrl.ejecutarIngresos = function(){
            if($scope.otro){
                ingresoDoc.set(ctrl.tipoIngresoSelec);
                $location.path('/ingresos/ingreso_registroG/'+ctrl.tipoIngresoSelec.Nombre);
            }else{

                ctrl.consultarPagos();
            }

        }
        ctrl.consultarPagos = function() {
            $scope.datos = false;
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
                ctrl.cargandoDatosPagos = true;

                switch (tipo_recibo) {
                    case "INSCRIPCIONES":
                        ctrl.gridOptions.columnDefs = [
                            { name: 'identificacion', displayName: 'Identificación', headerCellClass: 'text-info' },
                            { name: 'fecha', displayName: 'Fecha', headerCellClass: 'text-info' },
                            //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                            { name: 'valor', displayName: 'Valor', headerCellClass: 'text-info', cellFilter: 'currency',cellClass: 'right-letters' },
                            { name: 'codigo_banco', displayName: 'Codigo del Banco', headerCellClass: 'text-info' },
                            { name: 'oficina_banco', displayName: 'Oficina del Banco', headerCellClass: 'text-info' },
                            { name: 'referencia_pago', displayName: 'Referencia del Pago', headerCellClass: 'text-info', cellFilter: 'currency',cellClass: 'right-letters' }
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
                            { name: 'pago_reportado', displayName: 'Pago Reportado', headerCellClass: 'text-info', cellFilter: 'currency',cellClass: 'right-letters' },
                            { name: 'matricula', displayName: 'Pago Matricula', headerCellClass: 'text-info', cellFilter: 'currency',cellClass: 'right-letters' },
                            { name: 'seguro', displayName: 'Pago Seguro', headerCellClass: 'text-info', cellFilter: 'currency',cellClass: 'right-letters' },
                            { name: 'carnet', displayName: 'Pago Carnet', headerCellClass: 'text-info', cellFilter: 'currency',cellClass: 'right-letters' }
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
