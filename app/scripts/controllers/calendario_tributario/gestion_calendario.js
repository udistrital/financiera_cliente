'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CalendarioTributarioGestionCalendarioCtrl
 * @description
 * # CalendarioTributarioGestionCalendarioCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionCalendarioCtrl', function ($scope,$translate,uiGridConstants) {
    var self=this;


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
          field: 'Vigencia',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          displayName: $translate.instant('VIGENCIA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '8%'
        },
        /*{
          field: 'DenominacionBanco',
          displayName: $translate.instant('DENOMINACION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '20%'
        },*/
        {
          field: 'Entidad.Nombre',
          displayName: $translate.instant('ENTIDAD'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '30%'
        },
        {
          field: 'FechaInicio',
          displayName: $translate.instant('FECHA_INICIO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '10%'
        },
        {
          field: 'FechaFin',
          displayName: $translate.instant('FECHA_FIN'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '9%'
        },
        {
          field: 'Responsable',
          displayName: $translate.instant('RESPONSABLE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          //cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.EstadoActivo" disabled></center>',
          width: '14%'
        },
        {
          field: 'EstadoCalendario.Nombre',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '7%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '7%',
          cellTemplate: '<center>' + '<a href="" class="ver" data-toggle="modal" data-target="#modalbanco" ng-click="grid.appScope.id_banco=row.entity.Id">' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a href="" class="editar" ng-click="grid.appScope.gestionBancos.modo_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
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

    self.gridOptions.data=[
      {
        Descripcion: "Calendario prueba",
        FechaInicio: "01-05-2015",
        FechaFin: "30-06-2015",
        Vigencia: 2015,
        Entidad: {
          Nombre:"U Distrital"
        },
        EstadoCalendario: {
          Nombre:"Sin pagar"
        },
        Responsable: 19654664
      },
      {
        Descripcion: "Calendario prueba 2",
        FechaInicio: "01-05-2015",
        FechaFin: "30-06-2015",
        Vigencia: 2015,
        Entidad: {
          Nombre:"U Distrital"
        },
        EstadoCalendario: {
          Nombre:"Sin pagar"
        },
        Responsable: 19654664
      }
    ];


  });
