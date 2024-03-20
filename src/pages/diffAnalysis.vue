<template>
  <q-page padding class="flex column content-center items-center content-start q-gutter-xs">
    <!--顶端选择-->
    <div class="row q-gutter-sm justify-start page-item">
      <q-radio v-model="chartServer" dense val="bestdori" label="Bestdori" @input="clearInput"/>
      <q-radio v-model="chartServer" dense val="bandori" label="Bandori" @input="clearInput"/>
      <q-radio v-model="chartServer" dense val="custom" label="自定义" @input="clearInput"/>
      <q-space/>
      <q-btn :color="returnColor(diffID)" @click="clickOnButton()" :label="diffStr[diffID]" v-show="!chartServer"
             style="width:80px"/>
    </div>
    <!--Bandori谱面 -->
    <q-input v-model="bestdoriID" type="number" class="page-item" label="谱面id"
             @keyup.enter="remoteChartAnalysis" v-if="chartServer === 'bandori'">
      <template v-slot:prepend v-if="chartServer">
        <q-btn :color="returnColor(diffID)" @click="clickOnButton()" :label="diffStr[diffID]" style="width:80px">
        </q-btn>
      </template>
    </q-input>
    <!--Bestdori谱面-->
    <q-input v-model="bestdoriID" type="number" class="page-item" label="谱面id"
             @keyup.enter="remoteChartAnalysis" v-if="chartServer ==='bestdori'">
      <template v-slot:prepend v-if="chartServer">
        <q-btn color="grey" :disable="true" label="Default" style="width:80px">
        </q-btn>
      </template>
    </q-input>
    <!--自定义谱面-->
    <q-input type="textarea" class="page-item" v-model.lazy="inputStr" label="bestdori谱面"
             :readonly="onLoading || showDetail" outlined v-if="chartServer === 'custom'" style="padding-top: 10px">
    </q-input>
    <!--计算按钮[Bandori/Bestdori谱面]-->
    <q-btn color="primary" @click="remoteChartAnalysis" :loading="onLoading" class="page-item"
           v-show="Array('bestdori', 'bandori').indexOf(chartServer) !== -1 && !showDetail">
      获取
      <template v-slot:loading>
        <q-spinner-gears class="on-left"/>
        <span v-show="onLoading">计算中...</span>
      </template>
    </q-btn>
    <!--计算按钮[自定义谱面]-->
    <q-btn color="primary" @click="analysis" class="page-item" :readonly="onLoading || showDetail"
           :loading="onLoading" v-show="chartServer === 'custom' && !showDetail">分析
      <template v-slot:loading>
        <q-spinner-gears class="on-left"/>
        <span>计算中...</span>
      </template>
    </q-btn>
    <q-btn color="pink-4" @click="clearInput" class="page-item" v-show="showDetail">重置</q-btn>

    <div v-if="showDetail" class="q-gutter-sm row justify-center wrap items-start page-item">
      <div v-for="(subject,i) in itemSubject" :key="i" class="page-item">
        <q-separator spaced/>
        <div class="text-center text-subtitle2 full-width text-weight-bold"
             v-if="itemList[subject] && itemList[subject][0][2] !== 0">{{ itemLabel[i] }}
        </div>
        <q-separator spaced/>
        <div class="q-col-gutter-sm row justify-evenly items-start">
          <div v-for="(item,j) in itemList[subject]" :key="j" class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <q-card v-if="item[2] !== 0">
              <q-card-section class="text-center">
                <div class="text-caption">
                  <span>{{ item[0] }}</span>
                </div>
                <q-separator/>
                <div class="q-gutter-xs fit row justify-evenly text-subtitle2">
                  <div>
                    <span class="text-caption">{{ item[1] }}</span>
                    <span>{{ item[2] }}</span>
                    <span class="text-caption">{{ item[3] }}</span>
                  </div>
                  <div v-if='item[5]!==""'>
                    <span class="text-caption">{{ item[4] }}</span>
                    <span>{{ item[5] }}</span>
                    <span class="text-caption">{{ item[6] }}</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  data: function () {
    return {
      diffStr: ['easy', 'normal', 'hard', 'expert', 'special'],
      diffID: 3, // 难度等级 EASY~EXPERT 0~3
      inputStr: '', // 从大输入框输入的谱面
      bestdoriID: 128, // 需要获取的bestdori的id
      showDetail: false, // 是否打开谱面分析栏
      onLoading: false, // 是否在拉取数据
      chartServer: "bestdori",
      itemSubject: ['basic', 'detail'],
      itemLabel: ['基础信息', '详细信息(Beta：数据可能不准确)'],
      itemList: {
        basic: null,
        detail: null
      }
    }
  },
  methods: {
    analysis() {
      const vm = this;

      function generateRelativeStr(relative){
        switch (relative){
          case 1:
            return "偏高"
          case 0:
            return "正常"
          case -1:
            return "偏低"
        }
      }

      function generateTimeStr(totalMin, totalSec) {
        if (totalSec < 10) {
          return totalMin + '\'0' + totalSec
        } else {
          return totalMin + '\'' + totalSec
        }
      }

      function generateBPMStr(BPMLow, BPMHigh, MainBPM) {
        if (BPMHigh - BPMLow < 0.01) {
          return MainBPM
        } else {
          return BPMLow + '~' + BPMHigh + '(' + MainBPM + ')'
        }
      }

      function fix(num, d = 2) {
        if (num === 0) {
          return '--'
        } else {
          if (d < 0) {
            num = 1000 / num
            d = -d - 1
          }
          return num.toFixed(d)
        }
      }

      function procession(res) {
        if (res.status === 200) {
          const response = res.data;
          console.log(response)
          const basic = response.metrics;
          const basicDiff = response.difficulty;
          const totalTimeMin = Math.floor(basic.total_time / 60)
          const totalTimeSec = (basic.total_time - totalTimeMin * 60).toFixed(1)
          vm.itemList.basic = [ // 标题，数值前缀，数值，数值后缀，难度前缀，难度，难度后缀
            ['谱面时间', '', generateTimeStr(totalTimeMin, totalTimeSec), '', '', '', ''],
            ['总物量', '', basic.total_note, '', '', '', ''],
            ['总敲击次数', '', basic.total_hit_note, '', '', '', ''],
            ['加权难度', 'LV.', fix(basicDiff.difficulty, 2), '', '', '', ''],
            ['最大音符密度', '', fix(basic.max_screen_nps, 2), '个/s', 'LV.', fix(basicDiff.max_screen_nps, 2), ''],
            ['整体每秒音符', '', fix(basic.total_nps, 2), '个/s', 'LV.', fix(basicDiff.total_nps, 2), ''],
            ['整体每秒击打', '', fix(basic.total_hps, 2), '次/s', 'LV.', fix(basicDiff.total_hps, 2), ''],
            ['BPM', '', generateBPMStr(basic.bpm_low, basic.bpm_high, basic.main_bpm), '', '', '', '']
          ]
          if(basic.irregular === 1){
            const detail = response.metrics_extend
            const detailDiff = response.difficulty_extend
            vm.itemList.detail = [
              ['左手击打音符占比', '', fix(detail.left_percent * 100, 1), '%', '', '', ''],
              ['最大单手每秒击打', '', fix(detail.finger_max_hps, 2), '次/s', '', generateRelativeStr(detailDiff.finger_max_hps), ''],
              ['粉键-下个键间隔', '', fix(detail.flick_note_interval, -2), 'ms', '', generateRelativeStr(detailDiff.flick_note_interval), ''],
              ['上个键-粉键间隔', '', fix(detail.note_flick_interval, -2), 'ms', '', generateRelativeStr(detailDiff.note_flick_interval), ''],
              ['最大单手移动速度', '', fix(detail.max_speed, 2), '轨/s', '', generateRelativeStr(detailDiff.max_speed), ''],
            ]
          }else{
            vm.$q.notify({
              title: '单手分析错误',
              message: basic.irregular_info,
              type: 'warning'
            })
          }
          vm.onLoading = false
          vm.showDetail = true
        } else {
          vm.$q.notify('分析过程错误：' + res.data.error)
          vm.onLoading = false
        }
      }

      function apiErrorHandler(error){
        vm.onLoading = false
        if(error.response == null || error.response.data == null){
          vm.$q.notify({message: error.message, type: 'negative'})
        }else{
          const res = error.response.data
          if('error' in res){
            vm.$q.notify({message: res.error, type: 'negative'})
          }else{
            vm.$q.notify({message: '服务器错误或无法连接服务器', type: 'negative'})
          }
        }
      }

      vm.onLoading = true
      let metricsBaseUrl = 'https://api.ayachan.fun/v2/chart/metrics/'
      // let metricsBaseUrl = 'http://127.0.0.1:8081/v2/chart/metrics/' // for dev
      let url
      if (this.chartServer === 'bestdori') {
        url = metricsBaseUrl + 'bestdori/' + this.bestdoriID
        this.$axios.get(url).then(procession).catch(apiErrorHandler)
      } else if (this.chartServer === 'bandori') {
        url = metricsBaseUrl + 'bandori/' + this.bestdoriID + '/' + this.diffStr[this.diffID]
        this.$axios.get(url).then(procession).catch(apiErrorHandler)
      } else if(this.chartServer === 'custom') {
        url = metricsBaseUrl + 'custom/' + this.diffStr[this.diffID]
        let chart
        try {
          chart = JSON.parse(this.inputStr)
        } catch {
          vm.$q.notify({
            message: 'JSON解析失败',
            type: 'Warning'
          })
          vm.onLoading = false
          return false
        }
        this.$axios.post(url, chart).then(procession).catch(apiErrorHandler)
      }
      return true
    },
    remoteChartAnalysis() {
      this.clearInput()
      this.$forceUpdate()
      this.analysis()
    },
    clearInput() {
      this.inputStr = ''
      this.showDetail = false
      this.itemList = {
        basic: null,
          detail: null
      }
    },
    returnColor(id) {
      const barColor = ['blue', 'green', 'orange', 'red', 'purple'];
      return barColor[id]
    },
    clickOnButton(e) {
      this.diffID = !this.onLoading && !this.showDetail ? (this.diffID + 1) % 5 : this.diffID
    }
  }
}
</script>
