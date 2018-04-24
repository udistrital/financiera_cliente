'use strict';

describe('Controller: InversionesConsultaTitulosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var InversionesConsultaTitulosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InversionesConsultaTitulosCtrl = $controller('InversionesConsultaTitulosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InversionesConsultaTitulosCtrl.awesomeThings.length).toBe(3);
  });
});
