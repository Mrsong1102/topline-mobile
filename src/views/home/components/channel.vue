<template>
  <van-popup :value="value"
             @input="$emit('input',$event)"
             position="bottom"
             :style="{ height: '93%' }">
    <div class="close"></div>
    <div class="channels">
      <div class="head">
        <div class="mychannel">
          <span class="my">我的频道</span>
          <span class="enter">点击进入频道</span>
          <button class="edit">编辑</button>
        </div>
      </div>

      <div class="content">
        <van-grid :gutter="10"
                  clickable>
          <van-grid-item v-for="(channelItem,index) in channels"
                         :key="channelItem.id">
            <span slot="text"
                  class="text"
                  :class="{active:index===activeIndex}">{{channelItem.name}}</span>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.channels {
  .head {
    .mychannel {
      .my {
        font-size: 30px;
        margin-left: 18px;
      }
      .enter {
        font-size: 22px;
        margin-left: 15px;
        color: #bbb;
      }
      .edit {
        font-size: 24px;
        margin-left: 355px;
        border-radius: 25px;
        padding-left: 20px;
        padding-right: 20px;
        color: rgb(235, 84, 84);
        border: 1px solid rgb(235, 84, 84);
        background: #fff;
      }
    }
  }
  .content {
    .text {
      font-size: 26px;
    }
    .active {
      color: red;
    }
  }
}
// font-size: 16px;
// border-radius: 25px;
// color: red;
// border: 1px solid;
// padding-left: 10px;
// padding-right: 10px;
</style>
