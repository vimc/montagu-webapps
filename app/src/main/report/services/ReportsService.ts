import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class ReportsService extends AbstractLocalService {

    getAllReports() {
        return this.setOptions({cacheKey: ReportsCacheKeysEnum.reports})
            .get("/versions/", "reporting");
    }

    getReportVersions(reportId: string) {
        return this.setOptions({cacheKey: ReportsCacheKeysEnum.versions})
            .get(`/reports/${reportId}/`, "reporting");
    }

    getVersionDetails(reportId: string, versionId: string) {
        return this.setOptions({cacheKey: ReportsCacheKeysEnum.versionDetails})
            .get(`/reports/${reportId}/versions/${versionId}/`, "reporting");
    }

    getVersionChangelog(reportId: string, versionId: string) {
        return this.setOptions({cacheKey: ReportsCacheKeysEnum.versionChangelog})
            .get(`/reports/${reportId}/versions/${versionId}/changelog`, "reporting");
    }

    publishReport(name: string, version: string) {
        return this.post(`/reports/${name}/versions/${version}/publish/`, "reporting");
    }

    unPublishReport(name: string, version: string) {
        return this.post(`/reports/${name}/versions/${version}/publish/?value=false`, "reporting");
    }

    runReport(name: string) {
        return this.post(`/reports/${name}/run/`, "{}", "reporting");
    }
}

export enum ReportsCacheKeysEnum {
    "reports" = "reports",
    "versions" = "versions",
    "versionDetails" = "versionDetails",
    "versionChangelog"="versionChangelog"
}