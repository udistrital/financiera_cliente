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
  .controller('RpRpSolicitudConsultaCtrl', function($scope, $filter, $translate, $window, financieraMidRequest, argoRequest, financieraRequest, oikosRequest) {
    var self = this;
    self.alerta = "";
    self.aprovarMasivo = false;
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
          headerCellClass: 'text-info'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'FechaSolicitud',
          displayName: $translate.instant('FECHA_REGISTRO'),
          headerCellClass: 'text-info',
          cellClass: 'input_center',
          cellTemplate: '<span>{{row.entity.FechaSolicitud | date:"yyyy-MM-dd":"UTC"}}</span>'
        },
        {
          field: 'DatosDisponibilidad.NumeroDisponibilidad',
          displayName: $translate.instant('NO_CDP'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'DatosDisponibilidad.DatosNecesidad.Numero',
          displayName: $translate.instant('NECESIDAD_NO'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'DatosDisponibilidad.DatosNecesidad.DatosDependenciaSolicitante.Nombre',
          displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Opciones',
          cellTemplate: '<center>' +
            ' <a type="button" class="editar" ng-click="grid.appScope.rpSolicitudConsulta.verSolicitud(row)" > ' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>' +
            ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.rpSolicitudConsulta.verSolicitud(row)" >',
          headerCellClass: 'text-info'
        }
      ]

    };
    self.UnidadEjecutora = 1;
    financieraRequest.get("orden_pago/FechaActual/2006",'') //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.vigenciaActual = parseInt(response.data);
      var dif = self.vigenciaActual - 1995 ;
      var range = [];
      range.push(self.vigenciaActual);
      for(var i=1;i<dif;i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = self.years[0];
      self.gridOptions.totalItems = 5000;
      self.actualizar_solicitudes(0,'');
    });
    oikosRequest.get("dependencia",$.param({
          limit: -1,
        }))
    .then(function(response){
      self.Dependencias = response.data;
    });
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#actualizar_solicitudes
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link financieraMidService.service:financieraMidRequest financieraMidRequest}
     * y obtener las solicitudes de registros presupuestales que no esten en estado rechazada.
     */
    self.actualizar_solicitudes = function(offset,query) {
      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      var query = '';
      if (inicio !== undefined && fin !== undefined){
        financieraMidRequest.get('registro_presupuestal/GetSolicitudesRp/'+self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          rangoinicio: inicio,
          rangofin: fin,
          offset: offset
        })).then(function(response) {
        if (response.data === null){

          self.gridOptions.data = [];
        }else{
          
          self.gridOptions.data = response.data;
        }
        console.log(response.data);

      });
      }else{
        financieraMidRequest.get('registro_presupuestal/GetSolicitudesRp/'+self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          offset: offset
        })).then(function(response) {
        if (response.data === null){
          self.gridOptions.data = [];
        }else{

          self.gridOptions.data = response.data;
        }
        console.log(response.data);

      });
      }
      
    };

    self.limpiar_alertas = function() {
      self.alerta_registro_cdp = "";
    };
    //self.gridOptions.multiSelect = false;
    
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
        gridApi.core.on.filterChanged($scope, function() {
          var grid = this.grid;
          angular.forEach(grid.columns, function(value, key) {
              if(value.filters[0].term) {
                  //console.log('FILTER TERM FOR ' + value.colDef.name + ' = ' + value.filters[0].term);
              }
          });
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          console.log('newPage '+newPage+' pageSize '+pageSize);
          self.gridOptions.data = {};
          var offset = (newPage-1)*pageSize;
         
          self.actualizar_solicitudes(offset,'');
        });
      self.gridApi.selection.on.rowSelectionChangedBatch($scope, function() {
        self.cargueMasivo = self.gridApi.selection.getSelectedRows();
        if (self.cargueMasivo.length === 0 && self.aprovarMasivo) {
          self.aprovarMasivo = false;
        } else {
          self.aprovarMasivo = true;
        }
        console.log(self.cargueMasivo);
      });
      self.gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.cargueMasivo = self.gridApi.selection.getSelectedRows();
        if (self.cargueMasivo.length === 0 && self.aprovarMasivo) {
          self.aprovarMasivo = false;
        } else {
          self.aprovarMasivo = true;
        }
        console.log(self.cargueMasivo);
      });

    };

    self.gridOptions.isRowSelectable = function (row) { //comprobar si la solicitud es de cargue masivo o no
      if (!row.entity.Masivo) return false;
      else return true;
    }

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl#verSolicitud
     * @methodOf financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y consulta la informacion de la solicitud que se seleccione para mostrar su informacion de forma detallada.
     */
    self.verSolicitud = function(row) {
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      self.data = row.entity;
      financieraRequest.get('compromiso/' + self.data.Compromiso, '').then(function(response) {
        self.data.InfoCompromiso = response.data;
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
    self.Registrar = function() {
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
          Compromiso: self.data.DatosCompromiso,
          Solicitud: self.data.Id,
          DatosSolicitud: self.data
        };
        console.log(rp);
        var rubros = [];



        var dataRegistros = [];
        var registro = {
          rp: rp,
          rubros: self.data.Rubros
        };
        dataRegistros[0] = registro;
        console.log(registro);
        financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataRegistros).then(function(response) {
          self.alerta_registro_rp = response.data;
          console.log(self.alerta_registro_rp);
          var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('NO_CRP') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
          angular.forEach(self.alerta_registro_rp, function(data) {
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
          }).then(function(){
            
            $("#myModal").modal('hide');
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
    self.cargarDatos = function() {
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
    self.RegistrarMasivo = function() {
      var dataCargueMasivo = [];

      var estado = {
        Id: 1
      };
      var promise = self.cargarDatos();
      promise.then(function(dataCargueMasivo) {
        financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataCargueMasivo).then(function(response) {
          self.alerta_registro_rp = response.data;
          console.log(self.alerta_registro_rp);
          var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('NO_CRP') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
          angular.forEach(self.alerta_registro_rp, function(data) {
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
    self.Rechazar = function() {
      var solicitud = self.data;
      $("#myModal").modal('hide');
      swal({
        title: $translate.instant("S_M001"),
        input: 'textarea',
        showCancelButton: true,
        inputValidator: function(value) {
          return new Promise(function(resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject($translate.instant("S_M002"));
            }
          });
        }
      }).then(function(text) {
        console.log(text);
        console.log(solicitud);
        self.solicitud.MotivoRechazo = text;
        argoRequest.post('ingreso/RechazarIngreso', solicitud).then(function(response) {
          console.log(response.data);
          if (response.data.Type !== undefined) {
            if (response.data.Type === "error") {
              swal('', $translate.instant(response.data.Code), response.data.Type);
              self.cargarIngresos();
            } else {
              swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {

              });
            }

          }

        });

      });
    };

    $scope.$watch("rpSolicitudConsulta.Vigencia", function() {
      
       
        //self.actualizar_solicitudes(0,'');
    
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
