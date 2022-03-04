<template>
  <div class="row justify-center" style="padding-left:1%;padding-right:1%;padding-top:1%">
    <div class="column q-gutter-sm" style="padding-top:1%;width: 1000px; max-width: 80vw">
        <div class="row q-gutter-sm ">
          <q-input v-model.number="bestdoriId" type="number" label="Bestdori官谱id" class="full-width" @keyup.enter.native="pullBestdoriMap()" style="width:200px">
          </q-input>
          <q-select v-model="diff" :options="options" label="难度" class="full-width" :disable="bestdoriId >= 500">
          </q-select>
        </div>
      <div>
        <q-btn :loading="onLoading" color="primary" class="full-width" @click="pullBestdoriMap()">拉取并复制到剪贴板</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  data: function () {
    return {
      bestdoriId: 1,
      diff: 'expert',
      onLoading: false,
      options: ['easy', 'normal', 'hard', 'expert', 'special']
    }
  },
  methods: {
    pullBestdoriMap () {
      this.onLoading = true
      const diffConvert = { easy: 0, normal: 1, hard: 2, expert: 3, special: 4 }
      const vm = this
      const url = 'https://test.api.ayachan.fun/v2/map-data/bestdori/' + this.bestdoriId + '?map-format-out=BestdoriV2&diff=' + diffConvert[this.diff]
      this.$axios.get(url).then(function (res) {
        vm.onloading = false
        if (res.status === 200) {
          if (res.data.result) {
            copyToClipboard(JSON.stringify(res.data.data)).then(() => { vm.$q.notify('已复制到剪贴版中') }).catch(() => { vm.$q.notify('复制失败') })
          } else {
            vm.$q.notify({ message: '谱面id/难度输入错误', color: 'negative', position: 'top' })
          }
        } else {
          vm.$q.notify({ message: '拉取资源失败', color: 'negative' })
        }
      }
      )
    }
  }
}
</script>
