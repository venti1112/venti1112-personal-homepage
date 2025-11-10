let copyTimeout = null;
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', copyServerCode);
    });
});
function copyServerCode(event) {
    const targetId = event.target.getAttribute('data-target');
    if (!targetId) {
        console.error('复制按钮缺少 data-target 属性');
        alert('复制失败：配置错误');
        return;
    }
    const codeElement = document.getElementById(targetId);
    if (!codeElement) {
        console.error(`元素#${targetId}不存在`);
        alert('复制失败：目标内容不存在');
        return;
    }
    if (!navigator.clipboard) {
        console.error('浏览器不支持复制');
        alert('复制失败：浏览器不支持复制,请手动复制');
        return;
    }
    const code = codeElement.innerText;
    navigator.clipboard.writeText(code)
        .then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            if (copyTimeout) {
            clearTimeout(copyTimeout);
            copyTimeout = null;
            }
            btn.textContent = '复制成功！';
            setTimeout(() => {
                btn.textContent = originalText;
                copyTimeout = null;
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
}