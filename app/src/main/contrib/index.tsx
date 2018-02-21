import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContribApp } from "./components/ContribApp";
import { ContribFetcher } from "./sources/ContribFetcher";
import fetcher from "../shared/sources/Fetcher";
import { Provider } from "react-redux";
import { createContribStore } from "./stores/createContribStore";
import { authActions } from "../shared/actions/authActions"

import './index.html';
import './style.scss';


fetcher.fetcher = new ContribFetcher();
const store = createContribStore();
store.dispatch(authActions.loadSavedToken())


ReactDOM.render(
    <Provider store={store}>
        <ContribApp />
    </Provider>,
    document.getElementById("react")
);