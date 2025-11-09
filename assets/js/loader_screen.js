(function() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 1;
        }
        .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #2bc5a2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loader"></div>
        <div class="loading-text">加载中...</div>
    `;
    document.body.insertBefore(loadingScreen, document.body.firstChild);
    const bgImage = new Image();
    bgImage.src = '/assets/image/wp.jpg';
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#') && 
            !e.target.classList.contains('no-loading')) {
            e.preventDefault();
            loadingScreen.style.opacity = '1';
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = e.target.href;
            }, 300);
        }
    });
    function hideLoading() {
        loadingScreen.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
            style.remove();
        }, 500);
    }
    window.addEventListener('load', hideLoading);
    document.addEventListener('DOMContentLoaded', hideLoading);
    setTimeout(hideLoading, 3000);
    if (document.readyState === 'complete') hideLoading();
})();
