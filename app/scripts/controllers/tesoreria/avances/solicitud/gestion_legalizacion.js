'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesSolicitudGestionLegalizacionCtrl
 * @description
 * # TesoreriaAvancesSolicitudGestionLegalizacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionLegalizacionCtrl', function ($scope,gridApiService,$translate,financieraMidRequest,financieraRequest,$localStorage) {
    var ctrl = this;
    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};

    $scope.botones = [
        { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
        { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];

    ctrl.gridLegalizaciones = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSelectAll: true,
      useExternalPagination:true,
      selectionRowHeaderWidth: 35,
      columnDefs: [
          {
              field: 'Avance.Consecutivo',
              displayName: $translate.instant('AVANCE_NO'),
              headerCellClass: 'encabezado',
              width: '25%',
                cellTemplate: '<div class="ngCellText" ><a href="" ng-click="grid.appScope.verAvance(row)">{{row.entity.Avance.Consecutivo}}</a></div>'
          },
          {
              field: 'Legalizacion',
              displayName: $translate.instant('LEGALIZACION'),
              headerCellClass: 'encabezado',
              width: '25%'
          },
          {
              field: 'Valor',
              displayName: $translate.instant('VALOR'),
              headerCellClass: 'encabezado',
              cellClass: 'input_right',
              cellFilter:"currency",
              width: '25%'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '25%',
              headerCellClass: 'encabezado',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiLegalizaciones = gridApi;
        ctrl.gridApiLegalizaciones = gridApiService.pagination(gridApi,ctrl.consultarLegalizaciones,$scope);
      },
    };

    ctrl.consultarLegalizaciones = function(offset,query){
        financieraMidRequest.get('legalizacion_avance/GetAllLegalizacionAvance',$.param({
          limit: ctrl.gridLegalizaciones.paginationPageSize,
          offset:offset,
          query:query,
        })).then(function(response){
          if(response.data != null){
          ctrl.gridLegalizaciones.data = response.data.Legalizaciones;
          ctrl.gridLegalizaciones.totalItems = response.data.RegCuantity;
          }
        });
        };
    ctrl.consultarLegalizaciones(0,'');
    ctrl.cargarEstados = function() {
        financieraRequest.get("estado_legalizacion", $.param({
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {
                $scope.estados = [];
                $scope.aristas = [];
                ctrl.estados = response.data;
                angular.forEach(ctrl.estados, function(estado) {
                    $scope.estados.push({
                        id: estado.Id,
                        label: estado.Nombre
                    });
                    $scope.estado_select.push({
                        value: estado.Nombre,
                        label: estado.Nombre,
                        estado: estado
                    });
                });
                $scope.aristas = [{
                        from: 1,
                        to: 2
                    },
                    {
                        from: 1,
                        to: 3
                    }
                ];
            });
    };

  ctrl.cargarEstados();
  $scope.loadrow = function(row, operacion) {
      $scope.legalizacion = row.entity;
      switch (operacion) {
          case "proceso":
              $scope.estado = $scope.legalizacion.Estado;
              break;
          case "ver":
                  ctrl.getAccountantInfo();
                  $('#modal_verLeg').modal('show');
                  break;
          default:
      }
  };

  ctrl.getAccountantInfo = function(){
    financieraMidRequest.get('legalizacion_avance/GetLegalizacionAccountantInformation/'+$scope.legalizacion.Id).then(function(response){
      if (response.data != null) {
        ctrl.movimientosAsociados = response.data.InformacionContable;
        ctrl.conceptos = response.data.Conceptos;
      }
    });
  }

  $scope.funcion = function() {
      $scope.estadoclick = $localStorage.nodeclick;
      ctrl.Request = {
      EstadoLegalizacion:{
        Estado:$scope.estadoclick,
      },
        AvanceLegalizacion:{
          Id:$scope.legalizacion.Id
        },
      Usuario:111111
      };
            financieraRequest.post('estado_legalizacion_avance_legalizacion/AddEstadoLegalizacion', ctrl.Request).then(function(response) {
              if(response.data.Type != undefined){
                if(response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                  }else{
                    $scope.estado = response.data.Estado;
                    swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                      ctrl.consultarLegalizaciones();
                    })
                  }
                }
              });
}
$scope.verAvance = function(row){
  $('#modal_ver').modal('show');

}


  });
