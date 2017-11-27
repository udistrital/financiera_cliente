'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:EditarDescuentoCtrl
 * @alias editarDescuento
 * @requires $scope
 * @requires $translate
 * @requires $location
 * @requires $routeParams
 * @requires financieraService.service:financieraRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {service} administrativaRequest Servicio para el API de financiera {@link administrativaService.service:administrativaRequest administrativaRequest}
 * @param {injector} $scope scope del controlador
 * @param {injector} $translate internacionalización
 * @param {injector} $routeParams parametros de route
 * @description
 * # EditarDescuentoCtrl
 * Controlador para la edición de descuentos e impuestos.
 *
 * **Nota:** El plan de cuentas maestro debe estar creado
 */
angular.module('financieraClienteApp')
  .controller('EditarDescuentoCtrl', function (financieraRequest,administrativaRequest, $scope, $routeParams, $translate) {
    var self = this;

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarDescuentoCtrl#cargar_descuento
     * @methodOf financieraClienteApp.controller:EditarDescuentoCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y obtener la información del descuento a editarse
     */
    self.cargar_descuento=function(){
      financieraRequest.get("cuenta_especial", $.param({
        query: "Id:" + $routeParams.Id
      })).then(function(response) {
        self.e_descuento=response.data[0];
        self.search_tercero();  // Funcion para cargar la info del tercero asociada al descuento
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarDescuentoCtrl#cargar_tipos
     * @methodOf financieraClienteApp.controller:EditarDescuentoCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y obtener la información de los tipos de descuentos (impuesto, descuento), para la selecccion en el formulario.
     */
    self.cargar_tipos = function() {
      financieraRequest.get("tipo_cuenta_especial", "").then(function(response) {
        self.tipos_cuentas = response.data;
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarDescuentoCtrl#cargar_plan_maestro
     * @methodOf financieraClienteApp.controller:EditarDescuentoCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y obtener la información del plan de cuentas maestro para cargar el arbol de cuentas.
     */
    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };

    //tabla que muestra la información del proveedor
    self.gridOptions = {
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
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
        self.e_descuento.proveedor = self.gridApi.selection.getSelectedRows()[0];
        self.e_descuento.InformacionPersonaJuridica=self.gridApi.selection.getSelectedRows()[0].Id;
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarDescuentoCtrl#search_tercero
     * @methodOf financieraClienteApp.controller:EditarDescuentoCtrl
     * @description Se encarga de consumir el servicio {@link administrativaService.service:administrativaRequest administrativaRequest}
     * y obtener la información del tercero asociada al descuento.
     */
    self.search_tercero=function(){
      administrativaRequest.get("informacion_proveedor", $.param({
        query:"Id:"+self.e_descuento.InformacionPersonaJuridica,
        fields:"Id,Tipopersona,NumDocumento,NomProveedor"
      })).then(function(response) {
        //self.gridOptions.data = response.data;
        self.e_descuento.proveedor=response.data[0];
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarDescuentoCtrl#search_terceros
     * @methodOf financieraClienteApp.controller:EditarDescuentoCtrl
     * @description Se encarga de consumir el servicio {@link administrativaService.service:administrativaRequest administrativaRequest}
     * y obtener la información delos terceros en la busqueda de proveedor del descuento
     */
    self.search_terceros=function(){
      administrativaRequest.get("informacion_proveedor", $.param({
        query:"NumDocumento:"+$scope.num_documento,
        fields:"Id,Tipopersona,NumDocumento,NomProveedor",
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:EditarDescuentoCtrl#actualizar_descuento
     * @methodOf financieraClienteApp.controller:EditarDescuentoCtrl
     * @description valida la informacion ingresada para la actualización del concepto, luego
     * se encarga de consumir el servicio {@link administrativaService.service:administrativaRequest administrativaRequest}
     * y actualizar la información sobre el descuento
     */
    self.actualizar_descuento=function(){
      //if (self.e_descuento.CuentaContable == undefined || self.e_descuento.proveedor == undefined) {
        if (self.e_descuento.CuentaContable == undefined) {
          swal("",  $translate.instant('ALERTA_SELECCIONAR_CUENTA'), "error");
        }
        else if (self.e_descuento.proveedor == undefined) {
          swal("", $translate.instant('ALERTA_SELECCIONAR_PROVEEDOR'), "error");
      //  }
      } else {
        swal({
          title: $translate.instant('EDITAR')+" "+self.e_descuento.TipoCuentaEspecial.Nombre+'!',
          text: $translate.instant('DESEA_ACTUALIZAR_DESCUENTO'),
          type: 'info',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
          cancelButtonText: $translate.instant('BTN.CANCELAR'),
          buttonsStyling: false
        }).then(function() {
          if (self.e_descuento.TipoCuentaEspecial.Nombre=="Descuento") {
            self.e_descuento.Porcentaje=null;
            self.e_descuento.TarifaUvt=null;
          }
          financieraRequest.put("cuenta_especial",self.e_descuento.Id,self.e_descuento).then(function(response){
            console.log(response.data);
            if (response.data.Type == 'success') {
              swal($translate.instant(response.data.Code), self.e_descuento.TipoCuentaEspecial.Nombre+" "+ $translate.instant('NO')+ response.data.Body, response.data.Type);
              $scope.des_imp_uform.$setPristine();
              $scope.des_imp_uform.$setUntouched();
              $scope.submitted=false;
              self.cargar_descuento();
            } else {
              swal("", $translate.instant(response.data.Code), response.data.Type);
            }
          });

        });
      }

    };

    self.cargar_descuento();
    self.cargar_tipos();
    self.cargar_plan_maestro();


  });
