import { expect } from "chai";

import {createMockStore} from "../../mocks/mockStore";
import {UsersService} from "../../../main/admin/services/UsersService";
import {Sandbox} from "../../Sandbox";

describe('Users service tests', () => {
    const sandbox = new Sandbox();

    const store = createMockStore();

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches users', () => {
        const usersService = new UsersService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(usersService, "setOptions");
        const getStub = sandbox.setStubFunc(usersService, "get", ()=>{
            return Promise.resolve();
        });

        usersService.getAllUsers();

        expect(getStub.getCall(0).args[0])
            .to.equal("/users/");
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'users' });
    })

})