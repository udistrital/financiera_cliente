'use strict';

describe('Controller: InversionesCreacionCancelacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesCreacionCancelacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesCreacionCancelacionCtrl = $controller('InversionesCreacionCancelacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesCreacionCancelacionCtrl.awesomeThings.length).toBe(3);
  });
});
