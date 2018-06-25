'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionRubroCrearCtrl
 * @description
 * # HomologacionRubroCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionRubroCrearCtrl', function ($scope,$translate,financieraMidRequest,gridApiService) {
    var ctrl = this;

    ctrl.botones = [
      { clase_color: "ver", clase_css: "fa fa-language fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_HOMOL'), operacion: 'verHomologacion', estado: true },
    ];

    ctrl.rubroHomologado={};
    ctrl.gridrubros = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableSelectAll: false,
      enableRowHeaderSelection: true,
      selectionRowHeaderWidth: 35,
      useExternalPagination:true,
      columnDefs: [
          {
              field: 'CodigoHomologado',
              displayName: $translate.instant('NUMERO_OPERACION'),
              headerCellClass:'text-info',
              width: '24%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('NOMBRE'),
              headerCellClass:'text-info',
              width: '24%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '24%'
          },
          {
              field: 'Organizacion[0].Nombre',
              displayName: $translate.instant('ENTIDAD'),
              headerCellClass:'text-info',
              width: '24%'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            ctrl.rubroHomologado = row.entity;
        });
        gridApi = gridApiService.pagination(gridApi,ctrl.consultarRubrosHomologacion,$scope)

      }
    };
    ctrl.consultarRubrosHomologacion = function(offset,query){
      financieraMidRequest.cancel();
      financieraMidRequest.get("rubro_homologado",$.param({
        limit: ctrl.gridrubros.paginationPageSize,
        offset:offset,
        query:query
      })).then(function(response){
          ctrl.gridrubros.data=response.data;
      });
    }

    ctrl.consultarRubrosEntidad= function(){
      ctrl.gridrubros.data = [];
      ctrl.consultarRubrosHomologacion(0, 'Organizacion:'+ctrl.entidad.Id);
    }
    ctrl.vincular = function(){
        var request = {
          RubroHomologado:{Id:ctrl.rubroHomologado.Id},
          Rubro:{Id:parseInt(ctrl.rubroSeleccionado.Id)},
        }
        financieraMidRequest.post("rubro_homologado/CreateHomologacion",request).then(
          function(response){
            swal('',$translate.instant(response.data.Code),response.data.Type)
          }
        );
    }
  ctrl.getLists=function(){

    financieraMidRequest.get('organizaciones_core_new/getOrganizacion', $.param({
        limit: -1,
        query: "CodigoAbreviacion:TE_2"
    })).then(function(response) {
        ctrl.entidades=response.data;
    });
  }
  ctrl.getLists();
    ctrl.creacionRubro=function(){
      $('#modal').modal();
    }
  });
