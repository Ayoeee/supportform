const BASE_URL = process.env.BASE_URL
const USER_EMAIL = process.env.USER_EMAIL
const USER_PIN = process.env.USER_PIN

if (!BASE_URL || !USER_EMAIL || !USER_PIN) {
  throw new Error(
    '❌ Missing one or more required environment variables (BASE_URL, USER_EMAIL, USER_PIN)'
  )
}

module.exports = {
  BASE_URL,
  USER_EMAIL,
  USER_PIN,
}
