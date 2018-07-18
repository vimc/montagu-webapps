import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import {settings} from "../../shared/Settings";

export abstract class AbstractReportLocalService extends AbstractLocalService {
    protected initOptions() {
        super.initOptions();
        this.options.baseURL = settings.reportingApiUrl();
    }
}

export function buildRelativeReportingURL(urlFragment: string): string {
    return "/v1" + urlFragment;
}