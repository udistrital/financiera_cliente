'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesListaSolicitudCtrl
 * @description
 * # TesoreriaAvancesListaSolicitudCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('ListaSolicitudCtrl', function(financieraRequest, $translate, $scope, modelsRequest) {
        var ctrl = this;
        $scope.info_validar = false;
        $scope.selected = [];
        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "ver", clase_css: "fa  fa-check fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VALIDAR'), operacion: 'validar', estado: true },
            { clase_color: "editar", clase_css: "fa fa fa-sitemap faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'estado', estado: true }
        ];

        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                item.Valido = "S";
                item.Estado = "A";
                list.push(item);
            }
        };

        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        ctrl.get_solicitudes = function() {
            financieraRequest.get("solicitud_avance", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    angular.forEach(response.data, function(solicitud) {
                        financieraRequest.get("estado_avance", $.param({
                                query: "SolicitudAvance.Id:" + solicitud.Id,
                                sortby: "FechaRegistro",
                                limit: -1,
                                order: "desc"
                            }))
                            .then(function(estados) {
                                solicitud.Estado = estados.data;

                            });
                        //aqui va la conexions con el beneficiario
                        modelsRequest.get("terceros_completo")
                            .then(function(response) {
                                solicitud.Tercero = response.data;
                            });
                        financieraRequest.get("solicitud_tipo_avance", $.param({
                                query: "SolicitudAvance.Id:" + solicitud.Id,
                                sortby: "Id",
                                limit: -1,
                                order: "asc"
                            }))
                            .then(function(response) {
                                solicitud.Tipos = response.data;
                                solicitud.Total = 0;
                                angular.forEach(response.data, function(tipo) {
                                    solicitud.Total += tipo.Valor;
                                    financieraRequest.get("requisito_tipo_avance", $.param({
                                            query: "TipoAvance:" + tipo.TipoAvance.Id + ",Estado:" + "A",
                                            limit: -1,
                                            fields: "RequisitoAvance,TipoAvance,Id",
                                            sortby: "TipoAvance",
                                            order: "asc"
                                        }))
                                        .then(function(response) {
                                            tipo.Requisitos = response.data;
                                            var sol = 0;
                                            var leg = 0;
                                            angular.forEach(tipo.Requisitos, function(data) {
                                                if (data.RequisitoAvance.Etapa == "solicitar") {
                                                    sol++;
                                                }
                                                if (data.RequisitoAvance.Etapa == "legalizar") {
                                                    leg++;
                                                }
                                                tipo.n_solicitar = sol;
                                                tipo.n_legalizar = leg;
                                            });
                                        });
                                });
                            });

                    });
                    ctrl.gridOptions.data = response.data;
                });
        };

        ctrl.get_solicitudes();
        ctrl.gridOptions = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'Consecutivo',
                    displayName: $translate.instant('CONSECUTIVO'),
                    width: '5%',
                }, {
                    field: 'Vigencia',
                    displayName: $translate.instant('VIGENCIA'),
                    width: '10%',
                },
                {
                    field: 'Objetivo',
                    displayName: $translate.instant('OBJETIVO'),
                    width: '15%',
                },
                {
                    field: 'Tercero.documento',
                    displayName: $translate.instant('DOCUMENTO'),
                    width: '10%'
                },
                {
                    field: 'Tercero.nombres',
                    displayName: $translate.instant('NOMBRES'),
                    width: '14%'
                },
                {
                    field: 'Tercero.apellidos',
                    displayName: $translate.instant('APELLIDOS'),
                    width: '14%'
                },
                {
                    field: 'Estado[0].Estados.Nombre',
                    displayName: $translate.instant('ESTADO'),
                    cellTemplate: '<div align="center">{{row.entity.Estado[0].Estados.Nombre}}</div>',
                    width: '8%',
                },
                {
                    field: 'Estado[0].FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.Estado[0].FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span></div>',
                    width: '8%',
                },
                {
                    field: 'Total',
                    displayName: $translate.instant('VALOR'),
                    cellTemplate: '<div align="center"><span>{{row.entity.Total | currency}}</span></div>',
                    width: '8%',
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',

                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'

                }
            ]
        };
        $scope.loadrow = function(row, operacion) {
            $scope.solicitud = row.entity;
            switch (operacion) {
                case "ver":
                    $('#modal_ver').modal('show');
                    break;
                case "estado":
                    $('#modal_estado').modal('show');
                    $scope.estados = [];
                    $scope.aristas = [];
                    angular.forEach($scope.solicitud.Estado, function(estado) {
                        $scope.estados.push({ id: estado.Estados.Id, label: estado.Estados.Nombre });
                    });
                    $scope.aristas = [
                        { from: 4, to: 6 }
                    ];
                    break;
                case "validar":
                    if ($scope.solicitud.Estado[0].Estados.Nombre == "Verificado") {
                        swal(
                            '',
                            $translate.instant('SOLICITUD_AVANCE_VALIDADA'),
                            "warning"
                        );
                    } else {
                        $('#modal_validar').modal('show');
                    }
                    break;
                default:
            }
        };
        ctrl.validar_solicitud = function() {
            var error = "<ol>";
            var i = 0,
                j = 0,
                st = 0,
                lt = 0;
            angular.forEach($scope.solicitud.Tipos, function(reg) {
                if (!angular.isUndefined(reg.n_legalizar)) {
                    lt += reg.n_legalizar;
                    st += reg.n_solicitar;
                }
            });

            angular.forEach($scope.selected, function(registro) {
                if (!angular.isUndefined(registro.Observaciones)) {
                    if (registro.Observaciones !== "") {
                        i++;
                    }
                }
                j++;
            });
            console.log("Indefinidos: " + i + ", seleccionados: " + j);
            console.log(st);
            if (i < st) {
                error += "<li><label>" + $translate.instant('ERROR_OBSERVACIONES') + "</label></li>";
            }
            if (j < st) {
                error += "<li><label>" + $translate.instant('ERROR_REQUISITOS') + "</label></li>";
            }
            error += "</ol>";
            if (i + j < 2 * st) {
                swal(
                    'Faltan Campos...',
                    error,
                    "error"
                );
            } else {
                $scope.data = {};
                $scope.envio = [];
                angular.forEach($scope.selected, function(data) {
                    var envio = {};
                    envio.RequisitoTipoAvance = data.RequisitoTipoAvance;
                    envio.SolicitudTipoAvance = data.SolicitudTipoAvance;
                    envio.Observaciones = data.Observaciones;
                    $scope.envio.push(envio);
                });
                $scope.data.Requisitos = $scope.envio;
                $scope.data.Solicitud = $scope.solicitud.SolicitudAvance;

                financieraRequest.post("solicitud_requisito_tipo_avance/TrValidarAvance", $scope.data)
                    .then(function(response) {
                        console.log(response.data);
                        if (response.data.Type !== undefined) {
                            if (response.data.Type === "error") {
                                swal('', $translate.instant(response.data.Code), response.data.Type);
                            } else {
                                swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type);
                            }
                        }
                    });

            }
        };
    });