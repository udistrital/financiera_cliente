'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearComprobanteCtrl', function ($scope, $translate,financieraMidRequest,financieraRequest) {
  	var ctrl = this;


    ctrl.TipoComprobantes = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 10,
        useExternalPagination: true,
        columnDefs: [
            { field: 'Id', visible: false },
            { field: 'CodigoAbreviacion',displayName: $translate.instant('CODIGO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Nombre',displayName: $translate.instant('NOMBRE'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Descripcion',displayName: $translate.instant('DESCRIPCION'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'UnidadEjecutora',displayName: $translate.instant('UNIDAD_EJECUTORA'), cellClass: 'input_center', headerCellClass: 'text-info' },

            ]
    };



    });
