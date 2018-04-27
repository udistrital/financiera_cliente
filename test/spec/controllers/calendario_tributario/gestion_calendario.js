'use strict';

describe('Controller: CalendarioTributarioGestionCalendarioCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var CalendarioTributarioGestionCalendarioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CalendarioTributarioGestionCalendarioCtrl = $controller('CalendarioTributarioGestionCalendarioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CalendarioTributarioGestionCalendarioCtrl.awesomeThings.length).toBe(3);
  });
});
