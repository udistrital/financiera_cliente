'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.grid/gridapiService
 * @description
 * # grid/gridapiService
 * Service in the financieraClienteApp.
 */
angular.module('gridApiService',[])
/**
     * @ngdoc service
     * @name gridApiService.service:gridApiService
     * @description
     * # gridApiService
     * Fabrica sobre la cual se consumen los servicios para paginado externo en uigrid
     */
    .factory('gridApiService', function() {
        //var path = CONF.GENERAL.ACADEMICA_SERVICE;
        // Public API here
        return {
            /**
             * @ngdoc function
             * @name gridApiService.service:gridApiService#pagination
             * @methodOf gridApiService.service:gridApiService
             * @param {object} gridApi gridApi de uigrid para poner paginado externo
             * @return {object} gridApi con paginacion externa
             * @description Metodo gridApi del servicio
             */
            pagination: function(gridApi, consulFunc,$scope) {
                gridApi.core.on.filterChanged($scope, function() {
                    var grid = this.grid;
                    var query = '';
                    angular.forEach(grid.columns, function(value, key) {
                        if (value.filters[0].term) {
                            var formtstr = value.colDef.name.replace('[0]', '');
                            query = query + '&query=' + formtstr + '__icontains:' + value.filters[0].term;//
                            console.log("chnged ",query);
                        }
                    });
                    
                    consulFunc(0, query);
                });
                gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

                    //self.gridOptions.data = {};


                    var query = '';

                    var grid = this.grid;
                    angular.forEach(grid.columns, function(value, key) {
                        if (value.filters[0].term) {
                            var formtstr = value.colDef.name.replace('[0]', '');
                            query = query + '&query=' + formtstr + '__icontains:' + value.filters[0].term; //__icontains

                        }
                    });
                    var offset = (newPage - 1) * pageSize;
                    consulFunc(offset, query);
                });
                return gridApi;
            }
        };
    });