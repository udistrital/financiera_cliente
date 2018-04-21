'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:RubroRubroRegistroCtrl
 * @alias Registro de Rubros
 * @requires $scope
 * @requires financieraService.service:financieraRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @description
 * # RubroRubroRegistroCtrl
 * Controlador para el registro de rubros presupuestales.
 *
 *
 */
angular.module('financieraClienteApp')
  .controller('RubroRubroRegistroCtrl', function (financieraRequest,$translate,gridApiService,$scope) {
    var self = this;
    self.ProdutoRubro = [];
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true },
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
      
    ];
    
    financieraRequest.get('entidad','limit=0').then(function (response) {
      self.entidadOptions = response.data;
      });

      self.selectEntidad=null;
    self.quitar_padre = function() {
      self.padre = undefined;
      self.tipo_plan_hijo = '';
      self.codigo_hijo = '';
      self.descripcion_hijo='';
      self.selectEntidad=null;
      self.ProdutoRubro = [];
      self.gridApi.selection.clearSelectedRows();
    };

    self.gridOptionsProductos = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 5,
            useExternalPagination: false,
            columnDefs: [{
                field: 'Id',
                visible: false
            }, {
                field: 'Nombre',
                cellClass: 'input_center',
                displayName: $translate.instant('NOMBRE'),
                headerCellClass: 'text-info',
                enableFiltering: true ,
                width: '35%'
            }, {
                field: 'Descripcion',
                displayName: $translate.instant('DESCRIPCION'),
                cellClass: 'input_center',
                headerCellClass: 'text-info'
            }],
            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                //self.gridApi = gridApiService.pagination(self.gridApi, self.actualizarListaProductos, $scope);
                self.gridApi.selection.on.rowSelectionChanged($scope,function(row){
                  var productos = [];
                  angular.forEach(self.gridApi.selection.getSelectedRows(), function(data) {
                    productos.push({Producto: data, ValorDistribucion: 100/self.gridApi.selection.getSelectedRows().length});
                  });
                  self.ProdutoRubro = productos;
                  console.log(self.ProdutoRubro);
                });
           
                self.gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
                  var productos = [];
                  angular.forEach(self.gridApi.selection.getSelectedRows(), function(data) {
                    productos.push({Producto: data});
                  });
                  self.ProdutoRubro = productos;
                });
            }

        };

        self.actualizarListaProductos = function(offset,query){
            financieraRequest.get('producto/', query ).then(function(response) { //+ "&UnidadEjecutora=" + self.UnidadEjecutora
                if (response.data === null) {
                    self.gridOptionsProductos.data = [];
                } else {
                    self.gridOptionsProductos.data = response.data;
                }
            });
        };
        financieraRequest.get("producto/TotalProductos",'').then(function(response){
            self.gridOptionsProductos.totalItems = response.data;
            self.actualizarListaProductos(self.offset, '');
        });
      self.isDistr = function(){
        var distr = 0;
        var res = false;
        angular.forEach(self.ProdutoRubro, function(data) {
         distr = distr + parseInt(data.ValorDistribucion);
        });
        if (distr === 100){
          res = true
        }
        console.log("D ", distr);
        return res;
      };

      /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RubroRubroRegistroCtrl#registrar_rubro
     * @methodOf financieraClienteApp.controller:RubroRubroRegistroCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y registrar los datos de un rubro, ya sea como cabeza de rama o como hoja de una rama existente.
     */
      self.registrar_rubro = function() {
        if (self.padre === undefined || self.padre.UnidadEjecutora === ''){
          swal("", $translate.instant("E_RB003"),"error");
        }else if (self.codigo_hijo === '' || self.codigo_hijo === undefined){
          swal("", $translate.instant("E_RB001"),"error");
        }else if (self.descripcion_hijo === '' || self.descripcion_hijo === undefined){
          swal("", $translate.instant("E_RB002"),"error");
        }else if (self.chkProducto && self.ProdutoRubro.length === 0){
          swal("", $translate.instant("E_RB005"),"error");
        }else if(self.chkProducto && !self.isDistr()){
          swal("", $translate.instant("E_RB006"),"error");
        }/*else if (self.selectEntidad === null){
          swal("", $translate.instant("E_RB004"),"error");
        }*/
        else{
          var codigo_rubro = "";
          var id_hijo = 0;
          var rubro_padre;
  
  
          if( self.padre.Codigo === undefined){
            codigo_rubro = codigo_rubro + self.codigo_hijo;
          }else{
            codigo_rubro = codigo_rubro + self.padre.Codigo + "-" + self.codigo_hijo;
  
              rubro_padre= {
                    Id : parseInt(self.padre.Id)
                };
  
          }
          var Pr = null;
          if (self.chkProducto){
            Pr = self.ProdutoRubro;
            angular.forEach(Pr, function (data) {
              data.ValorDistribucion = parseInt(data.ValorDistribucion);
            });
          }
          
          var rubro_hijo = {
                Vigencia: 0,
                Entidad: 1,
                Nombre: self.nombre_hijo,
                Codigo: codigo_rubro,
                Descripcion: self.descripcion_hijo,
                UnidadEjecutora: parseInt(self.padre.UnidadEjecutora),
                Estado: 1,
                ProductoRubro: Pr
            };
            console.log(rubro_hijo);
           if(self.padre.Codigo != undefined){
              var rubro_rubro = {
                    RubroPadre : rubro_padre,
                    RubroHijo: rubro_hijo
                  }
                  console.log("Valor a Registrar###############");
                  console.log(rubro_rubro);
              financieraRequest.post('rubro_rubro', rubro_rubro).then(function(response) {
                if (response.data.Type !== undefined){
                  if (response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                  }else{
                    swal('',$translate.instant(response.data.Code)+": "+response.data.Body.RubroHijo.Codigo+":"+response.data.Body.RubroHijo.Descripcion,response.data.Type);
                    self.filtro_rubro = ""+response.data.Body.RubroHijo.Descripcion;
                    self.recarga_arbol = !self.recarga_arbol;
                  }
    
                }
                console.log(response.data);
                   });;
  
           }else{
             console.log(rubro_hijo);
              financieraRequest.post("rubro", rubro_hijo).then(function(response) {
                if (response.data.Type !== undefined){
                  if (response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                  }else{
                    swal('',$translate.instant(response.data.Code)+": "+response.data.Body.Codigo+":"+response.data.Body.Descripcion,response.data.Type);
                    self.filtro_rubro = ""+response.data.Body.Descripcion;
                    self.recarga_arbol = !self.recarga_arbol;
                  }
                  
                }
              console.log(response.data);
            });;
           }
        }
        

        };
  });
