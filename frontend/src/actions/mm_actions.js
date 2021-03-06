import * as types from './action_types';

export function setTitles(json) {
  return {type: types.FETCH_TITLES, titles: json.titles};
}

export function fetchTitles() {
  return dispatch => {
    return fetch("/movie_titles", {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(setTitles(json)));
  };
}

export function setSearch(search) {
  return {type: types.SET_SEARCH, search};
}

export function setVersion(version) {
  return {type: types.SET_VERSION, version};
}

export function setFilters(data) {
  return {type: types.SET_FILTERS, data};
}

export function resetFilters() {
  return {type: types.RESET_FILTERS};
}
