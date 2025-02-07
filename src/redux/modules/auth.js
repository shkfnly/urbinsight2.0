/* @flow */
// import 'whatwg-fetch'
import serverEndpoint from 'utils/serverUtils'
import { removeHtmlStorage, setHtmlStorage, statusHtmlStorage } from 'utils/generalUtils'
// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS'
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
// NOTE: "Action" is a Flow interface defined in https://github.com/TechnologyAdvice/flow-interfaces
// If you're unfamiliar with Flow, you are completely welcome to avoid annotating your code, but
// if you'd like to learn more you can check out: flowtype.org.
// DOUBLE NOTE: there is currently a bug with babel-eslint where a `space-infix-ops` error is
// incorrectly thrown when using arrow functions, hence the oddity.

function requestLogin (creds): Action {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveLogin (user): Action {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user._id,
    user: user
  }
}

function loginError (message): Action {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

function requestSignUp (creds): Action {
  return {
    type: SIGN_UP_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveSignUp (user): Action {
  return {
    type: SIGN_UP_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user._id,
    user: user
  }
}

function signUpError (message): Action {
  return {
    type: SIGN_UP_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

// Calls the API to get a token and
// dispatches actions along the way

function requestLogout (): Action {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout (): Action {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

export function loginUser (creds) {
  let config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${creds.username}&password=${creds.password}`
  }
  return (dispatch) => {
      // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))
    return fetch('http://' + serverEndpoint + ':8000/api/sessions/create', config)
      .then((response) =>
        response.json().then((user) => ({ user, response }))
            ).then(({ user, response }) => {
              if (!response.ok) {
            // If there was a problem, we want to
            // dispatch the error condition
                dispatch(loginError(user.message))
                return Promise.reject(user)
              } else {
            // If login was successful, set the token in local storage
                setHtmlStorage('id_token', user.user._id, 86400)
                if (user.user.isAdmin) {
                  setHtmlStorage('isAdmin', true, 86400)
                }
            // Dispatch the success action
                dispatch(receiveLogin(user.user))
              }
            }).catch((err) => console.log('Error: ', err))
  }
}

export function logoutUser (): Action {
  return (dispatch) => {
    dispatch(requestLogout())
    removeHtmlStorage('id_token')
    removeHtmlStorage('isAdmin')
    dispatch(receiveLogout())
  }
}

export function signUpUser (creds) {
  let config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${creds.username}&password=${creds.password}`
  }
  return (dispatch) => {
      // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestSignUp(creds))
    return fetch('http://' + serverEndpoint + ':8000/api/user/create', config)
      .then((response) =>
        response.json().then((user) => ({ user, response }))
            ).then(({ user, response }) => {
              if (!response.ok) {
            // If there was a problem, we want to
            // dispatch the error condition
                dispatch(loginError(user.message))
                return Promise.reject(user)
              } else {
            // If login was successful, set the token in local storage
                setHtmlStorage('id_token', user.user._id, 86400)
            // Dispatch the success action
                dispatch(receiveLogin(user.user))
              }
            }).catch((err) => console.log('Error: ', err))
  }
}

export const actions = {
  requestLogin,
  receiveLogin,
  loginError,
  requestLogout,
  receiveLogout,
  requestSignUp,
  receiveSignUp,
  signUpError
}

// ------------------------------------
// Action Handlers
// ------------------------------------
// const ACTION_HANDLERS = {
//   [COUNTER_INCREMENT]: (state: number, action: {payload: number}): number => state + action.payload
// }

// ------------------------------------
// Reducer
// ------------------------------------
// const initialState = 0
// export default function counterReducer (state: number = initialState, action: Action): number {
//   const handler = ACTION_HANDLERS[action.type]
//
//   return handler ? handler(state, action) : state
// }

  // isAuthenticated: localStorage.getItem('id_token') ? true : false
  // The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export default function auth (state = {
  isFetching: false,
  isAuthenticated: statusHtmlStorage('id_token') ? localStorage.getItem('id_token') : null,
  user: {
    isAdmin: statusHtmlStorage('isAdmin') ? localStorage.getItem('isAdmin') : null
  }
}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isAdmin: action.user.isAdmin,
        user: action.user
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    case SIGN_UP_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case SIGN_UP_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        user: action.user
      })
    case SIGN_UP_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
    default:
      return state
  }
}
