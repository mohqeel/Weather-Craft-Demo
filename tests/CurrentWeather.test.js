describe("Current Weather", function() {
    describe("Testing the Validate API result function", () => {
      it("Should return flase for empty object", () => {
        expect(validateResultObj({})).to.equal(false);
      });
    });

    describe("Testing the get weather function ---- With server off", () => {
      it("Weather for San Francisco should be nothing", async () => {
        const currentSelectedCity = "San Francisco";
        let result = await getWeather(currentSelectedCity);
        expect(result).to.deep.equal({});
      });
    });

    describe("Testing the get weather function ---- With server on", () => {
      it("Weather for San Francisco should work", async () => {
        const currentSelectedCity = "San Francisco";
        let result = await getWeather(currentSelectedCity);
        expect(Object.keys(result).length).to.equal(6);
      });
    });
  
    describe("Get month from date function", () => {
      it("Should get December for date passed in December", () => {
          const date = new Date(1543973934039);
          expect(getMonthFromDate(date)).to.equal('December');
      });
    });
});