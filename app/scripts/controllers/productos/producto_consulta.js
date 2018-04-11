'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ProductosProductoConsultaCtrl
 * @description
 * # ProductosProductoConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ProductosProductoConsultaCtrl', function ($scope,$translate) {
    var self = this;
    	self.prRegistrar = {};
    	self.prRegistrar.rubrosRelacionados = [];
        self.offset = 0;
        $scope.botones = [{
                clase_color: "ver",
                clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
                titulo: $translate.instant('BTN.VER'),
                operacion: 'ver',
                estado: true
            }
            //{ clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('PROCESO'), operacion: 'proceso', estado: true }
        ];
        self.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 10,
            useExternalPagination: true,
            columnDefs: [{
                field: 'Id',
                visible: false
            }, {
                field: 'Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('NOMBRE'),
                headerCellClass: 'text-info',
                enableFiltering: true
            }, {
                field: 'Descripcion',
                displayName: $translate.instant('DESCRIPCION'),
                cellClass: 'input_center',
                headerCellClass: 'text-info'
            }, {
                field: 'FechaRegistro',
                displayName: $translate.instant("FECHA_REGISTRO"),
                cellClass: 'input_center',
                headerCellClass: 'text-info'
            },{
                name: $translate.instant('OPCIONES'),
                enableFiltering: false,
                width: '8%',
                 headerCellClass: 'text-info',
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>'
            }]

        };

        self.gridOptionsProductoRubro = {
            enableFiltering: true,
            enableSorting: true,
            enableRowHeaderSelection: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 10,
            columnDefs: [{
                field: 'Id',
                visible: false
            }, {
                field: 'Rubro.Codigo',
                cellClass: 'input_center',
                displayName: $translate.instant('CODIGO'),
                headerCellClass: 'text-info',
                enableFiltering: true
            }, {
                field: 'Rubro.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('NOMBRE'),
                headerCellClass: 'text-info',
                enableFiltering: true
            }, {
                field: 'ValorDistribucion',
                cellClass: 'input_center',
                displayName: $translate.instant('VALOR'),
                headerCellClass: 'text-info',
                enableFiltering: true,
                 cellTemplate: "<span>{{row.entity.ValorDistribucion * 100}} %</span>"
            }, {
                field: 'FechaAsignacion',
                cellClass: 'input_center',
                displayName: $translate.instant('FECHA_REGISTRO'),
                headerCellClass: 'text-info',
                enableFiltering: true
            }
            ]

        };


        var testData = {
        	Id: 1,
        	Nombre: "Producto 1",
        	Descripcion: "Producto prueba",
        	FechaRegistro: "2018-01-01",
        	ProductoRubro: [{Id:1, Rubro:{Id:1, Codigo:"111-111-111-111",Nombre:"Rubro Prueba"}, ValorDistribucion:0.12, FechaAsignacion: "2018-01-01" }],
        };
        var restServicePetitionResul = [];
        restServicePetitionResul.push(testData);
        self.gridOptions.data = restServicePetitionResul;


        $scope.loadrow = function(row, operacion) {
            switch (operacion) {
                case "ver":
                    self.verProducto(row.entity);
                    break;
            }
        };

        self.verProducto = function(entity){
        	self.data = {};
        	self.data = entity;
        	self.gridOptionsProductoRubro.data = self.data.ProductoRubro
        	$("#myModal").modal();
        };

        self.limpiar = function(){
        	self.data = {};
        	self.prRegistrar = {};

        	self.prRegistrar.rubrosRelacionados = [];
        };

        $scope.$watch("productoConsulta.rubroSel", function() {
         
          if (self.rubroSel != undefined && self.rubroSel != null){
          	if (self.prRegistrar.rubrosRelacionados.indexOf(self.rubroSel) == -1){
          	self.prRegistrar.rubrosRelacionados.push(self.rubroSel);

          	}

          }
             
             
           
        }, true);
  });
