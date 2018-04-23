'use strict';

describe('Controller: InversionesConsultaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesConsultaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesConsultaCtrl = $controller('InversionesConsultaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesConsultaCtrl.awesomeThings.length).toBe(3);
  });
});
