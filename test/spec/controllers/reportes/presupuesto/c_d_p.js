'use strict';

describe('Controller: ReportesPresupuestoCDPCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ReportesPresupuestoCDPCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportesPresupuestoCDPCtrl = $controller('ReportesPresupuestoCDPCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportesPresupuestoCDPCtrl.awesomeThings.length).toBe(3);
  });
});
