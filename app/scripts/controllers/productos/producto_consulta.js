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
      self.cargando = false;
      self.hayData = true;
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
                headerCellClass: 'encabezado',
                enableFiltering: true,
                width: '30%',
            }, {
                field: 'Descripcion',
                displayName: $translate.instant('DESCRIPCION'),
                cellClass: 'input_center',
                headerCellClass: 'encabezado',
                width: '30%',
            }, {
                field: 'FechaRegistro',
                displayName: $translate.instant("FECHA_REGISTRO"),
                cellClass: 'input_center',
                headerCellClass: 'encabezado',
                cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
                width: '30%',
            },{
                name: $translate.instant('OPCIONES'),
                enableFiltering: false,
                width: '10%',
                 headerCellClass: 'encabezado',
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
                headerCellClass: 'encabezado',
                enableFiltering: true
            }, {
                field: 'Rubro.Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('NOMBRE'),
                headerCellClass: 'encabezado',
                enableFiltering: true
            }, {
                field: 'ValorDistribucion',
                cellClass: 'input_center',
                displayName: $translate.instant('VALOR'),
                headerCellClass: 'encabezado',
                enableFiltering: true,
                 cellTemplate: "<span>{{row.entity.ValorDistribucion * 100}} %</span>"
            }, {
                field: 'FechaAsignacion',
                cellClass: 'input_center',
                displayName: $translate.instant('FECHA_REGISTRO'),
                headerCellClass: 'encabezado',
                enableFiltering: true
            }
            ]

        };





        $scope.loadrow = function(row, operacion) {
            switch (operacion) {
                case "ver":

                    self.verProducto(row.entity);

                    break;
                case "otro":
                    break;
            }
        };

        self.verProducto = function(entity){
          self.data ={};
          self.data = entity;
          self.cargando_rubros = false;
          self.hayData_rubros = true;

          financieraRequest.get('producto/', 'query=Id:'+entity.Id ).then(function(response) { //+ "&UnidadEjecutora=" + self.UnidadEjecutora

              if (response.data[0].ProductoRubro.length == 0) {

                self.hayData_rubros= false;
                self.cargando_rubros = false;
                self.gridOptionsProductoRubro.data = [];
                $("#myModal").modal("show");
              } else {
                  self.hayData_rubros = true;
                  self.cargando_rubros = false;
                self.gridOptionsProductoRubro.data = response.data[0].ProductoRubro;
                  $("#myModal").modal("show");
              }
          });


        //  self.gridOptionsProductoRubro.data = [];
        };

        self.limpiar = function(){
        	self.data = {};
        	self.prRegistrar = {};

        	self.prRegistrar.ProductoRubro = [];
        };


        self.actualizarLista = function(offset,query){
            self.gridOptions.data = [];
            self.cargando = true;
            self.hayData = true
            financieraRequest.get('producto/', 'limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query ).then(function(response) { //+ "&UnidadEjecutora=" + self.UnidadEjecutora
                if (response.data === null) {

                  self.hayData = false;
                  self.cargando = false;
                  self.gridOptions.data = [];
                } else {
                    self.hayData = true;
                    self.cargando = false;
                    self.gridOptions.data = response.data;
                }
            });
        };
        financieraRequest.get("producto/TotalProductos",'').then(function(response){
            self.gridOptions.totalItems = response.data;
            self.actualizarLista(self.offset, '');
        });

        self.registrarProducto = function(){

          if(self.prRegistrar.Nombre === null || self.prRegistrar.Nombre === "" || self.prRegistrar.Nombre === undefined) {
              swal("", $translate.instant('ERROR_LLENAR'), "error")
            }else if(self.prRegistrar.Descripcion === null || self.prRegistrar.Descripcion === "" || self.prRegistrar.Descripcion === undefined){
              swal("", $translate.instant('ERROR_LLENAR'), "error")
            } else{
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



            }
        };

        $scope.$watch("productoConsulta.rubroSel", function() {

          if (self.rubroSel != undefined && self.rubroSel != null){
          	if (self.prRegistrar.ProductoRubro.indexOf(self.rubroSel) == -1){
          	self.prRegistrar.ProductoRubro.push({Rubro: self.rubroSel});

          	}

          }



        }, true);
  });
