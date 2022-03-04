import {api} from "boot/axios";
import {Notify} from "quasar";

export async function fetchFromServerMyChart(query,page,limit){
  let myJson = []
  await api.get('/assets/songList.json',).then((response)=>{
    myJson = response.data
  }).catch((error)=>{
    Notify.create({message:error.message,color:'negative'})
  })
  myJson = myJson.sort((a,b)=> -(a.id - b.id))
  const offset = (page - 1) * limit
  const end = offset + limit > myJson.length ? myJson.length : offset + limit
  return {
    docs: transformModel(myJson.slice(offset,end)),
    totalPage: myJson.length,
    err : null
  }
}

function transformModel(docs){
  let transformDocs = []
  docs.forEach(doc => {
    let newDoc = {
      id: doc.id,
      title : doc.songname,
      artists : doc.artist,
      level : doc.diff,
      author : doc.charter,
      cover : "/assets/pic/"+doc.id+".jpg/webp",
      sp_rhythm : doc.sp_rhythm === true
    }
    transformDocs.push(newDoc)
  })
  return transformDocs
}
