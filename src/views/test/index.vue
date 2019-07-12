<template>
  <div>
    <p>test page</p>
    <!--
      1.v-validate 是 vee-validate提供的一个全局指令，用来给表单元素设置校验规则的
      2.为元素设置name属性
      3.可以使用errors.first('字段的name')来获取该字段验证失败的错误消息
        errors是验证插件给你全局注入的
     -->
    <!-- <input v-validate="'required|email'"
           name="email"
           type="text">
    <span>{{ errors.first('email') }}</span> -->

    <van-cell-group>
      <!--
        1.使用v-validate添加校验规则
        2.为元素设置name属性
        3.将错误信息配置到组建的error-message属性上
       -->
      <van-field v-model="username"
                 v-validate="'required'"
                 placeholder="请输入用户名"
                 name="username"
                 :error-message="errors.first('username')" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'TestIndex',
  data () {
    return {
      username: ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
