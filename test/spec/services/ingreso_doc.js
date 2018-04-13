'use strict';

describe('Service: ingresoDoc', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var ingresoDoc;
  beforeEach(inject(function (_ingresoDoc_) {
    ingresoDoc = _ingresoDoc_;
  }));

  it('should do something', function () {
    expect(!!ingresoDoc).toBe(true);
  });

});
