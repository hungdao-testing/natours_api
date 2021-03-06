/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'
// import { getPort } from './env.config'

// const port = getPort()
export const updateSettings = async (data: FormData, type: string) => {
  try {
    const url = type === 'password' ? `/api/v1/users/updateMyPassword` : `/api/v1/users/updateMe`

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch (err) {
    showAlert('error', (err as any).response.data.message)
  }
}
