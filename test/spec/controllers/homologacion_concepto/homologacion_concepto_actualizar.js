'use strict';

describe('Controller: HomologacionConceptoHomologacionConceptoActualizarCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var HomologacionConceptoHomologacionConceptoActualizarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomologacionConceptoHomologacionConceptoActualizarCtrl = $controller('HomologacionConceptoHomologacionConceptoActualizarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomologacionConceptoHomologacionConceptoActualizarCtrl.awesomeThings.length).toBe(3);
  });
});
