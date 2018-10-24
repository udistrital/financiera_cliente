'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesListaSolicitudCtrl
 * @description
 * # TesoreriaAvancesListaSolicitudCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('ListaSolicitudCtrl', function(financieraRequest, $localStorage, $translate, $location, $scope, academicaRequest, administrativaPruebasRequest,$sanitize) {
        var ctrl = this;
        $scope.info_validar = false;
        $scope.selected = [];
        $scope.mostrar_direc = false;
        $scope.estados = [];
        $scope.estado_select = [];
        $scope.aristas = [];
        $scope.estadoclick = {};

        ctrl.cargando = true;
        ctrl.hayData = true;

        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
            { clase_color: "ver", clase_css: "fa fa-check fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.LEGALIZAR'), operacion: 'legalizar', estado: true }

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

        ctrl.validatenoRowFound = function (item){
          if(angular.equals(typeof(item),"string")){
            return true;
          }else{
            return false;
          }
        }
        ctrl.get_solicitudes = function() {
            financieraRequest.get("solicitud_avance", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                  if(response.data !==  null){
                    angular.forEach(response.data, function(solicitud) {
                        financieraRequest.get("avance_estado_avance", $.param({
                                query: "SolicitudAvance.Id:" + solicitud.Id,
                                sortby: "FechaRegistro",
                                limit: -1,
                                order: "desc"
                            }))
                            .then(function(estados) {
                                solicitud.Estado = estados.data;
                            });
                        //aqui va la conexions con el beneficiario
                        academicaRequest.get("documento=" + solicitud.Beneficiario)
                            .then(function(response) {
                                solicitud.Tercero = response.data[0];
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
                                    if(!ctrl.validatenoRowFound(tipo)){

                                    solicitud.Total += tipo.Valor;
                                    financieraRequest.get("requisito_tipo_avance", $.param({
                                            query: "TipoAvance:" + tipo.TipoAvance.Id + ",Activo:1",
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
                                              if(!ctrl.validatenoRowFound(data)){
                                                data.SolicitudTipoAvance = { Id: tipo.Id };
                                                data.RequisitoTipoAvance = { Id: data.Id };
                                                if (data.RequisitoAvance.EtapaAvance.Id == 1) { //Solicitud
                                                    sol++;
                                                }
                                                if (data.RequisitoAvance.EtapaAvance.Id == 2) { //Legalización
                                                    leg++;
                                                }
                                                tipo.n_solicitar = sol;
                                                tipo.n_legalizar = leg;
                                              }
                                            });
                                        });
                                      }
                                });


                            });

                    });
                    ctrl.cargando = false;
                    ctrl.hayData = true;
                    ctrl.gridOptions.data = response.data;
                  }else{
                    ctrl.cargando = false;
                    ctrl.hayData = false;
                    ctrl.gridOptions.data = {};
                  }
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
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                }, {
                    field: 'Vigencia',
                    displayName: $translate.instant('VIGENCIA'),
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Objetivo',
                    displayName: $translate.instant('OBJETIVO'),
                    width: '15%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Tercero.documento',
                    displayName: $translate.instant('DOCUMENTO'),
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Tercero.nombres',
                    displayName: $translate.instant('NOMBRES'),
                    width: '14%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Tercero.apellidos',
                    displayName: $translate.instant('APELLIDOS'),
                    width: '14%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Estado[0].Estados.Nombre',
                    displayName: $translate.instant('ESTADO'),
                    cellTemplate: '<div align="center">{{row.entity.Estado[0].EstadoAvance.Nombre}}</div>',
                    width: '8%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Estado[0].FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.Estado[0].FechaRegistro| date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '8%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Total',
                    displayName: $translate.instant('VALOR'),
                    cellTemplate: '<div align="center"><span>{{row.entity.Total | currency}}</span></div>',
                    width: '8%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
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
                        $scope.estados.push({ id: estado.EstadoAvance.Id, label: estado.EstadoAvance.Nombre });
                    });
                    $scope.aristas = [
                        { from: 2, to: 3 }
                    ];
                    break;
                case "legalizar":
                    $localStorage.avance = $scope.solicitud;
                    $location.path('/tesoreria/avances/legalizacion');
                    break;
                case "proceso":
                    $scope.estado = row.entity.Estado[0].EstadoAvance;
                    $scope.informacion = $translate.instant('AVANCE_NO')+' '+row.entity.Consecutivo;
                    $scope.mostrar_direc = true;
                    break;
                default:
            }
        };

        ctrl.solicitud_necesidad = function() {
            swal({
                title: $translate.instant('SOLICITUD_NECESIDAD'),
                text: $translate.instant('AVANCE_NO') + $scope.solicitud.Consecutivo + " "+$translate.instant('PARA') +" "+ $scope.solicitud.Tercero.nombres + " " + $scope.solicitud.Tercero.apellidos,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.SOLICITAR')
            }).then(function() {
                var data = {
                    ProcesoExterno: $scope.solicitud.Id,
                    Consecutivo: $scope.solicitud.Consecutivo,
                    TipoNecesidad: { Id: 3 }
                };
                console.log(data);
                administrativaPruebasRequest.post("necesidad_proceso_externo", data)
                    .then(function(response) {
                        if (response.status === 200) {
                            console.log(response.data);
                        }
                    });
            });

        };


        $scope.funcion = function() {
            $scope.estadoclick = $localStorage.nodeclick;
            switch ($scope.estadoclick.Id) {
                case (3):
                    $('#modal_validar').modal('show');
                    break;
                case (2):
                    $scope.estado = $scope.solicitud.EstadoIngreso;
                    break;
                case (4):
                    administrativaPruebasRequest.get("necesidad_proceso_externo",
                            $.param({
                                query: "proceso_externo:" + $scope.solicitud.Id,
                                limit: -1
                            }))
                        .then(function(response) {
                            if (response.data == null) {
                                ctrl.solicitud_necesidad();
                            } else {
                                $('#modal_aprobacion').modal('show');
                                ctrl.necesidad_proceso_externo = response.data[0];
                            }
                        });

            }
        };

        ctrl.cargarEstados = function() {
            financieraRequest.get("estado_avance", $.param({
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
                            from: 2,
                            to: 3
                        },
                        {
                            from: 2,
                            to: 1
                        },
                        {
                            from: 3,
                            to: 4
                        }, {
                            from: 4,
                            to: 5
                        }, {
                            from: 5,
                            to: 6
                        }
                    ];
                });
        };
        ctrl.cargarEstados();

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
            //console.log("Indefinidos: " + i + ", seleccionados: " + j);
            //console.log(st);
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
                    //console.log(data);
                    var envio = {};
                    envio.RequisitoTipoAvance = data.RequisitoTipoAvance;
                    envio.SolicitudTipoAvance = data.SolicitudTipoAvance;
                    envio.Observaciones = data.Observaciones;
                    $scope.envio.push(envio);
                });
                $scope.data.Requisitos = $scope.envio;
                $scope.data.Solicitud = { Id: $scope.solicitud.Id };

                financieraRequest.post("solicitud_requisito_tipo_avance/TrValidarAvance", $scope.data)
                    .then(function(response) {
                        //console.log(response.data);
                        if (response.data.Type !== undefined) {
                            if (response.data.Type === "error") {
                                swal('', $translate.instant(response.data.Code), response.data.Type);
                            } else {
                                swal('', $translate.instant(response.data.Code), response.data.Type);
                            }
                            ctrl.get_solicitudes();
                            $('#modal_validar').modal('hide');
                        }
                    });
                //console.log($scope.data);

            }
        };
    });
