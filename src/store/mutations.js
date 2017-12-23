/**
 * Created by newuser on 2017/9/12.
 */
import * as types from './mutation-types'

export default {
  [types.ADD_TRANSITION](state, {obj}) {
    obj.style.transition = 'all 0.5s'
    obj.style.webkitTransition = 'all 0.5s'
  },
  [types.REMOVE_TRANSITION](state, {obj}) {
    obj.style.transition = 'none'
    obj.style.webkitTransition = 'none'
  },
  [types.SET_TRANSLATEY](state, {obj, offsetY}) {
    obj.style.transform = 'translateY(' + offsetY + 'px)'
    obj.style.webkitTransform = 'translateY(' + offsetY + 'px)'
  },
  [types.RECEIVE_CART](state) {
    console.log(state)
    let arr = []
    state.goods.cartGoods.forEach((item) => {
      if (item.count > 0) {
        arr.push(item)
      }
    })
    state.cart.added = arr
  }
}
