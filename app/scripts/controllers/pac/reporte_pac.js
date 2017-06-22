'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacReportePacCtrl
 * @description
 * # PacReportePacCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacReportePacCtrl', function (financieraRequest) {
    var self = this;
    self.resumen = {}
    self.gridOptions = {
      enableHorizontalScrollbar:0,
      enableVerticalScrollbar:1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: false,
      enableFiltering: true,
      rowHeight: 45
    };
    self.gridOptions.columnDefs = [
      { name: 'descripcion', displayName: 'RUBRO', headerCellClass: 'text-info'  },
      { name: 'codigo', displayName: 'Codigo', headerCellClass: 'text-info'  },
      { name: 'Opciones', cellTemplate: ' <a type="button" class="fa fa-eye" ng-click="grid.appScope.reportePac.verResumen(row)" ></a>', headerCellClass: 'text-info'}
    ];
    self.gridOptions_meses = {
      enableHorizontalScrollbar:0,
      enableVerticalScrollbar:1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: false,
      enableFiltering: true,
      rowHeight: 45
    };
    self.gridOptions.columnDefs_meses = [];
    self.generarReporte = function(){
      var consulta = {
        inicio : self.fechaInicio,
        fin : self.fechaFin
      };
      financieraRequest.post('rubro/RubroReporte', consulta).then(function(response){
        console.log(response.data);
        self.gridOptions.data = response.data;
      });
    }

    self.verResumen = function(row){
      self.resumen = row.entity;
      angular.forEach(self.resumen.reporte, function(data){
        console.log(data);
        self.gridOptions.columnDefs_meses.push({ name: '', displayName: ''+data.mes, headerCellClass: 'text-info'  });
      });
      console.log(row);
      $("#myModal").modal();
    }
  });
