// 主题管理：light / dark / system
const DARK_VARS = {
  '--bg-page': '#1c1c1e',
  '--bg-gradient-start': '#2c2520',
  '--bg-gradient-mid1': '#252220',
  '--bg-gradient-mid2': '#222020',
  '--bg-gradient-mid3': '#1e1e1e',
  '--bg-gradient-end': '#1c1c1e',
  '--bg-card': 'rgba(44, 44, 46, 0.65)',
  '--bg-card-solid': '#2c2c2e',
  '--bg-card-border': 'rgba(255, 255, 255, 0.08)',
  '--bg-input': '#3a3a3c',
  '--bg-keyboard': 'rgba(44, 44, 46, 0.9)',
  '--bg-key': 'rgba(58, 58, 60, 0.8)',
  '--text-primary': '#f5f5f5',
  '--text-secondary': '#ababab',
  '--text-tertiary': '#8e8e93',
  '--text-placeholder': '#636366',
  '--color-brand': '#ff8533',
  '--color-income': '#30d158',
  '--color-danger': '#ff453a',
  '--divider': 'rgba(255, 255, 255, 0.08)',
  '--shadow-card': '0 8rpx 32rpx rgba(0, 0, 0, 0.3)',
}

export function getThemeMode() {
  const settings = uni.getStorageSync('user_settings')
  return settings?.theme?.mode || 'system'
}

export function setThemeMode(mode) {
  const settings = uni.getStorageSync('user_settings') || {}
  if (!settings.theme) settings.theme = {}
  settings.theme.mode = mode
  uni.setStorageSync('user_settings', settings)
}

export function isDarkMode() {
  const mode = getThemeMode()
  if (mode === 'dark') return true
  if (mode === 'light') return false
  try {
    const info = uni.getSystemInfoSync()
    if (info.theme) return info.theme === 'dark'
    if (info.osTheme) return info.osTheme === 'dark'
  } catch (e) {}
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// 返回需要绑定到页面根 view 的 :style 对象
export function getThemeVars() {
  return isDarkMode() ? { ...DARK_VARS } : {}
}

// 动态设置原生 page 背景色（影响安全区域、下拉背景等）
export function setPageBgColor() {
  const dark = isDarkMode()
  const bg = dark ? '#1c1c1e' : '#f5f5f5'
  try {
    uni.setBackgroundColor({
      backgroundColor: bg,
      backgroundColorTop: bg,
      backgroundColorBottom: bg,
    })
  } catch (e) {}
}

// 动态设置原生导航栏颜色 + page 背景色
export function setNavBarTheme() {
  const dark = isDarkMode()
  uni.setNavigationBarColor({
    frontColor: dark ? '#ffffff' : '#000000',
    backgroundColor: dark ? '#1c1c1e' : '#ffffff',
    animation: { duration: 0 }
  })
  setPageBgColor()
}
