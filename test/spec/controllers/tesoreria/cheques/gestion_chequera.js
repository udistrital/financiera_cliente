'use strict';

describe('Controller: TesoreriaChequesGestionChequeraCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaChequesGestionChequeraCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaChequesGestionChequeraCtrl = $controller('TesoreriaChequesGestionChequeraCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaChequesGestionChequeraCtrl.awesomeThings.length).toBe(3);
  });
});
