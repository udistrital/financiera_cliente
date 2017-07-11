'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesListaSolicitudCtrl
 * @description
 * # TesoreriaAvancesListaSolicitudCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ListaSolicitudCtrl', function(financieraRequest, $translate, $scope, modelsRequest) {
    var ctrl = this;

    ctrl.get_solicitudes = function() {
      financieraRequest.get("estado_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          console.log(response.data);
          angular.forEach(response.data, function(solicitud) {
            //aqui va la conexions con el beneficiario
            modelsRequest.get("terceros_completo")
              .then(function(response) {
                solicitud.Tercero = response.data;
              });
            financieraRequest.get("solicitud_tipo_avance", $.param({
                query: "SolicitudAvance.Id:" + solicitud.SolicitudAvance.Id,
                sortby: "Id",
                limit: -1,
                order: "asc"
              }))
              .then(function(response) {
                solicitud.Tipos = response.data;
                angular.forEach(solicitud.Tipos, function(tipo) {
                  financieraRequest.get("requisito_tipo_avance", $.param({
                      query: "TipoAvance:" + tipo.Id + ",Estado:" + "A",
                      limit: -1,
                      fields: "RequisitoAvance,TipoAvance",
                      sortby: "TipoAvance",
                      order: "asc"
                    }))
                    .then(function(response) {
                      tipo.Requisitos = response.data;
                    });
                });
              });

          });
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
      columnDefs: [{
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
          field: 'Tercero.documento',
          displayName: $translate.instant('DOCUMENTO')
        },
        {
          field: 'Tercero.nombres',
          displayName: $translate.instant('NOMBRES')
        },
        {
          field: 'Tercero.apellidos',
          displayName: $translate.instant('APELLIDOS')
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
            '<a class="ver" ng-click="grid.appScope.listaSolicitud.ver_fila(row.entity)" data-toggle="modal" data-target="#modal_ver">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '</center>'
        }
      ]
    };

    ctrl.ver_fila = function(row) {
      $scope.solicitud = row;
      console.log($scope.solicitud);
    };

  });
