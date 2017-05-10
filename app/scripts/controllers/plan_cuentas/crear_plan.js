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
    self.actualizar = false;

    self.gridOptions = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
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
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '20%',
          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row,\'ver\')" >' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '<a class="borrar" ng-click="grid.appScope.TiposAvance.load_row(row,\'delete\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.BORRAR\' | translate }}" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>' +
            '</center>'
        }
      ]

    };

    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.noUnselect = true;

    self.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        $scope.plansel = $scope.gridApi.selection.getSelectedRows()[0];
        console.log(self.plan);
      });
    };


    self.cargar_datos = function() {
      financieraRequest.get('plan_cuentas', $.param({
        sortby: "Id",
        order: "asc",
        limit: 0
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };



    //----
    self.cargar_datos();

    financieraRequest.get("unidad_ejecutora", $.param({
      sortby: "Id",
      order: "asc",
      limit: 0
    })).then(function(response) {
      self.unidades_ejecutoras = response.data;
    });

    self.crear_plan = function(form) {
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
    };

    $scope.$watch('[crearPlan.gridOptions.paginationPageSize,crearPlan.gridOptions.data]', function() {
      console.log("sisss" + self.gridOptions.paginationPageSize);
      if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize == null) && self.gridOptions.data.length > 0) {
        $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
        if (self.gridOptions.data.length <= 10) {
          self.gridOptions.enablePaginationControls = false;
          $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
        }
      } else {
        $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
        self.gridOptions.enablePaginationControls = true;
      }
    }, true);

  });
