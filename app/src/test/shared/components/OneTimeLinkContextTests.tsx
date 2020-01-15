import {expect} from "chai";
import * as React from "react";

import {checkAsync} from "../../testHelpers";
import {OneTimeLinkContext, OneTimeLinkProps} from "../../../main/shared/components/OneTimeLinkContext";
import {Sandbox} from "../../Sandbox";
import {OneTimeTokenService} from "../../../main/shared/services/OneTimeTokenService";
import {mockContribState, mockOnetimeTokenState} from "../../mocks/mockStates";
import {ILookup} from "../../../main/shared/models/Lookup";
import {shallow} from "enzyme";
import {MockStore} from "redux-mock-store";
import * as Sinon from "sinon"
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";
import {createMockContribStore} from "../../mocks/mockStore";

describe("OneTimeLinkContext", () => {
    const sandbox = new Sandbox();
    let store: MockStore<ContribAppState> = null,
        fetchTokenStub: Sinon.SinonStub = null;

    const url = "/banana/";
    const token = "TOKEN";
    const tokens: ILookup<string> = {};
    tokens[url] = token;

    beforeEach(() => {
        store = createMockContribStore(mockContribState({onetimeTokens: mockOnetimeTokenState({tokens})}));
        fetchTokenStub = sandbox.sinon.stub(OneTimeTokenService.prototype, "fetchToken")
            .returns(Promise.resolve("token"))
    });

    afterEach(() => {
            fetchTokenStub.restore();
            sandbox.restore();
        });

    class EmptyComponent extends React.Component<OneTimeLinkProps, undefined> {
        render(): JSX.Element {
            return <button onClick={this.props.tokenConsumed}/>;
        }
    }

    const Class = OneTimeLinkContext(EmptyComponent);

    test(
        "if store does not contain matching token, href passed to child is null",
        (done: DoneCallback) => {
            const rendered = render(<Class href="/orange/"/>);
            const child = rendered.find(EmptyComponent);
            checkAsync(done, () => {
                expect(child.prop("href")).to.equal(null);
            });
        }
    );

    test(
        "can get properties from store with matching token",
        (done: DoneCallback) => {
            const rendered = render(<Class href="/banana/"/>);
            const child = rendered.find(EmptyComponent);
            checkAsync(done, () => {
                expect(child.prop("href")).to.equal("http://localhost:8080/v1/banana/?access_token=" + token);
            });
        }
    );

    test("can handle url with query string", (done: DoneCallback) => {
        const Class = OneTimeLinkContext(EmptyComponent);
        const url = "/banana/?query=whatevs";
        tokens[url] = token;
        const rendered = render(<Class href={url}/>);
        checkAsync(done, () => {
            const child = rendered.find(EmptyComponent);
            expect(child.prop("href")).to.equal("http://localhost:8080/v1/banana/?query=whatevs&access_token=" + token);
        });
    });

    test("triggers fetchToken on mount", (done: DoneCallback) => {
        render(<Class href="/banana/"/>);
        checkAsync(done, () => {
            expect(fetchTokenStub.called).to.equal(true, "Expected fetchToken to be called");
            expect(fetchTokenStub.getCall(0).args).to.eql(["/banana/"]);
        });
    });

    test("does not trigger fetchToken if href is null", (done: DoneCallback) => {
        render(<Class href={null}/>);
        checkAsync(done, () => {
            expect(fetchTokenStub.notCalled).to.equal(true, "Expected fetchToken to not be called");
        });
    });

    test(
        "triggers fetchToken when wrapped component consumes token",
        (done: DoneCallback) => {
            const url = "/table/";
            const element = render(<Class href={url}/>);
            element.find(EmptyComponent).dive().find("button").simulate("click");
            checkAsync(done, () => {
                expect(fetchTokenStub.callCount).to.equal(2, "Expected fetchToken to be called twice");
                expect(fetchTokenStub.getCall(0).args[0]).to.equal(url, "Expected first call to be called with url");
                expect(fetchTokenStub.getCall(1).args[0]).to.equal(url, "Expected second call to be called with url");
            });
        }
    );

    test(
        "it does not trigger fetchToken on properties change if href is the same",
        (done: DoneCallback) => {
            const url = "/bamboo";
            const element = render(<Class href={url}/>);
            element.setProps({href: url});

            checkAsync(done, () => {
                expect(fetchTokenStub.callCount).to.equal(1, "Expected fetchToken to be called once");
                expect(fetchTokenStub.getCall(0).args[0]).to.equal(url, "Expected fetchToken to be called with old url");
            });
        }
    );

    test(
        "it does trigger fetchToken on properties change if href is different",
        (done: DoneCallback) => {
            const url = "/bamboo";
            const element = render(<Class href={url}/>);

            const newUrl = "/juniper";
            element.setProps({href: newUrl});

            checkAsync(done, () => {
                expect(fetchTokenStub.callCount).to.equal(2, "Expected fetchToken to be called twice");
                expect(fetchTokenStub.getCall(0).args[0]).to.equal(url, "Expected fetchToken to be called with old url");
                expect(fetchTokenStub.getCall(1).args[0]).to.equal(newUrl, "Expected fetchToken to be called with new url");
            });
        }
    );

    test(
        "triggers fetchToken when href becomes not null",
        (done: DoneCallback) => {
            const url = "/bamboo";
            const element = render(<Class href={null}/>);
            element.setProps({href: url});
            checkAsync(done, () => {
                expect(fetchTokenStub.calledOnce).to.equal(true, "Expected fetchToken to be called once");
            });
        }
    );

    test("is loading when href is not null and token is null", () => {
        const url = "/url-with-no-token";
        const element = render(<Class href={url}/>);
        expect(element.find(EmptyComponent).prop("loading")).to.be.true;
    });

    test("is not loading when href is null", () => {
        const element = render(<Class href={null}/>);
        expect(element.find(EmptyComponent).prop("loading")).to.be.false;
    });

    test("is not loading when token is present", (done: DoneCallback) => {
        const url = "/bamboo";
        const element = render(<Class href={url}/>);

        checkAsync(done, () => {
            expect(element.find(EmptyComponent).prop("loading")).to.be.true;
        });
    });

    describe("enablement", () => {

        test("by default, stays enabled after clicking", (done: DoneCallback) => {
            const element = render(<Class href="/url/"/>);
            const wrapped = element.find(EmptyComponent);
            wrapped.dive().find("button").simulate("click");
            checkAsync(done, () => expect(wrapped.prop("enabled")).to.be.true);
        });

        test("when state.enabled is false, wrapped component is disabled", () => {
            const element = render(<Class href="/url/"/>);
            element.instance().setState({enabled: false});
            element.update();
            expect(element.find(EmptyComponent).prop("enabled")).to.be.false;
        });

        test("when href is null, wrapped component is disabled", () => {
            const element = render(<Class href={null}/>);
            expect(element.find(EmptyComponent).prop("enabled")).to.be.false;
        });

        test(
            "with delayBeforeReenable, disables temporarily after clicking",
            (done: DoneCallback) => {
                const element = render(<Class href="/url/" delayBeforeReenable={0.25}/>);
                element.find(EmptyComponent).dive().find("button").simulate("click");
                setTimeout(() => {
                    element.update();
                    expect(element.find(EmptyComponent).prop("enabled")).to.be.false;
                    setTimeout(() => {
                        element.update();
                        expect(element.find(EmptyComponent).prop("enabled")).to.be.true;
                        done();
                    }, 300);
                });
            }
        );
    });

    function render(node: React.ReactElement<any>) {
        return shallow(node, {context: {store}}).dive();
    }
});