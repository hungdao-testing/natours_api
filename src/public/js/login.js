import axios from 'axios'
import { showAlert } from './alerts'

let port
if (process.env.NODE_ENV === 'local') {
  port = 3001
} else if (process.env.NODE_ENV === 'development') {
  port = 3000
} else if (process.env.NODE_ENV === 'production') {
  port = 3000
}

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:${port}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:${port}/api/v1/users/logout`,
    })
    if ((res.data.status = 'success')) location.reload(true)
  } catch (err) {
    console.log(err.response)
    showAlert('error', 'Error logging out! Try again.')
  }
}
