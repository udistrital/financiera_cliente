'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
 * @description
 * # RpRpSolicitudConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RpRpSolicitudConsultaCtrl', function ($scope, $translate, $window, financieraMidRequest, uiGridService, argoRequest, financieraRequest) {
    var self = this;
    self.alerta = "";
    self.aprovarMasivo = false;
    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
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
          cellTemplate: '<span>{{row.entity.FechaSolicitud | date:"yyyy-MM-dd":"+0900"}}</span>'
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

    self.actualizar_solicitudes = function () {
      financieraMidRequest.get('registro_presupuestal/GetSolicitudesRp', '').then(function (response) {
        self.gridOptions.data.length = 0;
        self.gridOptions.data = response.data;
        console.log(response.data);

      });
    };

    self.limpiar_alertas = function () {
      self.alerta_registro_cdp = "";
    };
    //self.gridOptions.multiSelect = false;
    self.actualizar_solicitudes();

    self.gridOptions.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
      self.gridApi.selection.on.rowSelectionChangedBatch($scope, function () {
        self.cargueMasivo = self.gridApi.selection.getSelectedRows();
        if (self.cargueMasivo.length === 0 && self.aprovarMasivo) {
          self.aprovarMasivo = false;
        } else {
          self.aprovarMasivo = true;
        }
        console.log(self.cargueMasivo);
      });
      self.gridApi.selection.on.rowSelectionChanged($scope, function () {
        self.cargueMasivo = self.gridApi.selection.getSelectedRows();
        if (self.cargueMasivo.length === 0 && self.aprovarMasivo) {
          self.aprovarMasivo = false;
        } else {
          self.aprovarMasivo = true;
        }
        console.log(self.cargueMasivo);
      });

    };

    /*self.gridOptions.isRowSelectable = function (row) { //comprobar si la solicitud es de cargue masivo o no
      if (!row.entity.Masivo) return false;
      else return true;
    }*/


    self.verSolicitud = function (row) {
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      self.data = row.entity;
      financieraRequest.get('compromiso/' + self.data.Compromiso, '').then(function (response) {
        self.data.InfoCompromiso = response.data;
      });

      argoRequest.get('disponibilidad_apropiacion_solicitud_rp', 'limit=0&query=SolicitudRp:' + self.data.Id).then(function (response) {
        self.afectacion_pres = response.data;
        angular.forEach(self.afectacion_pres, function (rubro) {
          financieraRequest.get('disponibilidad_apropiacion', 'limit=1&query=Id:' + rubro.DisponibilidadApropiacion).then(function (response) {
            angular.forEach(response.data, function (data) {
              rubro.DisponibilidadApropiacion = data;

            });

          });
        });
        console.log("afec");
        console.log(self.afectacion_pres);
      });



    };

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
          Compromiso: self.data.DatosCompromiso,
          Solicitud: self.data.Id,
          DatosSolicitud: self.data
        };
        console.log(rp);
        var rubros = [];


        for (var i = 0; i < self.afectacion_pres.length; i++) {
          self.afectacion_pres[i].DisponibilidadApropiacion.ValorAsignado = self.afectacion_pres[i].Monto;
          self.afectacion_pres[i].DisponibilidadApropiacion.FuenteFinanciacion = self.afectacion_pres[i].DisponibilidadApropiacion.FuenteFinanciamiento;
          rubros.push(self.afectacion_pres[i].DisponibilidadApropiacion);
        }
        var dataRegistros = [];
        var registro = {
          rp: rp,
          rubros: rubros
        };
        dataRegistros[0] = registro;
        console.log(registro);
        financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataRegistros).then(function (response) {
          self.alerta_registro_rp = response.data;
          console.log(self.alerta_registro_rp);
          var templateAlert = "<table class='table table-bordered'><th>"+$translate.instant('SOLICITUD')+"</th><th>"+$translate.instant('NO_CRP')+"</th><th>"+$translate.instant('DETALLE')+"</th>";
          angular.forEach(self.alerta_registro_rp, function(data){
            if (data.Type === "error"){
              templateAlert = templateAlert + "<tr class='danger'><td>"+ data.Body.Rp.Solicitud + "</td>"+"<td> N/A </td>"+"<td>"+ $translate.instant(data.Code)+ "</td>";
            }else if (data.Type === "success"){
              templateAlert = templateAlert + "<tr class='success'><td>"+ data.Body.Rp.Solicitud + "</td>"+"<td>"+data.Body.Rp.NumeroRegistroPresupuestal+"</td>"+"<td>"+ $translate.instant(data.Code)+ "</td>";
            }

          });
          templateAlert = templateAlert + "</table>" ;
          console.log(templateAlert);
          swal({
                title: '',
                type: self.alerta_registro_rp[0].Type,
                width: 800,
                html: templateAlert,
                showCloseButton: true,
                confirmButtonText:
                  'Cerrar'
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


    self.cargarAfectacion = function(sol){
      var rubros = [];
      var afectacion_pres = [];
      argoRequest.get('disponibilidad_apropiacion_solicitud_rp', 'limit=0&query=SolicitudRp:' + sol.Id).then(function (response) {
        afectacion_pres = response.data;
        angular.forEach(afectacion_pres, function (rubro) {
          financieraRequest.get('disponibilidad_apropiacion', 'limit=1&query=Id:' + rubro.DisponibilidadApropiacion).then(function (response) {
            angular.forEach(response.data, function (data) {
              rubro.DisponibilidadApropiacion = data;
              rubro.DisponibilidadApropiacion.ValorAsignado = rubro.Monto;
              rubro.DisponibilidadApropiacion.FuenteFinanciacion = rubro.DisponibilidadApropiacion.FuenteFinanciamiento;
              rubros.push(rubro.DisponibilidadApropiacion);
            });

          });
        });
      });
      return rubros;
    } ;
    self.RegistrarMasivo = function () {
      var dataCargueMasivo = [];

      var estado = {
        Id: 1
      };
      for (var i = 0 ; i < self.cargueMasivo.length; i++){
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



          var rubros = self.cargarAfectacion(self.cargueMasivo[i]);
          var registro = {
            rp: rp,
            rubros: rubros
          };
          dataCargueMasivo.push(registro);
      }

      console.log("#############################");
      console.log(dataCargueMasivo);
      console.log("#############################");
      financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataCargueMasivo).then(function (response) {
        self.alerta_registro_rp = response.data;
        console.log(self.alerta_registro_rp);
        var templateAlert = "<table class='table table-bordered'><th>"+$translate.instant('SOLICITUD')+"</th><th>"+$translate.instant('NO_CRP')+"</th><th>"+$translate.instant('DETALLE')+"</th>";
        angular.forEach(self.alerta_registro_rp, function(data){
          if (data.Type === "error"){
            templateAlert = templateAlert + "<tr class='danger'><td>"+ data.Body.Rp.Solicitud + "</td>"+"<td> N/A </td>"+"<td>"+ $translate.instant(data.Code)+ "</td>";
          }else if (data.Type === "success"){
            templateAlert = templateAlert + "<tr class='success'><td>"+ data.Body.Rp.Solicitud + "</td>"+"<td>"+data.Body.Rp.NumeroRegistroPresupuestal+"</td>"+"<td>"+ $translate.instant(data.Code)+ "</td>";
          }

        });
        templateAlert = templateAlert + "</table>" ;
        console.log(templateAlert);
        swal({
              title: '',
              type: self.alerta_registro_rp[0].Type,
              width: 800,
              html: templateAlert,
              showCloseButton: true,
              confirmButtonText:
                'Cerrar'
            });


      });
    };

    self.Rechazar = function () {
      var solicitud = self.data;
      $("#myModal").modal('hide');
      swal({
        title: 'Indique una justificación por el rechazo',
        input: 'textarea',
        showCancelButton: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject('Por favor indica una justificación!');
            }
          });
        }
      }).then(function (text) {
        console.log(text);
        console.log(solicitud);
        self.solicitud.MotivoRechazo = text;
        argoRequest.post('ingreso/RechazarIngreso', solicitud).then(function (response) {
          console.log(response.data);
          if (response.data.Type !== undefined) {
            if (response.data.Type === "error") {
              swal('', $translate.instant(response.data.Code), response.data.Type);
              self.cargarIngresos();
            } else {
              swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function () {

                self.cargarIngresos();
              });
            }

          }

        });

      });
    };




  });
