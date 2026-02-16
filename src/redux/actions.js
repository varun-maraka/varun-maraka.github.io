export const TOGGLE_MENU = 'TOGGLE_MENU';
export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE';

export const toggleMenu = () => ({
    type: TOGGLE_MENU
});

export const setActivePage = (page) => ({
    type: SET_ACTIVE_PAGE,
    payload: page
});
