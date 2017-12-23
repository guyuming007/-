/**
 * Created by newuser on 2017/9/12.
 */
import * as types from '../mutation-types'

const state = {
  index: 0,
  timer: 1,
  length: 0
}

const mutations = {
  [types.RECEIVE_LENGTH](state, length) {
    state.length = length
  }
}

const actions = {
  startHeaderTransition({commit, state}, obj) {
    clearInterval(state.timer)
    state.timer = setInterval(() => {
      state.index++
      commit(types.ADD_TRANSITION, {obj})
      commit(types.SET_TRANSLATEY, {obj, offsetY: -state.index * 16})
    }, 1500)
  }
}

export default {
  state,
  mutations,
  actions
}
