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

    ctrl.gridrubros = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: true,
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
              width: '24%',
              enableFiltering: false
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if(row.isSelected){
              ctrl.rubroHomologado = row.entity;
            }else{
              ctrl.rubroHomologado = undefined;
            }

        });
        gridApi = gridApiService.pagination(gridApi,ctrl.consultarRubrosHomologacion,$scope);

      },
      isRowSelectable: function(row) {
        return row.entity.Disponibilidad;
      }
    };
    ctrl.consultarRubrosHomologacion = function(offset,query){
      financieraMidRequest.cancel();
      if (!angular.isUndefined(ctrl.entidad.Id)){
        query='Organizacion:'+ctrl.entidad.Id;
      }

      financieraMidRequest.get("rubro_homologado/GetHomologationNumberEntity",$.param({
        idEntidad:ctrl.entidad.Id
      })).then(function(response){
          ctrl.gridrubros.totalItems = response.data.Body;
      });

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
      ctrl.consultarRubrosHomologacion(0, null);
    }

    ctrl.validar = function(){
      if(angular.isUndefined(ctrl.rubroSeleccionado)){
        swal("", $translate.instant("E_RB003"),"error");
        return false;
      }
      if(angular.isUndefined(ctrl.rubroHomologado)){
        swal("", $translate.instant("E_RB003"),"error");
        return false;
      }

      financieraMidRequest.get('rubro_homologado/GetHomologationNumberRubro/'+ctrl.rubroSeleccionado.Id).then(function(response){
        if (response.data.Body>=1){
          swal("", $translate.instant("E_RB003"),"error");
          return false;
        }
      });

    }

    ctrl.vincular = function(){
      if (!ctrl.validar()) {
        return;
      }
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
      $('#modal').modal('show');
    }
    $scope.$watch("rubrocreado",function(newValue,oldValue){
      if (!angular.isUndefined(newValue)){
        if (angular.equals(newValue,"success")){
          ctrl.consultarRubrosEntidad(0,'');
          $('#modal').modal('hide');
        }
      }
    },true);
  });
