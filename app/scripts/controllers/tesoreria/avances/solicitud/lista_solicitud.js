'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesListaSolicitudCtrl
 * @description
 * # TesoreriaAvancesListaSolicitudCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ListaSolicitudCtrl', function (financieraRequest, $translate) {
    var ctrl = this;

    ctrl.get_solicitudes = function(){
      financieraRequest.get("estado_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          console.log(response);
          ctrl.gridOptions.data = response.data;
        });
    };
    ctrl.get_solicitudes();
    ctrl.gridOptions = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [
        {
          field: 'SolicitudAvance.Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '10%',
        },
        {
          field: 'SolicitudAvance.Consecutivo',
          displayName: $translate.instant('CONSECUTIVO'),
          width: '15%',
        },
        {
          field: 'SolicitudAvance.Objetivo',
          displayName: $translate.instant('OBJETIVO'),
          width: '15%',
        },
        {
          field:'SolicitudAvance.IdBeneficiario',
          displayName: $translate.instant('BENEFICIARIO')
        },
        {
          field: 'Estado',
          displayName: $translate.instant('ESTADO'),
          cellTemplate: '<div align="center">{{row.entity.Estados.Nombre}}</div>',
          width: '10%',
        },
        {
          field: 'FechaRegistro',
          displayName: $translate.instant('FECHA'),
          cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span></div>',
          width: '12%',
        },
        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '8%',

          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.TiposAvance.load_row(row,\'ver\')" data-toggle="modal" data-target="#modalVer">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
            '<a class="configuracion" ng-click="grid.appScope.TiposAvance.load_row(row,\'config\');" data-toggle="modal" data-target="#modalConf">' +
            '<i data-toggle="tooltip" title="{{\'BTN.CONFIGURAR\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover" aria-hidden="true"></i></a> ' +
            '<a class="borrar" ng-click="grid.appScope.TiposAvance.load_row(row,\'delete\');">' +
            '<i data-toggle="tooltip" title="{{\'BTN.BORRAR\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a>' +
            '</center>'
        }
      ]
    };
  });
