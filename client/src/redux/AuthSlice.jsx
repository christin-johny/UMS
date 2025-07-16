import { createSlice } from '@reduxjs/toolkit'

let savedUser = null
let savedToken = null

try {
  const userData = localStorage.getItem('user')
  if (userData && userData !== 'undefined') {
    savedUser = JSON.parse(userData)
  }
  savedToken = localStorage.getItem('token')
} catch (error) {
  console.error('Invalid data in localStorage:', error)
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const initialState = {
  user: savedUser,
  token: savedToken,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
