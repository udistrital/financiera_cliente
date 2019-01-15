'use strict';

describe('Controller: TesoreriaChequesGestionChequeCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaChequesGestionChequeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaChequesGestionChequeCtrl = $controller('TesoreriaChequesGestionChequeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaChequesGestionChequeCtrl.awesomeThings.length).toBe(3);
  });
});
