<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页" />
      <!--
        activeChannelIndex 绑定当前激活的标签页，使用索引
       -->
      <van-tabs v-model="activeChannelIndex">
        <van-tab title="标签 1">
          <!--
            下拉刷新
            isLoading 用来控制下拉树新的loading状态，下拉刷新的时候，它会自动将loading设置为true
            @refresh当下拉刷新的时候会触发
           -->
          <van-pull-refresh v-model="isLoading"
                            @refresh="onRefresh">
            <!-- 列表组件：主要提供上拉加载更多的功能
              loading 用来控制是否加载完毕
              finished 用来控制是否加载完毕
              @load 加载更多的时候触发一个事件，它自动会调用onload函数拿数据，以填充页面，他每次调用onload会自动将loading设置为true，我们需要在onload中拿到本次加载的数据以后，将loading设置为false
           -->
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      @load="onLoad">
              <van-cell v-for="item in list"
                        :key="item"
                        :title="item" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="标签 2">内容 2</van-tab>
        <van-tab title="标签 3">内容 3</van-tab>
        <van-tab title="标签 4">内容 4</van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    onRefresh () {
      console.log('onRefresh')
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
