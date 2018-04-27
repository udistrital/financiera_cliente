'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpCargueMasivoCtrl
 * @description
 * # RpRpCargueMasivoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RpRpCargueMasivoCtrl', function ($scope, $filter, $translate, $window,$q, financieraMidRequest, argoRequest,agoraRequest, financieraRequest, oikosRequest) {
    var self = this;
    self.aprovarMasivo = false;

    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
       paginationPageSizes: [20, 50, 100],
      paginationPageSize: 20,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('NO'),
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
          field: 'Opciones',
          cellTemplate: '<center>' +
            ' <a type="button" class="editar" ng-click="grid.appScope.rpCargueMasivo.verSolicitud(row)" > ' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>' +
            ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.rpCargueMasivo.verSolicitud(row)" >',
          headerCellClass: 'text-info'
        }
      ]

    };

    self.UnidadEjecutora = 1;

    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;

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
      var respuesta;
      if (!row.entity.Masivo) {
          respuesta = false;
      }
      else {
          respuesta = true;
      }
      return respuesta;
    };

    financieraRequest.get("orden_pago/FechaActual/2006",'') //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.Vigencia = parseInt(response.data);
    });
    oikosRequest.get("tipo_dependencia",$.param({
          limit: -1
        }))
    .then(function(response){
      self.TiposDependencias = response.data;
    });
    argoRequest.get("tipo_necesidad",$.param({
          limit: -1
        }))
    .then(function(response){
      self.tiposNecesidad = response.data;
    });
    self.cargarSolicitudesMasivas = function(){
      self.cargandoMasivo = true;
    	var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      	var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      	if (inicio !== undefined && fin !== undefined){
        financieraMidRequest.get('registro_presupuestal/SolicitudesRpByDependencia/'+self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          rangoinicio: inicio,
          rangofin: fin,
          offset: 0,
          tipoNecesidad: self.tipoNecesidad,
          idDependencia: self.Dependencia
        })).then(function(response) {
        if (response.data.Type !== undefined){

          self.gridOptions.data = undefined;
        }else{

          self.gridOptions.data = response.data.InformacionRp;
        }
        console.log(response.data);
        self.cargandoMasivo = false;
      });
      }else{
        financieraMidRequest.get('registro_presupuestal/SolicitudesRpByDependencia/'+self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          offset: 0,
          idDependencia: self.Dependencia,
          tipoNecesidad: self.tipoNecesidad
        })).then(function(response) {
        if (response.data.Type !== undefined){
          self.gridOptions.data = undefined;
        }else{

          self.gridOptions.data = response.data.InformacionRp;
          self.resumenCargue = response.data.ResumenCargueRp;
        }
        console.log(response.data);
         self.cargandoMasivo = false;
      });
      }
    };

        self.verSolicitud = function(row) {
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      self.data = row.entity;
      agoraRequest.get('informacion_proveedor/' + self.data.Proveedor, '').then(function(response) {
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

    self.Rechazar = function() {
      var solicitud = self.data;
      $("#myModal").modal('hide');
      swal({
        title: 'Indique una justificación por el rechazo',
        input: 'textarea',
        showCancelButton: true,
        inputValidator: function(value) {
          return new Promise(function(resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject('Por favor indica una justificación!');
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

    self.RegistrarMasivo = function() {
      var dataCargueMasivo = [];
      self.cargandoMasivo = true;

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

          swal({
            title: '',
            type: self.alerta_registro_rp[0].Type,
            width: 800,
            html: templateAlert,
            showCloseButton: true,
            confirmButtonText: 'Cerrar'
          }).then(function(){
            self.cargarSolicitudesMasivas();
          });
          self.cargandoMasivo = false;

        });
      });

    };

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
          Beneficiario: self.cargueMasivo[i].Proveedor,
          TipoCompromiso: self.cargueMasivo[i].DatosCompromiso,
          NumeroCompromiso: self.cargueMasivo[i].NumeroCompromiso,
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

     $scope.$watch("rpCargueMasivo.Vigencia", function() {

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

      $scope.$watch("rpCargueMasivo.TipoDependencia", function() {
       if (self.TipoDependencia != undefined ){
        oikosRequest.get("dependencia",$.param({
            limit: -1,
            query: "DependenciaTipoDependencia.TipoDependenciaId.Id:"+self.TipoDependencia
          }))
      .then(function(response){
        self.Dependencias = response.data;
      });
       }

    }, true);

  });
