export const TOGGLE_CURRENCY_MENU = "TOGGLE_CURRENCY_MENU";
export const CLOSE_CURRENCY_MENU = "CLOSE_CURRENCY_MENU";

const initialState = {
    isOpen: false
};

const currencyReducer = (state=initialState, action) => {
    switch(action.type) {
        case TOGGLE_CURRENCY_MENU:
            return {
                ...state,
                isOpen: !state.isOpen
            };
        case CLOSE_CURRENCY_MENU:
            return {
                ...state,
                isOpen: false
            };
        default: 
            return state;
    }
};

export default currencyReducer;
