<template>
  <van-popup :value="value"
             @input="$emit('input',$event)"
             position="bottom"
             :style="{ height: '93%' }" />
</template>

<script>
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
</style>
