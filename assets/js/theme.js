// 从localStorage获取存储的主题名称
const getStoredTheme = () => localStorage.getItem('theme')
// 存储主题到localStorage
const setStoredTheme = theme => localStorage.setItem('theme', theme)
// 获取首选主题（优先使用存储的主题，否则根据系统偏好）
const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
// 设置主题到HTML元素的data-bs-theme属性
const setTheme = theme => {
  if (theme === 'auto') {
    document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}

setTheme(getPreferredTheme())
// 更新主题切换UI的状态
const showActiveTheme = (theme, focus = false) => {
  const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
  if (!btnToActive) {
    return;
  }

  document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
    element.classList.remove('active');
    element.setAttribute('aria-pressed', 'false');
  });

  btnToActive.classList.add('active');
  btnToActive.setAttribute('aria-pressed', 'true');

  // 更新图标
  const icon = btnToActive.querySelector('i.bi');
  if (icon) {
    if (theme === 'dark') {
      icon.classList.replace('bi-moon', 'bi-sun');
    } else {
      icon.classList.replace('bi-sun', 'bi-moon');
    }
  }

  // 动态更新按钮的data-bs-theme-value为相反主题值
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  btnToActive.setAttribute('data-bs-theme-value', nextTheme);

  if (focus) {
    btnToActive.focus();
  }
}
// 页面加载完成后初始化主题UI
window.addEventListener('DOMContentLoaded', () => {
  const currentTheme = getPreferredTheme();
  // 确保按钮初始状态正确
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.setAttribute('data-bs-theme-value', currentTheme === 'dark' ? 'light' : 'dark');
  }
  
  showActiveTheme(currentTheme);

  document.querySelectorAll('[data-bs-theme-value]')
    .forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value')
        setStoredTheme(theme)
        setTheme(theme)
        showActiveTheme(theme, true)
      })
    })
})