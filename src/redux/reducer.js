import { TOGGLE_MENU, CLOSE_MENU } from './actions';

const initialState = {
    isMenuOpen: false
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_MENU:
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            };
        case CLOSE_MENU:
            return {
                ...state,
                isMenuOpen: false
            };
        default:
            return state;
    }
};
