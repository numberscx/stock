<script setup lang="ts">

</script>

<template>
  <div
    style="
       {
        padding: '20px';
      }
    "
  >
    <a-anchor
      direction="horizontal"
      :items="[
        {
          key: 'horizontally-part-1',
          href: '#horizontally-part-1',
          title: '我的关注',
        },
        {
          key: 'horizontally-part-2',
          href: '#horizontally-part-2',
          title: '我的持仓',
        },
        {
          key: 'horizontally-part-3',
          href: '#horizontally-part-3',
          title: '今日热门',
        },
        {
          key: 'horizontally-part-4',
          href: '#horizontally-part-4',
          title: '涨幅榜单',
        }
      ]"
    />
  </div>
</template>




<style scoped>


@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
