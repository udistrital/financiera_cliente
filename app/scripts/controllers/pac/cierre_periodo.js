'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacCierrePeriodoCtrl', function ($scope, $translate,financieraMidRequest) {
  	var ctrl = this;

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
        width: "20%",
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
        name: 'Proyeccion',
        displayName:  'Proyeccion',
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Pvariacion',
        displayName: 'Pvariacion' ,
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
    ];
      var consulta = {
        inicio: ctrl.fechaInicio,
        fin: new Date(ctrl.fechaInicio.getFullYear(),ctrl.fechaInicio.getMonth() + 1,0),
        nperiodos:'3'
      };
      console.log("fecha fin "+ consulta.fin);
      financieraMidRequest.post('rubro/GenerarCierre', consulta).then(function(response){
        if (response.data.Ingresos !== null && response.data.Ingresos !== undefined){
           console.log(response.data);
           $scope.ingresos = response.data.Ingresos;
           $scope.gridOptions.data = $scope.ingresos;
        }

    });
    }



    });
