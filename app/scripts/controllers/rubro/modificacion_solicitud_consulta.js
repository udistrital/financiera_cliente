'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudConsultaCtrl
 * @description
 * # RubroModificacionSolicitudConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudConsultaCtrl', function (presupuestoRequest,presupuestoMidRequest, token_service, $scope, $translate, $filter, $window) {
    var self = this;
    self.offset = 0;
    self.UnidadEjecutora = parseInt(token_service.getUe());
    self.cargando = false;
    self.hayData = true;

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
      columnDefs: [
        {
          field: 'Id',
          visible: false
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant("VIGENCIA"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'NumeroMovimiento',
          displayName: $translate.instant("NO"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'FechaMovimiento',
          displayName: $translate.instant("FECHA_MOVIMIENTO"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellTemplate: '<span>{{row.entity.FechaMovimiento | date:"yyyy-MM-dd":"UTF"}}</span>'
        },
        {
          field: 'Noficio',
          displayName: $translate.instant("NO_OFICIO"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Foficio',
          displayName: $translate.instant("FECHA_OFICIO"),
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
          cellTemplate: '<span>{{row.entity.Foficio | date:"yyyy-MM-dd":"UTF"}}</span>'
        },
        {
          field: 'EstadoMovimientoApropiacion.Nombre',
          displayName: $translate.instant("ESTADO"),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },

        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          cellClass: 'input_center',
          width: '6%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'encabezado'
        }
      ]

    };
    presupuestoRequest.get("date/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
      .then(function (response) { //error con el success
        self.vigenciaActual = parseInt(response.data);
        var dif = self.vigenciaActual - 1995;
        var range = [];
        range.push(self.vigenciaActual);
        for (var i = 1; i < dif; i++) {
          range.push(self.vigenciaActual - i);
        }
        self.years = range;
        self.Vigencia = self.vigenciaActual;
        //self.cargarDatos(self.offset,'');
        presupuestoRequest.get("movimiento_apropiacion/TotalMovimientosApropiacion/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
          .then(function (response) { //error con el success
            self.gridOptions.totalItems = response.data;
            self.cargarDatos(self.offset, '');
          }).catch(function (e) {
            console.log('error', e);
            swal('', $translate.instant("E_0462"), "error").then(function () {
            });

          });
      }).catch(function (e) {
        console.log('error', e);
        swal('', $translate.instant("E_0462"), "error").then(function () {
        });

      });



    self.cargarDatos = function (offset, query) {
      self.gridOptions.data = [];
      self.cargando = true;
      self.hayData = true;

      if (query === '') {
        query = query + '&query=Vigencia:' + self.Vigencia + ",UnidadEjecutora:" + self.UnidadEjecutora;
      } else {
        query = query + ',Vigencia:' + self.Vigencia + ",UnidadEjecutora:" + self.UnidadEjecutora;
      }
      presupuestoRequest.get('movimiento_apropiacion', 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query).then(function (response) {
        if (response.data === null || response.data.Type !== undefined) {
          self.hayData = false;
          self.cargando = false;
          self.gridOptions.data = [];
        } else {
          console.log(response.data);
          self.hayData = true;
          self.cargando = false;
          self.gridOptions.data = response.data;
        }
      }).catch(function (e) {
        console.log('error', e);
        swal('', $translate.instant("E_0462"), "error").then(function () {
        });

      });


    };
    self.verDisponibilidad = function (numero, vigencia) {
      console.log('Numero: ', numero);
      console.log('Vigencia: ', vigencia);
      $window.open('#/cdp/cdp_consulta?vigencia=' + vigencia + '&numero=' + numero, '_blank', 'location=yes');
    };

    self.gridOptions.onRegisterApi = function (gridApi) {
      gridApi.core.on.filterChanged($scope, function () {
        var grid = this.grid;
        var query = '';
        angular.forEach(grid.columns, function (value, key) {
          if (value.filters[0].term) {
            var formtstr = value.colDef.name.replace('[0]', '');
            query = query + '&query=' + formtstr + '__icontains:' + value.filters[0].term;
            console.log(query);
          }
        });
        self.cargarDatos(self.offset, query);
      });
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        var grid = this.grid;
        var query = '';
        angular.forEach(grid.columns, function (value, key) {
          if (value.filters[0].term) {
            var formtstr = value.colDef.name.replace('[0]', '');
            query = query + '&query=' + formtstr + '__icontains:' + value.filters[0].term;

          }
        });
        self.offset = (newPage - 1) * pageSize;
        self.cargarDatos(self.offset, query);
      });
    };

    $scope.$watch("modificacionSolicitudConsulta.Vigencia", function () {
      if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
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


    $scope.loadrow = function (row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
        case "ver":
          $("#myModal").modal();
          self.data = row.entity;
          self.comprobarMovimiento();
          break;
        case "otro":
          break;
        default:
      }
    };

    self.comprobarMovimiento = function () {
      const comprobacion = {
        MovimientoApropiacionDisponibilidadApropiacion: self.data.MovimientoApropiacionDisponibilidadApropiacion,
      }

      presupuestoMidRequest.post('movimiento_apropiacion/ComprobarMovimientoApropiacion/' + self.UnidadEjecutora + '/' + self.Vigencia + '?format=1', comprobacion).then(function (response) {
        try {
          console.info(response.data);
          if (response.data.Type === 'success') {
            self.saldoArbol = response.data.Body.Saldo
            self.Diff = response.data.Body.Diff
            self.balanceado = response.data.Body.Comp
          } else {

          }
        } catch (error) {
          console.info(error);
        }
      }).catch(function (e) {
        console.log('Error', e);
        swal('', $translate.instant('E_MODP010'), 'error');

      })


    }

    self.generarModificacion = function () {
      presupuestoMidRequest.post('movimiento_apropiacion/AprobarMovimietnoApropiacion/' + self.UnidadEjecutora + '/' + self.Vigencia, self.data).then(function (response) {
        console.log(response.data);
        self.alerta = response.data.Body;
        console.log(self.alerta);
        var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('DETALLE') + "</th>" + "</th><th>" + $translate.instant('NO_CDP') + "</th>" + "</th><th>" + $translate.instant('APROPIACION') + "</th>";
        angular.forEach(self.alerta, function (data) {
          if (data.Type === "error") {
            if (data.Body !== null) {
              templateAlert = templateAlert + "<tr class='danger'><td>" + data.Body.Movimiento.NumeroMovimiento + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>" + "<td>" + data.Body.Disponibilidad + "</td>" + "<td>" + data.Body.Apropiacion + "</td>";
            } else {
              templateAlert = templateAlert + "<tr class='danger'><td>" + 'N/A' + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>" + "<td>" + 'N/A' + "</td>" + "<td>" + 'N/A' + "</td>";
            }
          } else if (data.Type === "success") {
            templateAlert = templateAlert + "<tr class='success'><td>" + data.Body.Movimiento.NumeroMovimiento + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>" + "<td>" + data.Body.Disponibilidad + "</td>" + "<td>" + data.Body.Apropiacion + "</td>";
          }

        });
        templateAlert = templateAlert + "</table>";

        swal({
          title: '',
          type: self.alerta[0].Type,
          width: 800,
          html: templateAlert,
          showCloseButton: true,
          confirmButtonText: 'Cerrar'
        }).then(function () {

        });



        self.data = null;
        self.cargarDatos(-1, '');
        $("#myModal").modal('hide');
      }).catch(function (e) {
        console.log('Error ', e);
        swal('', $translate.instant('E_MODP011'), 'error');

      });
    };

    self.rechzarMoidficacion = function () {
      var dataupd = {};
      angular.copy(self.data, dataupd);
      console.log(dataupd);
      dataupd.EstadoMovimientoApropiacion.Id = 3;
      presupuestoRequest.put('movimiento_apropiacion', self.data.Id + "?fields=EstadoMovimientoApropiacion", dataupd).then(function (response) {
        if (response.data.Type !== undefined) {
          if (response.data.Type === "error") {
            swal('', $translate.instant(response.data.Code), response.data.Type);
            console.log(response.data);
          } else {
            swal('', $translate.instant(response.data.Code) + " " + $translate.instant("NO") + " : " + response.data.Body.Id, response.data.Type).then(function () {
              self.data = null;
              self.cargarDatos(-1, '');
              $("#myModal").modal('hide');

            });
          }

        }
      }).catch(function (e) {
        console.log('Error ', e);
        swal('', $translate.instant('E_MODP011'), 'error');

      });
    };

    $scope.$watch("modificacionSolicitudConsulta.Vigencia", function () {


      presupuestoRequest.get("movimiento_apropiacion/TotalMovimientosApropiacion/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
        .then(function (response) { //error con el success
          self.gridOptions.totalItems = response.data;
          self.cargarDatos(self.offset, '');
        }).catch(function (e) {
          console.log('error', e);
          swal('', $translate.instant("E_0462"), "error").then(function () {
          });

        });

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
