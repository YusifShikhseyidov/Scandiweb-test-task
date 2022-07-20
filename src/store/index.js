import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { CartOperationsReducer, currencyReducer, croductReducer, productReducer } from "./reducers";

import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { encryptTransform } from "redux-persist-transform-encrypt";

const persistConfig = {
    key: "root",
    storage: storageSession,
    transforms: [
        encryptTransform({
            secretKey: "my-super-secret-key",
            onError: (error) =>{
                console.log(error)
            }
        })
    ]
};

const rootReducer = combineReducers({
    productList: productReducer,
    currency: currencyReducer,
    cart: CartOperationsReducer
});

const persistingReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistingReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export const persistor = persistStore(store);