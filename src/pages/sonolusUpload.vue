
<template>
  <q-page padding class="flex column content-center items-center content-start q-gutter-xs">
      <q-banner inline-actions class="text-black bg-warning page-item" style="text-align: center">
        测试中，可能不稳定，请合理使用，上传谱面资源仅保留6个小时
      </q-banner>
      <q-banner inline-actions class="text-white bg-primary page-item" style="text-align: center">
        服务器地址： test.sonolus.ayachan.fun/bestdori <q-btn dense flat label="点此复制" @click="copy2clipboard"></q-btn>
      </q-banner>
      <div class="page-item">
        <q-input v-model.number="title" label="谱面标题" @input="Storage"/>
        <q-input v-model.number="musicURL" label="音乐URL" @input="Storage">
          <template v-slot:append>
            <q-btn round dense flat icon="publish" @click="() => {uploadMusicDialog = true; }"/>
          </template>
        </q-input>
        <q-dialog v-model="uploadMusicDialog">
          <q-uploader
            style="max-width: 400px"
            url="/api/sonolus/upload/song"
            label="仅限10M以内 MP3格式"
            auto-upload
            max-file-size="10485760"
            max-files="1"
            accept=".mp3"
            @rejected="onRejected"
            @uploaded="FileUploaded"
          />
        </q-dialog>
      </div>
      <div>
        <q-input type="textarea" v-model.lazy="inputstr" label="上传谱面" outlined clearable class="page-item"></q-input>
      </div>
      <div>
        <q-btn color="primary" @click="upload" class="page-item" :loading="loading" :disable="uploaded">
          {{uploadLabel}}
        </q-btn>
      </div>
  </q-page>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  data: function () {
    return {
      musicURL: '',
      title: '',
      inputstr: '',
      loading: false,
      uploaded: false,
      uploadLabel: '上传',
      uploadMusicDialog: false
    }
  },
  methods: {
    upload () {
      if (this.title !== '' && this.inputstr !== '' && this.musicURL !== '') {
        let inputjson
        this.loading = true
        try {
          inputjson = JSON.parse(this.inputstr)
        } catch (err) {
          this.$q.notify('谱面错误')
        }
        this.$axios.post('/api/sonolus/upload/script',
          {
            bgm: this.musicURL,
            title: this.title,
            notes: inputjson,
          }).then(
          res => {
            if (res.data.result) {
              this.uploaded = true
              this.uploadLabel = '上传完成，测试谱面ID:' + res.data.id
              this.loading = false
            } else {
              this.$q.notify({
                message: '上传失败，错误：' + res.data.error,
                type: 'Warning'
              })
              this.loading = false
            }
          }).catch(err => {
          this.$q.notify({
            message: '上传失败，错误：' + err,
            type: 'Warning'
          })
          this.loading = false
        })
      } else {
        this.$q.notify('请检查是否填写标题、乐曲地址、谱面信息')
      }
    },
    onRejected (rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: '请上传MP3格式文件'
      })
    },
    FileUploaded (info) {
      console.log(info)
      const res = JSON.parse(info.xhr.responseText);
      if (res.result) {
        this.musicURL = res.filename
        this.uploadMusicDialog = false
        this.Storage()
      }
    },
    Storage () {
      this.$q.localStorage.set('title', this.title)
      this.$q.localStorage.set('musicURL', this.musicURL)
    },
    copy2clipboard () {
      const vm = this;
      copyToClipboard('http://test.sonolus.ayachan.fun/bestdori').then(() => { vm.$q.notify('已复制到剪贴版中') }).catch(() => { vm.$q.notify('复制失败') })
    }
  },
  mounted () {
    this.title = this.$q.localStorage.getItem('title')
    this.musicURL = this.$q.localStorage.getItem('musicURL')
  }
}
</script>
