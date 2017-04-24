'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpConsultaCtrl
 * @description
 * # RpRpConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.factory("rp",function(){
        return {};
  })
  .controller('RpRpConsultaCtrl', function ($window,rp,$scope,financieraRequest,financieraMidRequest,uiGridService,agoraRequest) {
    var self = this;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass:'alignleft'},
        {field: 'NumeroRegistroPresupuestal',   displayName: 'Consecutivo del RP'},
        {field: 'Disponibilidad.NumeroDisponibilidad',   displayName: 'Consecutivo del CDP'},
        {field: 'Necesidad.Numero',   displayName: 'Consecutivo de la Necesidad'},
        {field: 'FechaMovimiento' , displayName : 'Fecha de Registro' , cellTemplate: '<span>{{row.entity.FechaMovimiento | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'Estado.Nombre', displayName : 'Estado'},
      ]

    };

    self.gridOptions_rubros = {
      rowHeight: 30,
      headerHeight : 30,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo', displayName: 'Codigo'},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',  displayName: 'Descripcion'},
        {field: 'Valor',  cellFilter: 'currency' },
        {field: 'Saldo', cellFilter: 'currency'}
      ]
    };

    self.gridOptions.multiSelect = false;
    financieraRequest.get('registro_presupuestal','limit=0').then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion','limit=1&query=RegistroPresupuestal:'+data.Id).then(function(response) {
          data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
          financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Disponibilidad.Solicitud,'').then(function(response) {

                data.Necesidad = response.data[0].SolicitudDisponibilidad.Necesidad;


            });
        });
      });
    });
    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        financieraRequest.get('registro_presupuestal','query=Id:'+row.entity.Id).then(function(response) {

            self.detalle = response.data;
            angular.forEach(self.detalle, function(data){

              agoraRequest.get('informacion_proveedor/'+data.Beneficiario,'').then(function(response) {

                    data.Beneficiario = response.data;

                });
              });
            angular.forEach(self.detalle, function(data){
              financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion','query=RegistroPresupuestal.Id:'+data.Id).then(function(response) {
                  self.gridOptions_rubros.data = response.data;
                  data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
                  angular.forEach(self.gridOptions_rubros.data, function(rubros_data){
                    var rpdata = {
                      Rp : rubros_data.RegistroPresupuestal,
                      Apropiacion : rubros_data.DisponibilidadApropiacion.Apropiacion
                    };
                    financieraRequest.post('registro_presupuestal/SaldoRp',rpdata).then(function(response){
                      rubros_data.Saldo  = response.data;
                    });
                    financieraMidRequest.get('disponibilidad/SolicitudById/'+rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud,'').then(function(response) {
                        var solicitud = response.data
                        angular.forEach(solicitud, function(data){
                          self.Necesidad = data.SolicitudDisponibilidad.Necesidad;
                          console.log(self.Necesidad);


                        });

                      });
                      if($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) !== -1) {

                      }else{
                        $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
                      }

                    });
                    self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
                });

            });
          });
      });
    };

    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.apropiacion = row.entity;
        $scope.apropiacion_id = row.entity.DisponibilidadApropiacion.Apropiacion.Id;
      });
    };
  });
