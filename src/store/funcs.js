/*
Copyright 2017 Bitnami.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// @flow
import Api from 'utils/Api'
import type { Func, Cluster, ReduxAction } from 'utils/Types'

type State = {
  list: Array<Cluster>,
  selected?: Cluster,
  loading: boolean
}
// ------------------------------------
// Constants
// ------------------------------------
export const FUNCS_SELECT = 'FUNCS_SELECT'
export const FUNCS_FETCH = 'FUNCS_FETCH'
export const FUNCS_LOADING = 'FUNCS_LOADING'
export const FUNCS_RUN = 'FUNCS_RUN'
export const FUNCS_SAVE = 'FUNCS_SAVE'
export const FUNCS_CREATE = 'FUNCS_CREATE'

// ------------------------------------
// Actions
// ------------------------------------
export function funcsSelect(func: Func) {
  return {
    type: FUNCS_SELECT,
    item: func
  }
}
export function funcsLoading(loading: boolean = false) {
  return {
    type: FUNCS_LOADING,
    loading
  }
}
export function funcsFetch(cluster: Cluster) {
  return (dispatch: () => void) => {
    dispatch({
      type: FUNCS_LOADING,
      item: true
    })
    return Api.get('/functions', {}, cluster).then(result => {
      dispatch({
        type: FUNCS_FETCH,
        list: result.items
      })
    }).catch(e => {
      dispatch({
        type: FUNCS_FETCH,
        list: []
      })
    })
  }
}
export function funcsSave(func: Func) {
  return {
    type: FUNCS_SAVE,
    item: func
  }
}

export function funcsCreate(params: any, cluster: Cluster) {
  return (dispatch: () => void) => {
    const data = {
      kind: 'Function',
      metadata: {
        name: params.name,
        handler: params.handler
      },
      spec: {
        'function': '',
        runtime: params.runtime
      }
    }
    return Api.post('/functions', data, cluster).then(result => {
      dispatch({
        type: FUNCS_CREATE,
        item: result.item
      })
    })
  }
}

export function funcsRun(func: Func, body: string) {
  return {
    type: FUNCS_RUN,
    item: func,
    body
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list: [],
  loading: false
}
export default function funcsReducer(state: State = initialState, action: ReduxAction) {
  switch (action.type) {
    case FUNCS_SELECT:
      return Object.assign({}, state, {
        selected: action.item
      })
    case FUNCS_FETCH:
      return Object.assign({}, state, {
        list: action.list,
        selected: null,
        loading: false
      })
    case FUNCS_LOADING:
      return Object.assign({}, state, {
        loading: action.item
      })
    case FUNCS_SAVE:
      return state
    case FUNCS_RUN:
      return state
    default:
      return state
  }
}