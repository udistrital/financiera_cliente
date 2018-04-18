'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ProductosProductoConsultaCtrl
 * @description
 * # ProductosProductoConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ProductosProductoConsultaCtrl', function ($scope,$translate,financieraRequest, gridApiService) {
    var self = this;
        self.offset = 0;
    	self.prRegistrar = {};
    	self.prRegistrar.ProductoRubro = [];
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
            }],
            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                self.gridApi = gridApiService.pagination(self.gridApi, self.actualizarLista, $scope);
            }

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

        	self.prRegistrar.ProductoRubro = [];
        };


        self.actualizarLista = function(offset,query){
            financieraRequest.get('producto/', 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query ).then(function(response) { //+ "&UnidadEjecutora=" + self.UnidadEjecutora
                if (response.data === null) {
                    self.gridOptions.data = [];
                } else {
                    self.gridOptions.data = response.data;
                }
            });
        };
        financieraRequest.get("producto/TotalProductos",'').then(function(response){
            self.gridOptions.totalItems = response.data;
            self.actualizarLista(self.offset, '');
        });

        self.registrarProducto = function(){
            financieraRequest.post('producto/', self.prRegistrar).then(function(response) {
                console.log(response.data);
                if (response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                }else{
                    var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('NOMBRE') + "</th><th>" + $translate.instant('DETALLE') + "</th>";      
                    templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Nombre + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td>"+"</tr>";
                    templateAlert = templateAlert + "</table>";
                    swal({
                      title: '',
                      type: response.data.Type,
                      width: 800,
                      html: templateAlert,
                      showCloseButton: true,
                      confirmButtonText: 'Cerrar'
                    }).then(function(){
                      $("#modalRegistroPr").modal('hide');
                      self.actualizarLista(0,'');
                    });
                }
            });
        };

        $scope.$watch("productoConsulta.rubroSel", function() {
         
          if (self.rubroSel != undefined && self.rubroSel != null){
          	if (self.prRegistrar.ProductoRubro.indexOf(self.rubroSel) == -1){
          	self.prRegistrar.ProductoRubro.push({Rubro: self.rubroSel});

          	}

          }
             
             
           
        }, true);
  });
