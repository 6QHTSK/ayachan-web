<template>
  <q-tr :props="props">
    <q-td key="chartName" :props="props">
      <q-badge color="grey-8" text-color="white">{{props.row.id}}</q-badge>
      {{props.row.title}}
    </q-td>
    <q-td key="artists" :props="props">
      {{props.row.artists}}
    </q-td>
    <q-td key="diff" :props="props">
      <q-avatar size="sm" text-color="white" :color="diffColor(props.row.level)" font-size="12px">{{maxLevel(props.row.level)}}</q-avatar>
    </q-td>
    <q-td key="author" :props="props">
      {{props.row.author}}
    </q-td>
  </q-tr>
</template>

<script>
export default {
  name: 'tableListItem',
  props: ["props"],
  setup () {
    function maxDiff(levels){
      let maxLevel = -1
      let maxDiff = 0
      for(let i=4;i>=0;i--){
        if(parseInt(levels[i]) > maxLevel){
          maxLevel = parseInt(levels[i])
          maxDiff = i
        }
      }
      return maxDiff
    }
    function maxLevel(levels){
      return levels[maxDiff(levels)]
    }
    function diffColor(levels){
      const diffColorList = ["blue","green","orange","red","purple"]
      return diffColorList[maxDiff(levels)]
    }
    return {
      diffColor,
      maxLevel
    }
  }
}
</script>
