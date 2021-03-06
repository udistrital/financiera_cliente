'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:procesoVariosEst
 * @description
 * # procesoVariosEst
 */
angular.module('financieraClienteApp')
  .directive('procesol', function () {
    return {
      restrict: 'E',
      scope: {
          nodes: '=?',
          edges: '=?',
          node: '=?',
          nodeclick: '=',
          eventclick: '&',
          info: '=?'

      },

      templateUrl: 'views/directives/procesosvariosest.html',

      link: function(scope, elm, attrs) {

      },
      controller: function($scope, $localStorage) {
        $scope.allchildrens = [];

          $scope.clicknode = function(params) {
              var data = {
                  Estado: { Id: this.getNodeAt(params.pointer.DOM) }
              };
              if ($scope.allchildrens.indexOf(data.Estado.Id) !== -1) {
                  $scope.nodeclick = data.Estado;
                  $localStorage.nodeclick = data.Estado;
                  $scope.eventclick();
              }
          };
          var nodes = {};
          var edges = {};
          var network = {};

          $scope.$watch('node', function() {
              if (!angular.isUndefined($scope.node)) {
                  $scope.ver_proceso = true;
              } else {
                  $scope.ver_proceso = false;
              }
              nodes = new vis.DataSet($scope.nodes);
              edges = new vis.DataSet($scope.edges);
              var container = document.getElementById('mynetwork');
              // provide the data in the vis format
              var data = {
                  nodes: nodes,
                  edges: edges
              };
              var options = {
                  nodes: {
                      color: '#BFBFBF',
                      borderWidth: 3,
                      borderWidthSelected: 1,
                      font: {
                          size: 15
                      },
                      shape: "dot"
                  },
                  edges: {
                      arrows: {
                          to: {
                              enabled: true
                          }
                      },
                      smooth: false
                  },
                  physics: false,
                  interaction: {
                      selectable: false,
                      dragNodes: false, // do not allow dragging nodes
                      zoomView: false, // do not allow zooming
                      dragView: true // do not allow dragging
                  },
                  layout: {
                      randomSeed: 1,
                      improvedLayout: true,
                      hierarchical: {
                          enabled: true,
                          levelSeparation: 300,
                          nodeSpacing: 150,
                          treeSpacing: 10,
                          blockShifting: false,
                          edgeMinimization: true,
                          parentCentralization: true,
                          direction: 'LR', // UD, DU, LR, RL
                          sortMethod: 'directed' // hubsize, directed
                      }
                  }
              };
              // initialize your network!
              network = new vis.Network(container, data, options);

              network.on('click', $scope.clicknode);
              angular.forEach($scope.node,function(fatherNode){
              console.log(fatherNode);
              $scope.childrens = network.getConnectedNodes(fatherNode.Id, 'to');
              angular.forEach($scope.childrens, function(node) {
                $scope.allchildrens.push(node);
                  var clickedNode = nodes.get(node);
                  clickedNode.color = {
                      background: '#31708F',
                  };
                  clickedNode.clicked = true;
                  nodes.update(clickedNode);
              });
              var node_active = nodes.get(fatherNode.Id);

              node_active.shape = "icon";
              node_active.icon = {
                  face: 'FontAwesome',
                  code: '\uf058',
                  size: 60,
                  color: '#2ECC71'
              };
              nodes.update(node_active);

            });

          });

      },
      controllerAs: 'd_procesoVariosEst'
  };
});
