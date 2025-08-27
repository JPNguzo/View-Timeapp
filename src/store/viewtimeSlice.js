import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bannerData : [],
    imageURL : ""
};

export const viewtimeSlice = createSlice({
    name : 'viewtimeData',
    initialState,
    reducers : {
          setBannerData : (state, action)=>{
            state.bannerData = action.payload
          },
          setImageURL : (state, action) =>{
            state.imageURL = action.payload
          }
    }
})

export const { setBannerData, setImageURL } = viewtimeSlice.actions


export default viewtimeSlice.reducer