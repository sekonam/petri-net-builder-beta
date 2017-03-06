const OPEN_POPUP = 'popups/OPEN_POPUP';
const CLOSE_POPUP = 'popups/CLOSE_POPUP';
const SWAP_POPUPS = 'popups/SWAP_POPUPS';

export function openPopup(component, title, props = {}) {
  return {
    type: OPEN_POPUP,
    component,
    title,
    props,
  };
}

export function closePopup(index) {
  return {
    type: CLOSE_POPUP,
    index,
  };
}

export function swapPopups(source, target) {
  return {
    type: SWAP_POPUPS,
    source,
    target,
  };
}

export default function reducer(state = [], action = {}) {
  switch (action.type) {

    case OPEN_POPUP:
      return [
        ...state,
        action,
      ];

    case CLOSE_POPUP:
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1),
      ];

    case SWAP_POPUPS: {
      const source = state[action.source];
      state[action.source] = state[action.target];
      state[action.target] = source;
      return [...state];
    }
    default:
      return state;
  }
}
