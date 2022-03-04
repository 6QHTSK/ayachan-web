import {api} from "boot/axios";
import {Notify} from "quasar";

export const defaultPagination = {
    page: 1,
    rowsPerPage: 8,
    rowsNumber: 0
}


export async function fetchFromServerBestdori (query, page, limit){
  let docs = []
  let totalCount = 0
  let err = null
  await api.get('https://api.ayachan.fun/v2/bestdori/list',{params: {query:query,page:page-1,limit:limit}}).then((response)=>{
    docs = response.data.docs
    totalCount = response.data.totalCount
  }).catch((error)=>{
    err = error.message
    Notify.create({message:err,color:'negative'})
  })
  return {
    docs: transformModel(docs),
    totalPage: totalCount,
    err : err
  }
}

function transformModel(docs){
  let transformDocs = []
  docs.forEach(doc => {
    let newDoc = {
      chartName :  '[' + doc.id + '] '+doc.title,
      id: doc.id,
      title : doc.title,
      artists : doc.artists,
      level : [-1,-1,-1,-1,-1],
      author : doc.author.nickname + '@' + doc.author.username,
      cover : doc.song_url.cover,
      sp_rhythm : doc.sp_rhythm
    }
    newDoc.level[doc.diff] = doc.level
    transformDocs.push(newDoc)
  })
  return transformDocs
}


