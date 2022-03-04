<template>
  <q-page padding class="flex column content-center items-center content-start q-gutter-xs">
    <q-input label="谱面搜索" v-model="query" @keyup.enter="startSearch" :readonly="loading" class="page-item">
      <template v-slot:append>
        <q-btn round flat icon="search" @click="startSearch"/>
      </template>
    </q-input>
    <chart-info-table title="Bestdori 谱面搜索" @onRequest="request" :ratio="1"></chart-info-table>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import {computed} from "vue";
import ChartInfoTable from "components/table/table";
import {defaultPagination, fetchFromServerBestdori} from "src/utils/fetch/search";
import { useStore, mapActions,mapState} from "vuex";
export default {
  components: {ChartInfoTable},
  // name: 'PageName',
  beforeCreate() {
    const store = useStore()
    store.dispatch('table/initTable',0)
  },
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const query = computed({
      get: () => store.state.table.query,
      set(value){
        store.commit('table/setQuery',value)
      }
    })
    $q.screen.setSizes({sm:320,md:375,lg:425,xl:750})
    return{
      query
    }
  },
  methods: {
    async startSearch () {
      console.log("Start Search")
      await this.request(defaultPagination)
    },
    async request(newPagination){
      console.log(fetchFromServerBestdori)
      await this.onRequest(newPagination)
    },
    ...mapActions({
      onRequest: 'table/onRequest',
    })
  },
  computed: mapState({
    loading: state => state.table.loading
  })
}
</script>
