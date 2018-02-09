'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PacCierrePeriodoCtrl', function ($scope, $translate) {
  	var ctrl = this;

  	
  	var monthFormat = buildLocaleProvider("MMM-YYYY");
  	var ymdFormat = buildLocaleProvider("YYYY-MM-DD");


  function buildLocaleProvider(formatString) {
        return {
            formatDate: function (date) {
                if (date) return moment(date).format(formatString);
                else return null;
            },
            parseDate: function (dateString) {
                if (dateString) {
                    var m = moment(dateString, formatString, true);
                    return m.isValid() ? m.toDate() : new Date(NaN);
                }
                else return null;
            }
        };
    }


  	$scope.dateFields = [
                {
                    type: 'date',
                    required: false,
                    binding: 'applicant.pickADate',
                    label: 'Standard Date Field - picking day, month and year',
                    startView: 'day',
                    mode: 'day',
                    locale: ymdFormat
                },
                {
                    type: 'date',
                    required: true,
                    binding: 'applicant.dateOfBirth',
                    label: 'Date of Birth (date picker that starts with month and year, but still needs day)',
                    startView: 'month',
                    mode: 'day',
                    locale: ymdFormat
                },
                {
                    type: 'date',
                    required: false,
                    binding: 'applicant.expectedGraduation',
                    startView: 'month',
                    label: 'Credit Card Expiry - Year/Month picker',
                    mode: 'month',
                    locale: monthFormat
                }
    ];
  	


  	ctrl.incrementaMes = function(){
 		console.log(1);

 	}

    });

  

 
