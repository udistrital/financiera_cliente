'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpAprobacionAnulacionCtrl
 * @description
 * # CdpCdpAprobacionAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CdpCdpAprobacionAnulacionCtrl', function ($scope,$translate,financieraRequest,financieraMidRequest,agoraRequest) {
    var self = this;
    self.rubros_afectados = [];
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('CDP_NUMERO') },
        {field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Vigencia',   displayName: $translate.instant('VIGENCIA'), cellClass: 'input_center'},
        {field: 'FechaRegistro' , displayName : $translate.instant('FECHA_CREACION'), cellClass: 'input_center',cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'EstadoAnulacion.Nombre', displayName : $translate.instant('ESTADO')},
        {field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Solicitud.DependenciaSolicitante.Nombre' , displayName : $translate.instant('DEPENDENCIA_SOLICITANTE')}
      ]

    };
    self.gridOptions.multiSelect = false;
    self.cargarListaAnulaciones = function(){
      financieraRequest.get('anulacion_disponibilidad',$.param({
        limit: -1
      })).then(function(response){
        self.gridOptions.data = response.data;
        angular.forEach(self.gridOptions.data, function(data){
          financieraMidRequest.get('disponibilidad/SolicitudById/'+data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Solicitud,'').then(function(response) {
            data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Solicitud = response.data[0];
          });
        });
      });
    };

    self.cargarListaAnulaciones();

    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        self.cdp = row.entity.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad;
        self.anulacion = row.entity;
        console.log(self.anulacion);
        financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.cdp.Id).then(function(response) {
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
              financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                data.Saldo  = response.data;
              });

            });

              agoraRequest.get('informacion_persona_natural',$.param({
                query: "Id:"+self.cdp.Responsable,
                limit: 1
              })).then(function(response){
                if (response.data != null){
                  self.cdp.Responsable = response.data[0];
                }

              });


        });
      });
    };

    self.aprobarAnulacion = function(){
      console.log("anulacion. ");
      console.log(self.anulacion);
    };

  });
