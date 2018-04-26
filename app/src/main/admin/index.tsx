import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import {History} from "history";

import { AdminApp } from "./components/AdminApp";
import fetcher from "../shared/sources/Fetcher";
import { AdminFetcher } from "./sources/AdminFetcher";
import { Provider } from "react-redux";
import { createAdminStore } from "./stores/createAdminStore";
import { authActionCreators } from "../shared/actions/authActionCreators"


import './index.html';
import './style.scss';

fetcher.fetcher = new AdminFetcher();

const history: History = createBrowserHistory({ basename: "/admin"});
const store = createAdminStore(history);

store.dispatch(authActionCreators.loadSavedToken());

ReactDOM.render(
    <Provider store={store}>
        <AdminApp history={history}/>
    </Provider>,
    document.getElementById("react")
);