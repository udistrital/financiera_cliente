'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionConceptoHomologacionConceptoCrearCtrl
 * @description
 * # HomologacionConceptoHomologacionConceptoCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionConceptoCrearCtrl', function($scope, financieraRequest, $localStorage, agoraRequest, $location, $translate, uiGridConstants, $window, titanRequest) {

    var self = this;
    self.HomologacionConcepto = {};

    titanRequest.get('nomina',
      $.param({
        query: "Activo:true",
        limit: -1
      })
    ).then(function(response) {
      self.NominaTitanData = response.data
    })
    //
    self.gridConcepto = {
      enableRowHeaderSelection: true,
      paginationPageSizes: [8, 50, 100],
      enableFiltering: true,
      minRowsToShow: 8,
      useExternalPagination: false,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'Codigo',
          displayName: $translate.instant('CODIGO') + " " + $translate.instant('CONCEPTO') + " Kronos",
          width: '20%',
          cellClass: 'input_center',
        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Kronos",
          width: '80%',
        }
      ],
    };
    self.gridConcepto.multiSelect = false;
    self.gridConcepto.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        console.log(row.entity);
        self.ConceptoSelect = row.entity.Id;
        console.log(self.ConceptoSelect);
      });
    };

    financieraRequest.get("concepto",
      $.param({
        query: "Clasificador:false",
        sortby: "Codigo",
        limit: -1,
        order: "asc",      })
    ).then(function(response) {
      self.gridConcepto.data = response.data;
    });


  });
