'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionConceptoHomologacionConceptoActualizarCtrl
 * @description
 * # HomologacionConceptoHomologacionConceptoActualizarCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionConceptoActualizarCtrl', function($scope, $routeParams, financieraRequest, financieraMidRequest, titanRequest, agoraRequest, coreRequest, oikosRequest, $translate) {
    var self = this;
    self.HomologacionId = $routeParams.Id;
    financieraRequest.get("homologacion_concepto",
      $.param({
        query: "Id:" + self.HomologacionId,
        limit: 1,
      })
    ).then(function(response) {
      self.homologacionConceptoData = response.data[0];
      // data concepti titan
      titanRequest.get('concepto_nomina',
        $.param({
          query: "Id:" + self.homologacionConceptoData.ConceptoTitan,
          limit: 1
        })
      ).then(function(response) {
        self.ConceptoTitanData = response.data[0];
      })
      // data nomina titan
      titanRequest.get('nomina',
        $.param({
          query: "Id:" + self.homologacionConceptoData.NominaTitan,
          limit: 1
        })
      ).then(function(response) {
        self.NominaTitanData = response.data[0];
        if (self.NominaTitanData.TipoNomina.Nombre == 'HCS') {
          self.camposFacultades = true;
        } else {
          self.camposFacultades = false;
        }
      })
      // Proyecto y facultad
      financieraRequest.get('concepto_tesoral_facultad_proyecto',
        $.param({
          query: "HomologacionConcepto.Id:" + self.homologacionConceptoData.Id,
          limit: 1
        })
      ).then(function(response) {
        self.ConceptoFaculatadProyecto = response.data[0];
        // data proyecto y Facultad
        oikosRequest.get('dependencia',
          $.param({
            query: "Id:" + self.ConceptoFaculatadProyecto.Facultad,
            limit: 1
          })
        ).then(function(response) {
          self.FacultadData = response.data[0];
          self.homologacionConceptoData.Facultad = self.FacultadData.Id;
          // select de proyectos curriculares
          oikosRequest.get('dependencia/proyectosPorFacultad/' + self.FacultadData.Id, ).then(function(response) {
            self.selectProyectoCurriculares = response.data;
          });
        });
        oikosRequest.get('dependencia',
          $.param({
            query: "Id:" + self.ConceptoFaculatadProyecto.ProyectoCurricular,
            limit: 1
          })
        ).then(function(response) {
          self.ProyectoCurricularData = response.data[0];
          self.homologacionConceptoData.ProyectoCurricular = self.ProyectoCurricularData.Id;
        })
      })
    })
    // ===============
    // Opciones Select
    // ===============
    titanRequest.get('nomina',
      $.param({
        query: "Activo:true",
        limit: -1
      })
    ).then(function(response) {
      self.selectNominaTitan = response.data
    })
    oikosRequest.get('dependencia_padre/FacultadesConProyectos',
      $.param({
        limit: -1
      })
    ).then(function(response) {
      self.selectFacultades = response.data;
    })
    //
    self.getIdNomina = function(nominaSelect) {
      if (nominaSelect != undefined) {
        self.homologacionConceptoData.NominaTitan = nominaSelect.Id;
        if (nominaSelect.TipoNomina.Nombre == 'HCS') {
          self.camposFacultades = true;
        } else {
          self.camposFacultades = false;
          delete self.homologacionConceptoData['Facultad']
          delete self.homologacionConceptoData['ProyectoCurricular']
        }
      } else {
        delete self.HomologacionConcepto['NominaTitan']
      }
    }
    self.getIdFacultad = function(facultadSelect) {
      if (facultadSelect != undefined) {
        self.homologacionConceptoData.Facultad = facultadSelect.Id;
        self.selectProyectoCurriculares = facultadSelect.Opciones
      } else {
        delete self.homologacionConceptoData['Facultad'];
      }
    }
    //
    self.getIdProyectoCurricular = function(proyectoCurricularSelect) {
      if (proyectoCurricularSelect != undefined) {
        self.homologacionConceptoData.ProyectoCurricular = proyectoCurricularSelect.Id;
      } else {
        delete self.homologacionConceptoData['ProyectoCurricular']
      }
    }
    // ===============
    // grid para cambiar conceptos
    // ===============
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
        if ($scope.gridApi.selection.getSelectedRows()[0] != undefined) {
          self.ConceptoSelect = $scope.gridApi.selection.getSelectedRows()[0];
          self.homologacionConceptoData.ConceptoKronos = self.ConceptoSelect;
        } else {
          delete self.homologacionConceptoData['ConceptoKronos'];
        }
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
        if ($scope.gridApi2.selection.getSelectedRows()[0] != undefined) {
          self.ConceptoTitanSelect = $scope.gridApi2.selection.getSelectedRows()[0];
          self.homologacionConceptoData.ConceptoTitan = self.ConceptoTitanSelect.Id;
          // refrescar ConceptoTitanData
          titanRequest.get('concepto_nomina',
            $.param({
              query: "Id:" + self.homologacionConceptoData.ConceptoTitan,
              limit: 1
            })
          ).then(function(response) {
            self.ConceptoTitanData = response.data[0];
          })
        } else {
          delete self.homologacionConceptoData['ConceptoTitan'];
        }

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
