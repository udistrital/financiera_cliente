'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CalendarioTributarioGestionCalendarioCtrl
 * @description
 * # CalendarioTributarioGestionCalendarioCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionCalendarioCtrl', function ($scope,$translate,uiGridConstants,financieraRequest) {
    var self=this;

    self.nuevo_calendario={};

    self.cargar_vigencia=function(){
      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        self.vigencia_calendarios=parseInt(response.data);
        var year = parseInt(response.data)+1;
        self.vigencias = [];
          for(var i=0;i<5;i++) {
            self.vigencias.push(year - i);
          }
       });
    };

    self.cargar_vigencia();

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Vigencia',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          displayName: $translate.instant('VIGENCIA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '8%'
        },
        /*{
          field: 'DenominacionBanco',
          displayName: $translate.instant('DENOMINACION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '20%'
        },*/
        {
          field: 'Entidad.Nombre',
          displayName: $translate.instant('ENTIDAD'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '30%'
        },
        {
          field: 'FechaInicio',
          displayName: $translate.instant('FECHA_INICIO'),
          cellFilter: "date:'yyyy-MM-dd'",
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '10%'
        },
        {
          field: 'FechaFin',
          displayName: $translate.instant('FECHA_FIN'),
          cellFilter: "date:'yyyy-MM-dd'",
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '9%'
        },
        {
          field: 'Responsable',
          displayName: $translate.instant('RESPONSABLE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          //cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.EstadoActivo" disabled></center>',
          width: '14%'
        },
        {
          field: 'EstadoCalendario.Nombre',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '7%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '7%',
          cellTemplate: '<center>' + '<a href="#/calendario_tributario/admin_calendario/{{row.entity.Id}}" class="ver">' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a href="" class="editar" ng-click="grid.appScope.gestionCalendario.modo_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '</center>'
        }
      ]
    };

    //opciones extras para el control del grid
    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.enablePaginationControls = true;
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.cuenta = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.cargar_calendarios_full=function(){
      financieraRequest.get('calendario_tributario',$.param({
        limit: -1
      })).then(function(response){
        if (response.data===null) {
          self.gridOptions.data=[];
        } else {
          self.gridOptions.data=response.data;
        }
      });
    };

    self.cargar_calendarios_vigencia=function(vigencia){
      financieraRequest.get('calendario_tributario',$.param({
        limit: -1,
        query: 'Vigencia:'+vigencia
      })).then(function(response){
        if (response.data===null) {
          self.gridOptions.data=[];
        } else {
          self.gridOptions.data=response.data;
        }
      });
    };

    self.modo_editar=function(calendario){
      self.nuevo_calendario=angular.copy(calendario);
      self.nuevo_calendario.FechaInicio=new Date(self.nuevo_calendario.FechaInicio);
      self.nuevo_calendario.FechaFin=new Date(self.nuevo_calendario.FechaFin);
    };

    self.crear_calendario=function(){
      if ($scope.editar===true) {
        console.log("edito");
        financieraRequest.put('calendario_tributario', self.nuevo_calendario.Id, self.nuevo_calendario).then(function(response){
          console.log(response);
          if (self.vigencia_calendarios===null) {
            self.cargar_calendarios_full();
          } else {
            self.cargar_calendarios_vigencia(self.vigencia_calendarios);
          }
        });
      } else {
        console.log("creo");
        var nuevo={
          Vigencia: self.nuevo_calendario.Vigencia,
          Entidad: {Id:1},
          Descripcion: self.nuevo_calendario.Descripcion,
          FechaInicio: self.nuevo_calendario.FechaInicio,
          FechaFin: self.nuevo_calendario.FechaFin,
          EstadoCalendario: {Id:1},
          Responsable: 546546556
        };

        financieraRequest.post('calendario_tributario', nuevo).then(function(response){
          console.log(response);
          if (self.vigencia_calendarios===null) {
            self.cargar_calendarios_full();
          } else {
            self.cargar_calendarios_vigencia(self.vigencia_calendarios);
          }
        });
      }
    };

    $scope.$watch('gestionCalendario.nuevo_calendario.Vigencia',function(){
      //console.log("vigencia",self.nuevo_calendario.Vigencia);
      if (self.nuevo_calendario.FechaInicio!==undefined && self.nuevo_calendario.Vigencia!==self.nuevo_calendario.FechaInicio.getFullYear()) {
        //console.log(self.nuevo_calendario.FechaInicio.getFullYear());
        console.log("reset fecha inicio");
        self.nuevo_calendario.FechaInicio=undefined;
        self.nuevo_calendario.FechaFin=undefined;
      }
      self.fechamin=new Date(
        self.nuevo_calendario.Vigencia,
        0,1
      );
      self.fechamax=new Date(
        self.nuevo_calendario.Vigencia,
        12,0
      );
    },true);

    $scope.$watch('gestionCalendario.nuevo_calendario.FechaInicio',function(){
      console.log("entro dfedaf", self.nuevo_calendario.FechaInicio);
      if (self.nuevo_calendario.FechaInicio>=self.nuevo_calendario.FechaFin || self.nuevo_calendario.FechaInicio===undefined || self.nuevo_calendario.Vigencia!==self.nuevo_calendario.FechaFin.getFullYear()) {
        self.nuevo_calendario.FechaFin=undefined;
      }
    },true);

    $scope.$watch('editar',function(){
      console.log($scope.editar);
      if ($scope.editar===false){
        self.nuevo_calendario={};
      }
    });

    $scope.$watch('gestionCalendario.vigencia_calendarios',function(){
      if (self.vigencia_calendarios===null) {
        self.cargar_calendarios_full();
      } else {
        self.cargar_calendarios_vigencia(self.vigencia_calendarios);
      }
    },true);


  });
