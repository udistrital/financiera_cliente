'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:tesoreria/reintegros
 * @description
 * # tesoreria/reintegros
 */
angular.module('financieraClienteApp')
  .directive('tesoreriaReintegros', function () {
    return {
      restrict: 'E',
      scope:{
          avancelegalizacion: '=?',
          g:'=?',
          resgitrareintegro:'=?'
        },
      templateUrl: 'views/directives/tesoreria/reintegros.html',
      controller:function($scope,$translate,uiGridConstants,financieraMidRequest,gridApiService,financieraRequest,$interval,$localStorage){
        var ctrl = this;
        ctrl.reintegroAvance = [];
        ctrl.gridReintegros = {
                  enableRowSelection: true,
                  enableSelectAll: false,
                  selectionRowHeaderWidth: 35,
                  multiSelect: false,
                  enableRowHeaderSelection: true,
                  paginationPageSizes: [5, 10, 15],
                  paginationPageSize: 10,
                  enableFiltering: true,
                  useExternalPagination: true,
                  columnDefs:[{
                      field: 'Id',
                      visible: false
                    },
                    {
                      field: 'Consecutivo',
                      displayName: $translate.instant('CONSECUTIVO'),
                      width: '*',
                      headerCellClass: 'encabezado'
                    },
                    {
                      field: 'Causal.Descripcion',
                      width: '*',
                      displayName: $translate.instant('CAUSAL_REINTEGRO'),
                      headerCellClass: 'encabezado'
                    },
                    {
                      field: 'Ingreso.IngresoConcepto.ValorAgregado',
                      displayName: $translate.instant('VALOR'),
                      width: '*',
                      cellFilter: 'currency',
                      cellClass: 'input_right',
                      headerCellClass: 'encabezado'
                    }
                  ],
                  onRegisterApi: function(gridApi) {
                    ctrl.gridReintApi = gridApi;
                    gridApi = gridApiService.pagination(gridApi,ctrl.cargarReintegros,$scope);
                    gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                      var reintegroAvnc = {}
                      reintegroAvnc={Reintegro:{Id:row.entity.Id}};

                      if (!angular.isUndefined($scope.avancelegalizacion) && $scope.avancelegalizacion !=null){
                        reintegroAvnc.AvanceLegalizacion={Id:$scope.avancelegalizacion.Id};
                      }else {
                        reintegroAvnc.SolicitudAvance={Id:$localStorage.avance.Id};
                      }

                      if(row.isSelected){
                        ctrl.reintegroAvance.push(reintegroAvnc);
                      }else{
                        var index = ctrl.reintegroAvance.indexOf(reintegroAvnc);
                        if (index > -1) {
                            ctrl.reintegroAvance.splice(index, 1);
                        }
                      }
                    });
                  }
                };

                ctrl.cargarReintegros = function(offset,query){
                  var querybase = "iei.estado_ingresomayor:1,r.disponible:true";
                  if(angular.isUndefined(query)||query.trim().length===0){
                    query = querybase;
                  }else{
                    query = query+","+querybase;
                  }
                  financieraMidRequest.cancel();
                  financieraMidRequest.get('reintegro/GetReintegroDisponible',$.param({
                    query:query,
                    limit:ctrl.gridReintegros.paginationPageSize,
                    offset:offset
                  })).then(function (response){
                    ctrl.gridReintegros.totalItems = response.data.cantidadReg;
                    ctrl.gridReintegros.data = response.data.reintegros;
                  });
                }

              ctrl.cargarReintegros(0,'');

              ctrl.guardarReinteAvances = function(){
                if(ctrl.reintegroAvance.length>0){
                  var request = {
                    reintegroAvance:ctrl.reintegroAvance
                  }
                  financieraRequest.post('reintegro_avance_legalizacion/AddReintegroAvance',request).then(function(response) {
                        swal('',$translate.instant(response.data.Code),response.data.Type).then(function(){
                          if(angular.equals(response.data.Type,"success")){
                            $scope.resgitrareintegro=true;
                          }
                          ctrl.cargarReintegros(0,'');

                        });
                  });
                }
              }

              $scope.$watch('g', function() {
                if(!$scope.g || angular.isUndefined($scope.g)){
                  $interval( function() {
                      ctrl.gridReintApi.core.handleWindowResize();
                    }, 500, 2);
                }
              });
      },
      controllerAs:'d_tesoreriaReintegros'
    };
  });
