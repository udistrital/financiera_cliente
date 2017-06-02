'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasCrearDescuentoCtrl
 * @description
 * # PlanCuentasCrearDescuentoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearDescuentoCtrl', function($scope, financieraRequest, agoraRequest, $translate) {
    var self = this;
    self.descuento_nuevo = {};

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('NIT'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '30%'
        },
        {
          field: 'NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '69%'
        }
      ]
    };

    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;

    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.proveedor = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.cargar = function() {
      financieraRequest.get("tipo_cuenta_especial", "").then(function(response) {
        self.tipos_cuentas = response.data;
      });
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
      agoraRequest.get("informacion_persona_juridica", $.param({
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    self.crear_nuevo = function() {
      var alerta = "";
      if (self.cuenta_contable == undefined || self.proveedor == undefined) {
        if (self.cuenta_contable == undefined) {
          alerta += "<li>Es necesario seleccionar la cuenta contable asociada al descuento</li>";
        }
        if (self.proveedor == undefined) {
          alerta += "<li>Es necesario seleccionar el proveedor asociado al descuento</li>";
        }
        swal("", alerta, "error");
      } else {
        var nuevo = {
          Descripcion: self.descripcion,
          CuentaContable: self.cuenta_contable,
          TipoCuentaEspecial: self.tipo_cuenta,
          InformacionPersonaJuridica: self.proveedor.Id
        };
        console.log(self.proveedor.Id);
        if (self.tipo_cuenta.Nombre === "Impuesto") {
          nuevo.Porcentaje = self.porcentaje;
          nuevo.TarifaUvt = self.base_min;
          nuevo.Deducible = self.deducible;
        }
        self.descuento_nuevo = nuevo;
        financieraRequest.post("cuenta_especial", nuevo).then(function(response) {
          console.log(response);
          swal("", "La cuenta se creo exitosamente", "success");
        });
      }
    };

    self.cargar();

    $scope.$watch('crearDescuento.cuenta_contable', function() {
      if (self.cuenta_contable !== undefined) {
        if (self.cuenta_contable.Hijos != null) {
          self.cuenta_contable = undefined;
          swal("Espera!", "Unicamente puedes seleccionar cuentas que no tengan hijos", "warning");
        }
      }
    }, true);

    $scope.$watch('crearDescuento.gridOptions.data', function() {
        if (self.gridOptions.data.length <= 5) {
          self.gridOptions.enablePaginationControls = false;
      } else {
        self.gridOptions.enablePaginationControls = true;
      }
    }, true);

  });
