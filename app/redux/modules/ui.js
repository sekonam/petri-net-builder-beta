const SET_PROPERTY = 'ui/SET_PROPERTY';

export function setProperty(action) {
  return {
    type: SET_PROPERTY,
    ...action,
  };
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {

    case SET_PROPERTY:
      return {
        ...state,
        [action.widgetId]: {
          ...state[action.widgetId],
          [action.property]: action.value,
        },
      };

    default:
      return state;
  }
}
