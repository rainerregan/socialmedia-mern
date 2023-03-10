const { createSlice } = require("@reduxjs/toolkit");

// Create global states that can be accessible within the app globally
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
}

// Basically reducer is like a function to modify state
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if(state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends non-exsitent");
      }
    }, 
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      // Return the new list of post containing the updated ones
      const updatedPosts = state.posts.map((post) => {
        if(post._id === action.payload.post._id) return action.payload.post;
        return post;
      });

      // Change the list
      state.posts = updatedPosts;
    }
  }
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;