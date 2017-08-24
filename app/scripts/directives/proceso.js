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
                        nodes: {
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
                            dragNodes: true, // do not allow dragging nodes
                            zoomView: false, // do not allow zooming
                            dragView: true // do not allow dragging
                        },
                        layout: {
                            randomSeed: 1,
                            improvedLayout: true,
                            hierarchical: {
                                enabled: true,
                                levelSeparation: 300,
                                nodeSpacing: 100,
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
                });

            },
            controllerAs: 'd_proceso'
        };
    });