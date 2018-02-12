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

    self.gridHomologacionConcepto = {
      enableRowHeaderSelection: false,
      paginationPageSizes: [10, 50, 100],
      enableFiltering: true,
      minRowsToShow: 10,
      useExternalPagination: false,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('CONSECUTIVO'),
          width: '5%',
          cellClass: 'input_center',
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '5%',
          cellClass: 'input_center'
        },
        {
          field: 'ConceptoKronos.Codigo',
          displayName: $translate.instant('CODIGO') + " " + $translate.instant('CONCEPTO') + " Kronos",
          width: '10%',
          cellClass: 'input_center',
        },
        {
          field: 'ConceptoKronos.Nombre',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Kronos",
          width: '50%',
        },
        //63
        {
          field: 'ConceptoTitanData.Id',
          displayName: $translate.instant('CODIGO') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '8%',
          cellClass: 'input_center'
        },
        {
          field: 'ConceptoTitanData.AliasConcepto',
          displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CONCEPTO') + " Titan",
          width: '10%',
          cellClass: 'input_center'
        },
        {
          field: 'NominaTitanData.TipoNomina.Nombre',
          displayName: $translate.instant('NOMINA'),
          width: '8%',
          cellClass: 'input_center',
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
          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.homologacionConceptoVerTodas.detalle(row)">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.homologacionConceptoVerTodas.editar(row);" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
            '</center>'
        }
      ],
    };
    financieraRequest.get("homologacion_concepto",
      $.param({
        limit: -1,
      })
    ).then(function(response) {
      self.gridHomologacionConcepto.data = response.data;
      angular.forEach(self.gridHomologacionConcepto.data, function(concepto) {
        // data concepti titan
        titanRequest.get('concepto_nomina',
          $.param({
            query: "Id:" + concepto.ConceptoTitan,
            limit: 1
          })
        ).then(function(response) {
          concepto.ConceptoTitanData = response.data[0]
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
