'use strict';

describe('Controller: PacReportePacCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PacReportePacCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PacReportePacCtrl = $controller('PacReportePacCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PacReportePacCtrl.awesomeThings.length).toBe(3);
  });
});
