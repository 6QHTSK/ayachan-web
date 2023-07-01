<template>
  <q-page class="flex column content-center q-pa-xl">
    <div class="flex column items-center">
      <p class="text-h3">彩绫的工具站</p>
      <p>V0.6.2</p>
    </div>
    <q-separator spaced class="flex-break"/>
    <div class="row q-col-gutter-xl justify-around">
      <item class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12"
            v-for = "item in showItems"
            :key = "item.title"
            :icon="item.icons"
            :title="item.title"
            :caption="item.caption"
            style="min-width: 200px;"
      ></item>
    </div>
    <q-separator spaced class="flex-break" style="text-align: center"/>
    <div class="flex column items-center">
      <span>公告：新API正在开发中，网站也计划翻新，Bestdori 搜索目前暂时无法使用，请等待重构</span>
<!--      <span>服务器API版本：V2.1.0</span>-->
    </div>
    <q-footer bordered reveal class="bg-white">
      <q-toolbar>
        <div style="margin:0 auto;">
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45030502000326"
             style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
            <img src="~assets/备案图标.png" style="float:left;"/>
            <span style="float:left;height:20px;line-height:20px;margin: 0 0 0 5px; color:#939393;">桂公网安备 45030502000326号</span>
          </a>
          <a target="_blank" href="http://beian.miit.gov.cn"
             style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
              <span
                style="float:left;height:20px;line-height:20px;margin: 0 0 0 5px; color:#939393;">桂ICP备20005849-1号</span>
          </a>
        </div>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import {defineAsyncComponent, defineComponent} from "vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    item : defineAsyncComponent(()=>import("components/index/item.vue"))
  },
  data: () =>{
    return{
      showItems : [
        {
          icons : "share",
          title : "谱面分享",
          caption : "本人写的优质BanG Dream谱面"
        },
        {
          icons : "calculate",
          title : "谱面分析",
          caption : "帮你算BanG Dream谱面的难度"
        },
        {
          icons : "bar_chart",
          title : "Bestdori分析",
          caption : "了解Bestdori自制谱社区的各项数字"
        },
        {
          icons : "construction",
          title : "实用工具",
          caption : "帮助制作你的自制谱"
        },
      ]
    }
  }
});
</script>
