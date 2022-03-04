<template>
  <q-page padding class="flex column content-center items-center q-gutter-md">
    <q-file label="选择歌曲文件(.mp3)" accept=".mp3" v-model="music" class="page-item">
      <template v-slot:append>
        <q-btn @click="do_analysis" color="primary" flat icon="calculate" :disable="music===null">分析</q-btn>
      </template>
    </q-file>
      <q-circular-progress
        :indeterminate="flag"
        show-value
        :min="40"
        :max="220"
        :value="bpm"
        size="150px"
        :thickness="0.2"
        color="orange"
        center-color="grey-8"
        track-color="transparent"
      >
        <div class="flex column content-center items-center q-gutter-md text-white">
          <span v-if="bpm === 0">- - -</span>
          <span v-else> {{bpm}} </span>
          <q-badge color="red">BPM</q-badge>
        </div>
      </q-circular-progress>
      <div class="page-item">
        <q-markup-table v-if="result !== null" style="text-align: center" separator="cell">
          <tbody>
          <tr>
            <td>采样区域</td>
            <td v-for="(bpm,val) in result.TempoSpectrum" :key="val"> {{val * 100}}%</td>
          </tr>
          <tr>
            <td>BPM</td>
            <td v-for="(bpm,val) in result.TempoSpectrum" :key="val"> {{bpm}} </td>
          </tr>
          </tbody>
        </q-markup-table>
      </div>
      <p style="text-align: center" class="page-item">此网页使用了@bd4sur的BPM测速代码<br/><a href="https://github.com/bd4sur/Tempo">Github源码</a></p>
  </q-page>
</template>

<script>
import {analysis} from "src/utils/tempo";

export default {
  data: () => {
    return {
      music: null,
      result: null,
      bpm: 0,
      flag: false
    }
  },
  methods: {
    clear (){
      this.result = null
      this.bpm = 0
      this.flag = true
    },
    load (res){
      this.flag = false
      this.result = res
      this.bpm = res.BPM
    },
    do_analysis (value) {
      this.clear()
      analysis(this.music,this.load)
    }
  }
}
</script>

<!--<style>-->
<!--.page-item{-->
<!--  width: 900px; max-width: 80vw-->
<!--}-->
<!--</style>-->
