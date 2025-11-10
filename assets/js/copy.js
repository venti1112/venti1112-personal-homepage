// ... existing code ...
function copyServerCode() {
    const code = document.getElementById('serverCode').innerText;
    navigator.clipboard.writeText(code)
        .then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '复制成功！';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
}