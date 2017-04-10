'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpAnulacionCtrl
 * @description
 * # CdpCdpAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CdpCdpAnulacionCtrl', function ($scope,financieraRequest,financieraMidRequest,uiGridService) {
    var self = this;
    self.formVisibility = false;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass:'alignleft'},
        {field: 'NumeroDisponibilidad',   displayName: 'Consecutivo'},
        {field: 'FechaRegistro' , displayName : 'Fecha de Registro' , cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'Estado.Nombre', displayName : 'Estado'},
        {field: 'Solicitud.DependenciaSolicitante.Nombre' , displayName : 'Dependencia Solicitante'}
      ]

    };

    self.gridOptions_rubros = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Apropiacion.Rubro.Codigo', displayName: 'Codigo'},
        {field: 'Apropiacion.Rubro.Descripcion',  displayName: 'Descripcion'},
        {field: 'Apropiacion.Rubro.Estado',    displayName: 'Estado' },
        {field: 'Valor', cellFilter: 'currency' },
        {field: 'Saldo', cellFilter: 'currency'}
      ]
    };

    self.gridOptions.multiSelect = false;
    financieraRequest.get('disponibilidad','limit=0').then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
          data.Solicitud = response.data[0];
        });
      });
      console.log(self.gridOptions.data );
    });

    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
          $scope.apropiacion = row.entity;
        });
    };



    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){

          $("#myModal").modal();
          self.cdp = row.entity;
          financieraRequest.get('disponibilidad_apropiacion','limit=0&query=Disponibilidad.Id:'+row.entity.Id).then(function(response) {
            self.gridOptions_rubros.data = response.data;
            angular.forEach(self.gridOptions_rubros.data, function(data){
                var saldo;
                var rp = {
                  Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                  Apropiacion : data.Apropiacion
                };
                financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                  data.Saldo  = response.data;
                });

              });
              self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
          });
      });
    };


    self.ShowForm = function(){
   self.formVisibility = !self.formVisibility;
    };



  });
