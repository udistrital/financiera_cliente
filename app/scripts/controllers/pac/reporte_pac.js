'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacReportePacCtrl
 * @description
 * # PacReportePacCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacReportePacCtrl', function(financieraRequest, $scope) {
    var self = this;
    self.resumen = {}
    $scope.gridOptions = {
      enableHorizontalScrollbar: 1,
      enableVerticalScrollbar: 1,
      enableFiltering: true,
      rowHeight: 100,
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };
    $scope.gridOptions.columnDefs = [{
        name: 'fdescrip',
        displayName: 'Fuente',
        headerCellClass: 'text-info',
        width: "20%",

        pinnedLeft:true
      },
      {
        name: 'descripcion',
        displayName: 'RUBRO',
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft:true
      },
      {
        name: 'codigo',
        displayName: 'Codigo',
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft:true
      },

      /*{
        name: 'Opciones',
        cellTemplate: ' <a type="button" class="fa fa-eye" ng-click="grid.appScope.reportePac.verResumen(row)" ></a>',
        headerCellClass: 'text-info',
        width: "5%"
      },*/
      {
        name: 'Tipo',
        headerCellClass: 'text-info',
        width: "10%"
      }
    ];

    self.generarReporte = function() {
      var consulta = {
        inicio: self.fechaInicio,
        fin: self.fechaFin
      };
      financieraRequest.post('rubro/RubroReporte', consulta).then(function(response) {
        console.log(response.data);
        for (var i = 0 ; i < response.data[0].reporte.length ; i++){
          $scope.gridOptions.columnDefs.push({
            name: ''+ response.data[0].reporte[i].mes+' EJC',
            field: '',
            cellTemplate: ' <div>{{row.entity.reporte['+i+'].egresos.valor}}</div>',
            headerCellClass: 'text-info',
            width: "8%"
          });
          $scope.gridOptions.columnDefs.push({
            name: ''+ response.data[0].reporte[i].mes+' PROY',
            field: '',
            headerCellClass: 'text-info',
            width: "8%"
            //cellTemplate: ' <div>{{row.entity.reporte['+i+'].egresos.valor}}</div>'
          });

        }

        $scope.gridOptions.data = response.data;

      });
    }

    self.verResumen = function(row) {
      self.resumen = row.entity;

    }
  });
