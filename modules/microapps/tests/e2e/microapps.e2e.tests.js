'use strict';

describe('MicroApps E2E Tests:', function () {
  describe('Test microapps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/microapps');
      expect(element.all(by.repeater('microapp in microapps')).count()).toEqual(0);
    });
  });
});
