'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('VerComprobanteCtrl', function ($scope, $translate,financieraMidRequest,financieraRequest) {
  	var ctrl = this;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
      { clase_color: "borrar", clase_css: "fa fa-times-circle fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.CONSULTAR'), operacion: 'inactive', estado: true }
    ];

    ctrl.Comprobantes = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 10,
        useExternalPagination: true,
        columnDefs: [
            { field: 'Id', visible: false },
            { field: 'Secuencia',displayName: $translate.instant('SECUENCIA'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'CuentaContable',displayName: $translate.instant('CUENTA_CONTABLE'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'CentroCosto',displayName: $translate.instant('CENTRO_COSTO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'SubcentroCosto',displayName: $translate.instant('SUBCENTRO_COSTO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Tercero',displayName: $translate.instant('INFORMACION_TERCERO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'CuentaContable.Tipo',displayName: $translate.instant('TIPO_CUENTA'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Valor',displayName: $translate.instant('VALOR'), cellClass: 'input_center', headerCellClass: 'text-info' },

        ]

    };


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

        ctrl.crearComprobante = function(){
          alert("Creacion de comprobante")
        };

    });
