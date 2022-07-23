import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
// import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <PersistGate persistor={persistor} >
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </Router>
);
