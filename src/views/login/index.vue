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
                    @click="handleLogin"
                    type="info">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '18801185985',
        code: '123456'
      }
    }
  },
  methods: {
    async handleLogin () {
      try {
        const data = await login(this.user)
        console.log(data)
      } catch (err) {
        console.log(err)
        console.log('登录失败!')
      }
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
