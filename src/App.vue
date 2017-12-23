<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import Header from './components/header/Header'
  export default {
    name: 'app',
    data () {
      return {
        seller: {}
      }
    },
    components: {
      'v-header': Header
    },
    created() {
      let self = this
      this.$axios.get('/api/seller')
        .then((response) => {
          response = response.data
          if (response.error === 0) {
            self.seller = response.data
          }
        }).catch((error) => {
          alert(error)
        })
    }
  }
</script>

<style lang="less">
  @import "common/less/mixin";

  #app {
    .tab {
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      .border-1px(rgba(7, 17, 27, 0.1))
    }
    .tab-item {
      flex: 1;
      text-align: center;
      & > a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
</style>
