<template>
  <q-page padding  class="flex column content-center items-center content-start">
    <chart-info-table title="谱面分享" @onRequest="request" :ratio="16/9"></chart-info-table>
  </q-page>
</template>

<script>
import {mapActions, useStore} from "vuex";
import ChartInfoTable from "components/table/table";

export default {
  // name: 'PageName',
  beforeCreate() {
    const store = useStore()
    store.dispatch('table/initTable',1)
  },
  components: {ChartInfoTable},
  methods: {
    async request(newPagination){
      await this.onRequest(newPagination)
    },
    ...mapActions({
      onRequest: 'table/onRequest',
    })
  }
}
</script>
