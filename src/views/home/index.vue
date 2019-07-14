<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页"
                   fixed />
      <!--
        activeChannelIndex 绑定当前激活的标签页，使用索引
       -->
      <van-tabs class="channel-tabs"
                v-model="activeChannelIndex">
        <van-tab v-for="channelItem in channels"
                 :key="channelItem.id"
                 :title="channelItem.name">
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
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [] // 存储频道列表
    }
  },

  created () {
    this.loadChannels()
  },

  methods: {
    async loadChannels () {
      const { user } = this.$store.state
      let channels = []
      // 已登录
      if (user) {
        const data = await getUserChannels()
        channels = data.channels
      } else {
        // 未登录

        // 如果有本地存储数据则使用本地存储中的频道列表
        const loadChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (loadChannels) {
          channels = loadChannels
        } else {
          // 如果没有本地存储频道数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      // 修改channels，将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.articles = [] // 用来储存当前文章的列表
        item.downPullLoading = false // 控制当前频道的下拉刷新loading状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的loading状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })

      this.channels = channels
    },

    /**
     * 上拉加载更多，push数据
     */
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

    /**
     * 下拉刷新，如果有新数据，则是重置列表数据
     */
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
.channel-tabs {
  margin-bottom: 100px;
}
// 深度作用选择器
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}

.channel-tabs /deep/ .van-tabs__content {
  margin-top: 96px;
}
</style>
