var expect = chai.expect;

describe("City", () => {
  describe("localStorage", () => {
    it("Key should be a certain value", () => {
      expect(localStoreKeyForCity).to.equal('cityName');
    });
  });
});