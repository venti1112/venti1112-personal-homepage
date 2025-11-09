const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading-screen';
loadingScreen.style.opacity = '1';
const loader = document.createElement('div');
loader.className = 'loader';
const loadingText = document.createElement('div');
loadingText.className = 'loading-text';
loadingText.textContent = '加载中...';
loadingScreen.appendChild(loader);
loadingScreen.appendChild(loadingText);
document.body.insertBefore(loadingScreen, document.body.firstChild);
const bgImage = new Image();
bgImage.src = '/assets/image/wp.jpg';
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#') && 
        !e.target.classList.contains('no-loading')) {
        e.preventDefault();
        loadingScreen.classList.add('active');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = e.target.href;
        }, 300);
    }
});
function hideLoading() {
    loadingScreen.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    document.body.classList.remove('fade-out');
    setTimeout(() => {
        loadingScreen.remove();
    }, 500);
}
window.addEventListener('load', hideLoading);
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = 1;
    setTimeout(hideLoading, 1000);
});
setTimeout(hideLoading, 3000);
if (document.readyState === 'complete') {
    hideLoading();
}
