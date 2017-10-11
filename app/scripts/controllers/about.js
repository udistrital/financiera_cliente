'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AboutCtrl', function($timeout, $http, $scope, configuracionRequest, $rootScope, agoraRequest) {

    function subGridApiRegister(gridApi){
      // register the child API in the parent - can't tell why it's not in the core...
      var parentRow = gridApi.grid.appScope.row;
      parentRow.subGridApi = gridApi;
      console.log(parentRow);
      // TODO::run over the subGrid's rows and match them to the parentRow.isSelected property by name to toggle the row's selection
      $timeout(function(){
        if (angular.isUndefined(parentRow.isSelected)) return;
        angular.forEach(gridApi.grid.rows, function(row){
          // if tagged as selected, select it
          if(parentRow.isSelected[row.entity.name]){
            gridApi.selection.toggleRowSelection(row.entity);
          }
        });

      });
      // subGrid selection method
      gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope, function(row){
        if (angular.isUndefined(parentRow.isSelected)){
          parentRow.isSelected = {};
        }
        parentRow.isSelected[row.entity.name] = row.isSelected;
        $scope.outputconceptos = gridApi.selection.getSelectedRows();
        // now would probably be a good time to unselect the parent row, because not all of its children are selected...

      });
    }

    $scope.gridOptions = {
      expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;" ui-grid-selection></div>',
      expandableRowHeight: 150,
      onRegisterApi: function (gridApi) {

          gridApi.selection.on.rowSelectionChanged($scope, function(row){
            var selectedState = row.isSelected;
            // if row is expanded, toggle its children as selected
            if (row.isExpanded){
              // choose the right callback according to row status
              var selectCallBack = selectedState?"selectAllRows":"clearSelectedRows";
              // do the selection/unselection of children
              row.subGridApi.selection[selectCallBack]();
              // $log.log(row);
            }
            //mark children as selected if needed
            angular.forEach(row.entity.subGridOptions.data, function(value){
              // create the "isSelected" property if not exists
              if (angular.isUndefined(row.isSelected)){
                row.isSelected = {};
              }

              // keep the selected rows values in the parent row - idealy would be a unique ID coming from the server
              row.isSelected[value.name] = selectedState;
            });
          });
      }
    }

    $scope.gridOptions.columnDefs = [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'string'},
      { name: 'age', type: 'int'},
      { name: 'address.city', type: 'string'}
    ];

    $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
      .then(function(response) {
        for(var i = 0; i < response.data.length; i++){
          response.data[i].subGridOptions = {
            columnDefs: [
              {name:"Id", field:"id", type: 'int'},
              {name:"Name", field:"name", type: 'string'}
            ],
            data: response.data[i].friends,
            onRegisterApi: subGridApiRegister,
          }
        }
        $scope.gridOptions.data = response.data;
      });



  });
