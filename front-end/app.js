import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

import * as reducers from "./reducers";
import App from "./components/App";
import { PersistGate } from "redux-persist/integration/react";

const reducer = combineReducers(Object.assign({}, reducers, {}));

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunkMiddleware)
);

// Note: passing enhancer as the last argument requires redux@>=3.1.0
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("mount")
);
