import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email: string, password: string) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
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
    showAlert('error', (err as any).response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/logout`,
    })
    if ((res.data.status = 'success')) {
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.')
  }
}

export const confirm = async (confirmToken: string) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/active/${confirmToken}`,
    })

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Your account is activated successfully, and hold a few seconds to redirect to Login page!',
      )
      window.setTimeout(() => {
        location.assign('/login')
      }, 1500)
    }
  } catch (err) {
    showAlert('error', (err as any).response.data.message)
  }
}
