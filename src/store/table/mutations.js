
export const setItems = (state,newItems) => {
  state.items.splice(0, state.items.length,...newItems)
}

export const setUseGrid = (state,status) => {
  state.useGrid = status
}

export const switchLoading = (state) => {
  state.loading = !state.loading
}

export const clearLoading = (state) =>{
  state.loading = false
}

export const setPagination = (state,newPagination) =>{
  state.pagination.rowsNumber = newPagination.rowsNumber
  state.pagination.page = newPagination.page
  state.pagination.rowsPerPage = newPagination.rowsPerPage
}

export const setQuery = (state,newQuery) => {
  state.query = newQuery
}

export const setTableType = (state,newType) =>{
  state.tableType = newType
}
