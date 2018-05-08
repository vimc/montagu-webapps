import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import {AssociateRole} from "../../shared/models/Generated";

export class UsersService extends AbstractLocalService {
    getAllUsers() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.users})
            .get("/users/");
    }

    getAllUserRoles() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.roles})
            .get("/users/roles/all/");
    }

    clearUsersListCache() {
        return this.clearCache(
            UserCacheKeysEnum.users,
            "/users/"
        );
    }

    createUser(name :string, email:string, username:string) {
        return this
            .setOptions({exceptionOnError: false})
            .post("/users/", JSON.stringify({name, email, username}));
    }

    addRoleToUser(username: string, role: string) {
        const associateRole: AssociateRole = {
            name: role,
            action: "add",
            scope_prefix: null,
            scope_id: null
        };
        return this
            .post(`/users/${username}/actions/associate-role/`, JSON.stringify(associateRole));
    }

    removeRoleFromUser(username: string, role: string, scopeId: string, scopePrefix: string) {
        const associateRole: AssociateRole = {
            name: role,
            action: "remove",
            scope_prefix: scopePrefix,
            scope_id: scopeId
        };
        return this
            .post(`/users/${username}/actions/associate-role/`, JSON.stringify(associateRole));
    }
};

export enum UserCacheKeysEnum {
    users = "users",
    roles = "roles"
};