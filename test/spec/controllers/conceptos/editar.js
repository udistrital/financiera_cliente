'use strict';

describe('Controller: ConceptosEditarCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ConceptosEditarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConceptosEditarCtrl = $controller('ConceptosEditarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConceptosEditarCtrl.awesomeThings.length).toBe(3);
  });
});
