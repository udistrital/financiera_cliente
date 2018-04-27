'use strict';

describe('Controller: RpRpAprobacionAnulacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var RpRpAprobacionAnulacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RpRpAprobacionAnulacionCtrl = $controller('RpRpAprobacionAnulacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RpRpAprobacionAnulacionCtrl.awesomeThings.length).toBe(3);
  });
});
