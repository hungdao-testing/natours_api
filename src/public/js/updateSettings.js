/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'
import { getPort } from './env.config'

const port = getPort()
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
