export const settings: Settings = {
    reportingApiUrl: () => "http://localhost:8081/v1",
    apiUrl: () => "http://localhost:8080/v1",
    montaguUrl: () => "http://localhost:5000",
    supportContact: "montagu-help@imperial.ac.uk",
    vimcEmail: "vimc@imperial.ac.uk",
    slackUrl: "https://vimc.slack.com/",
    teamcityServiceMessages: false,
    isApplicantTouchstone: (id: string) => id.indexOf("rfp-") > -1,
    is201804ApplicantTouchstone: (id: string) id.indexOf("201804rfp") > -1,
    admin: {
        publicPath: "",
        requiresModellingGroupMembership: false
    },
    contrib: {
        publicPath: "",
        requiresModellingGroupMembership: true
    },
    report: {
        publicPath: "",
        requiresModellingGroupMembership: false
    }
};