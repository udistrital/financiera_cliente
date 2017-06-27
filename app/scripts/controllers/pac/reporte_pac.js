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
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableFiltering: true,
      rowHeight: 300,
      onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
    };
    $scope.gridOptions.columnDefs = [{
        name: 'fdescrip',
        displayName: 'Fuente',
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'descripcion',
        displayName: 'RUBRO',
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'codigo',
        displayName: 'Codigo',
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },

      /*{
        name: 'Opciones',
        cellTemplate: ' <a type="button" class="fa fa-eye" ng-click="grid.appScope.reportePac.verResumen(row)" ></a>',
        headerCellClass: 'text-info',
        width: "5%"
      },*/
    ];

    self.generarReporte = function() {
      var consulta = {
        inicio: self.fechaInicio,
        fin: self.fechaFin
      };
      financieraRequest.post('rubro/RubroReporte', consulta).then(function(response) {
        console.log(response.data);
        for (var i = 0; i < response.data.egresos[0].reporte.length; i++) {
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.egresos[0].reporte[i].mes + ' EJC',
            field: '',
            cellTemplate: ' <div>{{row.entity.reporte[' + i + '].valores.valor}}</div>',
            headerCellClass: 'text-info',
            width: "8%",
            enablePinning:false
          });
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.egresos[0].reporte[i].mes + ' PROY',
            field: '',
            headerCellClass: 'text-info',
            width: "8%",
            cellTemplate: ' <div>{{row.entity.reporte[' + i + '].valores.proyeccion}}</div>',
            enablePinning:false
          });
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.egresos[0].reporte[i].mes + ' VAR',
            field: '' + response.data.egresos[0].reporte[i].mes,
            headerCellClass: 'text-info',
            width: "8%",
            cellTemplate: ' <div class="{{grid.appScope.reportePac.changeCellClass(row.entity.reporte[' + i + '].valores.variacion)}}">{{row.entity.reporte[' + i + '].valores.variacion}}</span>',
            enablePinning:false
          });
        }
        $scope.gridOptions.data = response.data.egresos;
        $scope.gridApi.core.handleWindowResize()
      });
    }
    self.changeCellClass = function (val) {
      if(val >= 0 && val <= 0,2){
        return 'bg-success'
      }else{
        return ''
      }
    }
    self.verResumen = function(row) {
      self.resumen = row.entity;

    }
  });
