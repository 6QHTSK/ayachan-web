
<template>
  <q-page padding class="flex column content-center items-center content-start q-gutter-xs">
      <q-banner inline-actions class="text-black bg-warning page-item" style="text-align: center">
        测试中，可能不稳定，请合理使用
      </q-banner>
      <q-banner inline-actions class="text-white bg-primary page-item" style="text-align: center">
        服务器地址： https://sonolus.ayachan.fun/test <q-btn dense flat label="点此复制" @click="copy2clipboard"></q-btn>
      </q-banner>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="page-item">
          <q-input name="title" v-model="title" label="谱面标题" @input="StoreChartInfoIntoBrowser" :rules="[val => !!val || '标题是必填项']"/>
          <q-file name="bgm" v-model="bgm" label="音乐文件（点击上传）" accept=".mp3" :max-file-size="1024*1024*20" :rules="[val => !!val || '音乐是必填项']"/>
          <div>
            <q-slider
              v-model="difficulty"
              name="difficulty"
              :color="difficultyColor()"
              markers
              :marker-labels="difficultyMarkerLabel"
              label-always
              :label-value="difficultyLabel"
              :min="2"
              :max="35"
              :inner-min="5"
              :inner-max="35"
            />
          </div>
          <q-checkbox name="hidden" v-model="hidden" label="谱面隐藏（勾选后需要在搜索界面准确输入谱面ID才能进行测试）" />
          <q-option-group name="lifetime" v-model="lifetime" :options="lifetimeOptions" inline/>
        </div>
        <div>
          <q-input name="chart" type="textarea" v-model.lazy="chartStr" label="上传谱面" outlined clearable class="page-item" :rules="[val => !!val || '谱面是必填项']"></q-input>
        </div>
        <div class="row q-gutter-lg justify-around" style="text-align: center">
          <q-btn color="primary" type="submit" :loading="loading" :disable="uploaded" class="col-5">
            {{uploadLabel}}
          </q-btn>
          <q-btn color="pink" type="reset" class="col-5">重置</q-btn>
        </div>
      </q-form>
  </q-page>
</template>

<script>
import { copyToClipboard } from 'quasar'
import {computed, ref} from "vue";
export default {
  data: function () {
    return {
      title: ref(''),
      bgm: ref(null),
      chartStr: ref(''),
      difficulty: ref(25),
      hidden: ref(false),
      lifetime: ref(6*3600),

      difficultyMarkerLabel : {5 : "Lv.5", 10 : "Lv.10", 15 : "Lv.15", 20 : "Lv.20", 25 : "Lv.25", 30 : "Lv.30", 35 : "Lv.35"},
      difficultyLabel : computed(()=> `谱面难度 Lv.${this.difficulty}`),

      lifetimeOptions : [
        {
          label: "保留1小时",
          value: 3600,
        },
        {
          label: "保留3小时",
          value: 3*3600,
        },
        {
          label: "保留6小时",
          value: 6*3600,
        },
        {
          label: "保留12小时",
          value: 12*3600,
        },
        {
          label: "保留24小时",
          value: 24*3600,
        },
      ],
      loading: false,
      uploaded: false,
      uploadLabel: '上传',
    }
  },
  methods: {
    computed,
    StoreChartInfoIntoBrowser () {
      this.$q.localStorage.set('title', this.title)
    },
    copy2clipboard () {
      const vm = this;
      copyToClipboard('https://sonolus.ayachan.fun/test').then(() => { vm.$q.notify('已复制到剪贴版中') }).catch(() => { vm.$q.notify('复制失败') })
    },
    onSubmit(evt){
      let chart
      try {
        chart = JSON.parse(this.chartStr)
      } catch (err) {
        this.$q.notify('谱面错误')
        return
      }
      this.loading = true
      let formData = new FormData(evt.target)
      let vm = this
      this.$axios.post('https://sonolus.ayachan.fun/test/sonolus/levels',formData, {headers: {'Content-Type': `multipart/form-data`}}).then(function (response){
        if(response.status === 200){ //上传成功
          vm.uploaded = true
          vm.uploadLabel = '上传完成，测试谱面ID:' + response.data.uid
          vm.loading = false
          vm.$q.dialog({
            title: '上传完成',
            message: '上传完成，测试谱面ID:' + response.data.uid,
          })
        }else {
          vm.$q.notify({
            message: '上传失败，错误（' + response.data.code + '）' + response.data.description + '：' + response.data.detail,
            type: 'warning'
          })
          vm.loading = false
        }
      }).catch(function (error){
        vm.$q.notify({
            message: '上传失败，错误' + error,
            type: 'Warning'
          })
        vm.loading = false
      })
    },
    onReset() {
      this.title = ''
      this.bgm = null
      this.chartStr = ''
      this.difficulty = null
      this.hidden = false
      this.lifetime = null
      this.uploaded = false
      this.uploadLabel = "上传"
    },
    difficultyColor(){
      if(this.difficulty<= 10){
        return "blue"
      }else if(this.difficulty <= 15){
        return "green"
      }else if(this.difficulty <= 22){
        return "orange"
      }else if(this.difficulty <= 28){
        return "red"
      }else {
        return "purple"
      }
    }
  },
  mounted () {
    this.title = this.$q.localStorage.getItem('title')
  }
}
</script>
