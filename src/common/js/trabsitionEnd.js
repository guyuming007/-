/**
 * Created by newuser on 2017/9/11.
 */

export function transitionEnd (obj, callback) {
  if (typeof obj === 'object') {
    obj.addEventListener('webkitTransitionEnd', function() {
      callback && callback()
    })
    obj.addEventListener('transitionEnd', function() {
      callback && callback()
    })
  }
}
