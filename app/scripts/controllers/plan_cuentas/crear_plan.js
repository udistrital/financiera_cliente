'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasCrearPlanCtrl
 * @description
 * # PlanCuentasCrearPlanCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PlanCuentasCrearPlanCtrl', function(financieraRequest, $scope, uiGridConstants,$translate) {
    var self = this;
    self.nuevo_plan = {};

    self.gridOptions = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [
        {
          field: 'Nombre',
          cellClass: 'text-success',
          headerCellClass: 'text-info',
          cellTooltip: function(row, col) {
            return row.entity.Nombre;
          },
          width: '20%'
        },
        {
          field: 'Descripcion',
          headerCellClass: 'text-info',
          cellTooltip: function(row, col) {
            return row.entity.Descripcion;
          },
          width: '40%'
        },
        {
          field: 'UnidadEjecutora.Nombre',
          displayName: 'Unidad Ejecutora',
          headerCellClass: 'text-info',
          cellTooltip: function(row, col) {
            if (row.entity.UnidadEjecutora != null) {
              return row.entity.UnidadEjecutora.Nombre + " <" + row.entity.UnidadEjecutora.Entidad.Nombre + ">";
            } else {
              return ""
            }
          },
          width: '20%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '20%',
          cellTemplate: '<center>' +
            '<a href="" class="ver" data-toggle="modal" data-target="#modalverplan">' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a href="" class="editar" ng-click="grid.appScope.crearPlan.mod_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '</center>'
        }
      ]
    };

    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.noUnselect = true;

    self.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
      $scope.gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.plansel = $scope.gridApi.selection.getSelectedRows()[0];
        console.log(self.plansel);
      });
    };

    self.cargar_datos = function() {
      financieraRequest.get('plan_cuentas', $.param({
        query: "PlanMaestro:false",
        sortby: "Id",
        order: "asc",
        limit: 0
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    self.cargar_datos();

    financieraRequest.get("unidad_ejecutora", $.param({
      sortby: "Id",
      order: "asc",
      limit: 0
    })).then(function(response) {
      self.unidades_ejecutoras = response.data;
    });

    self.confirmar_plan = function(form) {
      if ($scope.editar) {
        financieraRequest.put("plan_cuentas",self.nuevo_plan.Id, self.nuevo_plan).then(function(response) {
          self.alerta = "";
          /*for (var i = 1; i < response.data.length; i++) {
            self.alerta = self.alerta + response.data[i] + "\n";
          }*/
          swal("", "edito", "success");
          //alert("plan de cuentas creado:"+ response.data.Nombre);
          self.nuevo_plan = {};
          self.cargar_datos();
          $("#modalform").modal("hide");
          form.$setPristine();
          form.$setUntouched();
        });
      }else{
        financieraRequest.post("plan_cuentas", self.nuevo_plan).then(function(response) {
          self.alerta = "";
          for (var i = 1; i < response.data.length; i++) {
            self.alerta = self.alerta + response.data[i] + "\n";
          }
          swal("", self.alerta, response.data[0]);
          //alert("plan de cuentas creado:"+ response.data.Nombre);
          self.nuevo_plan = {};
          self.cargar_datos();
          $("#modalform").modal("hide");
          form.$setPristine();
          form.$setUntouched();
        });
      }
    };

    self.mod_editar=function(plan){
      console.log(plan);
        self.nuevo_plan=JSON.parse( JSON.stringify( plan ) );
    };

    $scope.$watch('editar',function(){
      console.log($scope.editar);
      if ($scope.editar===false){
        self.nuevo_plan={};
      }
    });

    self.gridOptions.enablePaginationControls = true;



  });
