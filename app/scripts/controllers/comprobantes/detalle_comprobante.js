'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DetalleComprobanteCtrl', function ($localStorage, $scope, $translate,financieraMidRequest,financieraRequest) {
  	var ctrl = this;
    ctrl.comprobante = $localStorage.comprobante;
    ctrl.observaciones = ctrl.comprobante.Observaciones;
    var valor_total_debito = 0;
    var valor_total_credito = 0;

    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
      { clase_color: "borrar", clase_css: "fa fa-times-circle fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'inactive', estado: true }
    ];

    ctrl.RegistroComprobantes = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 10,
        useExternalPagination: true,
        columnDefs: [
            { field: 'Id', visible: false },
            { field: 'Secuencia',displayName: $translate.instant('SECUENCIA'), cellClass: 'input_center', headerCellClass: 'text-info', width: '5%' },
            { field: 'MovimientoContable.CuentaContable.Codigo',displayName: $translate.instant('CODIGO'), cellClass: 'input_center', headerCellClass: 'text-info', width: '10%'  },
            { field: 'MovimientoContable.CuentaContable.Nombre',displayName: $translate.instant('CUENTA_CONTABLE'), cellClass: 'input_center', headerCellClass: 'text-info', width: '25%'  },
            { field: 'MovimientoContable.CuentaContable.Naturaleza',displayName: $translate.instant('TIPO_CUENTA'), cellFilter: "filtro_naturaleza_cuenta:row.entity", cellClass: 'input_center', headerCellClass: 'text-info', width: '10%'  },
            { field: 'MovimientoContable.Debito', visible: false },
            { field: 'MovimientoContable.Credito', visible: false },
            { field: 'CentroCosto',displayName: $translate.instant('CENTRO_COSTO'), cellClass: 'input_center',cellFilter: "filtro_null:row.entity", headerCellClass: 'text-info', width: '10%' },
            { field: 'SubcentroCosto',displayName: $translate.instant('SUBCENTRO_COSTO'), cellClass: 'input_center', cellFilter: "filtro_null:row.entity",headerCellClass: 'text-info', width: '10%' },
            { field: 'Tercero',displayName: $translate.instant('INFORMACION_TERCERO'), cellClass: 'input_center',cellFilter: "filtro_null:row.entity", headerCellClass: 'text-info', width: '10%' },
            { field: 'Valor',displayName: $translate.instant('VALOR'), cellClass: 'input_right', cellFilter: 'currency',headerCellClass: 'text-info', width: '15%'},
            {
                field: 'Opciones',
                displayName: $translate.instant('OPCIONES'),
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
                headerCellClass: 'text-info',
                width: '5%'
            }
        ]

    };

    ctrl.RegistroComprobantes.onRegisterApi = function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {

        });
    };

          ctrl.RegistroComprobantes.multiSelect = false;

        financieraRequest.get('registro_comprobantes','limit=-1?query=Comprobante:'+ctrl.comprobante.Id).then(function(response) {
          ctrl.RegistroComprobantes.data = response.data;

            for (var i = 0; i < response.data.length; i++) {

              if (response.data[i].MovimientoContable.CuentaContable.Naturaleza === "debito"){
                  valor_total_debito =  valor_total_debito + response.data[i].Valor
              }

              if (response.data[i].MovimientoContable.CuentaContable.Naturaleza === "credito"){
                  valor_total_credito =  valor_total_credito + response.data[i].Valor
              }
            }


            ctrl.debito_row = valor_total_debito;
            ctrl.credito_row = valor_total_credito;

            ctrl.diferencia_row = parseInt(ctrl.debito_row) - parseInt(ctrl.credito_row)
        });

        $scope.loadrow = function(row, operacion) {
            self.operacion = operacion;

              switch (operacion) {
                  case "edit":
                      //funcion
                      break;
                case "borrar":
                      //funcion
                      break;
                  default:
              }


        };

        ctrl.crearRegistro = function(){
          alert("Creacion registro")
        };

    }).filter('filtro_naturaleza_cuenta', function($filter,$translate) {
          return function(input, entity) {
              var output;
              if (undefined === input || null === input) {
                  return "";
              }

              if (entity.MovimientoContable.CuentaContable.Naturaleza === "debito") {
                  output =  $translate.instant('DEBITO');
              }

              if (entity.MovimientoContable.CuentaContable.Naturaleza === "credito") {
                  output =  $translate.instant('CREDITO');
              }


              return output;
          };
      }).filter('filtro_null', function($filter,$translate) {
            return function(input, entity) {
                var output;
                if (undefined === input || null === input) {
                    return "";
                }

                if (entity.CentroCosto === 0) {
                    output =  "N/A";
                }


                if (entity.SubcentroCosto === 0) {
                    output =  "N/A";
                }

                if (entity.Tercero === 0) {
                    output =  "N/A";
                }

                return output;
            };
        });
