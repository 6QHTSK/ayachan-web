export default function () {
  return {
    tableType: 0,
    useGrid: false,
    pagination:{
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    },
    loading : false,
    items: [],
    query: ""
  }
}
