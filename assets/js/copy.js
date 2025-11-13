// 设置元素的ARIA属性以增强无障碍访问
function setAriaAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}

// 创建ARIA提示alert元素用于屏幕阅读器通知
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

// DOM加载完成后初始化复制按钮事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 代理监听所有复制按钮的点击事件
    document.body.addEventListener('click', event => {
        const btn = event.target.closest('.copy-btn');
        if (btn && !btn.disabled) {
            copyServerCode({ currentTarget: btn });
        }
    });
    
    // 为所有复制按钮设置ARIA属性
    document.querySelectorAll('.copy-btn').forEach(button => {
        setAriaAttributes(button, {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            'role': 'button'
        });
    });
});

// 检测是否为移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
);

// 检查是否为有效DOM元素
function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}

// 处理代码复制操作
function copyServerCode(event) {
    const btn = event.currentTarget;
    // 保存按钮原始状态
    const originalState = {
        text: btn.textContent,
        copied: btn.dataset.copied === 'true',
        disabled: btn.disabled
    };
    
    // 防止重复复制或在禁用状态下操作
    if (originalState.copied || originalState.disabled) return;
    
    // 获取目标元素ID
    const targetId = btn.getAttribute('data-target');
    if (!targetId) {
        restoreState(btn, originalState);
        showError(btn, '配置错误：缺少 data-target 属性');
        return;
    }
    
    // 查找目标代码元素
    const codeElement = document.getElementById(targetId);
    if (!isElement(codeElement)) {
        restoreState(btn, originalState);
        showError(btn, `目标元素#${targetId}不存在`);
        return;
    }
    
    // 获取并验证代码内容
    const code = codeElement.textContent?.trim() || '';
    if (!code) {
        restoreState(btn, originalState);
        showError(btn, '内容为空');
        return;
    }
    
    // 根据设备类型设置反馈持续时间
    const feedbackDuration = isMobile ? 1500 : 2000;
    
    // 尝试复制到剪贴板
    copyToClipboard(code)
        .then(() => {
            showSuccess(btn, originalState, feedbackDuration);
        })
        .catch(err => {
            restoreState(btn, originalState);
            handleCopyError(err, btn);
        });
}

// 恢复按钮到原始状态
function restoreState(btn, state) {
    btn.textContent = state.text;
    btn.dataset.copied = state.copied ? 'true' : 'false';
    btn.disabled = state.disabled;
    btn.style.opacity = state.disabled ? '0.7' : '1';
}

// 复制文本到剪贴板（优先使用现代API，降级到传统方法）
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

// 显示复制成功状态
function showSuccess(btn, originalState, duration) {
    updateButtonState(btn, '复制成功！', true, duration);
}

// 显示错误消息
function showError(btn, message) {
    updateButtonState(btn, `错误: ${message}`, false, 3000);
    console.error(`[CopyError] ${message}`);
}

// 处理复制过程中的各种错误
function handleCopyError(err, btn) {
    let errorMessage = '复制失败，请手动复制';
    if (err.name === 'NotAllowedError') {
        errorMessage = '复制失败：需要用户授权剪贴板访问权限';
    } else if (err.message.includes('execCommand')) {
        errorMessage = '复制失败：浏览器不支持自动复制';
    }
    
    showError(btn, errorMessage);
}

// 更新按钮状态和UI反馈
function updateButtonState(btn, message, isSuccess, duration) {
    btn.textContent = message;
    btn.dataset.copied = 'true';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.setAttribute('aria-label', message);
    
    // 创建ARIA通知
    const alertDiv = createAriaAlert(message);
    document.body.appendChild(alertDiv);
    
    // 定时恢复按钮状态
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