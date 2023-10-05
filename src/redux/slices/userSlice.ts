import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserChange } from '../../model'

export interface userSlice {
  chatId: string,
  userData: any,
  lastMsg: string, 
}



const initialState: userSlice = {
    chatId: "",
    userData: {},
    lastMsg: "",
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userChange: (state, action: PayloadAction<UserChange>) => {
        state.chatId = action.payload.combinedId
        state.userData = action.payload

    },
    setLastMsg: (state, action:PayloadAction<string>) => {
      state.lastMsg = action.payload
    }   
    
  },
})

export const { userChange , setLastMsg} = userSlice.actions

export default userSlice.reducer