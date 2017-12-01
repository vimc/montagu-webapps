import {expect} from "chai";
import {helpers} from "../../../main/shared/Helpers";

describe("String formatting helpers", () => {

    it("can turn dots to hyphens", () => {
        expect(helpers.dotsToHyphens("some.name")).to.equal("some-name");
        expect(helpers.dotsToHyphens("some.thing.with.lots.of.dots")).to.equal("some-thing-with-lots-of-dots");
        expect(helpers.dotsToHyphens("many..hyphens")).to.equal("many--hyphens");
        expect(helpers.dotsToHyphens(null)).to.equal(null);
        expect(helpers.dotsToHyphens("blah")).to.equal("blah");
    });


    it("can turn hyphens to dots", () => {
        expect(helpers.hyphensToDots("some-name")).to.equal("some.name");
        expect(helpers.hyphensToDots("some-thing-with-lots-of-dots")).to.equal("some.thing.with.lots.of.dots");
        expect(helpers.hyphensToDots("many--hyphens")).to.equal("many..hyphens");
        expect(helpers.hyphensToDots(null)).to.equal(null);
        expect(helpers.hyphensToDots("blah")).to.equal("blah");
    });


});