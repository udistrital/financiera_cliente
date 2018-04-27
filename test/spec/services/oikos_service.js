'use strict';

describe('Service: oikosService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var oikosService;
  beforeEach(inject(function (_oikosService_) {
    oikosService = _oikosService_;
  }));

  it('should do something', function () {
    expect(!!oikosService).toBe(true);
  });

});
