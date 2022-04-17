/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

let port
if (process.env.NODE_ENV === 'local') {
  port = 3001
} else if (process.env.NODE_ENV === 'development') {
  port = 3000
} else {
  port = 3000
}

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `http://127.0.0.1:${port}/api/v1/users/updateMyPassword`
        : `http://127.0.0.1:${port}/api/v1/users/updateMe`

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
