'use strict';

describe('Controller: BancosGestionBancosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var BancosGestionBancosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BancosGestionBancosCtrl = $controller('BancosGestionBancosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BancosGestionBancosCtrl.awesomeThings.length).toBe(3);
  });
});
