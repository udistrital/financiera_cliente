'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacCierrePeriodoCtrl', function ($scope, $translate,financieraMidRequest,financieraRequest) {
  	var ctrl = this;


    ctrl.cargar_vigencia = function() {
      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        ctrl.vigencia_calendarios = parseInt(response.data);
        var year = parseInt(response.data);
        ctrl.vigencias = [];
        for (var i = 0; i < 5; i++) {
          ctrl.vigencias.push(year - i);
        }
      });
    };

    ctrl.cargar_vigencia();

    $scope.datos=true;

    $scope.load = false;

    $scope.gridOptions = {
      rowHeight: 30,
      enableHorizontalScrollbar: 1,
      enableVerticalScrollbar: 1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableFiltering: true,
      enableGridMenu: true,
      exporterCsvFilename: 'ingresospac.csv',
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    $scope.gridOptions.data=null;

    ctrl.generarCierre = function(){
      $scope.datos = false;
      $scope.gridOptions.columnDefs = [
      {
        name: 'Fdescrip',
        displayName: $translate.instant('FUENTE'),
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Descrubro',
        displayName: $translate.instant('RUBRO'),
        headerCellClass: 'text-info',
        width: "40%",
        pinnedLeft: true
      },
      {
        name: 'CodigoRub',
        displayName:  $translate.instant('CODIGO'),
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Valor',
        displayName:  $translate.instant('VAL_EJEC'),
        headerCellClass: 'text-info',
        width: "10%",
        cellFilter:"currency",
        cellClass:'ui-grid-number-cell',
        pinnedLeft: true
      },
      {
        name: 'Proyeccion',
        displayName:  $translate.instant('VAL_PROY'),
        headerCellClass: 'text-info',
        width: "10%",
        cellFilter:"currency",
        cellClass:'ui-grid-number-cell',
        pinnedLeft: true
      },
    ];
      var consulta = {
        vigencia: ctrl.vigencia,
        mes: $scope.mes,
        periodosproy: 3
      };
      $scope.union = [];
      financieraMidRequest.post('rubro/GenerarCierre', consulta).then(function(response){
        if (response.data.Ingresos != null && response.data.Ingresos != undefined){

           $scope.ingresos = response.data.Ingresos;
           $scope.egresos = response.data.Egresos;
           //$scope.union  = angular.extend([],$scope.ingresos);
           $scope.union.push.apply($scope.union,$scope.ingresos);
           $scope.union.push.apply($scope.union,$scope.egresos);

           $scope.gridOptions.data = $scope.union;
        }else{
          $scope.datos = false;
        }
    });
    }

    ctrl.guardarCierre = function(){
      var insercion = {
          datos:$scope.union,
          vigencia: ctrl.vigencia,
          mes: $scope.mes
      };
        financieraRequest.post('detalle_pac/InsertarRegistros',insercion).then(function(response){
           if (response.data.Type != undefined) {
                   swal('', $translate.instant(response.data.Code), response.data.Type);
           }

        });
      }

    });
