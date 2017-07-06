'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesRequisitosRequisitosCtrl
 * @description
 * # TesoreriaAvancesRequisitosRequisitosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RequisitosCtrl', function($scope, financieraRequest, $translate) {
    var ctrl = this;
    ctrl.operacion = "";
    ctrl.row_entity = {};
    ctrl.tipo_avance = {};
    ctrl.gridOptions = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
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
          width: '42%',
        },
        {
          field: 'Estado',
          displayName: $translate.instant('ESTADO'),
          cellTemplate: '<div align="center">{{row.entity.Estado}}</div>',
          width: '5%',
        },
        {
          field: 'Etapa',
          displayName: $translate.instant('ETAPA'),
          cellTemplate: '<div align="center">{{row.entity.Etapa}}</div>',
          width: '5%',
        },
        {
          field: 'FechaRegistro',
          displayName: $translate.instant('FECHA_REGISTRO'),
          cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span></div>',
          width: '10%',
        },
        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '8%',

          cellTemplate: '<center>' +
            '<a class="editar" ng-click="grid.appScope.requisitos.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
              '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' + '</a> ' +
              //boton borrar
              '<a class="borrar" ng-click="grid.appScope.requisitos.load_row(row,\'delete\');">' +
              '<i data-toggle="tooltip" title="{{\'BTN.BORRAR\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a>' +
              '</center>'
        }
      ]
    };

    ctrl.gridOptions.multiSelect = false;
    ctrl.get_all_avances = function() {
      financieraRequest.get("requisito_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
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
      ctrl.operacion = operacion;
      switch (operacion) {
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
          ctrl.tipo_avance.Etapa = ctrl.row_entity.Etapa;
          ctrl.tipo_avance.FechaRegistro = ctrl.row_entity.FechaRegistro;
          break;
        case "delete":
          ctrl.row_entity = row.entity;
          ctrl.delete_requisito();
          break;
      }
    };

    ctrl.delete_requisito = function() {
      swal({
        title: 'Está seguro ?',
        text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.Referencia,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('BTN.BORRAR')
      }).then(function() {
        financieraRequest.delete("requisito_avance", ctrl.row_entity.Id)
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
            Etapa: ctrl.tipo_avance.Etapa,
            FechaRegistro: ctrl.tipo_avance.FechaRegistro
          };
          console.log(data);
          financieraRequest.put("requisito_avance", data.Id, data)
            .then(function(info) {
              console.log(info);
              ctrl.get_all_avances();
            });
          break;
        case 'add':
          data = {
            Referencia: ctrl.tipo_avance.Referencia,
            Nombre: ctrl.tipo_avance.Nombre,
            Descripcion: ctrl.tipo_avance.Descripcion,
            Etapa: ctrl.tipo_avance.Etapa
          };
          financieraRequest.post("requisito_avance", data)
            .then(function(info) {
              console.log(info);
              ctrl.get_all_avances();
            });
          break;
        case 'delete':
          ctrl.delete_tipo();
          break;
        default:
      }
      ctrl.tipo_avance = {};
      $("#myModal").modal('hide');
    };
  });
