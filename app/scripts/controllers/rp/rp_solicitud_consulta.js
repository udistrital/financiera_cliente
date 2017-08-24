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

    self.gridOptions.isRowSelectable = function (row) { //comprobar si la solicitud es de cargue masivo o no
      if (!row.entity.Masivo) return false;
      else return true;
    }


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



    self.RegistrarMasivo = function () {
      var dataCargueMasivo = [];
      var estado = {
        Id: 1
      };
      angular.forEach(self.cargueMasivo, function (data) {
        var rp = {
          UnidadEjecutora: data.DatosDisponibilidad.UnidadEjecutora,
          Vigencia: data.DatosDisponibilidad.Vigencia,
          Responsable: data.DatosDisponibilidad.Responsable,
          Estado: estado,
          Beneficiario: data.DatosProveedor.Id,
          Compromiso: data.DatosCompromiso,
          Solicitud: data.Id,
          DatosSolicitud: data
        };
        var afectacion;
        argoRequest.get('disponibilidad_apropiacion_solicitud_rp', 'limit=0&query=SolicitudRp:' + data.Id).then(function (response) {
          afectacion = response.data;
          angular.forEach(afectacion, function (rubro) {
            financieraRequest.get('disponibilidad_apropiacion', 'limit=1&query=Id:' + rubro.DisponibilidadApropiacion).then(function (response) {
              angular.forEach(response.data, function (data) {
                rubro.DisponibilidadApropiacion = data;

              });

            });
          });
        });

        var rubros = [];
        if (afectacion !== undefined) {
          for (var i = 0; i < afectacion.length; i++) {
            afectacion[i].DisponibilidadApropiacion.ValorAsignado = afectacion[i].Monto;
            afectacion[i].DisponibilidadApropiacion.FuenteFinanciacion = afectacion[i].DisponibilidadApropiacion.FuenteFinanciamiento;
            rubros.push(afectacion[i].DisponibilidadApropiacion);
          }
          var registro = {
            rp: rp,
            rubros: rubros
          };
          dataCargueMasivo.push(registro);
        }


      });
      console.log(dataCargueMasivo)
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
