import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
      value: false,
    },
    reducers: {
      setLoading: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes.
        // Also, no return statement is required from these functions.
        state.value = true;
      },
      cancelLoading: (state) => {
        state.value = false;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setLoading, cancelLoading } = loadingSlice.actions
  
  export default loadingSlice.reducer