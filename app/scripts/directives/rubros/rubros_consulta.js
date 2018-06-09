'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubrosConsulta
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires $scope
 * @param {object} seleccion seleccion del rubro en el arbol
 * @param {object|string|int} filtro dato para filtrar por cualquier atributo en la estructura
 * @param {object} rubrosel rubro seleccionado en la estructura
 * @param {undefined} recargar dato de cualquier tipo que al cambiar recarga la estructura
 * @param {string|int} rubroid Id del rubro
 * @description
 * # rubrosConsulta
 * Directiva en la cual se muestra la estructura de los rubros presupuestales registrados y permita la seleccion de estos
 */
angular.module('financieraClienteApp')
  .directive('rubrosConsulta', function(financieraRequest,financieraMidRequest) {
    return {
      restrict: 'E',
      scope: {
        seleccion: '=?',
        filtro: '=?',
        rubrosel: '=?',
        recargar: '=?',
        rubroid: '=?',
        arbol: '=?',
        noresumen: '@?',
        ramasel: '=?',
        botones: '=?',
        botonespadre: '=?',
        vigencia: '=?'
      },
      templateUrl: 'views/directives/rubros/rubros_consulta.html',
      controller: function($scope, $translate) {
        var self = this;
        self.editar= false;
        self.padre = false;
        $scope.botonesProductos = [];
        self.ProdutoRubro = [];
        self.botonesEditar = [
          { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
          { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true },
        ];
        self.UnidadEjecutora = 1;
        self.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: $scope.ramasel,
          isLeaf: function(node) {
                      return node.IsLeaf;
                  },
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        };
        var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD * 100}}%</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';
        self.gridOptions = {
          enableFiltering: true,
          enableSorting: true,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          paginationPageSizes: [25, 50, 75],
          paginationPageSize: 10,
          columnDefs: [{
              field: 'Id',
              visible: false
          }, {
              field: 'Producto.Nombre',
              cellClass: 'input_center',
              displayName: $translate.instant('PRODUCTO'),
              headerCellClass: 'text-info',
              enableFiltering: true
          }, {
              field: 'ValorDistribucion',
              displayName: $translate.instant('VALOR_DISTRIBUCION'),
              cellClass: 'input_center',
              headerCellClass: 'text-info',
              cellTemplate: tmpl
          }, {
            field: 'FechaRegistro',
            displayName: $translate.instant("FECHA_REGISTRO"),
            cellClass: 'input_center',
            headerCellClass: 'text-info',
            cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>'
        },
        {
              field: 'Activo',
              displayName: $translate.instant("ACTIVO"),
              cellClass: 'input_center',
              headerCellClass: 'text-info',
              cellTemplate: '<span ng-if="row.entity.Activo">Si</span><span ng-if="!row.entity.Activo">No</span>'
          },{
              name: $translate.instant('OPCIONES'),
              enableFiltering: false,
              width: '8%',
               headerCellClass: 'text-info',
              cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesProductos" fila="row"></btn-registro></center>'
          }],
          onRegisterApi: function(gridApi) {
              self.gridApi = gridApi;
          }

      };

      self.gridOptionsProductos = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 5,
        useExternalPagination: false,
        multiSelect: false,
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
            self.gridApiP = gridApi;
            //self.gridApi = gridApiService.pagination(self.gridApi, self.actualizarListaProductos, $scope);
            self.gridApiP.selection.on.rowSelectionChanged($scope,function(row){
              var productos = [];
              angular.forEach(self.gridApiP.selection.getSelectedRows(), function(data) {
                var distrAct = 0;
                angular.forEach(self.gridOptions.data, function(data){
                  distrAct = distrAct + parseFloat(data.ValorDistribucion);
                });
                console.log(distrAct);
                productos.push({Producto: data, ValorDistribucion: Math.floor((1-distrAct)*100)/self.gridApiP.selection.getSelectedRows().length});
              });
              self.ProdutoRubro = productos;
              console.log(self.ProdutoRubro);
            });

            self.gridApiP.selection.on.rowSelectionChangedBatch($scope,function(rows){
              var productos = [];
              angular.forEach(self.gridApiP.selection.getSelectedRows(), function(data) {
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

        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:rubrosConsulta#cargar_arbol
         * @methodOf financieraClienteApp.directive:rubrosConsulta
         * @description Recarga la estructura de los rubros haciendo uso del servicio {@link financieraService.service:financieraRequest financieraRequest}
         */
        self.cargar_arbol = function() {
         /* financieraRequest.get("rubro/ArbolRubros", $.param({
          UnidadEjecutora: self.UnidadEjecutora
        })).then(function(response) {
            $scope.arbol = [];
            if (response.data !== null) {
              $scope.arbol = response.data;

            }
          });*/
          financieraMidRequest.get("rubro/ArbolRubros/"+ self.UnidadEjecutora, $.param({
            rama: ""
          })).then(function(response) {
              $scope.arbol = [];
              if (response.data !== null) {
                $scope.arbol = response.data;
              }
            });
        };


        $scope.loadrow = function(fila, operacion){

          switch (operacion) {
            case "delete":
            fila.entity.Activo = false;
            financieraRequest.put("producto_rubro",fila.entity.Id,fila.entity).then(function (response){
              console.log(response.data);
              if (response.data === "OK"){
                swal('',$translate.instant("S_542"),"success");

              }else{
                swal('',$translate.instant("E_23503"),"error");
              }

              financieraRequest.get("rubro",'query=Id:'+fila.entity.Id).then(function(response){
                if(response.data != null){
                  $scope.data = response.data[0];
                  financieraRequest.get("producto_rubro", "query=Activo:true,Rubro.Id:"+fila.entity.Id+"&sortby=Activo&order=desc").then(function (response) {
                    if (response.data !== null){
                      self.gridOptions.data = response.data;
                    }else{
                      self.gridOptions.data = [];
                    }
                  });

                  console.log(response.data);
                }
              });
            });
            break;
            case "edit":
              var index = self.gridOptions.data.indexOf(fila.entity);
              //Permite que la fila del index, sea editable
              if (!self.gridOptions.data[index].editable){
                self.gridOptions.data[index].editable = !self.gridOptions.data[index].editable;
              }else{
                self.gridOptions.data[index].editable = !self.gridOptions.data[index].editable;
                var jsonActualizado = fila.entity;
              jsonActualizado.ValorDistribucion = parseFloat(jsonActualizado.ValorDistribucion);
              console.log(jsonActualizado);

                financieraRequest.post("producto_rubro/SetVariacionProducto",jsonActualizado).then(function (response) {
                  if (response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                  }else{
                    var data = response.data;
                    var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('PRODUCTO') + "</th><th>" + $translate.instant('RUBRO') + "</th>"+ "</th><th>" + $translate.instant('VALOR_DISTRIBUCION') + "</th>"+ "</th><th>" + $translate.instant('DETALLE') + "</th>";
                    templateAlert = templateAlert + "<tr class='success'><td>" + data.Body.Producto.Nombre + "</td>" + "<td>" + data.Body.Rubro.Codigo + " / "+ data.Body.Rubro.Nombre + "</td>"+ "<td>" + data.Body.ValorDistribucion + "</td>"+ "<td>" +$translate.instant(data.Code)+ "</td>" + "</tr>" ;
                    templateAlert = templateAlert + "</table>";

                    swal({
                      title: '',
                      type: response.data.Type,
                      width: 800,
                      html: templateAlert,
                      showCloseButton: true,
                      confirmButtonText: 'Cerrar'
                    }).then(function(){

                      financieraRequest.get("rubro",'query=Id:'+fila.entity.Id).then(function(response){
                        if(response.data != null){
                          $scope.data = response.data[0];
                          financieraRequest.get("producto_rubro", "query=Activo:true,Rubro.Id:"+fila.entity.Id+"&sortby=Activo&order=desc").then(function (response) {
                            if (response.data !== null){
                              self.gridOptions.data = response.data;
                            }else{
                              self.gridOptions.data = [];
                            }
                          });

                          console.log(response.data);
                        }
                      });

                    });
                  }
                });

              }


              break;
            default:
              break;
          }
        };

        self.AgregarProducto = function () {
              var Pr = null;
              Pr = self.ProdutoRubro;
              angular.forEach(Pr, function (data) {
                data.ValorDistribucion = parseInt(data.ValorDistribucion);
                data.Rubro = $scope.data;
              });
              financieraRequest.post("producto_rubro/AddProductoRubrotr", Pr[0]).then(function(response){
                if (response.data.Type === "error"){
                  swal('',$translate.instant(response.data.Code),response.data.Type);
                }else{
                  var data = response.data;
                  var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('PRODUCTO') + "</th><th>" + $translate.instant('RUBRO') + "</th>"+ "</th><th>" + $translate.instant('VALOR_DISTRIBUCION') + "</th>"+ "</th><th>" + $translate.instant('DETALLE') + "</th>";
                  templateAlert = templateAlert + "<tr class='success'><td>" + data.Body.Producto.Nombre + "</td>" + "<td>" + data.Body.Rubro.Codigo + " / "+ data.Body.Rubro.Nombre + "</td>"+ "<td>" + data.Body.ValorDistribucion + "</td>"+ "<td>" +$translate.instant(data.Code)+ "</td>" + "</tr>" ;
                  templateAlert = templateAlert + "</table>";

                  swal({
                    title: '',
                    type: response.data.Type,
                    width: 800,
                    html: templateAlert,
                    showCloseButton: true,
                    confirmButtonText: 'Cerrar'
                  }).then(function(){

                    financieraRequest.get("rubro",'query=Id:'+$scope.data.Id).then(function(response){
                      if(response.data != null){
                        $scope.data = response.data[0];
                        financieraRequest.get("producto_rubro", "query=Activo:true,Rubro.Id:"+$scope.data.Id+"&sortby=Activo&order=desc").then(function (response) {
                          if (response.data !== null){
                            self.gridOptions.data = response.data;
                          }else{
                            self.gridOptions.data = [];
                          }
                        });

                        console.log(response.data);
                      }
                    });

                  });
                }
              });

        };
        self.onSelectNode = function(node, expanded){
          if (expanded && !node.Hijos){
            console.log("Some Action ", node);  
            financieraMidRequest.get("rubro/ArbolRubros/"+ self.UnidadEjecutora, $.param({
              rama: node.Codigo
            })).then(function(response) {
                if (response.data !== null) {
                  node.Hijos = response.data[0].Hijos;
                }
              });        
          }
        }

        self.arbol_operacion = function(nodo, operacion){
          self.operacion = operacion;

          switch (operacion) {
              case "ver":
              self.editar=false;
              $scope.botonesProductos = [];
              self.gridOptions.data = [];
                  financieraRequest.get("rubro",'query=Id:'+nodo.Id).then(function(response){
                    if(response.data != null){
                      $scope.data = response.data[0];
                      financieraRequest.get("producto_rubro", "query=Rubro.Id:"+nodo.Id+"&sortby=Activo&order=desc").then(function (response) {
                        if (response.data !== null){
                          self.gridOptions.data = response.data;
                        }
                      });

                      console.log(response.data);
                    }
                  });
                  $("#myModal").modal();
                  break;
              case "add":
                  break;
              case "edit":
                  self.editar = true;
                  if (nodo.Hijos == null){
                    self.padre = false;

                  }else{
                    self.padre = true;
                  }
                  self.gridOptions.data = [];
                  self.ProdutoRubro = [];
                  financieraRequest.get("rubro",'query=Id:'+nodo.Id).then(function(response){
                    if(response.data != null){
                      $scope.data = response.data[0];
                      financieraRequest.get("producto_rubro", "query=Activo:true,Rubro.Id:"+nodo.Id).then(function (response) {
                        if (response.data !== null){
                          self.gridOptions.data = response.data;
                        }
                      });

                      console.log(response.data);
                    }
                  });
                  $scope.botonesProductos = self.botonesEditar;

                  $("#myModal").modal();
                  break;
              case "delete":

                 if (nodo !== undefined){
                  financieraMidRequest.delete("rubro/EliminarRubro",nodo.Id).then(function(response){
                    console.log(response.data);
                    if (response.data !== null && response.data.Type !== undefined) {
                      if (response.data.Type === "error") {
                          swal('', $translate.instant(response.data.Code), response.data.Type);
                      } else {

                          swal('', $translate.instant(response.data.Code), response.data.Type);
                          $scope.recargar = !$scope.recargar;
                      }

                  }else{
                    swal('', $translate.instant('E_0460'), 'error');                    
                  }
                  });
                 }
                  break;
              case "editapr":
                console.log("apredit");
                $("#ModalEdicionApr").modal();
                self.apropiacionsel = nodo;
                self.apropiacionsel.Apropiacion = null;
                self.ValorAsignado = null;
                if (nodo.Hijos == null){
                  console.log("Nodo ", nodo);
                  financieraRequest.get("apropiacion", $.param({
                    query: "Rubro.Id:"+nodo.Id + ",Vigencia:"+$scope.vigencia
                  })).then(function(response) {
                    
                    if (response.data !== null) {
                      console.log(response.data);
                      self.apropiacionsel.Apropiacion = response.data[0];
                      financieraRequest.get("apropiacion/SaldoApropiacion/"+self.apropiacionsel.Apropiacion.Id, "").then(function(response) {
                        
                        if (response.data !== null) {
                          self.apropiacionsel.Apropiacion.InfoSaldo = response.data;
                        }
                      });
                      financieraRequest.get("movimiento_apropiacion/GetMovimientosApropiacionByApropiacion/"+self.apropiacionsel.Apropiacion.Id, "").then(function(response) {
                        
                        if (response.data !== null) {
                          self.apropiacionsel.Apropiacion.InfoMovs = response.data;
                          self.gridOptions.data = self.apropiacionsel.Apropiacion.InfoMovs;
                        }
                      });
                    }
                  });
                  
                }
              break;
              case "editapr":
                console.log("apredit");
                $("#ModalEdicionApr").modal();
                self.apropiacionsel = nodo;
                self.apropiacionsel.Apropiacion = null;
                self.ValorAsignado = null;
                if (nodo.Hijos == null){
                  financieraRequest.get("apropiacion", $.param({
                    query: "Rubro.Id:"+nodo.Id + ",Vigencia:"+$scope.vigencia
                  })).then(function(response) {
                    
                    if (response.data !== null) {
                      console.log(response.data);
                      self.apropiacionsel.Apropiacion = response.data[0];
                      financieraRequest.get("apropiacion/SaldoApropiacion/"+self.apropiacionsel.Apropiacion.Id, "").then(function(response) {
                        
                        if (response.data !== null) {
                          self.apropiacionsel.Apropiacion.InfoSaldo = response.data;
                        }
                      });
                      financieraRequest.get("movimiento_apropiacion/GetMovimientosApropiacionByApropiacion/"+self.apropiacionsel.Apropiacion.Id, "").then(function(response) {
                        
                        if (response.data !== null) {
                          self.apropiacionsel.Apropiacion.InfoMovs = response.data;
                          self.gridOptions.data = self.apropiacionsel.Apropiacion.InfoMovs;
                        }
                      });
                    }
                  });
                  
                }
              break;
              case "config":
                  break;
              default:
          }
        }

        self.ActualizarApr = function() {
          $("#ModalEdicionApr").modal('hide');
          financieraMidRequest.post('apropiacion/', self.apropiacionsel.Apropiacion).then(function(response){
            console.log(response.data);
            if (response.data.Type !== undefined){
              if (response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
              }else{
                swal('',$translate.instant(response.data.Code)+ " : "+$translate.instant('APROPIACION')+" : "+response.data.Body.Rubro.Codigo+" / "+response.data.Body.Rubro.Nombre ,response.data.Type);
              }

            }
          });
          $scope.datachangeevent = !$scope.datachangeevent;
        };

        self.RegistrarApr = function() {
          $("#ModalEdicionApr").modal('hide');
          var aprAregistrar = {};
          var estadoapr = {};
          var rubroapr = {};
          estadoapr.Id = 1;
          rubroapr = self.apropiacionsel;
          rubroapr.Nombre = self.apropiacionsel.Nombre;
          rubroapr.Codigo = self.apropiacionsel.Codigo;
          aprAregistrar.Vigencia = $scope.vigencia;
          aprAregistrar.Estado = estadoapr;
          aprAregistrar.Rubro = rubroapr;
          aprAregistrar.Valor = parseInt(self.ValorAsignado);
          console.log(aprAregistrar);
          financieraMidRequest.post('apropiacion', aprAregistrar).then(function(response){
            console.log(response.data);
            if (response.data.Type !== undefined){
              if (response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
              }else{
                swal('',$translate.instant(response.data.Code)+ " : "+$translate.instant('APROPIACION')+" : "+response.data.Body.Rubro.Codigo+" / "+response.data.Body.Rubro.Nombre ,response.data.Type);
              }

            }
          });
          $scope.datachangeevent = !$scope.datachangeevent;
        };


        self.expandedNodes = [];
        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:rubrosConsulta#expandAllNodes
         * @methodOf financieraClienteApp.directive:rubrosConsulta
         * @description funcion para expandir recursivamente los nodos del arbol de rubros
         */
        self.expandAllNodes = function (tree) {
          angular.forEach(tree, function(leaf){
            if (leaf.Hijos) {
              self.expandedNodes.push(leaf);
              self.expandAllNodes(leaf.Hijos);

            }
          });

        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:rubrosConsulta#watch_on_filtro
         * @eventOf financieraClienteApp.directive:rubrosConsulta
         * @param {undefined} filtro variable que activa el evento
         * @description si esta variable cambia se expanden los nodos del arbol para facilitar su busqueda
         */
        $scope.$watch("filtro", function() {
          financieraMidRequest.get("rubro/ArbolRubros/"+ self.UnidadEjecutora, $.param({
            rama: $scope.filtro
          })).then(function(response) {
              $scope.arbol = [];
              if (response.data !== null) {
                $scope.arbol = response.data;
              }
            });
            self.expandedNodes.length = 0;
          /*if (self.expandedNodes.length === 0){
            self.expandAllNodes($scope.arbol);
          }

              if ($scope.filtro !== '' && $scope.filtro !== undefined){

              }else{
                self.expandedNodes.length = 0;
              }*/
        }, true);

        /*$interval(function() {
          self.cargar_arbol();// your code
       }, 5000);*/

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:rubrosConsulta#watch_on_recargar
         * @eventOf financieraClienteApp.directive:rubrosConsulta
         * @param {undefined} recargar variable que activa el evento
         * @description si esta variable cambia se actualiza el arbol
         */
        $scope.$watch("recargar", function() {
          self.cargar_arbol();
        }, true);

        $scope.showSelected = function(node, $path) {
          $scope.ramasel = $path();
        };
        self.cargar_arbol();


      },
      controllerAs: 'd_rubrosConsulta'
    };
  }).directive('debounceState', function() {
    return {
      require: 'ngModel',
      link: function(s, e, a, c) {

        var origDebounce = c.$$debounceViewValueCommit;
        var origCommit = c.$commitViewValue;

        c.$$debounceViewValueCommit = function() {
          console.log(c.$debouncing);
          if (!c.$debouncing) {
            s.$apply(function() {
              c.$debouncing = true;
            })
          }

          origDebounce.apply(this, arguments);
        }

        c.$commitViewValue = function() {
          c.$debouncing = false;
          console.log(c.$debouncing);
          origCommit.apply(this, arguments);
        }
      }
    }
  });
