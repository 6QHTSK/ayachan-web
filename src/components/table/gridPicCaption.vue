<template>
  <div class="absolute-bottom-left" style="padding-top: 8px;padding-bottom: 8px;width: 100%">
    <div class="row q-gutter-x-xs">
      <q-badge color="grey-4" text-color="black">{{props.row.id}}</q-badge>
      <q-badge v-for="(color,i) in diffColor" :color="color" :key="i" v-show="props.row.level[i]>0">{{props.row.level[i]}}</q-badge>
      <q-badge color="teal" text-color="white" v-if="props.row.sp_rhythm">含SP键</q-badge>
    </div>
    <div class="ellipsis text-subtitle1" style="margin-right: 15px">
      {{ props.row.title }}
    </div>
    <div class="ellipsis text-caption">{{ props.row.artists }}</div>
    <div class="ellipsis text-caption">{{props.row.author}}</div>
  </div>
</template>

<script>
export default {
  name: 'GridPicCaption',
  props : ['props'],
  setup () {
    return {
      diffColor: ["blue","green","orange","red","purple"],
    }
  }
}
</script>
