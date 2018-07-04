'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CompromisosListadoCompromisosCtrl
 * @description
 * # CompromisosListadoCompromisosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.controller('GestionCompromisosCtrl', function($scope, financieraRequest, $translate) {
  var self = this;
  self.cargando = false;
  self.hayData = true;

  $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "eliminar", clase_css: "fa fa-times-circle fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.CANCELAR'), operacion: 'eliminar', estado: true },
      { clase_color: "editar", clase_css: "fa fa fa-cog fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editar', estado: true }
  ];

  $scope.loadrow = function(row, operacion) {
      $scope.solicitud = row.entity;
      switch (operacion) {
          case "ver":
          console.log(row);
            self.compromiso = row.entity;
            $('#modal_ver').modal('show');
            break;
          case "eliminar":
              swal({
                title: $translate.instant('CANCELAR_COMPROMISO')+'!',
                text: $translate.instant('DESEA_CANCELAR_COMPROMISO'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
                cancelButtonText: $translate.instant('BTN.CANCELAR'),
                buttonsStyling: false
              }).then(function() {
                financieraRequest.delete('compromiso',row.entity.Id).then(function(response){
                  console.log(response.data);
                  swal($translate.instant(response.data.Code),$translate.instant("COMPROMISO")+" "+$translate.instant("NO")+response.data.Body, response.data.Type);
                  if (response.data.Type=='success') {
                    self.cargar();
                  }
                });
              });
              break;
            case "editar":
                $('#modal_editar').modal('show');
                self.edit_compromiso = angular.copy(row.entity);
                self.edit_compromiso.FechaInicio = new Date(self.edit_compromiso.FechaInicio);
                self.edit_compromiso.FechaFin = new Date(self.edit_compromiso.FechaFin);
                //$location.hash('form_edit');
                //$anchorScroll();
                break;
            default:
      }
  };

  //grid para mostrar los impuestos y descuentos existentes
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
    columnDefs: [
      {
        field: 'Id',
        displayName: $translate.instant('NO'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        width: '4%'
      },
      {
        field: 'Vigencia',
        displayName: $translate.instant('VIGENCIA'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        width: '7%'
      },
      {
        field: 'Objeto',
        displayName: $translate.instant('OBJETO'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        width: '50%'
      },
      {
        field: 'FechaInicio',
        displayName: $translate.instant('FECHA_INICIO'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        cellFilter: "date:'yyyy-MM-dd'",
        width: '9%'
      },
      {
        field: 'FechaFin',
        displayName: $translate.instant('FECHA_FIN'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        cellFilter: "date:'yyyy-MM-dd'",
        width: '9%'
      },
      {
        field: 'EstadoCompromiso.Nombre',
        displayName: $translate.instant('ESTADO'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        width: '7%'
      },
      {
        field: 'TipoCompromisoTesoral.Nombre',
        displayName: $translate.instant('TIPO'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        width: '7%'
      },
      {
        visible:false,
        field: 'TipoCompromisoTesoral.CategoriaCompromiso.Nombre',
        displayName: $translate.instant('CATEGORIA'),
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        width: '6%'
      },
      {
        name: $translate.instant('OPCIONES'),
        enableFiltering: false,
        width: '7%',
        cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(row,operacion)" grupobotones="grid.appScope.botones"></btn-registro></center>'
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
      //self.compromiso = self.gridApi.selection.getSelectedRows()[0];
    });
  };


  self.cargar = function() {
    self.gridOptions.data = [];
    self.cargando = true;
    self.hayData = true;

    financieraRequest.get("compromiso", $.param({
      limit: -1,
      query: "TipoCompromisoTesoral.CategoriaCompromiso.Nombre:"+self.filtro_categoria.Nombre+",UnidadEjecutora:"+1 //CAMBIAR SEGUN USUARIO LOGUEADO
    })).then(function(response) {
      if (response.data === null) {
          self.hayData = false;
          self.cargando = false;
          self.gridOptions.data = [];
      }else {
          self.hayData = true;
          self.cargando = false;
          self.gridOptions.data = response.data;
        }

    });
  };

  self.actualizar_compromiso= function(){
    swal({
      title: $translate.instant('ACTUALIZAR_COMPROMISO')+'!',
      text: $translate.instant('DESEA_ACTUALIZAR_COMPROMISO'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
      cancelButtonText: $translate.instant('BTN.CANCELAR'),
      buttonsStyling: false
    }).then(function() {
      //console.log(self.edit_compromiso);
      financieraRequest.put('compromiso',self.edit_compromiso.Id,self.edit_compromiso).then(function(response){
        console.log(response.data);
        if (response.data.Type=='success') {
          swal($translate.instant(response.data.Code),$translate.instant("COMPROMISO")+" "+$translate.instant("NO")+response.data.Body, response.data.Type);
          self.cargar();
          self.edit_compromiso=null;
          $("#modal_editar").modal('hide');
        } else {
          swal("",$translate.instant(response.data.Code), response.data.Type);
        }
      });
    });
  };

  $scope.$watch('gestionCompromisos.filtro_categoria',function(){
    if (self.filtro_categoria != null) {
      self.gridfield=true;
      self.cargar();
    } else {
      self.gridfield=false;
    }
  },true);

});
