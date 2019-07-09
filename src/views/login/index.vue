<template>
  <div class="login-wrap">
    <van-nav-bar title="标题" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   required
                   clearable
                   label="手机号"
                   placeholder="请输入手机号" />

        <van-field v-model="user.code"
                   type="password"
                   label="密码"
                   placeholder="请输入密码"
                   required />
      </van-cell-group>
      <div class="login-btn">
        <van-button class="btn"
                    type="info">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await axios({
        method: 'POST',
        url: 'http://toutiao.course.itcast.cn/app/v1_0/authorizations',
        data: this.user
      })
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn {
  padding: 20px;
  .btn {
    width: 100%;
    border-radius: 8px;
  }
}
</style>
