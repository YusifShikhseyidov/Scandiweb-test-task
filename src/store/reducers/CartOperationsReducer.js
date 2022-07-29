export const ADD_TO_CART="ADD_TO_CART";
export const TOGGLE_CART="TOGGLE_CART";
export const UPDATE_CART_ITEM="UPDATE_CART_ITEM";
export const REMOVE_CART_ITEM="REMOVE_CART_ITEM";
export const CLEAR_CART="CLEAR_CART";
export const CLOSE_CART="CLOSE_CART";
export const SET_CURRENCY="SET_CURRENCY";
export const SET_TOTAL_AMOUNT="SET_TOTAL_AMOUNT";

const initialState = {
    cartItems: [],
    totalQuantity: 0,
    isOpen: false,
    currency: {
        label: "USD",
        symbol: "$"
    }
};

const CartOperationsReducer = (state=initialState, action) => {
    switch(action.type){
        case ADD_TO_CART:
            let newProduct = action.payload;

            const existingProductIndex = state.cartItems.findIndex((product)=> product.id === newProduct.id && JSON.stringify(product.attributes) === JSON.stringify(newProduct.attributes));
            const existingProduct = state.cartItems[existingProductIndex];

            let addedItems;
            if(existingProduct){
                const updatedProduct = {
                    ...existingProduct,
                    quantity: existingProduct.quantity + 1,
                    totalPrice: newProduct.singleprice * (existingProduct.quantity + 1)
                };
                addedItems = [...state.cartItems];
                addedItems[existingProductIndex] = updatedProduct;
            }

            if(!existingProduct){
                const newestProduct = {
                    ...newProduct,
                    totalPrice: newProduct.singleprice * newProduct.quantity
                };
                addedItems = [...state.cartItems, newestProduct];
            }

            return {
                ...state,
                cartItems: addedItems,
                totalQuantity: state.totalQuantity + 1
            };
        
        case TOGGLE_CART:
            return {
                ...state,
                isOpen: !state.isOpen
            };
        
        case REMOVE_CART_ITEM:
            const index = action.payload;
            const existingProd = state.cartItems[index];

            let remainingProductsAfterRemoving;

            if(existingProd.quantity === 1){
                remainingProductsAfterRemoving = state.cartItems.filter(i => i !== index)
            } else{
                const updatedProd = {
                    ...existingProd,
                    quantity: existingProd.quantity - 1
                };
                remainingProductsAfterRemoving = [...state.cartItems];
                remainingProductsAfterRemoving[index] = updatedProd;
            }

            return {
                ...state,
                totalQuantity: state.totalQuantity - 1,
                cartItems: remainingProductsAfterRemoving
            };

        case CLEAR_CART:
            return{
                ...state,
                cartItems: [],
                totalQuantity: 0,
                PriceInTotal: 0
            };

        case CLOSE_CART:
            return{
                ...state,
                isOpen: false
            };

        case SET_CURRENCY:
            return{
                ...state,
                currency: action.payload
            };

        case SET_TOTAL_AMOUNT:
            const getPriceLabel = (prices, currency) =>{
                let _price_ = 0;
                prices.forEach( price =>{
                    if(price.currency.label === currency){
                        _price_ = price.amount;
                        return;
                    }
                })

                return _price_;
            }

            const newCartItems = state.cartItems.map( product =>{
                return {
                    ...product,
                    singleprice: getPriceLabel(product.prices, state.currency.label),
                    totalPrice: getPriceLabel(product.prices, state.currency.label) * product.quantity
                };
            });

            const PriceInTotal = newCartItems.reduce( (acc, item ) => acc + item.totalPrice, 0);
            return {
                ...state,
                PriceInTotal
            };

        default:
            return state;
    }
};

export default CartOperationsReducer;