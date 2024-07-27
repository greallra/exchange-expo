import { createSlice } from '@reduxjs/toolkit'

export const headerSlice = createSlice({
    name: 'header',
    initialState: {
      value: {
        activePage: 'Page Title',
        leftside: ''
      },
    },
    reducers: {
      setActivePage: (state, { payload }) => {
        console.log('payload',payload);
        
        state.value = payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setActivePage } = headerSlice.actions
  
  export default headerSlice.reducer