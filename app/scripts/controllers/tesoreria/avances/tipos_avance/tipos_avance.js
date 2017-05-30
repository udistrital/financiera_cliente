'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TiposAvanceCtrl
 * @description
 * # TiposAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TiposAvanceCtrl', function($scope, financieraRequest, $translate) {
    var ctrl = this;
    ctrl.requisitos_tipo = {};
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

          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.TiposAvance.load_row(row,\'ver\')" >' +
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
    ctrl.gridOptions.multiSelect = false;
    ctrl.get_all_avances = function() {
      financieraRequest.get("tipo_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          ctrl.gridOptions.data = response.data;
          console.log(ctrl.gridOptions.data);
        });
    };
    var sumarDias = function(data, dias){
      var fecha = new Date(data);
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    };
    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {});
    };
    ctrl.update_config = function() {
      financieraRequest.get("requisito_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          ctrl.requisito_avance = response.data;
          console.log(ctrl.requisito_avance);
        });
    };
    ctrl.get_all_avances();



    ctrl.load_row = function(row, operacion) {
      ctrl.operacion = operacion;
      switch (operacion) {
        case "ver":
          ctrl.row_entity = row.entity;
          break;
        case "add":
          ctrl.tipo_avance.Referencia = "";
          ctrl.tipo_avance.Nombre = "";
          ctrl.tipo_avance.Descripcion = "";
          break;
        case "edit":
          ctrl.row_entity = row.entity;
          ctrl.tipo_avance.Referencia = ctrl.row_entity.Referencia;
          ctrl.tipo_avance.Nombre = ctrl.row_entity.Nombre;
          ctrl.tipo_avance.Descripcion = ctrl.row_entity.Descripcion;
          ctrl.tipo_avance.Estado = ctrl.row_entity.Estado;
          ctrl.tipo_avance.FechaRegistro = sumarDias(ctrl.row_entity.FechaRegistro, 1);
          break;
        case "delete":
          ctrl.row_entity = row.entity;
          ctrl.delete_tipo();
          break;
        case "config":
          ctrl.row_entity = row.entity;
          ctrl.update_config();
          break;
        default:
      }
    };
    ctrl.delete_tipo = function() {
      swal({
        title: 'Está seguro ?',
        text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.Referencia,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('BTN.BORRAR')
      }).then(function() {
        financieraRequest.delete("tipo_avance", ctrl.row_entity.Id)
          .then(function(response) {
            if (response.status === 200) {
              swal(
                $translate.instant('ELIMINADO'),
                ctrl.row_entity.Referencia + ' ' + $translate.instant('FUE_ELIMINADO'),
                'success'
              );
              ctrl.get_all_avances();
            }
          });
      })

    };
    ctrl.add_edit = function() {
      var data = {};
      switch (ctrl.operacion) {
        case 'edit':
          data = {
            Id: ctrl.row_entity.Id,
            Referencia: ctrl.tipo_avance.Referencia,
            Nombre: ctrl.tipo_avance.Nombre,
            Descripcion: ctrl.tipo_avance.Descripcion,
            Estado: ctrl.tipo_avance.Estado,
            FechaRegistro: ctrl.tipo_avance.FechaRegistro,
          };
          console.log(data);
          financieraRequest.put("tipo_avance", data.Id, data)
            .then(function(response) {
              if (response.status === 200) {
                swal(
                  $translate.instant('ACTUALIZADO'),
                  ctrl.row_entity.Referencia + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                  'success'
                );
                ctrl.get_all_avances();
              }
            });
          break;
        case 'add':
          data = {
            Referencia: ctrl.tipo_avance.Referencia,
            Nombre: ctrl.tipo_avance.Nombre,
            Descripcion: ctrl.tipo_avance.Descripcion
          };
          financieraRequest.post("tipo_avance", data)
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
