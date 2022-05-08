import axios from 'axios'
import { showAlert } from './alerts'
import { getPort } from './env.config'

const port = getPort()
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
    if ((res.data.status = 'success')) {
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    console.log(err.response)
    showAlert('error', 'Error logging out! Try again.')
  }
}