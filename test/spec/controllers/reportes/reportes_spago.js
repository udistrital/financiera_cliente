'use strict';

describe('Controller: ReportesReportesSpagoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ReportesReportesSpagoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportesReportesSpagoCtrl = $controller('ReportesReportesSpagoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportesReportesSpagoCtrl.awesomeThings.length).toBe(3);
  });
});
