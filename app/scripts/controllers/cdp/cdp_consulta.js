'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpConsultaCtrl
 * @description
 * # CdpCdpConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.factory("disponibilidad",function(){
        return {};
  })
  .controller('CdpCdpConsultaCtrl', function ($window,disponibilidad,$scope,financieraRequest,financieraMidRequest) {
    var self = this;
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
        {field: 'InfoSolicitud.DependenciaSolicitante.Nombre' , displayName : 'Dependencia Solicitante'}
      ]

    }
    self.gridOptions.multiSelect = false;
    financieraRequest.get('disponibilidad','limit=0').then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
          data.InfoSolicitud = response.data[0];
        });
      });
      console.log(self.gridOptions.data );
    });
    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.disponibilidad = disponibilidad;
        $scope.disponibilidad.Id = row.entity.Id;
        console.log(row);
        $window.location.href = '#/cdp/cdp_detalle';
      });
    };
  });
