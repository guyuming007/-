/**
 * Created by newuser on 2017/9/12.
 */
import Vue from 'vue'
import vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import header from './modules/header'
import goods from './modules/goods'
import cart from './modules/cart'

Vue.use(vuex)
const state = {
  classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
}

export default new vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    header,
    goods,
    cart
  }
})
