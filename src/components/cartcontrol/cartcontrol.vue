<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="myfood.count>0" @click="decCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" :class='{refrash: valueChange}' v-show="myfood.count>0">{{myfood.count}}
    </div>
    <div class="cart-add icon-add_circle" @click="addCart($event)"></div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    props: {
      food: {
        type: Object
      },
      needBall: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        count: 0
      }
    },
    computed: {
      ...mapGetters(['allGoods', 'valueChange']),
      myfood() {
        return this.allGoods.find(f => f.name === this.food.name)
      }
    },
    methods: {
      ...mapActions({
        addFn: 'addToCart',
        decFn: 'decToCart',
        drop: 'dropStart'
      }),
      addCart(event) {
        this.addFn({food: this.food})
        this.needBall ? this.drop({el: event.target}) : null
      },
      decCart() {
        this.decFn({food: this.food})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .cartcontrol {
    font-size: 0;

    .cart-decrease {
      transition: all 0.4s linear;

      .inner {
        transition: all 0.4s linear;
      }

      &.move-enter, &.move-leave-active {
        opacity: 0;
        transform: translate3D(24px, 0, 0);

        .inner {
          transform: rotate(180deg);
        }

      }
    }
    .cart-add, .inner {
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
    }

    .cart-add, .cart-decrease {
      padding: 6px;
      display: inline-block;
    }

    .cart-count {
      display: inline-block;
      padding-top: 6px;
      vertical-align: top;
      text-align: center;
      font-size: 10px;
      line-height: 24px;
      color: rgb(147, 153, 159);
    }

  }
</style>
