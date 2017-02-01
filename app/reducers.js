/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */
import _get from 'lodash/get';
import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import { reducer as formReducer } from 'redux-form';

/*
 * routeReducer
 *
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = {
  locationBeforeTransitions: null,
};

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return {
        ...state,
        locationBeforeTransitions: action.payload,
      };
    default:
      return state;
  }
}

// https://github.com/erikras/redux-form/issues/2178
const removeNested = (object, fullPath) => {
  if (typeof object === 'object') {
    const lastDotIndex = fullPath.lastIndexOf('.');
    const target = (lastDotIndex > -1 ? _get(object, fullPath.substr(0, lastDotIndex)) : object);
    if (target) {
      delete target[fullPath.substr(lastDotIndex + 1)];
    }
  }
};
const removeFormValue = (state, action) => {
  if (state && action.type === 'redux-form-plugin/REMOVE_TREE_ITEM') {
    removeNested(state.values, action.fullPath);
    removeNested(state.initial, action.fullPath);
  }
  return state;
};


/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    route: routeReducer,
    language: languageProviderReducer,
    form: formReducer.plugin({
      'control-manager-props': removeFormValue,
      'control-manager-data-model': removeFormValue,
    }),
    ...asyncReducers,
  });
}
