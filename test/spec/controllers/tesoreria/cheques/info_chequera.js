'use strict';

describe('Controller: TesoreriaChequesInfoChequeraCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaChequesInfoChequeraCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaChequesInfoChequeraCtrl = $controller('TesoreriaChequesInfoChequeraCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaChequesInfoChequeraCtrl.awesomeThings.length).toBe(3);
  });
});
