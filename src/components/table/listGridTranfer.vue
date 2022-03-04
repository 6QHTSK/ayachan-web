<template>
  <q-btn-toggle v-model="useGridState" :options="options" flat dense>
    <template v-slot:one>
      <q-icon name="view_list"></q-icon>
    </template>
    <template v-slot:two>
      <q-icon name="grid_view"></q-icon>
    </template>
  </q-btn-toggle>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: 'listGridTransfer',
  setup () {
    const $store = useStore()

    const useGridState = computed({
      get : () => $store.state.table.useGrid,
      set : val => { $store.commit('table/setUseGrid', val)}
    })
    return {
      useGridState,
      options : [
        {value:false, slot:'one'},
        {value:true, slot:'two'}
      ]
    }
  }
}
</script>
