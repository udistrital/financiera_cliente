'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/apropiacionConsulta
 * @description
 * # apropiacion/apropiacionConsulta
 */
angular.module('financieraClienteApp')
  .directive('apropiacionConsulta', function (financieraRequest,financieraMidRequest) {
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
        vigencia: '=?',
        botones: '=?',
        botonespadre: '=?',
        datachangeevent : '=?'
      },
      templateUrl: 'views/directives/apropiacion/apropiacion_consulta.html',
      controller:function($scope, $translate){
        var self = this;
        self.UnidadEjecutora = 1;
        $scope.datachangeevent = false;        
        console.log($scope.botonesPadre);
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

        self.gridOptions = {
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableFiltering : true,
          paginationPageSizes: [20, 50, 100],
          paginationPageSize: 10,
          //useExternalPagination: true,
          columnDefs : [
            {field: 'Id',             visible : false},
            {field: 'NumeroMovimiento' ,displayName: $translate.instant("NO"), cellClass: 'input_center',headerCellClass: 'text-info' },
            {field: 'Noficio' ,displayName: $translate.instant("NO_OFICIO"), cellClass: 'input_center',headerCellClass: 'text-info' },
            {field: 'Foficio',  displayName: $translate.instant("FECHA_OFICIO"), cellClass: 'input_center',headerCellClass: 'text-info' ,cellTemplate: '<span>{{row.entity.Foficio | date:"yyyy-MM-dd":"UTF"}}</span>'},
            {field: 'Tipo',  displayName: $translate.instant("TIPO_MOVIMIENTO"),headerCellClass: 'text-info'},
            {field: 'CuentaContraCredito',  displayName: $translate.instant("CUENTA_CONTRA_CREDITO"),headerCellClass: 'text-info'},
            {field: 'CuentaCredito',  displayName: $translate.instant("CUENTA_CREDITO"),headerCellClass: 'text-info'},
            {field: 'NumeroDisponibilidad',  displayName: $translate.instant("NO_CDP"),headerCellClass: 'text-info'},
            {field: 'Valor',  displayName: $translate.instant("VALOR"),headerCellClass: 'text-info', cellFilter: 'currency', cellClass: 'input_right'},
          ]

        };

        self.cargar_arbol = function() {
          $scope.arbol = [];
          financieraMidRequest.get("apropiacion/ArbolApropiaciones/"+ self.UnidadEjecutora+"/"+$scope.vigencia, $.param({
            rama: ""
          })).then(function(response) {
            
            if (response.data !== null) {
              $scope.arbol = response.data;

            }
          });

        };

        self.onSelectNode = function(node, expanded){
          if (expanded && !node.Hijos){
            console.log("Some Action ", node);  
            financieraMidRequest.get("apropiacion/ArbolApropiaciones/"+ self.UnidadEjecutora+"/"+$scope.vigencia, $.param({
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
                  
                  self.gridOptions.data.length=0;
                  $("#myModalapr").modal();
                  self.apropiacionsel = null;
                  self.apropiacionsel = nodo;
                  self.apropiacionsel.Apropiacion = null;
                  
                   
                     
                        self.apropiacionsel = nodo;
                        self.apropiacionsel.Apropiacion = {};
                        self.apropiacionsel.Vigencia = $scope.vigencia;
                        financieraRequest.get("apropiacion/SaldoApropiacion/"+self.apropiacionsel.Id, "").then(function(response) {//ver como consultar desde el nodo de mongo
                          
                          if (response.data !== null) {
                            self.apropiacionsel.Apropiacion.InfoSaldo = response.data;
                          }
                        });
                        if(nodo.Hijos == null){
                          financieraRequest.get("movimiento_apropiacion/GetMovimientosApropiacionByApropiacion/"+self.apropiacionsel.Id, "").then(function(response) {//este se debe dejar
                              
                              if (response.data !== null) {
                                self.apropiacionsel.Apropiacion.InfoMovs = response.data;
                                self.gridOptions.data = self.apropiacionsel.Apropiacion.InfoMovs;
                              }
                          });
                        }
                      
                    
                    
                 
                  
                  
                  break;
              case "add":
                  break;
              case "editapr":
                  $("#ModalEdicionApr").modal();
                  self.apropiacionsel = nodo;
                  self.apropiacionsel.Apropiacion = null;
                  self.ValorAsignado = null;
                  if (nodo.Hijos == null){
                    financieraRequest.get("apropiacion", $.param({
                      query: "Id:"+nodo.Id + ",Vigencia:"+$scope.vigencia
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
              case "delete":
                  break;
              case "config":
                  break;
              default:
          }
        }

        self.expandedNodes = [];
        
        self.expandAllNodes = function (tree) {
          angular.forEach(tree, function(leaf){
            if (leaf.Hijos) {
              self.expandedNodes.push(leaf);
              self.expandAllNodes(leaf.Hijos);

            }
          });

        };

        self.RegistrarApr = function() {
          $("#ModalEdicionApr").modal('hide');
          var aprAregistrar = {};
          var estadoapr = {};
          var rubroapr = {};
          estadoapr.Id = 1;
          rubroapr.Id = parseInt(self.apropiacionsel.Id);
          rubroapr.Nombre = self.apropiacionsel.Nombre;
          rubroapr.Codigo = self.apropiacionsel.Codigo;
          aprAregistrar.Vigencia = $scope.vigencia;
          aprAregistrar.Estado = estadoapr;
          aprAregistrar.Rubro = rubroapr;
          aprAregistrar.Valor = self.ValorAsignado;
          console.log(aprAregistrar);
          financieraRequest.post('apropiacion', aprAregistrar).then(function(response){
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

        self.ActualizarApr = function() {
          $("#ModalEdicionApr").modal('hide');
          financieraMidRequest.put('apropiacion/',self.apropiacionsel.Id+"/"+self.apropiacionsel.Apropiacion.Valor+"/"+$scope.vigencia, self.apropiacionsel).then(function(response){
            console.log(response.data);
            if (response.data.Type !== undefined){
              swal('',$translate.instant(response.data.Code),response.data.Type);
              $scope.recargar = !$scope.recargar;

            }
          });
          $scope.datachangeevent = !$scope.datachangeevent;
        };
        
        
        $scope.$watch("filtro", function() {    
              if ($scope.filtro !== '' && $scope.filtro !== undefined){
                self.expandAllNodes($scope.arbol);
              }else{
                self.expandedNodes.length = 0;
              }
             
             
           
        }, true);
        
        
        /*$scope.$watch("vigencia", function() {
          self.cargar_arbol();
          if ($scope.filtro !== '' && $scope.filtro !== undefined){
            self.expandAllNodes($scope.arbol);
          }else{
            self.expandedNodes.length = 0;
          }
        }, true);*/

        $scope.$watch("recargar", function() {
          self.cargar_arbol();
          if ($scope.filtro !== '' && $scope.filtro !== undefined){
            self.expandAllNodes($scope.arbol);
          }else{
            self.expandedNodes.length = 0;
          }
        }, true);

        $scope.showSelected = function(node, $path) {
          $scope.ramasel = $path();
        };
        self.cargar_arbol();
      },
      controllerAs:'d_apropiacionConsulta'
    };
  });
