<template>
  <div class="home">
    <van-nav-bar title="首页"
                 fixed />
    <!--
        activeChannelIndex 绑定当前激活的标签页，使用索引
       -->
    <van-tabs class="channel-tabs"
              v-model="activeChannelIndex">
      <div slot="nav-right"
           class="wap-nav"
           @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
      <van-tab v-for="channelItem in channels"
               :key="channelItem.id"
               :title="channelItem.name">
        <!--
            下拉刷新
            isLoading 用来控制下拉树新的loading状态，下拉刷新的时候，它会自动将loading设置为true
            @refresh当下拉刷新的时候会触发
           -->
        <van-pull-refresh v-model="channelItem.downPullLoading"
                          @refresh="onRefresh"
                          :success-text="channelItem.downPullSuccessText"
                          :success-duration="1000">
          <!-- 列表组件：主要提供上拉加载更多的功能
              loading 用来控制是否加载完毕
              finished 用来控制是否加载完毕
              @load 加载更多的时候触发一个事件，它自动会调用onload函数拿数据，以填充页面，他每次调用onload会自动将loading设置为true，我们需要在onload中拿到本次加载的数据以后，将loading设置为false
           -->
          <van-list v-model="channelItem.upPullLoading"
                    :finished="channelItem.upPullFinished"
                    finished-text="没有更多了"
                    @load="onLoad">
            <van-cell v-for="articleItem in channelItem.articles"
                      :key="articleItem.art_id"
                      :title="articleItem.title" />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

    <!-- 频道管理组件 -->
    <!--
      v-model 实际上是：
       v-bind:value="数据"
       v-on:input="数据=$event"
       :active-index.sync="activeChannelIndex" 相当于两句代码的简写
       :active-index="activeChannelIndex"
       @update:active-index="activeChannelIndex = $event"

       当你给一个属性加上 .sync 修饰符的时候，它会自动监听
          @update:绑定的字段="绑定的字段 = "$event"
          其中的事件名称中的update:是固定的语法
          所以你在你的子组件中发布自定义事件的时候务必要发送一个名字叫 update:绑定的字段 事件
          说白了：props数据.sync和v-model的作用是一样的，但是一个组件只能有一个v-mode

          v-model = "isChannelShow"是
          v-bind:value = "isChannelShow"
          @input = "isChannelShow = $event"
          的简写
     -->
    <HomeChannel v-model="isChannelShow"
                 :user-channels="channels"
                 :active-index.sync="activeChannelIndex" />
    <!-- 频道管理组件 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import HomeChannel from './components/channel'
export default {
  name: 'HomeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      channels: [], // 存储频道列表
      isChannelShow: false
    }
  },

  computed: {
    /**
     * 当前激活的频道
     */
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  watch: {
    // 监视容器中的user用户
    // 记住：凡是能this. 点儿出来的成员都可以直接在这里监视
    // 由于路由缓存了，所以这里监视用户的登录状态，如果登录了，则重新加载用户的频道列表
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannels()

      // 频道数据改变，重新加载当前激活频道的数据
      // 只需要将上拉加载更多设置为true，他就会自动调用onload请求函数
      this.activeChannel.upPullLoading = true
      // this.onLoad()
    }
    // isChannelShow () {
    //   // 如果频道面板隐藏了，并且当前频道没有数据，那我们就手动的onload加载更多
    //   if (!this.isChannelShow && !this.activeChannel.articles.length) {
    //     this.activeChannel.upPullLoading = true
    //     this.onLoad()
    //   }
    // }
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
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新loading状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的loading状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })

      this.channels = channels
    },

    /**
     * 上拉加载更多，push数据
     */
    async onLoad () {
      await this.$sleep(800)

      // console.log('onload')
      let data = []
      data = await this.loadArticles()

      /**
       * 如果没有pre_timestamp并且数组是空的，则意味着没有数据了
       */
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已加载完毕，组件自动给出提示，并且不再onload
        this.activeChannel.upPullFinished = true
        // 取消loading
        this.activeChannel.upPullLoading = false
        // 代码不要往后继续执行
        return
      }

      // pre_timestamp 下一页的页码
      // results 文章列表
      // console.log(data)

      // 解决初始化的时候没有最新推荐数据的问题（没有最新数据，那就加载上一次推荐数据）
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp

        // 加载下一页数据
        data = await this.loadArticles()
      }

      // 数据加载号以后，将pre_timestamp更新到当前频道中用于加载下下页数据
      this.activeChannel.timestamp = data.pre_timestamp

      // 将文章数据更新到频道中(注意：是push追加，不是赋值)
      this.activeChannel.articles.push(...data.results)

      // 数据加载完毕，取消上拉 loading
      this.activeChannel.upPullLoading = false

      // console.log(data)
      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    },

    /**
     * 下拉刷新，如果有新数据，则是重置列表数据
     */
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp

      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()

      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results
        // 由于你重置了文章列表，那么当前数据中的 pre_timestamp 就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'

        // 当下拉刷新有数据并重置以后数据无法满足一瓶，所以我们使用onload 在多加载一页数据
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }

      // 下拉刷新结束，取消loading状态
      activeChannel.downPullLoading = false

      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },

    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 当前频道下一页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
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

.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right: 0;
  background: #fff;
  padding-top: 10px;
  padding-left: 24px;
  padding-right: 24px;
}
</style>
