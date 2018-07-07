'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionConceptoHomologacionConceptoVerTodasCtrl
 * @description
 * # HomologacionConceptoHomologacionConceptoVerTodasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionConceptoVerTodasCtrl', function($scope, financieraRequest, $window, $location, $translate, financieraMidRequest, titanRequest, agoraRequest, coreRequest, uiGridConstants) {
    var self = this;
    $scope.tipos_nomina = [];
    self.cargando = true;
    self.hayData = true;

    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg   faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editar', estado: true },
    ];

    self.gridHomologacionConcepto = {
      enableRowHeaderSelection: false,
      paginationPageSizes: [10, 50, 100],
      enableFiltering: true,
      enableRowSelection: false,
      minRowsToShow: 10,
      useExternalPagination: false,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('CONSECUTIVO'),
          width: '5%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '5%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'ConceptoKronos.Codigo',
          displayName: $translate.instant('CODIGO') + " " + $translate.instant('CONCEPTO') + " Kronos",
          width: '10%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'ConceptoKronos.Nombre',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Kronos",
          width: '50%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        //63
        {
          field: 'ConceptoTitanData.Id',
          displayName: $translate.instant('CODIGO') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '8%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'ConceptoTitanData.AliasConcepto',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '10%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'NominaTitanData.TipoNomina.Nombre',
          displayName: $translate.instant('NOMINA'),
          width: '8%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          filter: {
            //term: 'OP-PROV',   // default filter
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos_nomina
          }
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '5%',
          headerCellClass: 'encabezado',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
        }
      ],
    };

    $scope.loadrow = function(row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
          case "ver":
            self.detalle(row);
          break;

          case "editar":
              self.editar(row);
          break;
          default:
      }
  };

    financieraRequest.get("homologacion_concepto",
      $.param({
        limit: -1,
      })
    ).then(function(response) {

     if (response.data === null){
       self.hayData = false;
       self.cargando = false;
       self.gridHomologacionConcepto.data = [];
     }
     else{
       self.hayData = true;
       self.cargando = false;

      angular.forEach(response.data, function(concepto) {
        // data concepti titan

        titanRequest.get('concepto_nomina',
          $.param({
            query: "Id:" + concepto.ConceptoTitan,
            limit: 1
          })
        ).then(function(response) {

          if(response.data === null){
              concepto.ConceptoTitanData = {};
              concepto.ConceptoTitanData.Id = $translate.instant('NO_ENCONTRADO');
              concepto.ConceptoTitanData.AliasConcepto = $translate.instant('NO_ENCONTRADO');

          }else{
              concepto.ConceptoTitanData = response.data[0]
          }

        })
        // data nomina titan
        titanRequest.get('nomina',
          $.param({
            query: "Id:" + concepto.NominaTitan,
            limit: 1
          })
        ).then(function(response) {
          concepto.NominaTitanData = response.data[0]
        })
      })

        self.gridHomologacionConcepto.data = response.data;
    }
    })
    // filtro nomina titan
    titanRequest.get("tipo_nomina",
      $.param({
        query: "Activo:true",
        sortby: "Id",
        limit: -1,
        order: "asc",
      })
    ).then(function(response) {
      angular.forEach(response.data, function(tipo) {
        $scope.tipos_nomina.push({
          value: tipo.Nombre,
          label: tipo.Nombre,
        });
      });
    });
    //Operacion de botones
    self.detalle = function(row) {
      var path = "/homologacion_concepto/ver/"
      $location.url(path + row.entity.Id)
    }
    self.editar = function(row) {
      var path = "/homologacion_concepto/actualizar/"
      $location.url(path + row.entity.Id)
    }

  });
