import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducers from './root-reducer';

import rootSaga from './root-saga';

const sagaMiddleWare = createSagaMiddleware();
const middlewares = [sagaMiddleWare];
const isProduction = true;
// eslint-disable-next-line no-undef
if (!isProduction) {
	middlewares.push(logger);
}

const store = createStore(rootReducers, applyMiddleware(...middlewares));

sagaMiddleWare.run(rootSaga);

const persistor = persistStore(store);

export { store, persistor };
