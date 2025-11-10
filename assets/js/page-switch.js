let currentPage = null;
let isAnimating = false;
let nextPage = null;
let underline, container;
function updateUnderlinePosition(pageId, animate = false) {
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
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
    const adjustedLeft = Math.floor(left) - 0.5;if (animate) {
        underline.style.width = '0';
        void underline.offsetWidth;
        underline.style.transform = `translateX(${adjustedLeft}px)`;
        underline.style.width = `${extendedWidth}px`;
    } else {
        underline.style.transform = `translateX(${adjustedLeft}px)`;
        underline.style.width = `${extendedWidth}px`;
    }
}

function showPage(pageId, isInitial = false) {
    const currentElement = document.getElementById(currentPage);
    const targetElement = document.getElementById(pageId);
    if (!targetElement) return;
    window.scrollTo(0, 0);
    if (isInitial) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        targetElement.classList.add('active');
        currentPage = pageId;
        const pageTitle = targetElement.getAttribute('page-title') || 'venti1112的小站';
        document.title = `${pageTitle} - venti1112的小站`;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('nav-active');
        });
        const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('nav-active');
            updateUnderlinePosition(pageId, true);
        }
        return;
    }
    if (isAnimating) {
        nextPage = pageId;
        return;
    }
    if (currentPage === pageId) return;
    const pageTitle = targetElement.getAttribute('page-title') || 'venti1112的小站';
    document.title = `${pageTitle} - venti1112的小站`;
    isAnimating = true;
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = navLinks.findIndex(link => link.getAttribute('data-page') === currentPage);
    const targetIndex = navLinks.findIndex(link => link.getAttribute('data-page') === pageId);
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-active');
    });
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('nav-active');
        updateUnderlinePosition(pageId);
        
    }
    targetElement.classList.add('active');
    void targetElement.offsetWidth;
    if (currentIndex < targetIndex) {
        currentElement.classList.add('slide-out-left');
    } else {
        currentElement.classList.add('slide-out-right');
    }
    targetElement.classList.add('slide-in-bottom');
    setTimeout(() => {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('slide-in-bottom', 'slide-out-left', 'slide-out-right');
        });
        if (currentElement) {
            currentElement.classList.remove('active');
        }
        currentPage = pageId;
        isAnimating = false;
        document.documentElement.scrollTop = 0;
        if (nextPage) {
            const target = nextPage;
            nextPage = null;
            showPage(target);
        }
    }, 500);
}
window.addEventListener('load', function() {
    underline = document.querySelector('.nav-underline');
    container = document.querySelector('.nav-container');
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash, true);
    if (!window.location.hash && currentPage === 'home') {
        window.history.replaceState(null, null, '#home');
    }
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            document.body.offsetHeight;
            container.offsetHeight;
            updateUnderlinePosition(currentPage);
        }, 200);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    const mediaQuery = window.matchMedia('(max-width: 768px), (max-width: 480px)');
    mediaQuery.addEventListener('change', handleResize);
});
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    }
});