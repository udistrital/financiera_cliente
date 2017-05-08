'use strict';

/**
 * @ngdoc service
 * @name nixApp.rulerService
 * @description
 * # rulerService
 * Factory in the nixApp.
 */
angular.module('nixApp')
  .factory('ruleRequest', function($http) { //declaramos la factoria
		var path = "http://localhost:8080/api/rules/";
		return {
			domains : function(){
				global = $http.get(path+'domains');
				return global;
			},
			domain : function(id){ //retornara el user por el id
				global = $http.get(path+'domains/'+id);
				return global;
			},
			delDomain : function(id){
				global = $http.delete(path+'domains/'+id);
				return global;
			},
			addDomain : function(first,last){
				var data = {
	                firstname: first,
	                lastname: last
	            };

				global = $http.post(path+'domains',data);
				return global;
			},
			editDomain : function(id,first,last){
				var data = {
	                firstname: first,
	                lastname: last
	            };

				global = $http.put(path+'domains/'+id,data);
				return global;
			}
		}
	});
