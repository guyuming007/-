/**
 * Created by newuser on 2017/9/13.
 */
import * as types from '../mutation-types'
// 所有商品
const state = {
  goods: [],
  cartGoods: [],
  value: false
}

const getters = {
  allGoods: state => state.cartGoods,
  valueChange: state => state.value
}

const mutations = {
  [types.RECEIVE_FOODS](state) {
    let allGoods = []
    for (let i = 0; i < state.goods.length; i++) {
      let item = state.goods[i]
      for (let j = 0; j < item.foods.length; j++) {
        let food = item.foods[j]
        const record = allGoods.find(f => f.name === food.name)
        if (!record) {
          food.count = 0
          allGoods.push(food)
        }
      }
    }
    state.cartGoods = allGoods
  },
  [types.ADD_TO_CART](state, {food}) {
    state.cartGoods.find(f => f.name === food.name).count++
    state.value = !state.value
  },
  [types.DEC_TO_CART](state, {food}) {
    state.cartGoods.find(f => f.name === food.name).count--
    state.value = !state.value
  }
}

export default {
  state,
  getters,
  mutations
}
