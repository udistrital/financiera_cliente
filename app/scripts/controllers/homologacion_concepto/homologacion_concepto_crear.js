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
    self.HomologacionConcepto.Vigencia = "AAAA";
    self.HomologacionConcepto.SeguridadSocial = false;
    self.camposFacultades = false;
    self.campoSeguridadSocial = false;
    self.cargando_con_kronos = true;
    self.hayData_con_kronos = true;
    self.cargando_con_titan = true;
    self.hayData_con_titan = true;

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
        //ss
        if (nominaSelect.TipoNomina.Nombre == 'HCS' || nominaSelect.TipoNomina.Nombre == 'HCH' || nominaSelect.TipoNomina.Nombre == 'FP' || nominaSelect.TipoNomina.Nombre == 'DP') {
          self.campoSeguridadSocial = true;
        } else {
          self.campoSeguridadSocial = false;
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
          headerCellClass: 'encabezado'
        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Kronos",
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
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
      if(response.data === null){
        self.hayData_con_kronos = false;
        self.cargando_con_kronos = false;
        self.gridConcepto.data = [];
      }else{
        self.hayData_con_kronos = true;
        self.cargando_con_kronos = false;
      self.gridConcepto.data = response.data;
    }
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
          headerCellClass: 'encabezado'
        },
        {
          field: 'AliasConcepto',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '80%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
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
      if(response.data === null){
        self.hayData_con_titan = false;
        self.cargando_con_titan = false;
        self.gridConceptoTitan.data = [];
      }else{
        self.hayData_con_titan = true;
        self.cargando_con_titan = false;
         self.gridConceptoTitan.data = response.data;
      }
    });
    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      var respuesta;
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
        respuesta =  true;
      } else {
        respuesta =  false;
      }
      return respuesta;
    }
    self.checkVigencia = function(p_vigencia) {
      var respuesta;

      if(p_vigencia !== undefined){
      if (p_vigencia.toString().length != 4) {
        respuesta =  false;
      } else {
        respuesta =  true;
      }
    }else{
      respuesta = false;
    }
      return respuesta;
    }
    // Registra
    self.registrarHomologacion = function() {
      if (self.camposObligatorios()) {
        self.HomologacionConcepto.Vigencia = parseInt(self.HomologacionConcepto.Vigencia)
        console.log("registrar");
        console.log(self.HomologacionConcepto);

        financieraRequest.post('homologacion_concepto/RegistrarHomologacionConcepto', self.HomologacionConcepto)
          .then(function(response) {
            self.resultado = response.data;
            console.log("Resultado");
            console.log(self.resultado);
            console.log("Resultado");
            swal({
              title: $translate.instant('HOMOLOGACION') + " " + $translate.instant('CONCEPTOS'),
              text: $translate.instant(self.resultado.Code) + self.resultado.Body,
              type: self.resultado.Type,
            }).then(function() {
              $window.location.href = '#/homologacion_concepto/homologacion_concepto_ver_todas';
            })
          })
      } else {
        swal({
          title: '¡Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }


  });
