'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesRelacionCtrl
 * @description
 * # DevolucionesRelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesRelacionCtrl', function ($scope,$translate) {
    var ctrl = this;
    ctrl.gridOrdenes = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
              field: 'Id',
              displayName: 'Solicitante',
              width: '5%',
          },
          {
              field: 'Vendedor',
              displayName: 'Beneficiario',
              width: '10%',
          },
          {
              field: 'Emisor',
              displayName: 'Forma Pago',
              width: '15%',
          },
          {
              field: 'NumOperacion',
              displayName: 'Numero Operación',
              width: '10%'
          },
          {
              field: 'Trm',
              displayName: 'Banco',
              width: '14%'
          },
          {
              field: 'TasaNominal',
              displayName: 'Tipo Cuenta',
              width: '14%'
          },
          {
              field: 'ValorNomSaldo',
              displayName: 'Cuenta',
              width: '8%',
          },
          {
              field: 'ValorNomSaldoMonNal',
              displayName: 'Valor Solicitado',
              width: '8%',
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '8%',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };


  });
