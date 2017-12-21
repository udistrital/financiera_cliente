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
    self.camposFacultades = false;

    titanRequest.get('nomina',
      $.param({
        query: "Activo:true",
        limit: -1
      })
    ).then(function(response) {
      self.nominaTitanData = response.data
    })
    //
    financieraRequest.get('concepto',
      $.param({
        query: "Id:73",
        limit: -1
      })
    ).then(function(response) {
      self.facultades = response.data;
    })
    //
    self.getIdNomina = function(nominaSelect) {
      if (nominaSelect != undefined) {
        self.HomologacionConcepto.NominaTitan = nominaSelect.Id;
        if (nominaSelect.TipoNomina.Nombre == 'HCS') {
          self.camposFacultades = true;
        } else {
          self.camposFacultades = false;
          delete self.HomologacionConcepto['Facultad']
          delete self.HomologacionConcepto['ProyectoCurricular']
        }
      } else {
        delete self.HomologacionConcepto['NominaTitan']
      }
    }
    //
    self.getIdFacultad = function(facultadSelect) {
      if (facultadSelect != undefined) {
        self.HomologacionConcepto.Facultad = facultadSelect.Id;
      } else {
        delete self.HomologacionConcepto['Facultad']
      }
    }
    //
    self.getIdProyectoCurricular = function(proyectoCurricularSelect) {
      if (proyectoCurricularSelect != undefined) {
        self.HomologacionConcepto.ProyectoCurricular = proyectoCurricularSelect.Id;
      } else {
        delete self.HomologacionConcepto['ProyectoCurricular']
      }
    }
    //
    self.gridConcepto = {
      enableRowSelection: true,
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
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.ConceptoSelect = $scope.gridApi.selection.getSelectedRows()[0];
        self.HomologacionConcepto.ConceptoKronos = self.ConceptoSelect.Id;
      });
    };
    financieraRequest.get("concepto",
      $.param({
        query: "Clasificador:false",
        sortby: "Codigo",
        limit: -1,
        order: "asc",
      })
    ).then(function(response) {
      self.gridConcepto.data = response.data;
    });
    //
    self.gridConceptoTitan = {
      enableRowSelection: true,
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
          field: 'Id',
          displayName: $translate.instant('CODIGO') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '20%',
          cellClass: 'input_center',
        },
        {
          field: 'AliasConcepto',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '80%',
        }
      ],
    };
    self.gridConceptoTitan.multiSelect = false;
    self.gridConceptoTitan.onRegisterApi = function(gridApi) {
      $scope.gridApi2 = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.ConceptoTitanSelect = $scope.gridApi2.selection.getSelectedRows()[0];
        self.HomologacionConcepto.ConceptoTitan = self.ConceptoTitanSelect.Id;
      });
    };
    titanRequest.get("concepto_nomina",
      $.param({
        query: "NaturalezaConcepto.Nombre:devengo",
        sortby: "Id",
        limit: -1,
        order: "asc",
      })
    ).then(function(response) {
      self.gridConceptoTitan.data = response.data;
    });


  });
