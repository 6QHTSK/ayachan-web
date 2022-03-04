<template>
  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 grid-style-transition" :class="ratio < 1.2 ? 'col-lg-3' : ''">
    <q-card flat class="flex flex-center">
      <q-img :src="props.row.cover" class="card" :ratio="ratio" placeholder-src="~assets/black.jpg">
        <template v-slot:error>
          <q-img src="~assets/black.jpg">
            <grid-pic-caption :props="props"/>
          </q-img>
        </template>
        <grid-pic-caption :props="props"/>
      </q-img>
    </q-card>
  </div>
</template>

<script>
import GridPicCaption from "components/table/gridPicCaption";
export default {
  name: 'tableGridItem',
  components: {GridPicCaption},
  props: ["props","ratio"],
  setup () {
    return {

    }
  },
}
</script>
