// 页面切换逻辑
let currentPage = 'home';

function showPage(pageId) {
    const currentElement = document.getElementById(currentPage);
    const targetElement = document.getElementById(pageId);
    
    if (currentPage === pageId) return;
    
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = navLinks.findIndex(link => link.getAttribute('data-page') === currentPage);
    const targetIndex = navLinks.findIndex(link => link.getAttribute('data-page') === pageId);
    
    // 关键修改：先激活新页面（但保持隐藏状态）
    targetElement.classList.add('active');
    targetElement.style.display = 'block';
    
    // 强制浏览器重排以应用display:block
    void targetElement.offsetWidth;
    
    // 添加动画类
    if (currentIndex < targetIndex) {
        currentElement.classList.add('slide-out-left');
    } else {
        currentElement.classList.add('slide-out-right');
    }
    targetElement.classList.add('slide-in-bottom');
    
    // 动画结束后清理
    setTimeout(() => {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('slide-in-left', 'slide-in-right', 
                                 'slide-in-bottom', 'slide-out-left', 'slide-out-right');
        });
        
        // 仅隐藏旧页面（保持新页面active状态）
        if (currentElement) {
            currentElement.classList.remove('active');
            currentElement.style.display = '';
        }
        
        currentPage = pageId;
    }, 500);
    
    // 更新导航栏
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-active');
    });
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('nav-active');
    }
}

// 处理导航链接点击事件
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        showPage(pageId);
        // 更新URL但不刷新页面
        history.pushState(null, null, `#${pageId}`);
    });
});

// 处理页面加载时的hash
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    }
});

// 处理浏览器前进后退按钮
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    }
});