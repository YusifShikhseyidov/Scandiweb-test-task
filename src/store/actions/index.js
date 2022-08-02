import { ADD_TO_CART, TOGGLE_CART, REMOVE_CART_ITEM, CLEAR_CART, CLOSE_CART, SET_CURRENCY, SET_TOTAL_AMOUNT } from "../reducers/CartOperationsReducer";
import { TOGGLE_CURRENCY_MENU, CLOSE_CURRENCY_MENU } from "../reducers/CurrencyReducer";
import { GET_PRODUCTS, SET_ERROR } from "../reducers/ProductReducer";

export const getProducts = (products) => ({
    type: GET_PRODUCTS,
    payload: products
});

export const setError = (errorMessage) =>({
    type: SET_ERROR,
    payload: errorMessage
});

export const toggleCart = () =>({
    type: TOGGLE_CART,
});

export const addToCart = (product) =>({
    type: ADD_TO_CART,
    payload: product
});

export const removeCartItem = (id) =>({
    type: REMOVE_CART_ITEM,
    payload: id
});

export const clearCart = () =>({
    type: CLEAR_CART,
});

export const closeCart = () =>({
    type: CLOSE_CART
});

export const setCurrency = (currency) =>({
    type: SET_CURRENCY,
    payload: currency
});

export const toggleCurrencyMenu = () =>({
    type: TOGGLE_CURRENCY_MENU,
});

export const closeCurrencyMenu = () =>({
    type: CLOSE_CURRENCY_MENU,
});

export const setTotalAmountt = () =>({
    type: SET_TOTAL_AMOUNT
});