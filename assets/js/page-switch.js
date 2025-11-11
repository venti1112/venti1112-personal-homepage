const pageTitles = {
    home: '首页',
    about: '关于我',
    rustdesk: 'RustDesk服务器'
};
let currentPage = null;
let isAnimating = false;
let nextPage = null;
let underline, container, contentBox, navLinks;
function updateUnderlinePosition(pageId, animate = false) {
    const activeLink = navLinks.find(link => link.dataset.page === pageId);
    if (!activeLink || !underline || !container) return;
    document.body.offsetHeight;
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const containerStyle = getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft);
    const borderLeft = parseFloat(containerStyle.borderLeftWidth);
    const left = linkRect.left - containerRect.left - paddingLeft - borderLeft;
    const width = linkRect.width;
    const extendedWidth = width + 2;
    const adjustedLeft = Math.floor(left) - 0.5;
    underline.style.width = animate ? '0' : `${extendedWidth}px`;
    underline.style.transform = `translateX(${adjustedLeft}px)`;
    if (animate) {
        void underline.offsetWidth;
        underline.style.width = `${extendedWidth}px`;
    }
}
function resetContentBoxHeight() {
    const { transition } = contentBox.style;
    contentBox.style.transition = 'none';
    contentBox.style.height = 'auto';
    void contentBox.offsetHeight;
    contentBox.style.transition = transition;
}
function updateNavLinksState(pageId) {
    navLinks.forEach(link => {
        link.classList.toggle('nav-active', link.dataset.page === pageId);
    });
}
function showPage(pageId, isInitial = false) {
    if (!pageTitles[pageId]) {
        console.error(`无效的页面ID: ${pageId}`);
        pageId = 'home';
    }
    if (currentPage === pageId && !isInitial) return;
    if (isAnimating) {
        nextPage = pageId;
        return;
    }
    const contentLoading = document.getElementById('content-loading');
    contentLoading.style.display = 'flex';
    fetch(`/page/${pageId}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`加载页面失败: ${response.status}`);
            return response.text();
        })
        .then(html => {
            contentLoading.style.display = 'none';
            const pageContent = document.getElementById('page-content');
            if (!currentPage) {
                pageContent.innerHTML = html;
                currentPage = pageId;
                document.title = `${pageTitles[pageId]} - venti1112的小站`;
                updateNavLinksState(pageId);
                updateUnderlinePosition(pageId, true);
                if (isInitial) {
                    window.history.replaceState(null, null, `#${pageId}`);
                }
                return;
            }
            isAnimating = true;
            updateNavLinksState(pageId);
            updateUnderlinePosition(pageId, true);
            const currentIndex = navLinks.findIndex(link => link.dataset.page === currentPage);
            const targetIndex = navLinks.findIndex(link => link.dataset.page === pageId);
            const directionClass = currentIndex < targetIndex ? 'slide-out-left' : 'slide-out-right';
            contentBox.classList.add(directionClass);
            setTimeout(() => {
                resetContentBoxHeight();
                pageContent.innerHTML = html;
                contentBox.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-bottom');
                contentBox.classList.add('slide-in-bottom');
                setTimeout(() => {
                    contentBox.classList.remove('slide-in-bottom');
                    currentPage = pageId;
                    isAnimating = false;
                    document.documentElement.scrollTop = 0;
                    document.title = `${pageTitles[pageId]} - venti1112的小站`;
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
window.addEventListener('load', function() {
    underline = document.querySelector('.nav-underline');
    container = document.querySelector('.nav-container');
    contentBox = document.querySelector('.content-box');
    navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash, true);
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            document.body.offsetHeight;
            container.offsetHeight;
            if (currentPage) updateUnderlinePosition(currentPage);
        }, 200);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    const mediaQuery = window.matchMedia('(max-width: 768px), (max-width: 480px)');
    mediaQuery.addEventListener('change', handleResize);
});
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) showPage(hash);
});
window.addEventListener('beforeunload', () => {
    if (copyTimeout) {
        clearTimeout(copyTimeout);
        copyTimeout = null;
    }
    document.body.removeEventListener('click', copyServerCode);
});