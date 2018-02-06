import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/reducers';

export function createContribStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk),
    );
}


