// import '@babel/polyfill'

import { login, logout, confirm } from './login'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { showAlert } from './alerts'
import { displayMap } from './mapbox'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const bookBtn = document.getElementById('book-tour')
const confirmSignUpBtn = document.getElementById('confirm-signup')

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations!)
  displayMap(locations)
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    login(email, password)
  })

if (logOutBtn) logOutBtn.addEventListener('click', logout)

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('name', (document.getElementById('name') as HTMLInputElement).value)
    form.append('email', (document.getElementById('email') as HTMLInputElement).value)
    const files = (document.getElementById('photo') as HTMLInputElement).files
    if (!files || files.length === 0) {
      return
    } else {
      form.append('photo', files[0])
    }

    updateSettings(form, 'data')
    // document.querySelector('.btn--save-settings')!.textContent = 'Save settings'
  })

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    ;(document.querySelector('.btn--save-password') as HTMLTextAreaElement).textContent =
      'Updating...'

    const passwordCurrent = (document.getElementById('password-current') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    const passwordConfirm = (document.getElementById('password-confirm') as HTMLInputElement).value
    await updateSettings(
      { passwordCurrent, password, passwordConfirm } as unknown as FormData,
      'password',
    )

    document.querySelector('.btn--save-password')!.textContent = 'Save password'
    ;(document.getElementById('password-current') as HTMLInputElement).value = ''
    ;(document.getElementById('password') as HTMLInputElement).value = ''
    ;(document.getElementById('password-confirm') as HTMLInputElement).value = ''
  })

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    ;(e.target as HTMLElement).textContent = 'Processing...'
    const { tourId } = (e.target as HTMLElement).dataset
    bookTour(tourId!)
  })
}

if (confirmSignUpBtn) {
  confirmSignUpBtn.addEventListener('click', (e) => {
    ;(e.target as HTMLElement).textContent = 'Activating Your Account...'
    const token = confirmSignUpBtn.getAttribute('token')
    confirm(token!)
  })
}

const alertMessage = document.querySelector('body')!.dataset.alert
if (alertMessage) showAlert('success', alertMessage, 20)
