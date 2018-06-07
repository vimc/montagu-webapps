import { AbstractLocalService } from "./AbstractLocalService";

export class TouchstonesService extends AbstractLocalService {
    getAllTouchstones() {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get("/touchstones/");
    }

    getTouchstonesByGroupId(groupId: string) {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/modelling-groups/${groupId}/responsibilities/`);
    }
}

export enum TouchstonesCacheKeysEnum {
    touchstones = "touchstones",
}
