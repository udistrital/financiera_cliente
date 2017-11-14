'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasEditarDescuentoCtrl
 * @description
 * # PlanCuentasEditarDescuentoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('EditarDescuentoCtrl', function (financieraRequest,administrativaRequest, $scope, $routeParams, $translate) {
    var self = this;

    self.cargar_descuento=function(){
      financieraRequest.get("cuenta_especial", $.param({
        query: "Id:" + $routeParams.Id
      })).then(function(response) {
        self.e_descuento=response.data[0];
        self.search_tercero();
      });
    };

    self.cargar_tipos = function() {
      financieraRequest.get("tipo_cuenta_especial", "").then(function(response) {
        self.tipos_cuentas = response.data;
      });
    };

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      data:[],
      columnDefs: [{
          field: 'NumDocumento',
          displayName: $translate.instant('DOCUMENTO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '20%'
        },
        {
            field: 'Tipopersona',
            displayName: $translate.instant('TIPO'),
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            width: '20%'
        },
        {
          field: 'NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '60%'
        }
      ]
    };

    //opciones extras para el control del grid
    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.enablePaginationControls = true;
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.e_descuento.proveedor = self.gridApi.selection.getSelectedRows()[0];
        self.e_descuento.InformacionPersonaJuridica=self.gridApi.selection.getSelectedRows()[0].Id;
      });
    };

    self.search_tercero=function(){
      administrativaRequest.get("informacion_proveedor", $.param({
        query:"Id:"+self.e_descuento.InformacionPersonaJuridica,
        fields:"Id,Tipopersona,NumDocumento,NomProveedor"
      })).then(function(response) {
        //self.gridOptions.data = response.data;
        self.e_descuento.proveedor=response.data[0];
        console.log("aui",response.data);
      });
    };

    self.search_terceros=function(){
      administrativaRequest.get("informacion_proveedor", $.param({
        query:"NumDocumento:"+$scope.num_documento,
        fields:"Id,Tipopersona,NumDocumento,NomProveedor",
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    self.cargar_descuento();
    self.cargar_tipos();
    self.cargar_plan_maestro();


  });
