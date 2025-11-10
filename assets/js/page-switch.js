let currentPage = 'home';
function showPage(pageId) {
    const currentElement = document.getElementById(currentPage);
    const targetElement = document.getElementById(pageId);
    if (currentPage === pageId) return;
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = navLinks.findIndex(link => link.getAttribute('data-page') === currentPage);
    const targetIndex = navLinks.findIndex(link => link.getAttribute('data-page') === pageId);
    targetElement.classList.add('active');
    targetElement.style.display = 'block';
    void targetElement.offsetWidth;
    if (currentIndex < targetIndex) {
        currentElement.classList.add('slide-out-left');
    } else {
        currentElement.classList.add('slide-out-right');
    }
    targetElement.classList.add('slide-in-bottom');
    setTimeout(() => {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('slide-in-left', 'slide-in-right', 
                                 'slide-in-bottom', 'slide-out-left', 'slide-out-right');
        });
        if (currentElement) {
            currentElement.classList.remove('active');
            currentElement.style.display = '';
        }
        
        currentPage = pageId;
    }, 500);
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-active');
    });
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('nav-active');
    }
}
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        showPage(pageId);
        history.pushState(null, null, `#${pageId}`);
    });
});
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    }
});
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    }
});