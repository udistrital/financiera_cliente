'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacReportePacCtrl
 * @description
 * # PacReportePacCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacReportePacCtrl', function(financieraRequest,financieraMidRequest, $scope, $translate) {
    var self = this;
    self.cargar_vigencia = function() {
      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        self.vigencia_calendarios = parseInt(response.data);
        var year = parseInt(response.data);
        self.vigencias = [];
        for (var i = 0; i < 5; i++) {
          self.vigencias.push(year - i);
        }
      });
    };

    self.cargar_vigencia();
    self.resumen = {}
    $scope.gridOptions = {
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
    $scope.gridOptions.columnDefs = [{
        name: 'Fdescrip',
        displayName: $translate.instant('FUENTE'),
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Descripcion',
        displayName: $translate.instant('RUBRO'),
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Codigo',
        displayName:  $translate.instant('CODIGO'),
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
    $scope.gridOptions_egresos = {
      enableHorizontalScrollbar: 1,
      enableVerticalScrollbar: 1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableFiltering: true,
      enableGridMenu: true,
      exporterCsvFilename: 'egresospac.csv',
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };
    $scope.gridOptions_egresos.columnDefs = [{
        name: 'Fdescrip',
        displayName: $translate.instant('FUENTE'),
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Descripcion',
        displayName: $translate.instant('RUBRO'),
        headerCellClass: 'text-info',
        width: "20%",
        pinnedLeft: true
      },
      {
        name: 'Codigo',
        displayName: $translate.instant('CODIGO'),
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
    $scope.gridOptions_egresos.data = null;
    $scope.gridOptions.data=null;
    self.generarReporte = function() {
      var consulta = {
        inicio: self.fechaInicio,
        fin: self.fechaFin,
        periodosproy: 3
      };
      financieraMidRequest.post('rubro/GenerarPac', consulta).then(function(response) {
       
        if (response.data.Ingresos !== null && response.data.Ingresos !== undefined){
           console.log(response.data);
          for (var i = 0; i < response.data.Ingresos[0].Reporte.length; i++) {
            console.log(response.data.Ingresos[i])
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.Ingresos[0].Reporte[i].Mes + ' EJC',
            field: 'Reporte[' + i + '].Valores.Valor',
            //cellTemplate: ' <div>{{row.entity.reporte[' + i + '].valores.valor | currency}}</div>',
            headerCellClass: 'text-info',
            width: "8%",
            enablePinning: false,
            cellFilter: 'currency'
          });
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.Ingresos[0].Reporte[i].Mes + ' PROY',
            field: 'Reporte[' + i + '].Valores.Proyeccion',
            headerCellClass: 'text-info',
            width: "8%",
            //cellTemplate: ' <div>{{row.entity.reporte[' + i + '].valores.proyeccion}}</div>',
            enablePinning: false,
            cellFilter: 'currency'
          });
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.Ingresos[0].Reporte[i].Mes + ' VAR',
            field: 'Reporte[' + i + '].Valores.Variacion',
            headerCellClass: 'text-info',
            width: "8%",
            enablePinning: false,
            cellFilter: 'currency'
          });
          $scope.gridOptions.columnDefs.push({
            name: '' + response.data.Ingresos[0].Reporte[i].Mes + ' %',
            field: 'Reporte[' + i + '].Valores.Pvariacion',
            headerCellClass: 'text-info',
            width: "8%",
            cellTemplate: ' <div  class="{{grid.appScope.reportePac.changeCellClass(row.entity.Reporte[' + i + '].Valores.Variacion)}}" >{{row.entity.Reporte[' + i + '].Valores.Pvariacion * 100}} %</div>',
            enablePinning: false
            //cellFilter: 'currencyFilter:%'
          });

        }
        }
        if (response.data.Egresos != null && response.data.Egresos != undefined){
          for (var i = 0; i < response.data.Egresos[0].Reporte.length; i++) {
          $scope.gridOptions_egresos.columnDefs.push({
            name: '' + response.data.Egresos[0].Reporte[i].Mes + ' EJC',
            field: 'Reporte[' + i + '].Valores.Valor',
            //cellTemplate: ' <div>{{row.entity.reporte[' + i + '].valores.valor | currency}}</div>',
            headerCellClass: 'text-info',
            width: "8%",
            enablePinning: false,
            cellFilter: 'currency'
          });
          $scope.gridOptions_egresos.columnDefs.push({
            name: '' + response.data.Egresos[0].Reporte[i].Mes + ' PROY',
            field: 'Reporte[' + i + '].Valores.Proyeccion',
            headerCellClass: 'text-info',
            width: "8%",
            //cellTemplate: ' <div>{{row.entity.reporte[' + i + '].valores.proyeccion}}</div>',
            enablePinning: false,
            cellFilter: 'currency'
          });
          $scope.gridOptions_egresos.columnDefs.push({
            name: '' + response.data.Egresos[0].Reporte[i].Mes + ' VAR',
            field: 'Reporte[' + i + '].Valores.Variacion',
            headerCellClass: 'text-info',
            width: "8%",
            //cellTemplate: ' <div class="{{grid.appScope.reportePac.changeCellClass(row.entity.reporte[' + i + '].valores.variacion)}}">{{row.entity.reporte[' + i + '].valores.variacion}}</span>',
            enablePinning: false,
            cellFilter: 'currency'
          });
          $scope.gridOptions_egresos.columnDefs.push({
            name: '' + response.data.Egresos[0].Reporte[i].Mes + ' %',
            field: 'Reporte[' + i + '].Valores.Pvariacion',
            headerCellClass: 'text-info',
            width: "8%",
            cellTemplate: ' <div class="{{grid.appScope.reportePac.changeCellClass(row.entity.Reporte[' + i + '].Valores.Pvariacion)}}">{{row.entity.Reporte[' + i + '].Valores.Pvariacion * 100}} %</div>',
            enablePinning: false
          });
        }
        }
        
        $scope.ingresos = response.data.Ingresos;
        $scope.egresos =  response.data.Egresos;
        $scope.gridOptions.data = $scope.ingresos;
        $scope.gridOptions_egresos.data = $scope.egresos;

      });
    }
    self.changeCellClass = function(val) {
      if (val >= 0 && val <= 0, 2) {
        return 'bg-success'
      } else {
        return ''
      }
    }
    self.verResumen = function(row) {
      self.resumen = row.entity;

    }

    $scope.$watch('reportePac.vigencia', function() {
      //console.log("vigencia",self.nuevo_calendario.Vigencia);
      if (self.fechaInicio !== undefined && self.vigencia !== self.fechaInicio.getFullYear()) {
        //console.log(self.nuevo_calendario.FechaInicio.getFullYear());
        console.log("reset fecha inicio");
        self.self.fechaInicio = undefined;
      }
      self.fechamin = new Date(
        self.vigencia,
        0, 1
      );
      self.fechamax = new Date(
        self.vigencia,
        12, 0
      );
    }, true);

  });
