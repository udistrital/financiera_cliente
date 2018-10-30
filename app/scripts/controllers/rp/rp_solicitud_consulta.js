'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
 * @alias Aprobacion y lista de solicitudes de RP
 * @requires $scope
 * @requires financieraService.service:financieraRequest
 * @requires financieraMidService.service:financieraMidRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {service} financieraMidRequest Servicio para el API de financiera {@link financieraMidService.service:financieraMidRequest financieraMidRequest}
 * @param {injector} $scope scope del controlador
 * @description
 * # RpRpSolicitudConsultaCtrl
 * Controlador para ver el listado y realizar la aprobacion de solicitudes de RP.
 *
 *
 */
angular.module('financieraClienteApp')
  .controller('RpRpSolicitudConsultaCtrl', function ($scope, $filter, $translate, $window, financieraMidRequest, argoRequest, financieraRequest, oikosRequest, agoraRequest) {
    var self = this;
    self.alerta = "";
    self.offset = 0;
    self.query = '';
    self.cargando = false;
    self.hayData = true;
    self.aprovarMasivo = false;
    self.UnidadEjecutora = 1;
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];

    self.gridOptions = {
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      paginationPageSizes: [20, 50, 100],
      paginationPageSize: 10,
      useExternalPagination: true,
      columnDefs: [{
        field: 'Id',
        displayName: $translate.instant('NO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado'
      },
      {
        field: 'Vigencia',
        displayName: $translate.instant('VIGENCIA'),
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
      },
      {
        field: 'FechaSolicitud',
        displayName: $translate.instant('FECHA_REGISTRO'),
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        cellTemplate: '<span>{{row.entity.FechaSolicitud | date:"yyyy-MM-dd":"UTC"}}</span>'
      },
      {
        field: 'DatosDisponibilidad.NumeroDisponibilidad',
        displayName: $translate.instant('NO_CDP'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        enableFiltering: false
      },
      {
        field: 'DatosDisponibilidad.DatosNecesidad.Numero',
        displayName: $translate.instant('NECESIDAD_NO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        enableFiltering: false
      },
      {
        field: 'DatosDisponibilidad.DatosNecesidad.DatosDependenciaSolicitante.Nombre',
        displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        enableFiltering: false
      },
      {
        field: 'Opciones',
        headerCellClass: 'encabezado',
        cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
        enableFiltering: false,
      }
      ]

    };
    self.UnidadEjecutora = 1;
    financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
      .then(function (response) { //error con el success
        self.vigenciaActual = parseInt(response.data);
        var dif = self.vigenciaActual - 1995;
        var range = [];
        range.push(self.vigenciaActual);
        for (var i = 1; i < dif; i++) {
          range.push(self.vigenciaActual - i);
        }
        self.years = range;
        self.Vigencia = self.years[0];
        self.gridOptions.totalItems = 5000;
        self.actualizar_solicitudes(0, '');
      });
    oikosRequest.get("dependencia", $.param({
      limit: -1,
    }))
      .then(function (response) {
        self.Dependencias = response.data;
      });

    $scope.loadrow = function (row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
        case "ver":
          self.verSolicitud(row);
          break;

        case "otro":

          break;
        default:
      }
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#actualizar_solicitudes
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link financieraMidService.service:financieraMidRequest financieraMidRequest}
     * y obtener las solicitudes de registros presupuestales que no esten en estado rechazada.
     */
    self.actualizar_solicitudes = function (offset, query) {
      self.gridOptions.data = [];
      self.cargando = true;
      self.hayData = true;

      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");

      if (inicio !== undefined && fin !== undefined) {
        financieraMidRequest.cancel();
        financieraMidRequest.get('registro_presupuestal/GetSolicitudesRp/' + self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          rangoinicio: inicio,
          rangofin: fin,
          offset: offset,
          query: query
        })).then(function (response) {
          if (response.data === null) {
            self.hayData = false;
            self.cargando = false;
            self.gridOptions.data = [];
          } else {
            self.hayData = true;
            self.cargando = false;
            self.gridOptions.data = response.data;
          }
          console.log(response.data);

        });
      } else {
        financieraMidRequest.cancel();
        financieraMidRequest.get('registro_presupuestal/GetSolicitudesRp/' + self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          offset: offset,
          query: query
        })).then(function (response) {
          if (response.data === null) {
            self.hayData = false;
            self.cargando = false;
            self.gridOptions.data = [];
          } else {
            self.hayData = true;
            self.cargando = false;
            self.gridOptions.data = response.data;
          }
          console.log(response.data);

        });
      }

    };

    self.limpiar_alertas = function () {
      self.alerta_registro_cdp = "";
    };
    //self.gridOptions.multiSelect = false;

    self.gridOptions.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
      self.gridApi.core.on.filterChanged($scope, function () {
        var grid = this.grid;
        var query = '';
        angular.forEach(grid.columns, function (value, key) {
          if (value.filters[0].term) {
            var formtstr = value.colDef.name.replace('[0]', '');
            if (query === '') {
              query = formtstr + '__icontains:' + value.filters[0].term;
            } else {
              query = query + ',' + formtstr + '__icontains:' + value.filters[0].term;
            }
          }
        });
        self.offset = 0;
        self.actualizar_solicitudes(self.offset, query);
      });
      self.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

        //self.gridOptions.data = {};
        console.log("change p");
        var query = '';
        var grid = this.grid;
        angular.forEach(grid.columns, function (value, key) {
          if (value.filters[0].term) {
            var formtstr = value.colDef.name.replace('[0]', '');
            if (query === '') {
              query = formtstr + '__icontains:' + value.filters[0].term;
            } else {
              query = query + ',' + formtstr + '__icontains:' + value.filters[0].term;
            }

          }
        });
        self.offset = (newPage - 1) * pageSize;
        self.actualizar_solicitudes(self.offset, query);
      });
      self.gridOptions.totalItems = 50000;
    };

    self.gridOptions.isRowSelectable = function (row) { //comprobar si la solicitud es de cargue masivo o no
      var respuesta;
      if (!row.entity.Masivo) {
        respuesta = false;
      } else {
        respuesta = true;
      }
      return respuesta;
    }

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#verSolicitud
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y consulta la informacion de la solicitud que se seleccione para mostrar su informacion de forma detallada.
     */
    self.verSolicitud = function (row) {
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      self.data = row.entity;
      console.log(row.entity);
      agoraRequest.get('informacion_proveedor/' + self.data.Proveedor, '').then(function (response) {
        self.data.DatosProveedor = response.data;
      });
      self.afectacion_pres = self.data.Rubros;

      console.log("------------------------");
      console.log(self.afectacion_pres);
      console.log("------------------------");
      /*argoRequest.get('disponibilidad_apropiacion_solicitud_rp', 'limit=0&query=SolicitudRp:' + self.data.Id).then(function(response) {
        self.afectacion_pres = response.data;
        angular.forEach(self.afectacion_pres, function(rubro) {
          financieraRequest.get('disponibilidad_apropiacion', 'limit=1&query=Id:' + rubro.DisponibilidadApropiacion).then(function(response) {
            angular.forEach(response.data, function(data) {
              rubro.DisponibilidadApropiacion = data;

            });

          });
        });
        console.log("afec");
        console.log(self.afectacion_pres);
      });*/



    };
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#Registrar
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link financieraMidService.service:financieraMidRequest financieraMidRequest}
     * y envia los datos de la solicitud de rp junto a si respectiva afectacion presupuestal para que sea pasada por las reglas de negocio correspondientes a este proceso y se determine si se expide o no el RP.
     */
    self.Registrar = function () {
      self.alerta_registro_rp = ["No se pudo registrar el rp"];
      if (self.data.DatosProveedor == null) {
        swal("", $translate.instant('E_RP001'), "error");
      } else if (self.data.DatosDisponibilidad.NumeroDisponibilidad == null) {
        swal("", $translate.instant('E_RP002'), "error");
      } else if ($scope.afectacion.length == 0) {
        swal("", $translate.instant('E_RP003'), "error");
      } else if (self.data.DatosCompromiso.Objeto == null) {
        swal("", $translate.instant('E_RP004'), "error");
      } else {

        var estado = {
          Id: 1
        };
        var rp = {
          UnidadEjecutora: self.data.DatosDisponibilidad.UnidadEjecutora,
          Vigencia: self.data.DatosDisponibilidad.Vigencia,
          Responsable: self.data.DatosDisponibilidad.Responsable,
          Estado: estado,
          Beneficiario: self.data.DatosProveedor.Id,
          TipoCompromiso: self.data.DatosCompromiso,
          Solicitud: self.data.Id,
          DatosSolicitud: self.data,
          NumeroCompromiso: self.data.NumeroCompromiso
        };
        console.log("data enviada:");
        console.log(rp);

        var dataRegistros = [];
        var registro = {
          rp: rp,
          rubros: self.data.Rubros
        };
        dataRegistros[0] = registro;
        console.log(registro);
        financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataRegistros).then(function (response) {
          self.alerta_registro_rp = response.data;

          var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('NO_CRP') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
          angular.forEach(self.alerta_registro_rp, function (data) {
            if (data.Type === "error") {
              if (typeof (data.Body) === "string") {
                templateAlert = templateAlert + "<tr class='danger'><td>" + "N/A" + "</td>" + "<td> N/A </td>" + "<td>" + $translate.instant(data.Code) + "</td>";
              }
              if (typeof (data.Body) === "object") {
                templateAlert = templateAlert + "<tr class='danger'><td>" + data.Body.Rp.Solicitud + "</td>" + "<td> N/A </td>" + "<td>" + $translate.instant(data.Code) + "</td>";
              }


            } else if (data.Type === "success") {
              templateAlert = templateAlert + "<tr class='success'><td>" + data.Body.Rp.Solicitud + "</td>" + "<td>" + data.Body.Rp.NumeroRegistroPresupuestal + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>";
            }

          });
          templateAlert = templateAlert + "</table>";
          console.log(templateAlert);
          swal({
            title: '',
            type: self.alerta_registro_rp[0].Type,
            width: 800,
            html: templateAlert,
            showCloseButton: true,
            confirmButtonText: 'Cerrar'
          }).then(function () {

            $("#myModal").modal('hide');
            // Call RP Info

            if (self.alerta_registro_rp[0].Type === 'success') {
              financieraMidRequest.get('registro_presupuestal/ListaRp/' + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora + '&limit=1&offset=0&query=Solicitud:' + self.alerta_registro_rp[0].Body.Rp.Solicitud).then(function (response) {
                self.rpExpedido = response.data[0];
                self.rpExpedido.necesidadInfo = self.rpExpedido.InfoSolicitudDisponibilidad;
                self.rpExpedido.valor_total_rp = 0;
                self.rpExpedido.RegistroPresupuestalDisponibilidadApropiacion.forEach(data => {
                  self.rpExpedido.valor_total_rp = self.rpExpedido.valor_total_rp + data.Valor;
                });

              });

              console.log('rp ', self.rpExpedido);

              $("#modalResumen").modal();
            }
            //self.actualizar_solicitudes(0,'');
          });
          /*angular.forEach(self.alerta_registro_rp, function(data){

            if (data === "error" || data === "success" || data === undefined){

            }else{
              self.alerta = self.alerta + data + "\n";
            }

          });
          swal("Alertas", self.alerta, self.alerta_registro_rp[0]).then(function(){

                self.alerta = "";
                $("#myModal").modal('hide');
                $window.location.reload();
              });*/
          //alert(data);
          //self.limpiar();
          //console.log(registro);

        });


      }
    };



    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#cargarDatos
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description se envarga de dar formato a las solicitudes seleccionadas, empaquetando estas en un solo array.
     */
    self.cargarDatos = function () {
      var defered = $q.defer();
      var promise = defered.promise;
      var dataCargueMasivo = [];
      var estado = {
        Id: 1
      };
      for (var i = 0; i < self.cargueMasivo.length; i++) {
        var rp = {
          UnidadEjecutora: self.cargueMasivo[i].DatosDisponibilidad.UnidadEjecutora,
          Vigencia: self.cargueMasivo[i].DatosDisponibilidad.Vigencia,
          Responsable: self.cargueMasivo[i].DatosDisponibilidad.Responsable,
          Estado: estado,
          Beneficiario: self.cargueMasivo[i].DatosProveedor.Id,
          Compromiso: self.cargueMasivo[i].DatosCompromiso,
          Solicitud: self.cargueMasivo[i].Id,
          DatosSolicitud: self.cargueMasivo[i]
        };

        var registro = {
          rp: rp,
          rubros: self.cargueMasivo[i].Rubros
        };
        dataCargueMasivo.push(registro);
      }
      defered.resolve(dataCargueMasivo);
      return promise;
    };
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#RegistrarMasivo
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link financieraMidService.service:financieraMidRequest financieraMidRequest}
     * carga los datos de las solicitudes que van de forma masiva y los envia para su correspondiente verificacion y posible aprobacion y expedicion.
     */
    self.RegistrarMasivo = function () {
      var dataCargueMasivo = [];

      var promise = self.cargarDatos();
      promise.then(function (dataCargueMasivo) {
        financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataCargueMasivo).then(function (response) {
          self.alerta_registro_rp = response.data;
          console.log(self.alerta_registro_rp);
          var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('NO_CRP') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
          angular.forEach(self.alerta_registro_rp, function (data) {
            if (data.Type === "error") {
              templateAlert = templateAlert + "<tr class='danger'><td>" + data.Body.Rp.Solicitud + "</td>" + "<td> N/A </td>" + "<td>" + $translate.instant(data.Code) + "</td>";
            } else if (data.Type === "success") {
              templateAlert = templateAlert + "<tr class='success'><td>" + data.Body.Rp.Solicitud + "</td>" + "<td>" + data.Body.Rp.NumeroRegistroPresupuestal + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>";
            }

          });
          templateAlert = templateAlert + "</table>";
          console.log(templateAlert);
          swal({
            title: '',
            type: self.alerta_registro_rp[0].Type,
            width: 800,
            html: templateAlert,
            showCloseButton: true,
            confirmButtonText: 'Cerrar'
          });


        });
      });

    };
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#Rechazar
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link argoService.service:argoRequest argoRequest}
     * y envia a este el motivo por el cual fue rechazada la solicitud de RP.
     */
    self.Rechazar = function () {
      var solicitud = self.data;
      $("#myModal").modal('hide');
      swal({
        title: $translate.instant("S_M001"),
        input: 'textarea',
        showCancelButton: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject($translate.instant("S_M001"));
            }
          });
        }
      }).then(function (text) {
        console.log(text);
        console.log(solicitud);
        solicitud.MotivoRechazo = text;
        argoRequest.post('ingreso/RechazarIngreso', solicitud).then(function (response) {
          console.log(response.data);
          if (response.data.Type !== undefined) {
            if (response.data.Type === "error") {
              swal('', $translate.instant(response.data.Code), response.data.Type);
              self.cargarIngresos();
            } else {
              swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function () {

              });
            }

          }

        });

      });
    };

    $scope.$watch("rpSolicitudConsulta.Vigencia", function () {


      self.actualizar_solicitudes(0, '');

      if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
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
      );
    }, true);


  });
