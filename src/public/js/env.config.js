export function getPort() {
  let port
  if (process.env.NODE_ENV === 'local') {
    port = 3000
  } else if (process.env.NODE_ENV === 'development') {
    port = 3001
  } else if (process.env.NODE_ENV === 'production') {
    port = 3002
  }
  return port
}
