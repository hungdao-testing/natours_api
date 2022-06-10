import path from 'path'
import dotenv, { DotenvParseOutput } from 'dotenv'

type Environment = {
    NODE_ENV: 'development' | 'production' | 'local'
    PORT: number
    DB_CONN_STRING: string
    DB_PASSWORD: string
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_COOKIE_EXPIRES_IN: string

    EMAIL_USERNAME: string
    EMAIL_PASSWORD: string
    EMAIL_HOST: string
    EMAIL_PORT: string
    EMAIL_FROM: string
    MAILJET_APIKEY: string
    MAILJET_SECRETKEY: string

    STRIPE_SECRET_KEY: string
    STRIPE_PUBLIC_KEY: string
    STRIPE_WEBHOOK_SECRET: string
} & DotenvParseOutput

export const environment = dotenv.config({
    path: path.join(__dirname, `${process.env.NODE_ENV}.env`),
}).parsed as Environment
