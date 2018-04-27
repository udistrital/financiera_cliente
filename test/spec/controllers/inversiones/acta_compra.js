'use strict';

describe('Controller: InversionesActaCompraCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesActaCompraCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesActaCompraCtrl = $controller('InversionesActaCompraCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesActaCompraCtrl.awesomeThings.length).toBe(3);
  });
});
