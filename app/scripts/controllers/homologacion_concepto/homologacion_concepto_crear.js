'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionConceptoHomologacionConceptoCrearCtrl
 * @description
 * # HomologacionConceptoHomologacionConceptoCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionConceptoCrearCtrl', function($scope, oikosRequest, financieraRequest, $localStorage, agoraRequest, $location, $translate, uiGridConstants, $window, titanRequest) {

    var self = this;
    self.HomologacionConcepto = {};
    self.HomologacionConcepto.Vigencia = 0;
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
    oikosRequest.get('dependencia_padre/FacultadesConProyectos',
      $.param({
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
        if ($scope.gridApi.selection.getSelectedRows()[0] != undefined) {
          self.ConceptoSelect = $scope.gridApi.selection.getSelectedRows()[0];
          self.HomologacionConcepto.ConceptoKronos = self.ConceptoSelect.Id;
        } else {
          delete self.HomologacionConcepto['ConceptoKronos'];
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
          self.HomologacionConcepto.ConceptoTitan = self.ConceptoTitanSelect.Id;
        } else {
          delete self.HomologacionConcepto['ConceptoTitan'];
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
    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      self.MensajesAlerta = '';
      if (self.HomologacionConcepto.NominaTitan == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_NOMINA') + "</li>";
      }
      if (self.camposFacultades) {
        if (self.HomologacionConcepto.Facultad == undefined) {
          self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('SELECCIONAR_FACULTAD') + "</li>";
        }
        if (self.HomologacionConcepto.ProyectoCurricular == undefined) {
          self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('SELECCIONAR_PROYECTO_CURRICULAR') + "</li>";
        }
      }
      if (self.HomologacionConcepto.ConceptoKronos == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_CONCEPTO') + " Kronos </li>";
      }
      if (self.HomologacionConcepto.ConceptoTitan == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_CONCEPTO') + " Titan </li>";
      }
      if (!self.checkVigencia(self.HomologacionConcepto.Vigencia)) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_VIGENCIA') + "</li>";
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    self.checkVigencia = function(p_vigencia) {
      if (p_vigencia.length != 4) {
        return false;
      } else {
        return true;
      }
    }
    // Registra
    self.registrarHomologacion = function() {
      if (self.camposObligatorios()) {
        self.HomologacionConcepto.Vigencia = parseInt(self.HomologacionConcepto.Vigencia)
        console.log("registrar");
        console.log(self.HomologacionConcepto);

        financieraRequest.post('homologacion_concepto/RegistrarHomologacionConcepto', self.HomologacionConcepto)
          .then(function(response) {
            self.MensajesAlertaSend = '';
            self.resultado = response.data;
            console.log("Resultado");
            console.log(response);
            console.log("Resultado");
            // angular.forEach(self.resultado, function(mensaje) {
            //   self.MensajesAlertaSend = self.MensajesAlertaSend + "<li>" + $translate.instant(mensaje.Code) + mensaje.Body + "</li>";
            // })
            // swal({
            //   title: $translate.instant('ORDEN_DE_PAGO'),
            //   html: '<ol align="left">' + self.MensajesAlertaSend + '</ol>',
            //   type: "success",
            // }).then(function() {
            //   $window.location.href = '#/orden_pago/ver_todos';
            // })
          })


      } else {
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }


  });
