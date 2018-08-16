'use strict';

describe('Controller: InversionesConsultaCancelacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesConsultaCancelacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesConsultaCancelacionCtrl = $controller('InversionesConsultaCancelacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesConsultaCancelacionCtrl.awesomeThings.length).toBe(3);
  });
});
