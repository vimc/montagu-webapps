import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class DemographicService extends AbstractLocalService {
    getDataSetsByTouchstoneId(touchstoneVersionId: string) {
        return this.setOptions({cacheKey: DemographicCacheKeysEnum.sets})
            .get(`/touchstones/${touchstoneVersionId}/demographics/`);
    }
}

export enum DemographicCacheKeysEnum {
    sets = "sets",
}
