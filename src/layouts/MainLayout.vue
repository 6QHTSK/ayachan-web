<template>
  <q-layout view="hHh lpR lFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          <q-avatar>
            <img src="icons/favicon-128x128.png">
          </q-avatar>
          彩绫的工具站
        </q-toolbar-title>
        <q-btn icon="info" flat round @click="this.$q.notify('公告：由于各种原因，网站将进入不活跃的更新阶段。')"/>
      </q-toolbar>


    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :mini="miniState"
              @mouseover="miniState = false"
              @mouseout="miniState = true"
              :width="200"
              :breakpoint="500"
              mini-to-overlay>
      <essential-link v-for="item in menu" :key="item.label" :title="item.label" :icon="item.icon" :link="item.to"/>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {ref} from 'vue'
import EssentialLink from "components/mainLayout/EssentialLink";

export default {
  components: {EssentialLink},
  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  data: () => {
    return {
      miniState : true,
      menu: [
        {
          icon: 'home',
          label: '首页',
          separator: false,
          to: '#/'
        },
        {
          icon: 'share',
          label: '谱面分享',
          separator: false,
          to: '#/my-chart'
        },
        {
          icon: 'calculate',
          label: '谱面分析',
          separator: false,
          to: '#/map-analyze'
        },
        {
          icon: 'search',
          label: '谱面搜索',
          separator: false,
          to: '#/search'
        },
        {
          icon: 'cloud_upload',
          label: 'Sonolus谱面测试',
          separator: true,
          to: '#/sonolus-upload'
        },
        {
          icon: 'calculate',
          label: 'BPM分析',
          separator: true,
          to: '#/tempo'
        }
      ]
    }
  }
}
</script>

