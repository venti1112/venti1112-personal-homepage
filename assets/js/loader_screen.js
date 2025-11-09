const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading-screen';
const loader = document.createElement('div');
loader.className = 'loader';
const loadingText = document.createElement('div');
loadingText.className = 'loading-text';
loadingText.textContent = '加载中...';
loadingScreen.appendChild(loader);
loadingScreen.appendChild(loadingText);
document.body.appendChild(loadingScreen);
const bgImage = new Image();
bgImage.src = '/assets/image/wp.jpg';
bgImage.onload = function() {
    document.body.style.backgroundImage = `url('${this.src}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
};
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#')) {
        e.preventDefault();
        loadingScreen.classList.add('active');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = e.target.href;
        }, 300);
    }
});
function hideLoading() {
    loadingScreen.classList.remove('active');
    document.body.classList.remove('fade-out');
}
window.addEventListener('load', function() {
    hideLoading();
});
setTimeout(hideLoading, 3000);
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 50);
});