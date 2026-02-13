const config = {
  development: {
    BASE_URL: 'http://127.0.0.1:7001/api',
  },
  production: {
    BASE_URL: 'https://aybks.anyaowl.cn/api',
  },
}

const currentEnv = process.env.NODE_ENV || 'development'
const envConfig = config[currentEnv] || config.development

export default envConfig
