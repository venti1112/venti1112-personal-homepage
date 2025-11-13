document.addEventListener('DOMContentLoaded', function() {
    // 页面标题映射
    const pageTitles = {
        home: '首页',
        about: '关于',
        rustdesk: 'RustDesk服务器'
    };

    let currentPage = null;
    let isAnimating = false;
    let nextPage = null;
    let navLinks = [];

    // 获取DOM元素
    const contentBox = document.getElementById('content-box');
    const contentLoading = document.getElementById('content-loading');
    const pageContent = document.getElementById('page-content');

    /**
     * 重置内容区域高度
     */
    function resetContentBoxHeight() {
        const transition = contentBox.style.transition;
        contentBox.style.transition = 'none';
        contentBox.style.height = 'auto';
        void contentBox.offsetHeight; // 强制重排
        contentBox.style.transition = transition;
    }

    /**
     * 更新导航链接状态
     * @param {string} pageId - 页面ID
     */
    function updateNavLinksState(pageId) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
            link.classList.toggle('nav-link', true);
        });

        // 更新导航横条位置
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
                // 恢复原始工作实现：直接设置最终样式，由浏览器自动触发CSS过渡
                underline.style.width = `${width}px`;
                underline.style.transform = `translateX(${offsetLeft + offset}px)`;
            }
        }
    }

    /**
     * 显示指定页面
     * @param {string} pageId - 页面ID
     * @param {boolean} isInitial - 是否为初始加载
     */
    function showPage(pageId, isInitial = false) {
        // 验证页面ID
        if (!pageTitles[pageId]) {
            console.error(`无效的页面ID: ${pageId}`);
            pageId = 'home';
        }

        // 防止重复加载或动画冲突
        if (currentPage === pageId && !isInitial) return;
        if (isAnimating) {
            nextPage = pageId;
            return;
        }

        // 显示加载提示
        contentLoading.style.display = 'flex';

        // 加载页面内容
        fetch(`/page/${pageId}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`加载页面失败: ${response.status}`);
                return response.text();
            })
            .then(html => {
                contentLoading.style.display = 'none';

                // 初始加载
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

                // 动画状态标记
                isAnimating = true;

                // 更新导航状态
                updateNavLinksState(pageId);

                // 确定动画方向
                const currentIndex = navLinks.findIndex(link => link.dataset.page === currentPage);
                const targetIndex = navLinks.findIndex(link => link.dataset.page === pageId);
                const directionClass = currentIndex < targetIndex ? 'slide-out-left' : 'slide-out-right';

                // 添加滑出动画
                contentBox.classList.add(directionClass);

                // 动画完成后更新内容
                setTimeout(() => {
                    resetContentBoxHeight();
                    pageContent.innerHTML = html;
                    contentBox.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-bottom');
                    contentBox.classList.add('slide-in-bottom');

                    // 动画结束后清理
                    setTimeout(() => {
                        contentBox.classList.remove('slide-in-bottom');
                        currentPage = pageId;
                        isAnimating = false;
                        document.documentElement.scrollTop = 0;
                        document.title = `${pageTitles[pageId]} - venti1112的小站`;

                        // 处理排队的页面切换
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

    // 初始化
    function init() {
        // 获取所有带data-page属性的导航链接
        navLinks = Array.from(document.querySelectorAll('[data-page]'));

        // 从URL哈希获取初始页面
        const hash = window.location.hash.substring(1) || 'home';
        showPage(hash, true);

        // 监听窗口大小变化
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

    // 绑定事件监听器
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) showPage(hash);
    });

    // 初始化页面
    init();
});