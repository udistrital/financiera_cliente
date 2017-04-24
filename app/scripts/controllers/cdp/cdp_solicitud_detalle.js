'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpSolicitudDetalleCtrl
 * @description
 * # CdpCdpSolicitudDetalleCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CdpCdpSolicitudDetalleCtrl', function ($scope,argoRequest, uiGridService,financieraRequest,financieraMidRequest,solicitud_disponibilidad) {

    $scope.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Apropiacion.Rubro.Codigo', displayName: 'Codigo'},
        {field: 'Apropiacion.Rubro.Vigencia',  displayName: 'Vigencia',  cellClass:'alignleft'},
        {field: 'Apropiacion.Rubro.Descripcion',  displayName: 'Descripcion'},
        {field: 'Apropiacion.Rubro.Estado',    displayName: 'Estado' },
        {field: 'MontoParcial',    displayName: 'Monto Parcial' , cellFilter: 'currency' }
      ],
      onRegisterApi : function( gridApi ) {
        $scope.gridApi = gridApi;
      }

    };


    $scope.gridOptions_actividad = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Actividad.Nombre', displayName: 'Nombre',        width: '20%'},
        {field: 'Actividad.Descripcion',  displayName: 'Descripcion',     width: '40%',  cellClass:'alignleft'},
        {field: 'Actividad.CentroCostos.Nombre',  displayName: 'Centro de costos',  width: '15%'},
        {field: 'MontoParcial',    displayName: 'Monto Parcial' ,     width: '15%'}
      ],
      onRegisterApi : function( gridApi ) {
        $scope.gridApi_actividad = gridApi;
      }

    };

    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.apropiacion = row.entity.Apropiacion.Id;
        console.log($scope.apropiacion);
      //  argoRequest.get('actividad_solicitud_necesidad','query=Necesidad.Id:'+row.entity.SolicitudNecesidad.Id).then(function(response) {
  		//      $scope.gridOptions_actividad.data = response.data
  		//});
        //console.log(row.entity.RubroSolicitudNecesidad.Id);
      });
  	};

     $scope.gridOptions.multiSelect = false;
  	$scope.solicitud_disponibilidad = solicitud_disponibilidad;
  	financieraMidRequest.get('disponibilidad/SolicitudById/'+$scope.solicitud_disponibilidad.Id,'').then(function(response) {
  		$scope.data = response.data;
  	});

  	argoRequest.get('fuente_financiacion_rubro_necesidad','query=SolicitudNecesidad.Id:'+$scope.solicitud_disponibilidad.Necesidad).then(function(response) {
  		$scope.gridOptions.data = response.data;
      angular.forEach($scope.gridOptions.data, function(data){
        financieraRequest.get('apropiacion','limit=1&query=Id:'+data.Apropiacion).then(function(response) {

  
          data.Apropiacion = response.data[0];

        });
        });
  	});



  });
