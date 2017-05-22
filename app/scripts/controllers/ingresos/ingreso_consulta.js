'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoConsultaCtrl
 * @description
 * # IngresosIngresoConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoConsultaCtrl', function (financieraRequest) {
    var self = this;
    self.ingresoSel = null;
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
      { name: 'Vigencia', displayName: 'Vigencia', headerCellClass: 'text-info'  },
      { name: 'Consecutivo', displayName: 'Consecutivo', headerCellClass: 'text-info'  },
      { name: 'FechaIngreso', displayName: 'Fecha de Ingreso' ,  headerCellClass: 'text-info' , cellTemplate: '<span>{{row.entity.FechaIngreso | date:"yyyy-MM-dd":"+0900"}}</span>' },
      { name: 'FechaConsignacion', displayName: 'Fecha de consignación' , headerCellClass: 'text-info' ,cellTemplate: '<span>{{row.entity.FechaConsignacion | date:"yyyy-MM-dd":"+0900"}}</span>'},
      { name: 'FormaIngreso.Nombre', displayName: 'Forma de Ingreso' , headerCellClass: 'text-info' },
      { name: 'EstadoIngreso.Nombre', displayName: 'Estado' , headerCellClass: 'text-info' },
      { name: 'Opciones', cellTemplate: ' <a type="button" class="fa fa-eye" ng-click="grid.appScope.ingresoConsulta.verIngreso(row)" ></a>', headerCellClass: 'text-info' }
    ];

    self.cargarIngresos = function(){
      financieraRequest.get('ingreso',$.param({
        limit: -1
      })).then(function(response){
        self.gridOptions.data = response.data;
        console.log(response.data);
      });
    };

    self.cargarIngresos();

    self.verIngreso = function(row){
      self.ingresoSel = null;
      self.ingresoSel = row.entity;
      $("#myModal").modal();
      console.log(self.ingresoSel);
    };



  });
