'use strict';

/**
 * @ngdoc service
 * @name nixApp.userService
 * @description
 * # userService
 * Factory in the nixApp.
 */
angular.module('nixApp')
.factory('userRequest', function($http) { //declaramos la factoria
		var path = "http://localhost:8080/api/v1/";
		return {
			users : function(){
				global = $http.get(path+'users');
				return global;
			},
			user : function(id){ //retornara el user por el id
				global = $http.get(path+'users/'+id);
				return global;
			},
			del : function(id){
				global = $http.delete(path+'users/'+id);
				return global;
			},
			add : function(first,last){
				var data = {
	                firstname: first,
	                lastname: last
	            };

				global = $http.post(path+'users',data);
				return global;
			},
			edit : function(id,first,last){
				var data = {
	                firstname: first,
	                lastname: last
	            };

				global = $http.put(path+'users/'+id,data);
				return global;
			}
		}
	});
