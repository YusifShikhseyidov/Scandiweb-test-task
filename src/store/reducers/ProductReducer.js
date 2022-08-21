/* eslint-disable no-case-declarations */
export const GET_PRODUCTS = "GET_PRODUCTS";
export const SET_ERROR = "SET_ERROR";

const initialState = {
    products: [],
    isError: false,
    errorMessage: ""
};

const productReducer = (state=initialState, action) => {
    const {type, payload} = action;

    switch(type) {
        case GET_PRODUCTS:
            const updatedlist={
                ...payload,
                products: payload.products.map( (product )=> {
                    return{
                        ...product,
                        quantity: 1
                    };
                })
            };

            return{
                ...state,
                products: updatedlist
            };

        case SET_ERROR:
            return{
                ...state,
                isError: true,
                errorMessage: payload
            };

        default:
            return state;
    }
};

export default productReducer;