function copyServerCode() {
    const code = document.getElementById('serverCode').innerText;
    navigator.clipboard.writeText(code)
        .then(() => {
            alert('服务器配置代码已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制代码');
        });
}
// 创建加载屏幕元素
const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading-screen';

// 添加加载圈
const loader = document.createElement('div');
loader.className = 'loader';

// 添加加载文字
const loadingText = document.createElement('div');
loadingText.className = 'loading-text';
loadingText.textContent = '加载中...';

// 组装加载屏幕
loadingScreen.appendChild(loader);
loadingScreen.appendChild(loadingText);
document.body.appendChild(loadingScreen);

// 预加载背景图片
const bgImage = new Image();
bgImage.src = '/assets/image/wp.jpg';

// 处理所有链接点击
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#')) {
        e.preventDefault();
        
        // 显示加载动画
        loadingScreen.classList.add('active');
        
        // 淡出当前页面
        document.body.classList.add('fade-out');
        
        // 延迟导航以允许过渡效果完成
        setTimeout(() => {
            window.location.href = e.target.href;
        }, 300);
    }
});

// 页面加载完成时隐藏加载动画
window.addEventListener('load', function() {
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        document.body.classList.remove('fade-out');
    }, 100);
});

// 确保页面初始加载时也有过渡效果
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 50);
});