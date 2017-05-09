'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TiposAvanceCtrl
 * @description
 * # TiposAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TiposAvanceCtrl', function(CONF, $scope, avancesRequest, $translate) {
    var ctrl = this;
    ctrl.operacion = "";
    ctrl.row_entity = {};
    ctrl.tipo_avance = {};
    ctrl.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
          field: 'IdTipo',
          visible: false
        },
        {
          field: 'Referencia',
          displayName: $translate.instant('REFERENCIA'),
          cellTemplate: '<div align="center">{{row.entity.Referencia}}</div>',
          width: '10%',
        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          width: '20%',
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          width: '47%',
        },
        {
          field: 'Estado',
          displayName: $translate.instant('ESTADO'),
          cellTemplate: '<div align="center">{{row.entity.Estado}}</div>',
          width: '5%',
        },
        {
          field: 'FechaRegistro',
          displayName: $translate.instant('FECHA_REGISTRO'),
          cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span></div>',
          width: '10%',
        },
        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '8%',
          cellTemplate: '<center>\
            <a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row,\'ver\')" ><i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="Ver !"></i></a> \
            <a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal"><i data-toggle="tooltip" title="Editar !" class="fa fa-cog fa-lg" aria-hidden="true"></i></a>  \
            <a class="borrar" ng-click="grid.appScope.TiposAvance.load_row(row,\'delete\');" data-toggle="modal" data-target="#myModal"><i data-toggle="tooltip" title="Borrar !" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>\
           </center>'
        }
      ]
    };
    ctrl.gridOptions.multiSelect = false;
    ctrl.get_all_avances = function() {
      avancesRequest.get(CONF.HOST_TIPO_AVANCE, "")
        .then(function(response) {
          ctrl.gridOptions.data = response.data;
          console.log(ctrl.gridOptions.data);
        });
    };

    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {});
    };

    ctrl.get_all_avances();

    ctrl.load_row = function(row, operacion) {
      console.log(operacion);
      ctrl.operacion = operacion;
      if (row === "") {
        ctrl.tipo_avance.Referencia = "";
        ctrl.tipo_avance.Nombre = "";
        ctrl.tipo_avance.Descripcion = "";
      } else {
        ctrl.row_entity = row.entity;
        ctrl.tipo_avance.Referencia = ctrl.row_entity.Referencia;
        ctrl.tipo_avance.Nombre = ctrl.row_entity.Nombre;
        ctrl.tipo_avance.Descripcion = ctrl.row_entity.Descripcion;
        ctrl.tipo_avance.Estado = ctrl.row_entity.Estado;
      }
    };

    ctrl.add_edit = function() {
      var data = {};
      switch (ctrl.operacion) {
        case 'edit':
          data = {
            Referencia: ctrl.tipo_avance.Referencia,
            Nombre: ctrl.tipo_avance.Nombre,
            Descripcion: ctrl.tipo_avance.Descripcion,
            Estado: ctrl.tipo_avance.Estado,
            IdTipo: ctrl.row_entity.IdTipo,
            FechaRegistro: ""
          };
          avancesRequest.put(CONF.HOST_TIPO_AVANCE, data)
            .then(function(info) {
              console.log(info);
              ctrl.get_all_avances();
            });
          break;
        case 'add':
          data = {
            Referencia: ctrl.tipo_avance.Referencia,
            Nombre: ctrl.tipo_avance.Nombre,
            Descripcion: ctrl.tipo_avance.Descripcion
          };
          avancesRequest.post(CONF.HOST_TIPO_AVANCE, data)
            .then(function(info) {
              console.log(info);
              ctrl.get_all_avances();
            });
          break;
        default:
      }
      ctrl.tipo_avance = {};
      $("#myModal").modal('hide');
    };
  });
