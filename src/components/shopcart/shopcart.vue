<template>
  <div class="shopcart-wrapper">
    <div class="shopcart">
      <div class="footer-content" @click="togglelist">
        <div class="content-left">
          <div class="logo-warpper">
            <div class="logo" :class="{'highlight':num>0}"><i class="icon-shopping_cart"></i></div>
            <div class="num" v-show="num>0">{{num}}</div>
          </div>
          <div class="price" :class="{'highlight':num>0}">&yen;{{totalPrice}}</div>
          <div class="desc">另需配送费&yen;{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="{'enough':totalPrice>=minPrice}" @click.stop="pay">{{payDesc}}</div>
        </div>
      </div>

      <!-- 运动的小球 -->
      <div class="ballWrapper">
        <div v-for="ball in getBalls">

          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <!-- 外层Y轴方向 内层X轴方向 -->
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>

      <transition name="fold">
        <div class="shopcart-list" v-show="listShow"> 
          <div class="list-header">  <h1 class="title">购物车</h1>  <span class="empty">清空</span> </div>
          <div class="list-content" ref="listContent"> 
            <ul> 
              <li class="food border" v-for="food in cartProducts">  <span class="name">{{food.name}}</span> 
                <div class="price">  <span>¥{{food.price*food.count}}</span> </div>
                <div class="cartcontrol-wrapper"> 
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hidelist"></div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import IScroll from 'iscroll'

  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapGetters(['cartProducts', 'getBalls']),
      num() {
        let count = 0
        this.cartProducts.forEach((item) => {
          count += item.count
        })
        return count
      },
      totalPrice() {
        let total = 0
        this.cartProducts.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差¥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      listShow() {
        if (!this.num) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new IScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    data() {
      return {
        fold: true
      }
    },
    methods: {
      togglelist() {
        if (!this.num) {
          return
        }
        this.fold = !this.fold
      },
      hidelist() {
        this.fold = true
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`支付${this.totalPrice}元`)
      },
      ...mapMutations({dropend: 'DROP_END'}),
      /* 小球开始落下运动 */
      beforeDrop (el) {
        // el === <div class="ball" style="transform: translate3d(0px, 0px, 0px); display: none;"><div class="inner inner-hook" style="transform: translate3d(0px, 0px, 0px);"></div></div>
        // console.log(el)
        let count = this.getBalls.length
        while (count--) {
          let ball = this.getBalls[count]
          if (ball.show) {
            // 获取当前元素的偏移量
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 26
            // 屏幕的Y轴是向上为负
            // 由于在css中设置了其位置(购物车logo处),故在其上面的为负，还需 屏幕高度-自身偏移量 方为两处间的距离
            let y = -(window.innerHeight - rect.top - 22)
            // 外层Y轴方向 内层X轴方向
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      dropping (el, done) {
        // console.log(done) function () {if (!called) {called = true;fn();}}
        // 定义变量又不使用需 注释eslint-disable no-unused-vars
        /* eslint-disable no-unused-vars */
        // 用el.offsetHeight来主动触发浏览器重绘，这样就能正确的计算出位置了
        // offsetHeight:获取对象相对于版面或由父坐标 offsetParent 属性指定的父坐标的高度
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          //  transitionend 完成过渡后触发
          el.addEventListener('transitionend', done)
        })
      },
      /* 小球结束落下运动  需从记录点击按钮位置数组dropBalls中删除 并重置其内部参数 */
      afterDrop (el) {
        this.dropend({el})
      }

    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/less/mixin";

  .shopcart {
    position: fixed;
    height: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 50;
    .footer-content {
      display: flex;
      background: #141d27;
      font-size: 0;

      .content-left {
        flex: 1;

        .logo-warpper, .price, .desc {
          display: inline-block;
        }

        .logo-warpper {
          position: relative;
          top: -10px;
          z-index: 55;
          margin: 0 6px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 50%;
          vertical-align: top;
          background: #141d27;

          .logo {
            width: 100%;
            height: 100%;
            line-height: 44px;
            border-radius: 50%;
            text-align: center;
            font-size: 24px;
            color: rgba(255, 255, 255, 0.4);
            background: #2C353D;

            &.highlight {
              background: rgb(0, 160, 220);
              color: #fff;
            }

          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 12px;
            font-size: 9px;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }

        }
        .price {
          margin: 12px 0;
          padding-right: 12px;
          line-height: 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          &.highlight {
            color: #fff;
          }

        }
        .desc {
          margin: 12px 0;
          padding-left: 12px;
          font-size: 10px;
          line-height: 24px;
          color: rgba(255, 255, 255, 0.4);
        }

      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        background: #2C343C;

        .pay {
          padding: 0 8px;
          height: 48px;
          line-height: 48px;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          &.enough {
            background: #55DA6C;
            color: #fff;
          }

        }
      }
    }

    .ballWrapper {
      .ball {
        /* 小球落点的位置 起点不唯一不可直接&.drop-enter, &.drop-leave-active来设置 , 需用js 动态获取 */
        position: fixed;
        left: 26px;
        bottom: 22px;
        z-index: 200;
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(240, 20, 20);
          transition: all 0.4s linear;
        }
      }
    }

    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      transition: all 0.5s;
      transform: translate3D(0, -100%, 0);
      &.fold-enter, &.fold-leave-active {
        opacity: 0;
        transform: translate3D(0, 0, 0);
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;;
          color: rgb(0, 160, 260);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          .border-1px(rgba(7, 17, 27, 0.1));
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 90px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }

      }

    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    transition: all 0.5s;
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }


</style>
