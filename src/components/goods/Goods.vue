<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex === index}"
            @click="selectMenu(index)">
          <span class="text border">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!--以hook命名的类 一般用来在js中获取元素不做css样式设置  -->
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="sell-count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">&yen;{{food.price}}</span><span v-show="food.oldPrice"
                                                                    class="old">&yen;{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-warpper">
                  <cartcontrol :food="food" :needBall="needBall"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :min-price="seller.minPrice" :delivery-price="seller.deliveryPrice"></shopcart>
  </div>
</template>

<script>
  import IScroll from 'iscroll'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import shopcart from '../shopcart/shopcart'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        classMap: this.$store.state.classMap,
        listHeight: [],  // 记录每个区间的高度
        scrollY: 0,
        needBall: true
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      }
    },
    methods: {
      _initScroll() {
        // 将这段代码放在 head 标签内 解决iscroll在chrome浏览器卡顿问题
        //  解决方法 https://segmentfault.com/q/1010000008489619
        //  http://www.qianduan.org/post-468.html 解释
        this.menuScroll = new IScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new IScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3  // 这调节了探针监听滚动事件触发的频率
        })
        let self = this
        this.foodsScroll.on('scroll', function () {
          console.log(this)
          self.scrollY = Math.abs(Math.round(this.y)) // 根据 iscroll 滚动事件
        })
      },
      _calculateHeught() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu(index) {
        let height = this.listHeight[index]
        this.foodsScroll.scrollTo(0, -height, 300)
      }
    },
    created () {
      let self = this
      this.$axios.get('/api/goods')
        .then((response) => {
          response = response.data
          if (response.error === 0) {
            self.goods = response.data
            self.$store.state.goods.goods = self.goods
            self.$store.commit('RECEIVE_FOODS')
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeught()
            })
          }
        })
        .catch((error) => {
          alert(error)
        })
    },
    components: {
      shopcart,
      cartcontrol
    }
  }
</script>

<style lang="less">
  @import "../../common/less/mixin";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          font-weight: 700;
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          font-size: 14px;
          .border-1px(rgba(7, 17, 27, 0.1))
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          .iconImg(3)
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        position: relative;
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        .border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          .border-none();
          margin-bottom: 0;
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc, .extra {
            font-size: 10px;
            line-height: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
          }
          .extra .sell-count {
            margin-right: 12px;
          }
          .price {
            font-weight: 700;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old {
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cartcontrol-warpper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
