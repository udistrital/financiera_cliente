'use strict';

describe('Controller: InversionesParametrosTituloCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesParametrosTituloCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesParametrosTituloCtrl = $controller('InversionesParametrosTituloCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesParametrosTituloCtrl.awesomeThings.length).toBe(3);
  });
});
