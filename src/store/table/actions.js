/*
export function someAction (context) {
}
*/
import {defaultPagination, fetchFromServerBestdori} from "src/utils/fetch/search";
import {fetchFromServerMyChart} from "src/utils/fetch/myChart";

export async function onRequest(context, newPagination) {
  context.commit('switchLoading')
  let returnedItems = {docs:[],err:null,totalPage:0}

  if(context.state.tableType === 0){
    returnedItems = await fetchFromServerBestdori(context.state.query, newPagination.page, newPagination.rowsPerPage)
  }else if(context.state.tableType === 1){
    returnedItems = await fetchFromServerMyChart(context.state.query, newPagination.page, newPagination.rowsPerPage)
  }

  if (returnedItems.err === null) {
    context.commit('setItems',returnedItems.docs)
    newPagination.rowsNumber = returnedItems.totalPage
    context.commit('setPagination',newPagination)
  }
  context.commit('switchLoading')
}

export function initTable(context,type){
  context.commit('setPagination',defaultPagination)
  context.commit('setItems',[])
  context.commit('setQuery',"")
  context.commit('clearLoading')
  context.commit('setTableType',type)
  switch (type){
    case 0:{
      context.commit('setUseGrid',false)
      break
    }
    case 1:{
      context.commit('setUseGrid',true)
      break
    }
  }
  console.log(context.state)
}
