'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionBancosCtrl
 * @description
 * # BancosGestionBancosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionBancosCtrl', function (coreRequest, $scope, $translate) {
    var self = this;
    self.nuevo_banco={};

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Nit',
          displayName: $translate.instant('NIT'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '10%'
        },
        /*{
          field: 'DenominacionBanco',
          displayName: $translate.instant('DENOMINACION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '25%'
        },*/
        {
          field: 'NombreBanco',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '25%'
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '29%'
        },
        {
          field: 'CodigoAch',
          displayName: $translate.instant('ACH'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '5%'
        },
        {
          field: 'CodigoSuperintendencia',
          displayName: $translate.instant('CODIGO_SUPER'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        {
          field: 'EstadoActivo',
          displayName: $translate.instant('ACTIVO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.EstadoActivo" disabled></center>',
          width: '8%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '8%',
          cellTemplate: '<center>' + '<a href="" class="ver" data-toggle="modal" data-target="#modalbanco" ng-click="grid.appScope.id_banco=row.entity.Id">' +
          '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a href="" class="editar" ng-click="grid.appScope.crearPlan.mod_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '</center>'
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
        self.cuenta = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.cargar_bancos=function(){
      coreRequest.get('banco',$.param({
        limit:-1
      })).then(function(response){
        self.gridOptions.data=response.data;
      });
    };

    self.cargar_sucursales_banco=function(banco){
      coreRequest.get('sucursal',$.param({
        query: "Banco:"+banco.Id,
        field: "Id,Nombre",
        limit:-1
      })).then(function(response){
        banco.sucursales=response.data;
      });
    };

    self.agregar_banco=function(){
      self.nuevo_banco.EstadoActivo=true;
      coreRequest.post('banco',self.nuevo_banco).then(function(response){
        console.log(response);
        self.nuevo_banco={};
      });
    };

    self.cargar_bancos();



  });
