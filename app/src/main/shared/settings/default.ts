export const settings: Settings = {
    apiUrl: () => "http://localhost:8080/v1",
    montaguUrl: () => "http://localhost",
    supportContact: "montagu-help@imperial.ac.uk",
    vimcEmail: "vimc@imperial.ac.uk",
    slackUrl: "https://vimc.slack.com/",
    isApplicantTouchstone: (id: string) => id.indexOf("rfp-") > -1,
    is2017Touchstone: (id: string) => id.indexOf("201710gavi-") === 0,
    is2019Touchstone: (id: string) => id.indexOf("201910") === 0,
    isNoGuidanceTouchstone: (id: string) => id.indexOf("202005covid") > -1,
    nonStochasticTouchstones: ["201810synthetic"],
    isVersionOfStochasticTouchstone: function (touchstoneId: string) {
        //is touchstone id NOT a version of any name in array of non-stochastic touchstones
        return !this.nonStochasticTouchstones.some((ts: string) => touchstoneId.indexOf(ts) === 0);
    },
    hideWideFormat: function (disease) {
        return ["MenA", "JE", "YF", "HPV", "measles", "rubella"]
            .map(d => d.toLocaleLowerCase())
            .indexOf(disease.toLowerCase()) > -1
    },
    showTouchstoneCreation: false,
    admin: {
        publicPath: "/admin",
        requiresModellingGroupMembership: false
    },
    contrib: {
        publicPath: "/contribution",
        requiresModellingGroupMembership: true
    },
    test: {
        publicPath: "/",
        requiresModellingGroupMembership: false
    }
};