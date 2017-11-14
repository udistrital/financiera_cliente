'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('IngresosIngresoRegistroCtrl', function($scope, financieraRequest, wso2Request, oikosRequest, pagosRequest, $translate, $filter) {
        var ctrl = this;
        //prueba de codigos de facultad

        ctrl.homologacion_facultad = [{
            old: 23,
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
                console.log(ctrl.codigo_facultad);
            });
        };

        ctrl.cargar_facultades();


        ctrl.registrarIngreso = function() {
            if (ctrl.unidadejecutora == null) {
                swal("", "Debe seleccionar la unidad ejecutora", "error");
            } else if (ctrl.concepto == null) {
                swal("", "Debe seleccionar el concepto que afecta este ingreso", "error");
            } else {
                ctrl.ingreso = {};
                ctrl.ingreso.Ingreso = {};
                ctrl.ingreso.Ingreso.FormaIngreso = ctrl.tipoIngresoSelec;
                ctrl.ingreso.Ingreso.FechaConsignacion = ctrl.fechaConsignacion;
                ctrl.ingreso.Ingreso.Observaciones = ctrl.observaciones;
                ctrl.ingreso.Ingreso.UnidadEjecutora = ctrl.unidadejecutora;
                ctrl.ingreso.IngresoBanco = ctrl.totalIngresos; //sumatoria no individual ******
                ctrl.ingreso.Concepto = ctrl.concepto[0];

                angular.forEach(ctrl.movs, function(data) {
                    delete data.Id;
                });
                ctrl.ingreso.Movimientos = ctrl.movs;
                console.log("########################")
                console.log(ctrl.ingreso);
                console.log("########################")
                financieraRequest.post('ingreso/CreateIngresos', ctrl.ingreso).then(function(response) {
                    console.log(response.data);
                    if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                        } else {
                            swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type);
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

        ctrl.calcularTotalIngresos = function() {
            ctrl.totalIngresos = 0;
            if (ctrl.gridOptions.data != null) {
                angular.forEach(ctrl.gridOptions.data, function(data) {
                    var valor = parseFloat(data.pago_reportado)
                    ctrl.totalIngresos = ctrl.totalIngresos + valor;
                });
            } else {

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

                var inicio = $filter('date')(ctrl.fechaInicio, "dd-MM-yy");
                var fin = $filter('date')(ctrl.fechaFin, "dd-MM-yy");
                var tipo_recibo = ctrl.tipoIngresoSelec.Nombre;
                var codigo_facultad = ctrl.facultadSelec.Id;

                var parametros = [{
                    name: "tipo_recibo",
                    value: tipo_recibo
                }, {
                    name: "codigo_facultad",
                    value: codigo_facultad
                }, {
                    name: "fecha_inicio",
                    value: inicio
                }, {
                    name: "fecha_fin",
                    value: fin
                }];

                console.log(parametros);
                ctrl.rta = null;
                ctrl.pagos = null;
                ctrl.cargandoDatosPagos = true;

                switch (tipo_recibo) {
                    case value:

                        break;

                    default:
                        break;
                }

                wso2Request.get("admisionesProxyServer", parametros, { headers: { 'Accept': 'application/json' } }).then(function(response) {
                    if (response != null) {
                        console.log(response.data);
                        ctrl.gridOptions.data = response.data.ingresosConceptoCollection.ingresoConcepto;
                        ctrl.pagos = true;
                        console.log(ctrl.gridOptions.data);
                    } else {
                        console.log("no data");
                    }

                }).finally(function() {
                    // called no matter success or failure
                    ctrl.cargandoDatosPagos = false;
                });
            }


        }

        ctrl.gridOptions.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.ingresoBanco = ctrl.gridApi.selection.getSelectedRows();
                ctrl.calcularTotalIngresos();
                console.log($scope.ingresoBanco);
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                $scope.ingresoBanco = ctrl.gridApi.selection.getSelectedRows();
                ctrl.calcularTotalIngresos();
                console.log($scope.ingresoBanco);
            });
        };


        $scope.$watch('ingresoRegistro.concepto', function() {
            console.log("cambio");
            ctrl.calcularTotalIngresos();
        }, true);


        /*$scope.$watch('[ingresoRegistro.gridOptions.paginationPageSize,ingresoRegistro.gridOptions.data]', function(){
        	console.log("af"+ctrl.gridOptions.data.length);
        	if ((ctrl.gridOptions.data.length<=ctrl.gridOptions.paginationPageSize || ctrl.gridOptions.paginationPageSize== null) && ctrl.gridOptions.data.length>0) {
        		$scope.gridHeight = ctrl.gridOptions.rowHeight * 3+ (ctrl.gridOptions.data.length * ctrl.gridOptions.rowHeight);
        		if (ctrl.gridOptions.data.length<=6) {
        			$scope.gridHeight = ctrl.gridOptions.rowHeight * 2+ (ctrl.gridOptions.data.length * ctrl.gridOptions.rowHeight);
        			ctrl.gridOptions.enablePaginationControls= false;

        		}
        	} else {
        		$scope.gridHeight = ctrl.gridOptions.rowHeight * 3 + (ctrl.gridOptions.paginationPageSize * ctrl.gridOptions.rowHeight);
        		ctrl.gridOptions.enablePaginationControls= true;
        	}
        },true);*/




    });