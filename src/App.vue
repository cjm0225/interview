<template>
  <router-view></router-view>
</template>

<script setup>
</script>



<style lang="less" >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
}

#app {
  width: 100%;
  height: 100%;
}

// 修改进度条颜色 全局css文件中添加，也可以独立出一个css文件，在页面处单独引入
#nprogress .bar {
  background: black !important;
  height: 5px !important;
}
</style>
