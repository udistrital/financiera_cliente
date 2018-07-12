'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpAprobacionAnulacionCtrl
 * @description
 * # RpRpAprobacionAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('RpRpAprobacionAnulacionCtrl', function($translate, $scope, financieraRequest, financieraMidRequest, agoraRequest, gridApiService) {
        var self = this;
        self.customfilter = '&query=TipoAnulacion.Nombre__not_in:Fenecido';
        self.rubros_afectados = [];
        self.UnidadEjecutora = 1;
        self.cargando = false;
        self.hayData = true;
        self.ver_boton_todos = false;
        self.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 10,
            useExternalPagination: true,

            columnDefs: [{
                field: 'Consecutivo',
                cellClass: 'input_center',
                displayName: $translate.instant('NO'),
                headerCellClass: 'encabezado',
                width:'10%',
            }, {
                field: 'AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.NumeroRegistroPresupuestal',
                cellClass: 'input_center',
                displayName: $translate.instant('REGISTRO_PRESUPUESTAL_NO'),
                headerCellClass: 'encabezado',
                width:'10%',
            }, {
                field: 'AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.Vigencia',
                displayName: $translate.instant('VIGENCIA'),
                cellClass: 'input_center',
                headerCellClass: 'encabezado',
                width:'10%',

            }, {
                field: 'FechaRegistro',
                displayName: $translate.instant('FECHA_CREACION'),
                cellClass: 'input_center',
                cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
                headerCellClass: 'encabezado',
                width:'15%',
            }, {
                field: 'TipoAnulacion.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('TIPO'),
                headerCellClass: 'encabezado',
                width:'15%',
            }, {
                field: 'EstadoAnulacion.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('ESTADO'),
                headerCellClass: 'encabezado',
                width:'15%',
            }, {
                field: 'AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.DataSolicitud.DependenciaSolicitante.Nombre',
                displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
                cellClass: 'input_center',
                headerCellClass: 'encabezado',
                width:'15%',
            }, {
                field: 'Opciones',
                cellTemplate: '<center>' +
                    ' <a type="button" class="editar" ng-click="grid.appScope.rpAprobacionAnulacion.verRp(row)" >' +
                    '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>',
                headerCellClass: 'encabezado',
                width:'10%',
            }],
            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                self.gridApi = gridApiService.pagination(self.gridApi, self.actualizarLista, $scope);
            }
        };
        self.gridOptions.multiSelect = false;

        self.cargarListaAnulaciones = function() {

          self.cargando = true;
          self.hayData = true;
          self.gridOptions.data = [];

            financieraRequest.get('anulacion_registro_presupuestal', $.param({
                limit: -1
            })).then(function(response) {
                if(response.data == null){
                      self.hayData = false;
                      self.cargando = false;
                      self.gridOptions.data = [];
                }else{
                  self.hayData = true;
                  self.cargando = false;
                  self.gridOptions.data = response.data;
                  angular.forEach(self.gridOptions.data, function(data) {
                      financieraMidRequest.get('disponibilidad/SolicitudById/' + data.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.Solicitud, '').then(function(response) {
                          data.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.DataSolicitud = response.data[0];
                      });
                  });
                }

            });
        };


        financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
            .then(function(response) { //error con el success
                self.vigenciaActual = parseInt(response.data);
                var dif = self.vigenciaActual - 1995;
                var range = [];
                range.push(self.vigenciaActual);
                for (var i = 1; i < dif; i++) {
                    range.push(self.vigenciaActual - i);
                }
                self.years = range;
                self.Vigencia = self.vigenciaActual;
                financieraRequest.get("anulacion_registro_presupuestal/TotalAnulacionRegistroPresupuestal/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                    .then(function(response) { //error con el success
                        self.gridOptions.totalItems = response.data;
                        self.actualizarLista(self.offset, '');
                    });

            });


        self.actualizarLista = function(offset, query) {

            self.gridOptions.data = [];
            self.cargando = true;
            self.hayData = true;
            if (query !== "") {
                query = query + ",AnulacionRegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.Vigencia:" + self.Vigencia;
            } else {
                query = "&query=AnulacionRegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.Vigencia:" + self.Vigencia;
            }
            financieraRequest.get('anulacion_registro_presupuestal/', 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query).then(function(response) { //+ "&UnidadEjecutora=" + self.UnidadEjecutora
                if (response.data === null) {
                  self.hayData = false;
                  self.cargando = false;
                    self.gridOptions.data = [];
                } else {
                    console.log(response.data);
                    self.hayData = true;
                    self.cargando = false;
                    self.gridOptions.data = response.data;
                    angular.forEach(self.gridOptions.data, function(data) {
                        financieraMidRequest.get('disponibilidad/SolicitudById/' + data.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.DisponibilidadProcesoExterno[0].ProcesoExterno, '').then(function(response) {
                            data.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.DataSolicitud = response.data;

                        });
                    });
                }
            });
        };




        //self.cargarListaAnulaciones();

        Array.prototype.indexOfOld = Array.prototype.indexOf;

        Array.prototype.indexOf = function(e, fn) {
            if (!fn) {
                return this.indexOfOld(e);
            } else {
                if (typeof fn === 'string') {
                    var att = fn;
                    fn = function(e) {
                        return e[att];
                    }
                }
                return this.map(fn).indexOfOld(e);
            }
        };

        self.formatoResumenAfectacion = function(afectacion) {
            var resumen = [];
            angular.forEach(afectacion, function(data) {
                var dispapr = angular.copy(data.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion);
                if (resumen.indexOf(dispapr.Apropiacion.Id, 'Apropiacion.Id') !== -1) {
                    dispapr.FuenteFinanciamiento.Valor = data.Valor;
                    resumen[resumen.indexOf(dispapr.Apropiacion.Id, 'Apropiacion.Id')].FuenteFinanciamiento.push(dispapr.FuenteFinanciamiento)
                } else {
                    if (dispapr.FuenteFinanciamiento != null || dispapr.FuenteFinanciamiento != undefined) {
                        var fuente = dispapr.FuenteFinanciamiento;
                        fuente.Valor = data.Valor;
                        dispapr.FuenteFinanciamiento = [];
                        dispapr.FuenteFinanciamiento.push(fuente);
                    } else {
                        dispapr.Valor = data.Valor;
                    }
                    resumen.push(dispapr);
                }

            });
            return resumen;
        };


        self.verRp = function(row) {
            $("#myModal").modal();
            $scope.apropiacion = undefined;
            $scope.apropiaciones = [];
            self.anulacion = row.entity;
            self.resumen = self.formatoResumenAfectacion(self.anulacion.AnulacionRegistroPresupuestalDisponibilidadApropiacion);
            console.log(row.entity)
            financieraRequest.get('registro_presupuestal', 'query=Id:' + row.entity.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.Id).then(function(response) {

                self.detalle = response.data;
                angular.forEach(self.detalle, function(data) {

                    agoraRequest.get('informacion_proveedor/' + data.Beneficiario, '').then(function(response) {

                        data.BeneficiarioInfo = response.data;

                    });
                });
                angular.forEach(self.detalle, function(data) {
                    financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', 'query=RegistroPresupuestal.Id:' + data.Id).then(function(response) {
                        self.rubros = response.data;
                        data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
                        angular.forEach(self.rubros, function(rubros_data) {
                            var rpdata = {
                                Rp: rubros_data.RegistroPresupuestal,
                                Apropiacion: rubros_data.DisponibilidadApropiacion.Apropiacion
                            };
                            financieraRequest.post('registro_presupuestal/SaldoRp', rpdata).then(function(response) {
                                rubros_data.Saldo = response.data;
                            });
                            financieraMidRequest.get('disponibilidad/SolicitudById/' + rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud, '').then(function(response) {
                                var solicitud = response.data

                                self.Necesidad = solicitud.SolicitudDisponibilidad.Necesidad;
                                console.log(self.Necesidad);

                            });
                            if ($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) !== -1) {

                            } else {
                                $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
                            }

                        });

                    });

                });
            });

        };

        self.solicitarAnulacion = function() {
            self.anulacion.EstadoAnulacion.Id = 2;
            self.anulacion.Solicitante = 1234567890; //tomar del prefil
            financieraRequest.post('registro_presupuestal/AprobarAnulacion', self.anulacion).then(function(response) {
                console.log(response.data);


                if (response.data.Type !== undefined) {
                    if (response.data.Type === "error") {
                        swal('', $translate.instant(response.data.Code), response.data.Type);
                    } else {
                        swal('', $translate.instant(response.data.Code) + ' ' + response.data.Body.Consecutivo, response.data.Type).then(function() {
                            $("#myModal").modal('hide');
                            self.cargarListaAnulaciones();
                        });
                    }

                }

            });
        };

  

        self.aprobarAnulacion = function() {
            self.anulacion.EstadoAnulacion.Id = 3;
            self.anulacion.Responsable = 876543216; //tomar del prefil
            financieraRequest.post('registro_presupuestal/AprobarAnulacion', self.anulacion).then(function(response) {
                console.log(response.data);
                if (response.data.Type !== undefined) {
                    if (response.data.Type === "error") {
                        swal('', $translate.instant(response.data.Code), response.data.Type);
                    } else {
                        swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {
                            $("#myModal").modal('hide');
                            self.cargarListaAnulaciones();
                        });
                    }

                }
            });
        };

        self.Rechazar = function() {
            var solicitud = self.anulacion;
            $("#myModal").modal('hide');
            swal({
                title: $translate.instant('ALERTA_JUSTIFICACION_RECHAZO'),
                input: 'textarea',
                showCancelButton: true,
                inputValidator: function(value) {
                    return new Promise(function(resolve, reject) {
                        if (value) {
                            resolve();
                        } else {
                            reject($translate.instant('ALERTA_JUSTIFICACION_RECHAZO'));
                        }
                    });
                }
            }).then(function(text) {
                console.log(text);
                solicitud.JustificacionRechazo = text;
                solicitud.EstadoAnulacion.Id = 4;
                console.log(solicitud);
                var sl = solicitud;
                financieraRequest.put('anulacion_registro_presupuestal/', sl.Id + "?fields=justificacion_rechazo,estado_anulacion", sl).then(function(response) {
                    console.log(response.data);

                    if(response.data == "OK"){
                      swal({
                         html: $translate.instant('ALERTA_RECHAZO_CORRECTO'),
                         type: "success",
                         showCancelButton: false,
                         confirmButtonColor: "#449D44",
                         confirmButtonText: $translate.instant('VOLVER'),
                         }).then(function() {
                        $('myModal').modal('hide');
                        self.actualizarLista(self.offset, self.customfilter);
                    })
                    }else{
                      swal({
                         html: $translate.instant('ALERTA_ERROR_RECHAZO'),
                         type: "success",
                         showCancelButton: false,
                         confirmButtonColor: "#449D44",
                         confirmButtonText: $translate.instant('VOLVER'),
                         }).then(function() {
                        $('myModal').modal('hide');
                        self.actualizarLista(self.offset, self.customfilter);
                    })
                    }
                    /* ------ SE DEJA PENDIENTE PARA CUANDO EL API INCLUYA MANEJO DE ERROR EN ESTA PARTE
                    self.cargarListaAnulaciones();
                    if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                            self.cargarListaAnulaciones();
                        } else {
                            swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {

                                self.cargarListaAnulaciones();
                            });
                        }

                    }
                    */
                });

            });
        };

        self.verFenecidos = function() {
            self.gridApi.grid.columns[4].filters[0] = {
                term: "Fenecido"
            };
            self.customfilter = '&query=TipoAnulacion.Nombre__in:Fenecido';
            self.ver_boton_todos = true;
        };

        self.verAnulaciones = function() {
            self.gridOptions.data = [];
            self.ver_boton_todos = false;
            self.gridApi.grid.columns[4].filters[0] = {
                term: ""
            };
            self.customfilter = '&query=TipoAnulacion.Nombre__not_in:Fenecido';
            financieraRequest.get("anulacion_registro_presupuestal/TotalAnulacionRegistroPresupuestal/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) { //error con el success
                    self.gridOptions.totalItems = response.data;
                    self.actualizarLista(self.offset, self.customfilter);
                    self.customfilter = '&query=TipoAnulacion.Nombre__not_in:Fenecido';
                });
        };




        $scope.$watch("rpAprobacionAnulacion.Vigencia", function() {
            financieraRequest.get("anulacion_registro_presupuestal/TotalAnulacionRegistroPresupuestal/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) { //error con el success
                    self.gridOptions.totalItems = response.data;
                    self.actualizarLista(self.offset, self.customfilter);
                    self.customfilter = '&query=TipoAnulacion.Nombre__not_in:Fenecido';
                });
            /*if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
                //console.log(self.nuevo_calendario.FechaInicio.getFullYear());
                console.log("reset fecha inicio");
                self.fechaInicio = undefined;
                self.fechaFin = undefined;
            }
            self.fechamin = new Date(
                self.Vigencia,
                0, 1
            );
            self.fechamax = new Date(
                self.Vigencia,
                12, 0
            );*/
        }, true);

    });
