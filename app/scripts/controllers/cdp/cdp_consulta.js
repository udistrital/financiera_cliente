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
  .controller('CdpCdpConsultaCtrl', function ($window,disponibilidad,$scope,financieraRequest,financieraMidRequest,uiGridService,agoraRequest) {
    var self = this;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass: 'input_center'},
        {field: 'NumeroDisponibilidad',   displayName: 'No.', cellClass: 'input_center'},
        {field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Numero' , displayName : 'Necesidad No.', cellClass: 'input_center'},
        {field: 'FechaRegistro' , displayName : 'Fecha de Registro' ,cellClass: 'input_center', cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>'},
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
    financieraRequest.get('disponibilidad','limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
          data.Solicitud = response.data[0];
        });
      });
      console.log(self.gridOptions.data );
    });
    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        self.cdp = row.entity;
        financieraRequest.get('disponibilidad_apropiacion','limit=0&query=Disponibilidad.Id:'+row.entity.Id).then(function(response) {
          self.gridOptions_rubros.data = response.data;
          angular.forEach(self.gridOptions_rubros.data, function(data){
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
              self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
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
    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.apropiacion = row.entity;
        console.log(row.entity);
        $scope.apropiacion_id = row.entity.Apropiacion.Id;
      });
    };
  });
