function setAriaAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}
function createAriaAlert(message) {
    const alertDiv = document.createElement('div');
    setAriaAttributes(alertDiv, {
        'role': 'alert',
        'aria-live': 'assertive'
    });
    alertDiv.style.position = 'absolute';
    alertDiv.style.clip = 'rect(0 0 0 0)';
    alertDiv.style.width = '1px';
    alertDiv.style.height = '1px';
    alertDiv.style.margin = '-1px';
    alertDiv.textContent = message;
    return alertDiv;
}
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', event => {
        const btn = event.target.closest('.copy-btn');
        if (btn && !btn.disabled) {
            copyServerCode({ currentTarget: btn });
        }
    });
    document.querySelectorAll('.copy-btn').forEach(button => {
        setAriaAttributes(button, {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            'role': 'button'
        });
    });
});
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
);
function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}
function copyServerCode(event) {
    const btn = event.currentTarget;
    const originalState = {
        text: btn.textContent,
        copied: btn.dataset.copied === 'true',
        disabled: btn.disabled
    };
    if (originalState.copied || originalState.disabled) return;
    const targetId = btn.getAttribute('data-target');
    if (!targetId) {
        restoreState(btn, originalState);
        showError(btn, '配置错误：缺少 data-target 属性');
        return;
    }
    const codeElement = document.getElementById(targetId);
    if (!isElement(codeElement)) {
        restoreState(btn, originalState);
        showError(btn, `目标元素#${targetId}不存在`);
        return;
    }
    const code = codeElement.textContent?.trim() || '';
    if (!code) {
        restoreState(btn, originalState);
        showError(btn, '内容为空');
        return;
    }
    const feedbackDuration = isMobile ? 1500 : 2000;
    copyToClipboard(code)
        .then(() => {
            showSuccess(btn, originalState, feedbackDuration);
        })
        .catch(err => {
            restoreState(btn, originalState);
            handleCopyError(err, btn);
        });
}
function restoreState(btn, state) {
    btn.textContent = state.text;
    btn.dataset.copied = state.copied ? 'true' : 'false';
    btn.disabled = state.disabled;
    btn.style.opacity = state.disabled ? '0.7' : '1';
}
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            success ? resolve() : reject(new Error('execCommand failed'));
        } catch (err) {
            document.body.removeChild(textarea);
            reject(err);
        }
    });
}
function showSuccess(btn, originalState, duration) {
    updateButtonState(btn, '复制成功！', true, duration);
}
function showError(btn, message) {
    updateButtonState(btn, `错误: ${message}`, false, 3000);
    console.error(`[CopyError] ${message}`);
}
function handleCopyError(err, btn) {
    let errorMessage = '复制失败，请手动复制';
    if (err.name === 'NotAllowedError') {
        errorMessage = '复制失败：需要用户授权剪贴板访问权限';
    } else if (err.message.includes('execCommand')) {
        errorMessage = '复制失败：浏览器不支持自动复制';
    }
    
    showError(btn, errorMessage);
}
function updateButtonState(btn, message, isSuccess, duration) {
    btn.textContent = message;
    btn.dataset.copied = 'true';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.setAttribute('aria-label', message);
    const alertDiv = createAriaAlert(message);
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        document.body.removeChild(alertDiv);
        if (isSuccess) {
            btn.textContent = '复制代码';
            btn.dataset.copied = 'false';
            btn.disabled = false;
            btn.style.opacity = '1';
        } else {
            btn.textContent = '复制';
            btn.dataset.copied = 'false';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }, duration);
}