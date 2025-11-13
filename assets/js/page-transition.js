// DOM加载完成后初始化页面过渡功能
document.addEventListener('DOMContentLoaded', function() {
    // 页面标题映射表，用于动态更新浏览器标签页标题
    const pageTitles = {
        home: '首页',
        about: '关于',
        rustdesk: 'RustDesk服务器'
    };

    let currentPage = null;  // 当前显示的页面ID
    let isAnimating = false;   // 动画进行中标志
    let nextPage = null;       // 排队等待的下一个页面ID
    let navLinks = [];         // 导航链接元素集合

    // 获取关键DOM元素引用
    const contentBox = document.getElementById('content-box');
    const contentLoading = document.getElementById('content-loading');
    const pageContent = document.getElementById('page-content');

    // 重置内容区域高度以适应新内容
    function resetContentBoxHeight() {
        const transition = contentBox.style.transition;
        contentBox.style.transition = 'none';
        contentBox.style.height = 'auto';
        void contentBox.offsetHeight; // 强制浏览器重排
        contentBox.style.transition = transition;
    }

    /**
     * 更新导航链接的激活状态和下划线位置
     * @param {string} pageId - 目标页面ID
     */
    function updateNavLinksState(pageId) {
        // 更新所有导航链接的激活类
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
            link.classList.toggle('nav-link', true);
        });

        // 计算并更新导航横条的位置和宽度
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            const container = document.querySelector('.navbar > .container-fluid');
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            const offsetLeft = linkRect.left - containerRect.left;
            const width = linkRect.width;

            const underline = document.querySelector('.nav-underline');
            if (underline) {
                const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--underline-offset'));
                // 直接设置样式，由CSS过渡实现平滑动画
                underline.style.width = `${width}px`;
                underline.style.transform = `translateX(${offsetLeft + offset}px)`;
            }
        }
    }

    /**
     * 显示指定页面内容并处理过渡动画
     * @param {string} pageId - 页面标识符
     * @param {boolean} isInitial - 是否为初始加载
     */
    function showPage(pageId, isInitial = false) {
        // 验证页面ID有效性
        if (!pageTitles[pageId]) {
            console.error(`无效的页面ID: ${pageId}`);
            pageId = 'home';
        }

        // 立即更新页面标题
        document.title = `${pageTitles[pageId]} - venti1112的小站`;

        // 防止重复加载或动画冲突
        if (currentPage === pageId && !isInitial) return;
        if (isAnimating) {
            nextPage = pageId;
            return;
        }

        // 显示内容加载提示
        contentLoading.style.display = 'flex';

        // 通过fetch异步加载页面HTML内容
        fetch(`/page/${pageId}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`加载页面失败: ${response.status}`);
                return response.text();
            })
            .then(html => {
                contentLoading.style.display = 'none';

                // 初始加载：直接填充内容
                if (!currentPage) {
                    pageContent.innerHTML = html;
                    currentPage = pageId;
                    document.title = `${pageTitles[pageId]} - venti1112的小站`;
                    updateNavLinksState(pageId);
                    
                    if (isInitial) {
                        window.history.replaceState(null, null, `#${pageId}`);
                    }
                    return;
                }

                // 标记动画开始
                isAnimating = true;

                // 更新导航状态
                updateNavLinksState(pageId);

                // 确定滑动方向（根据页面索引）
                const currentIndex = navLinks.findIndex(link => link.dataset.page === currentPage);
                const targetIndex = navLinks.findIndex(link => link.dataset.page === pageId);
                const directionClass = currentIndex < targetIndex ? 'slide-out-left' : 'slide-out-right';

                // 添加滑出动画类
                contentBox.classList.add(directionClass);

                // 动画完成后更新内容
                setTimeout(() => {
                    resetContentBoxHeight();
                    pageContent.innerHTML = html;
                    contentBox.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-bottom');
                    contentBox.classList.add('slide-in-bottom');

                    // 动画结束后清理状态
                    setTimeout(() => {
                        contentBox.classList.remove('slide-in-bottom');
                        currentPage = pageId;
                        isAnimating = false;
                        document.documentElement.scrollTop = 0;

                        // 处理排队的页面切换请求
                        if (nextPage) {
                            const target = nextPage;
                            nextPage = null;
                            showPage(target);
                        }
                    }, 500);
                }, 500);
            })
            .catch(error => {
                console.error(error);
                contentLoading.style.display = 'none';
                isAnimating = false;
                nextPage = null;
                alert(`页面加载失败: ${error.message}\n请检查网络连接或重试`);
            });
    }

    // 初始化应用状态和事件监听
    function init() {
        // 收集所有可导航的链接
        navLinks = Array.from(document.querySelectorAll('[data-page]'));

        // 从URL哈希获取初始页面
        const hash = window.location.hash.substring(1) || 'home';
        showPage(hash, true);

        // 监听窗口大小变化事件
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (currentPage) {
                    updateNavLinksState(currentPage);
                }
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
    }

    // 监听URL哈希变化以支持前进后退按钮
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) showPage(hash);
    });

    // 启动应用初始化
    init();
});