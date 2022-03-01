export default class AppError extends Error {
  public status: string
  public statusCode: number
  public isOperational: boolean
  public additionalInfo: any

  constructor(
    message: string,
    statusCode: number = 500,
    aditionalInfo: any = {},
  ) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.additionalInfo = aditionalInfo
    Error.captureStackTrace(this, this.constructor)
  }
}
