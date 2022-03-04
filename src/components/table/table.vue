<template>
  <q-table
    :title="title"
    class="page-item"
    :columns="columns"
    :rows="items"
    table-style="width:100%"
    :visible-columns="visible"
    :grid="useGrid"
    v-model:pagination="pagination"
    :loading="loading"
    :rows-per-page-options="[9]"
    @request="onRequest">
    <template v-slot:top-right>
      <list-grid-transfer/>
    </template>
    <template v-slot:body="props">
      <table-list-item :props="props"/>
    </template>
    <template v-slot:item="props">
      <table-grid-item :props="props" :ratio="ratio"/>
    </template>
  </q-table>
</template>

<script>
import {computed, ref} from "vue";
import {useQuasar} from "quasar";
import TableListItem from "components/table/listItem";
import TableGridItem from "components/table/gridItem";
import ListGridTransfer from "components/table/listGridTranfer";
import { mapState, useStore } from "vuex";
import {defaultPagination} from "src/utils/fetch/search";

export default {
  name: 'chartInfoTable',
  components: {ListGridTransfer, TableGridItem, TableListItem},
  props: {"title":String,"ratio":Number},
  setup () {
    const store = useStore()
    const pagination = computed({
      get: () => store.state.table.pagination,
      set(value){
        store.commit('table/setPagination',value)
      }
    })
    const columns = ref([
      {name:'chartName',require:true,label:"标题",field:'chartName',headerClasses:'width35',align:'center',classes:'cell'},
      {name:'artists',label: "艺术家",headerClasses:'width30',field: "artists",align:'center',classes:'cell'},
      {name:'diff',label: "最高难度", headerClasses:'width5',align:'center',classes:'cell'},
      {name:'author',label: "作者",headerClasses:'width30',field: "author",align:'center',classes:'cell'}
    ])

    return {
      columns,
      visible: computed(() => {
        let ret = ["chartName"]
        const $q = useQuasar()
        if ($q.screen.gt.sm) ret.push("diff")
        if ($q.screen.gt.md) ret.push("author")
        if ($q.screen.gt.lg) ret.push("artists")
        return ret
      }),
      pagination
    }
  },
  emits : ['onRequest'],
  methods : {
    async onRequest(newRequest){
      await this.$emit('onRequest',newRequest.pagination)
    }
  },
  mounted() {
    this.onRequest({pagination: defaultPagination})
  },
  computed: {
    ...mapState({
      useGrid : state => state.table.useGrid,
      loading: state => state.table.loading,
      items: state => state.table.items
    }),

  }
}
</script>


<style>
.width35{
  width:35%;
}
.width30{
  width:30%;
}
.width5{
  width:5%;
}
.gridCeil{
  text-overflow: ellipsis;
}
.cell{
  max-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
