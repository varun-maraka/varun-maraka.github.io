import { TOGGLE_MENU, SET_ACTIVE_PAGE } from './actions';

const initialState = {
    isMenuOpen: false,
    activePage: 'home'
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_MENU:
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            };
        case SET_ACTIVE_PAGE:
            return {
                ...state,
                activePage: action.payload,
                isMenuOpen: false
            };
        default:
            return state;
    }
};
