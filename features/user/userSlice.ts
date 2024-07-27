import { createSlice, } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import store from '@/store/store.js'

export const userSlice = createSlice({
    name: "user",
    initialState: {
        userRedux: null
    },
    reducers: {
        setUserRedux: (state, { payload }) => {
            console.log('state, payload', state);
            
            state.userRedux = payload;
        },
    },
   
    // extraReducers: {
    //   [createUser.fulfilled]: (state, action) => {
    //     state.loginStatus = true;
    //   },
    //   [createUser.rejected]: (state, action) => {
    //     state.loginStatus = false;
    //   },
    // },
  });

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
      console.log('from store', user);
      try {
        store.dispatch(setUserRedux(user.email))
      } catch (error) {
        console.log('xx', error);
        
      }

  });

  // Action creators are generated for each case reducer function
  export const { setUserRedux } = userSlice.actions
  
  export default userSlice.reducer