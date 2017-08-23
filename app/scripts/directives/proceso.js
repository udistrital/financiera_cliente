'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proceso
 * @description
 * # proceso
 */
angular.module('financieraClienteApp')
    .directive('proceso', function() {
        return {
            restrict: 'E',
            scope: {
                nodes: '=?',
                edges: '=?'
            },

            templateUrl: 'views/directives/proceso.html',
            controller: function($scope) {
                var nodes = {};
                var edges = {};
                var network = {};
                $scope.$watch('nodes', function() {
                    nodes = new vis.DataSet($scope.nodes);
                    edges = new vis.DataSet($scope.edges);
                    var container = document.getElementById('mynetwork');
                    // provide the data in the vis format
                    var data = {
                        nodes: nodes,
                        edges: edges
                    };
                    var options = {
                        clusterNodeProperties: {
                            allowSingleNodeCluster: true
                        }
                    };
                    // initialize your network!
                    network = new vis.Network(container, data, options);
                });

            },
            controllerAs: 'd_proceso'
        };
    });