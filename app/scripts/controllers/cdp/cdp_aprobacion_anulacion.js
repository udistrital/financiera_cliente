'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpAprobacionAnulacionCtrl
 * @description
 * # CdpCdpAprobacionAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('CdpCdpAprobacionAnulacionCtrl', function($scope, $translate, financieraRequest, presupuestoRequest, financieraMidRequest, presupuestoMidRequest, agoraRequest) {
        var self = this;
        self.offset = 0;
        self.customfilter = '&query=TipoAnulacion.Nombre__not_in:Fenecido';
        self.UnidadEjecutora = 1 ;
        self.rubros_afectados = [];
        self.cargando = false;
        self.hayData = true;
        self.ver_boton_todos = false;
        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
        ];

        self.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 10,
            useExternalPagination: true,

            columnDefs: [
              {
                  field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Vigencia',
                  displayName: $translate.instant('VIGENCIA'),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado'
              },
              {
                field: 'Consecutivo',
                cellClass: 'input_center',
                displayName: $translate.instant('NO'),
                headerCellClass: 'encabezado',
                width: "10%",
            }, {
                field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
                cellClass: 'input_center',
                displayName: $translate.instant('CDP_NUMERO'),
                headerCellClass: 'encabezado',
                width: "10%",
            },  {
                field: 'FechaRegistro',
                displayName: $translate.instant('FECHA_CREACION'),
                cellClass: 'input_center',
                cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
                headerCellClass: 'encabezado',
                width: "15%",
            }, {
                field: 'TipoAnulacion.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('TIPO'),
                headerCellClass: 'encabezado',
                width: "15%",
            }, {
                field: 'EstadoAnulacion.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('ESTADO'),
                headerCellClass: 'encabezado',
                width: "15%",
            }, {
                field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DataSolicitud.DependenciaSolicitante.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
                headerCellClass: 'encabezado',
                width: "15%",
            }, {
                field: 'Opciones',
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
                headerCellClass: 'encabezado',
                width: "10%",
            }]
        };
        self.gridOptions.multiSelect = false;

        presupuestoRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
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
                presupuestoRequest.get("anulacion_disponibilidad/TotalAnulacionDisponibilidad/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                    .then(function(response) { //error con el success
                        self.gridOptions.totalItems = response.data;
                        self.actualizarLista(self.offset, '');
                    });

            });

        self.gridOptions.multiSelect = false;

        self.actualizarLista = function(offset, query) {
            presupuestoMidRequest.cancel();
            //presupuestoRequest.cancel();

            self.gridOptions.data.length=0;
            self.gridOptions.data = [];
            self.cargando = true;
            self.hayData = true;

            if(query !== ""){
              query = query + ",AnulacionDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.Vigencia:"+ self.Vigencia;
            }else{
              query = "&query=AnulacionDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.Vigencia:"+ self.Vigencia+",TipoAnulacion.Nombre__not_in:Fenecido";
            }
            presupuestoRequest.get('anulacion_disponibilidad/', 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query ).then(function(response) { //+ "&UnidadEjecutora=" + self.UnidadEjecutora
                if (response.data === null) {
                    self.gridOptions.data.length=0;
                    self.hayData = false;
                    self.cargando = false;
                    self.gridOptions.data = [];
                } else {
                    self.hayData = true;
                    self.cargando = false;


                    angular.forEach(response.data, function(data) {
                    presupuestoMidRequest.get('disponibilidad/SolicitudById/' + data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DisponibilidadProcesoExterno[0].ProcesoExterno, '').then(function(response) {
                        data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DataSolicitud = response.data;
                    });
                });


                  self.gridOptions.data = response.data;

                }
            });


        };

        $scope.loadrow = function(row, operacion) {
          self.operacion = operacion;
          switch (operacion) {
              case "ver":
                self.verDisponibilidad(row);
              break;

              case "otro":

              break;
              default:
          }
      };

        self.cargarListaAnulaciones = function() {
          self.gridOptions.data = [];
          self.cargando = true;
          self.hayData = true;

            presupuestoRequest.get('anulacion_disponibilidad', $.param({
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
                      presupuestoMidRequest.get('disponibilidad/SolicitudById/' + data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DisponibilidadProcesoExterno[0].ProcesoExterno, '').then(function(response) {
                          data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DataSolicitud = response.data;

                      });
                  });
                }

            });
        };

        self.gridOptions.onRegisterApi = function(gridApi) {
            self.gridApi = gridApi;
            gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                var query = '';
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        if(formtstr !== "Tipo"){
                          query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                        }

                    }
                });
                self.actualizarLista(self.offset, query);
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

                //self.gridOptions.data = {};


                var query = '';

                var grid = this.grid;
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                    }
                });
                self.offset = (newPage - 1) * pageSize;
                self.actualizarLista(self.offset, query);
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
                    };
                }
                return this.map(fn).indexOfOld(e);
            }
        };

        self.formatoResumenAfectacion = function(afectacion) {
            var resumen = [];
            angular.forEach(afectacion, function(data) {
                var dispapr = angular.copy(data.DisponibilidadApropiacion);
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

        self.verDisponibilidad = function(row) {
            $("#myModal").modal();
            $scope.apropiacion = undefined;
            $scope.apropiaciones = [];
            self.cdp = row.entity.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad;
            self.anulacion = row.entity;
            self.resumen = self.formatoResumenAfectacion(self.anulacion.AnulacionDisponibilidadApropiacion);

            presupuestoRequest.get('disponibilidad_apropiacion', 'limit=-1&query=Disponibilidad.Id:' + self.cdp.Id).then(function(response) {
                self.rubros = response.data;
                angular.forEach(self.rubros, function(data) {
                    if ($scope.apropiaciones.indexOf(data.Apropiacion.Id) === -1) {
                        $scope.apropiaciones.push(data.Apropiacion.Id);
                    } 

                    var rp = {
                        Disponibilidad: data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                        Apropiacion: data.Apropiacion
                    };
                    presupuestoRequest.post('disponibilidad/SaldoCdp', rp).then(function(response) {
                        data.Saldo = response.data;
                    });

                });

                agoraRequest.get('informacion_persona_natural', $.param({
                    query: "Id:" + self.cdp.Responsable,
                    limit: 1
                })).then(function(response) {
                    if (response.data != null) {
                        self.cdp.DataResponsable = response.data[0];
                    }

                });


            });
        };

        /*self.gridOptions.onRegisterApi = function(gridApi){
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            $("#myModal").modal();
            $scope.apropiacion= undefined;
            $scope.apropiaciones = [];
            self.cdp = row.entity.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad;
            self.anulacion = row.entity;
            self.resumen = self.formatoResumenAfectacion(self.anulacion.AnulacionDisponibilidadApropiacion);
            console.log("resumen");
            console.log(self.resumen);
            presupuestoRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.cdp.Id).then(function(response) {
              self.rubros = response.data;
              angular.forEach(self.rubros, function(data){
                if($scope.apropiaciones.indexOf(data.Apropiacion.Id) !== -1) {

                }else{
                  $scope.apropiaciones.push(data.Apropiacion.Id);
                }

                  console.log($scope.apropiaciones);
                  console.log(self.cdp.Id);
                  var saldo;
                  var rp = {
                    Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                    Apropiacion : data.Apropiacion
                  };
                  presupuestoRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                    data.Saldo  = response.data;
                  });

                });

                  agoraRequest.get('informacion_persona_natural',$.param({
                    query: "Id:"+self.cdp.Responsable,
                    limit: 1
                  })).then(function(response){
                    if (response.data != null){
                      self.cdp.DataResponsable = response.data[0];
                    }

                  });


            });
          });
        };*/


        self.solicitarAnulacion = function() {
            self.anulacion.EstadoAnulacion.Id = 2;
            self.anulacion.Solicitante = 1234567890; //tomar del prefil
            presupuestoRequest.post('disponibilidad/AprobarAnulacion', self.anulacion).then(function(response) {

                if (response.data.Type !== undefined) {
                    if (response.data.Type === "error") {
                        swal('', $translate.instant(response.data.Code), response.data.Type);
                    } else {
                        swal('', $translate.instant(response.data.Code) + ' ' + response.data.Body.Consecutivo, response.data.Type).then(function() {
                            $("#myModal").modal('hide');
                            self.actualizarLista(self.offset, '');
                        });
                    }

                }
            });
        };

        self.aprobarAnulacion = function() {
            self.anulacion.EstadoAnulacion.Id = 3;
            self.anulacion.Responsable = 876543216; //tomar del prefil
            presupuestoMidRequest.post('disponibilidad/AprobarAnulacion', self.anulacion).then(function(response) {

                if (response.data.Type !== undefined) {
                    if (response.data.Type === "error") {
                        swal('', $translate.instant(response.data.Code), response.data.Type);
                    } else {
                        swal('', $translate.instant(response.data.Code) + ' ' + response.data.Body.Consecutivo, response.data.Type).then(function() {
                            $("#myModal").modal('hide');
                            self.actualizarLista(self.offset, '');
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

                solicitud.JustificacionRechazo = text;
                solicitud.EstadoAnulacion.Id = 4;

                var sl = solicitud;
                presupuestoRequest.put('anulacion_disponibilidad/', sl.Id + "?fields=justificacion_rechazo,estado_anulacion", sl).then(function(response) {

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
            presupuestoRequest.get("anulacion_disponibilidad/TotalAnulacionDisponibilidad/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) { //error con el success
                    self.gridOptions.totalItems = response.data;
                    self.actualizarLista(self.offset, self.customfilter);
                });
        };



        $scope.$watch("cdpAprobacionAnulacion.Vigencia", function() {
            if(self.Vigencia !== undefined){
                presupuestoRequest.get("anulacion_disponibilidad/TotalAnulacionDisponibilidad/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
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
            }
        }, true);

    });
