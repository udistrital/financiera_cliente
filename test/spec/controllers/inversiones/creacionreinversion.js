'use strict';

describe('Controller: InversionesCreacionreinversionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesCreacionreinversionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesCreacionreinversionCtrl = $controller('InversionesCreacionreinversionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesCreacionreinversionCtrl.awesomeThings.length).toBe(3);
  });
});
