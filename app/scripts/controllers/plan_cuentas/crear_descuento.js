'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:CrearDescuentoCtrl
 * @alias crearDescuento
 * @requires $scope
 * @requires $translate
 * @requires financieraService.service:financieraRequest
 * @requires financieraService.service:administrativaRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {service} administrativaRequest Servicio para el API de financiera {@link agoraService.service:administrativaRequest administrativaRequest}
 * @param {injector} $scope scope del controlador
 * @param {injector} $translate translate de internacionalizacion
 * @description
 * # GestionDescuentosCtrl
 * Controlador para la creacion de impuestos o descuentos del modulo de contabilidad.
 *
 * **Nota:** las cuentas contables deben existir en el plan de cuentas maestro.
 */

angular.module('financieraClienteApp')
  .controller('CrearDescuentoCtrl', function($scope, financieraRequest, administrativaRequest, $translate) {
    var self = this;
    self.descuento_nuevo = {};

    //grid para mostrar y seleccionar los proveedores relacionados al descuento o al impuesto.
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
      data:[],
      columnDefs: [{
          field: 'NumDocumento',
          displayName: $translate.instant('DOCUMENTO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '20%'
        },
        {
            field: 'Tipopersona',
            displayName: $translate.instant('TIPO'),
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            width: '20%'
        },
        {
          field: 'NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '60%'
        }
      ]
    };

    //opciones extras para el control del grid
    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.enablePaginationControls = true;
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.proveedor = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:CrearDescuentoCtrl#cargar
     * @methodOf financieraClienteApp.controller:CrearDescuentoCtrl
     * @description
     * Se realiza la carga de proveedores, plan de cuentas y los tipos de cuentas especiales (inmpuestos y descuentos) a traves de los servicios
     * {@link financieraService.service:financieraRequest financieraRequest} y {@link agoraService.service:administrativaRequest administrativaRequest}
     * que retorna la informacion de la cuenta contable y la del descuento o impuesto.
     */
    self.cargar = function() {
      financieraRequest.get("tipo_cuenta_especial", "").then(function(response) {
        self.tipos_cuentas = response.data;
      });

      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };

  /**
   * @ngdoc function
   * @name financieraClienteApp.controller:CrearDescuentoCtrl#crear_nuevo
   * @methodOf financieraClienteApp.controller:CrearDescuentoCtrl
   * @description
   * Se validan parametros obligatorios en la base de datos y se realiza el registro del nuevo item en la base de datos utilizando el servicio
   * {@link financieraService.service:financieraRequest financieraRequest}
   */
    self.crear_nuevo = function() {
      var alerta = "";
      if (self.cuenta_contable == undefined || self.proveedor == undefined) {
        if (self.cuenta_contable == undefined) {
          alerta += "<li><small>{{'ALERTA_SELECCIONAR_CUENTA' | translate}}</small></li>";
        }
        if (self.proveedor == undefined) {
          alerta += "<li><small>{{'ALERTA_SELECCIONAR_PROVEEDOR' | translate}}</small></li>";
        }
        swal("", alerta, "error");
      } else {
        var nuevo = {
          Descripcion: self.descripcion,
          CuentaContable: self.cuenta_contable,
          TipoCuentaEspecial: self.tipo_cuenta,
          InformacionPersonaJuridica: self.proveedor.NumDocumento
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
          swal("", "La cuenta se creo exitosamente", "success"); //pendiente a modificar servicio para el manejo de codigos
        });
      }
    };

    self.cargar();

    self.search_tercero=function(){
      administrativaRequest.get("informacion_proveedor", $.param({
        query:"NumDocumento:"+$scope.num_documento,
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };


    /**
     * @ngdoc event
     * @name financieraClienteApp.controller:CrearDescuentoCtrl#watch_on_cuenta_contable
     * @eventOf financieraClienteApp.controller:CrearDescuentoCtrl
     * @param {object} cuenta_contable cuenta contable seleccionada
     * @description valida que la cuenta seleccionada no tenga hijos, es decir, sea de ultimo nivel
     */
    $scope.$watch('crearDescuento.cuenta_contable', function() {
      if (self.cuenta_contable !== undefined) {
        if (self.cuenta_contable.Hijos != null) {
          self.cuenta_contable = undefined;
          swal("Espera!", $translate.instant('ALERTA_SELECCIONAR_CUENTA_SIN_HIJOS'), "warning"); //pendiente a modificar servicio para el manejo de codigos
        }
      }
    }, true);

  });
