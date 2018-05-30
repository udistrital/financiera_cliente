'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionTrasladosCtrl
 * @description
 * # BancosGestionTrasladosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionTrasladosCtrl', function(administrativaRequest,financieraRequest,coreRequest, $scope, $translate, uiGridConstants, $location, $route) {
    var ctrl = this;
    ctrl.formPresente = 'concepto_a_elegir';

    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver_traslado', estado: true },
      { clase_color: "editar", clase_css: "fa fa-check fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.APROBAR'), operacion: 'aprobar_traslado', estado: true },
        { clase_color: "editar", clase_css: "fa fa-file fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.GENERAR_ACTA'), operacion: 'generar_acta', estado: true },
    ];


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
          field: 'Estado',
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
            case "aprobar_traslado":
                  ctrl.aprobar_traslado(row);
                break;
          default:
        }
    };

    ctrl.aprobar_traslado = function(){
      alert("aprobar este traslado")
    };

    ctrl.generar_acta = function(){
      alert("generar acta")
    };

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

    ctrl.mostrar_banco_receptor = function(){
      ctrl.formPresente = 'banco_receptor';
    };

    ctrl.mostrar_banco_girador = function(){
      ctrl.formPresente = 'banco_girador';

      administrativaRequest.get('informacion_persona_juridica_tipo_entidad/', $.param({
          limit: -1,
          query: "TipoEntidadId:1",
        })).then(function(response) {
          ctrl.Bancos = response.data;
        });

    };

    ctrl.solicitar_traslado = function (){
      alert("solicitar traslado")
    };

    ctrl.cargar_cuentas_bancarias = function(){
       var objeto_banco_seleccionado= JSON.parse(ctrl.selectBanco);
      //BUSCAR CON ID y llenar grid
    };
  });
