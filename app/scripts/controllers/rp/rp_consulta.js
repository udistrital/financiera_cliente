'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpConsultaCtrl
 * @description
 * # RpRpConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .factory("rp", function () {
    return {};
  })
  .controller('RpRpConsultaCtrl', function ($window,$translate, rp, $scope, financieraRequest, financieraMidRequest, uiGridService, agoraRequest) {
    var self = this;
    self.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          cellClass: 'input_center',
           headerCellClass: 'text-info'
        },
        {
          field: 'NumeroRegistroPresupuestal',
          displayName: $translate.instant('NO'),
          cellClass: 'input_center',
           headerCellClass: 'text-info'
        },
        {
          field: 'Disponibilidad.NumeroDisponibilidad',
          displayName: $translate.instant('NO_CDP'),
          cellClass: 'input_center',
           headerCellClass: 'text-info'
        },
        {
          field: 'Necesidad.Numero',
          displayName: $translate.instant('NECESIDAD_NO'),
          cellClass: 'input_center',
           headerCellClass: 'text-info'
        },
        {
          field: 'FechaMovimiento',
          cellClass: 'input_center',
          displayName: $translate.instant('FECHA_REGISTRO'),
          cellTemplate: '<span>{{row.entity.FechaMovimiento | date:"yyyy-MM-dd":"+0900"}}</span>',
           headerCellClass: 'text-info'
        },
        {
          field: 'Estado.Nombre',
          displayName: $translate.instant('ESTADO'),
           headerCellClass: 'text-info'
        },
        {
          field: 'DependenciaSolicitante.Nombre',
          displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
           headerCellClass: 'text-info'
        },
        {
          field: 'Opciones',
          cellTemplate: '<center>' +
            ' <a type="button" class="editar" ng-click="grid.appScope.rpConsulta.verRp(row,false)" > ' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>' +
            ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.rpConsulta.verRp(row,true)" >' +
            '<i class="fa fa-file-excel-o fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.ANULAR\' | translate }}"></i></a>',
          headerCellClass: 'text-info'
        }
      ]

    };

    self.gridOptions_rubros = {
      rowHeight: 30,
      headerHeight: 30,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
          displayName: 'Codigo'
        },
        {
          field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',
          displayName: 'Descripcion'
        },
        {
          field: 'Valor',
          cellFilter: 'currency'
        },
        {
          field: 'Saldo',
          cellFilter: 'currency'
        }
      ]
    };

    self.gridOptions.multiSelect = false;
    self.cargandoDatosPagos = true;
    self.cargarLista = function () {
      financieraRequest.get('registro_presupuestal', 'limit=0').then(function (response) {
        self.gridOptions.data = response.data;
        angular.forEach(self.gridOptions.data, function (data) {
          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', 'limit=1&query=RegistroPresupuestal:' + data.Id).then(function (response) {
            data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
            financieraMidRequest.get('disponibilidad/SolicitudById/' + data.Disponibilidad.Solicitud, '').then(function (response) {
              self.cargandoDatosPagos = false;
              data.Necesidad = response.data[0].SolicitudDisponibilidad.Necesidad;
              data.DependenciaSolicitante = response.data[0].DependenciaSolicitante;
            });
          });
        });
      });
    };
    self.cargarLista();
    // called no matter success or failure

    self.limpiar = function () {
      self.motivo = undefined;
      self.Valor = undefined;
      self.Rubro_sel = undefined;
      self.alerta = "";
    };

    self.verRp = function (row, anular) {
      self.anular = anular;
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      financieraRequest.get('registro_presupuestal', 'query=Id:' + row.entity.Id).then(function (response) {

        self.detalle = response.data;
        angular.forEach(self.detalle, function (data) {

          agoraRequest.get('informacion_proveedor/' + data.Beneficiario, '').then(function (response) {

            data.Beneficiario = response.data;

          });
        });
        angular.forEach(self.detalle, function (data) {
          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', 'query=RegistroPresupuestal.Id:' + data.Id).then(function (response) {
            self.gridOptions_rubros.data = response.data;
            data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
            angular.forEach(self.gridOptions_rubros.data, function (rubros_data) {
              var rpdata = {
                Rp: rubros_data.RegistroPresupuestal,
                Apropiacion: rubros_data.DisponibilidadApropiacion.Apropiacion
              };
              financieraRequest.post('registro_presupuestal/SaldoRp', rpdata).then(function (response) {
                rubros_data.Saldo = response.data;
              });
              financieraMidRequest.get('disponibilidad/SolicitudById/' + rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud, '').then(function (response) {
                var solicitud = response.data
                angular.forEach(solicitud, function (data) {
                  self.Necesidad = data.SolicitudDisponibilidad.Necesidad;
                  console.log(self.Necesidad);


                });

              });
              if ($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) !== -1) {

              } else {
                $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
              }

            });
            self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
          });

        });
      });
    };
    self.anularRp = function(){
      if (self.motivo == undefined || self.motivo ===""|| self.motivo == null){
        swal("", $translate.instant("E_A02") , "error")
      }else if (self.tipoAnulacion == undefined || self.tipoAnulacion ===""|| self.tipoAnulacion == null){
        swal("", $translate.instant("E_A03"), "error")
      }else if ((self.Valor == undefined || self.Valor ===""|| self.Valor == null)&&(self.tipoAnulacion === "P")){
        swal("", $translate.instant("E_A04"), "error")
      }else if ((self.Rubro_sel == undefined || self.Rubro_sel ===""|| self.Rubro_sel == null)&&(self.tipoAnulacion === "P")){
       swal("", $translate.instant("E_A06"), "error")
      }else if(parseFloat(self.Valor) <= 0){
        swal("", $translate.instant("E_A07"), "error")
      }else{
        var valor = 0;
        var rp_apropiacion =[];
        self.alerta = "<ol>"
        var anulacion = {
          Motivo : self.motivo,
          TipoAnulacion : self.tipoAnulacion,
          EstadoAnulacion : {Id:1},
          Expidio: 1234567890
        };
        if (self.tipoAnulacion === "T"){
          rp_apropiacion = self.rubros_afectados;
        }else if (self.tipoAnulacion === "P"){
          rp_apropiacion[0] = self.Rubro_sel;
          valor = parseFloat(self.Valor);
        }
        var datos_anulacion = {
          Anulacion : anulacion,
          Rp_apropiacion : rp_apropiacion,
          Valor : valor
        };
        console.log(datos_anulacion);
        financieraRequest.post('registro_presupuestal/Anular', datos_anulacion).then(function(response) {
            self.alerta_anulacion_rp = response.data;
            angular.forEach(self.alerta_anulacion_rp, function(data){

              if (data === "error" || data === "success"){

              }else{
                self.alerta = self.alerta +"<li align='left'>" +data +"</li>";
              }

            });
            self.alerta = self.alerta + "</ol>";
            swal("", self.alerta, self.alerta_anulacion_rp[0]).then(function(){
              self.limpiar();
              self.actualizarLista();
              //$("#myModal").modal('hide');
            });
          });
      }


    };
    /*self.gridOptions.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $("#myModal").modal();
        $scope.apropiacion = undefined;
        $scope.apropiaciones = [];
        financieraRequest.get('registro_presupuestal', 'query=Id:' + row.entity.Id).then(function (response) {

          self.detalle = response.data;
          angular.forEach(self.detalle, function (data) {

            agoraRequest.get('informacion_proveedor/' + data.Beneficiario, '').then(function (response) {

              data.Beneficiario = response.data;

            });
          });
          angular.forEach(self.detalle, function (data) {
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', 'query=RegistroPresupuestal.Id:' + data.Id).then(function (response) {
              self.gridOptions_rubros.data = response.data;
              data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
              angular.forEach(self.gridOptions_rubros.data, function (rubros_data) {
                var rpdata = {
                  Rp: rubros_data.RegistroPresupuestal,
                  Apropiacion: rubros_data.DisponibilidadApropiacion.Apropiacion
                };
                financieraRequest.post('registro_presupuestal/SaldoRp', rpdata).then(function (response) {
                  rubros_data.Saldo = response.data;
                });
                financieraMidRequest.get('disponibilidad/SolicitudById/' + rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud, '').then(function (response) {
                  var solicitud = response.data
                  angular.forEach(solicitud, function (data) {
                    self.Necesidad = data.SolicitudDisponibilidad.Necesidad;
                    console.log(self.Necesidad);


                  });

                });
                if ($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) !== -1) {

                } else {
                  $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
                }

              });
              self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
            });

          });
        });
      });
    };*/

    self.gridOptions_rubros.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.apropiacion = row.entity;
        $scope.apropiacion_id = row.entity.DisponibilidadApropiacion.Apropiacion.Id;
      });
    };

  });
