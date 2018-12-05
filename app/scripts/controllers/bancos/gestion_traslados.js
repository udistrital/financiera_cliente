'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionTrasladosCtrl
 * @description
 * # BancosGestionTrasladosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionTrasladosCtrl', function(administrativaRequest,financieraRequest,financieraMidRequest,coreRequest, $scope, $translate, uiGridConstants, $location, $route,organizacionRequest) {
    var ctrl = this;
    ctrl.formPresente = 'datos_basicos';
    $scope.mostrar_direc = false;
    $scope.concepto=[];
    $scope.estados = [];
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver_traslado', estado: true },
      { clase_color: "proceso", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.PROCESO'), operacion: 'proceso', estado: true },
    ];

    $scope.valorAfectacion=0;
    $scope.validado = 0;

    ctrl.Traslados = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          displayName: 'Id',
          visible: false
        },
        {
          field: 'NumeroTraslado',
          displayName: $translate.instant('NUMERO_TRASLADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Fecha',
          displayName: $translate.instant('FECHA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'estado',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
            headerCellClass: 'text-info'
        }
      ]
    };

    ctrl.Traslados.multiSelect = false;
    ctrl.Traslados.modifierKeysToMultiSelect = false;
    ctrl.Traslados.enablePaginationControls = true;
    ctrl.Traslados.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };

    ctrl.ConceptosTesorales = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible:false

        },
        {
          field: 'Codigo',
          displayName: $translate.instant('CODIGO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },

      ]
    };

    ctrl.ConceptosTesorales.multiSelect = false;
    ctrl.ConceptosTesorales.modifierKeysToMultiSelect = false;
    ctrl.ConceptosTesorales.enablePaginationControls = true;
    ctrl.ConceptosTesorales.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };

    administrativaRequest.get('informacion_persona_juridica_tipo_entidad/', $.param({
        limit: -1,
        query: "TipoEntidadId:1",
      })).then(function(response) {
        ctrl.Traslados.data = response.data;
      });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "ver_traslado":
                  $('#modal_ver').modal('show');
                break;
            case "proceso":
                  $scope.mostrar_direc = true;
                break;
          default:
        }
    };

    ctrl.cargarEstados = function() {

          financieraRequest.get("estado_cancelacion_inversion", $.param({
                  sortby: "NumeroOrden",
                  limit: -1,
                  order: "asc"
              }))
              .then(function(response) {
                  $scope.estados = [];
                  $scope.aristas = [];
                  ctrl.estados = response.data;
                  angular.forEach(ctrl.estados, function(estado) {
                      $scope.estados.push({
                          id: estado.Id,
                          label: estado.Nombre
                      });
                      $scope.estado_select.push({
                          value: estado.Nombre,
                          label: estado.Nombre,
                          estado: estado
                      });
                  });
                  $scope.aristas = [{
                          from: 1,
                          to: 2
                      },
                      {
                          from: 1,
                          to: 3
                      }
                  ];
              });
    }
    ctrl.cargarEstados();

    ctrl.mostrar_modal_solicitud_traslado = function(){
      $('#modal_solicitar_traslado').modal('show');
      financieraRequest.get('concepto/', $.param({
          limit: 10,
      })).then(function(response) {
          ctrl.ConceptosTesorales.data = response.data;
        });
    };

    ctrl.mostrar_datos_basicos = function(){
        ctrl.formPresente = 'datos_basicos';
    };

    ctrl.mostrar_conceptos_tesorales = function(){
        ctrl.formPresente = 'concepto_a_elegir';
        financieraRequest.get('concepto/', $.param({
            limit: 10,
        })).then(function(response) {
            ctrl.ConceptosTesorales.data = response.data;
          });
    };

    ctrl.consultarListas = function(){
      financieraRequest.get('forma_pago',
        $.param({
          limit: 0
        })
      ).then(function(response) {
        ctrl.formaPagos = response.data;
      });
      organizacionRequest.get('organizacion/', $.param({
          limit: -1,
          query: "TipoOrganizacion.CodigoAbreviacion:EB",
      })).then(function(response) {
        ctrl.bancos = response.data;
      });
    }

    ctrl.obtenerSucursales = function(tipo){
      switch(tipo){
        case 1:
          ctrl.banco = ctrl.bancoGiro;
          ctrl.SucursalGiro = undefined;
          break;
        case 2:
          ctrl.banco = ctrl.bancoRecib;
          ctrl.SucursalRecib = undefined;
          break;
        default:
        break;
      }
      if(!angular.isUndefined(ctrl.banco)){
        financieraMidRequest.get('gestion_sucursales/ListarSoloSucursalesBanco/'+ctrl.banco.Id).then(function(response){
          if (response.data != null) {
            switch(tipo){
              case 1:
                ctrl.sucursalesGiro = response.data;
                break;
              case 2:
                ctrl.sucursalesRecib = response.data;
                break;
              default:
              break;
            }

          }
        });
      }
    }

    ctrl.obtenerCuentasBancarias = function(tipo){
      switch(tipo){
        case 1:
          ctrl.sucursal = ctrl.SucursalGiro;
          break;
        case 2:
          ctrl.sucursal = ctrl.SucursalRecib;
          break;
        default:
        break;
      }
      financieraRequest.get('cuenta_bancaria',$.param({
        query:"Sucursal:"+ctrl.sucursal.Id,
        limit:-1
      })).then(function(response){
        switch(tipo){
          case 1:
            ctrl.cuentasBancariasGiro = response.data;
            break;
          case 2:
            ctrl.cuentasBancariasRecib = response.data;
            break;
          default:
          break;
        }
      });
    }

    ctrl.consultarListas();
    ctrl.mostrar_banco_receptor = function(){
      ctrl.formPresente = 'banco_receptor';
    };

    ctrl.cuentas_traslado = function(){
      ctrl.formPresente = 'cuentas_traslado';
    };

    ctrl.solicitar_traslado = function (){
      //alert("solicitar traslado")
    };

    ctrl.cargar_cuentas_bancarias = function(){
      // var objeto_banco_seleccionado= JSON.parse(ctrl.selectBanco);
      //BUSCAR CON ID y llenar grid
    };
  });
