'use strict';

describe('Controller: CdpCdpAprobacionAnulacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var CdpCdpAprobacionAnulacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CdpCdpAprobacionAnulacionCtrl = $controller('CdpCdpAprobacionAnulacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CdpCdpAprobacionAnulacionCtrl.awesomeThings.length).toBe(3);
  });
});
