/**
 * X_ASCENT 教练工作台 - 交互脚本
 * 
 * 功能：
 * - 筛选运动员卡片
 * - 通知数量更新
 * - 用户菜单交互
 * - 平滑滚动
 * - 响应式导航
 */

// ==========================================
// 页面加载完成后初始化
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initFilterButtons();
    initAlertActions();
    initAthleteCardActions();
    initUserProfile();
    initNotifications();
    initSmoothScroll();
});

// ==========================================
// 运动员筛选功能
// ==========================================

function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const athleteCards = document.querySelectorAll('.athlete-card:not(.athlete-card-placeholder)');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.textContent.trim();
            
            // 筛选卡片
            athleteCards.forEach(card => {
                const status = card.querySelector('.athlete-status');
                const statusText = status ? status.textContent.trim() : '';
                
                let shouldShow = false;
                
                switch(filterType) {
                    case '全部':
                        shouldShow = true;
                        break;
                    case '进行中':
                        shouldShow = statusText === '训练中';
                        break;
                    case '需关注':
                        shouldShow = statusText === '需关注';
                        break;
                    case '优秀表现':
                        shouldShow = statusText === '表现优异';
                        break;
                }
                
                // 添加动画效果
                if (shouldShow) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

// ==========================================
// 提醒区域操作
// ==========================================

function initAlertActions() {
    const alertActions = document.querySelectorAll('.alert-action');
    
    alertActions.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const alertItem = this.closest('.alert-item');
            const actionType = this.textContent.trim();
            
            // 添加视觉反馈
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // 模拟操作
            console.log(`执行操作: ${actionType}`);
            
            // 可选：移除已处理的提醒
            if (actionType === '处理') {
                alertItem.style.opacity = '0';
                alertItem.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    alertItem.remove();
                    updateAlertCount();
                }, 300);
            }
        });
    });
    
    // 点击整个提醒项也可触发
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
        item.addEventListener('click', function() {
            const actionBtn = this.querySelector('.alert-action');
            if (actionBtn) {
                actionBtn.click();
            }
        });
    });
}

// 更新待处理事项数量
function updateAlertCount() {
    const remainingAlerts = document.querySelectorAll('.alert-item').length;
    const urgentAlerts = document.querySelectorAll('.alert-urgent').length;
    
    const metricValue = document.querySelector('.metric-card:nth-child(3) .metric-value');
    const metricSecondary = document.querySelector('.metric-card:nth-child(3) .metric-secondary');
    
    if (metricValue) {
        metricValue.innerHTML = `${remainingAlerts}<span class="metric-unit">项</span>`;
    }
    if (metricSecondary) {
        metricSecondary.textContent = `${urgentAlerts}项需紧急处理`;
    }
}

// ==========================================
// 运动员卡片交互
// ==========================================

function initAthleteCardActions() {
    const athleteCards = document.querySelectorAll('.athlete-card:not(.athlete-card-placeholder)');
    
    athleteCards.forEach(card => {
        // 卡片点击查看详情
        card.addEventListener('click', function(e) {
            // 如果点击的是操作按钮，不触发卡片点击
            if (e.target.closest('.btn-icon')) {
                return;
            }
            
            const athleteName = this.querySelector('.athlete-name').textContent;
            console.log(`查看运动员详情: ${athleteName}`);
            // 这里可以跳转到运动员详情页
        });
        
        // 操作按钮
        const actionButtons = card.querySelectorAll('.btn-icon');
        actionButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const athleteName = card.querySelector('.athlete-name').textContent;
                const actions = ['查看详情', '发送消息', '编辑计划'];
                
                console.log(`${actions[index]}: ${athleteName}`);
                
                // 视觉反馈
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    });
    
    // 占位卡片点击
    const placeholderCard = document.querySelector('.athlete-card-placeholder');
    if (placeholderCard) {
        placeholderCard.addEventListener('click', function() {
            console.log('添加新运动员');
            // 这里可以打开添加运动员的模态框
        });
    }
}

// ==========================================
// 用户资料菜单
// ==========================================

function initUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('打开用户菜单');
            
            // 这里可以显示下拉菜单
            // 包含：个人设置、账户管理、退出登录等选项
            
            // 视觉反馈
            const arrow = this.querySelector('.dropdown-arrow');
            if (arrow) {
                arrow.style.transform = 'translateY(2px) rotate(180deg)';
                setTimeout(() => {
                    arrow.style.transform = '';
                }, 300);
            }
        });
    }
}

// ==========================================
// 通知功能
// ==========================================

function initNotifications() {
    const notificationBtn = document.querySelector('.nav-action-btn[aria-label="通知"]');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('打开通知中心');
            
            // 这里可以显示通知面板
            // 暂时模拟减少未读数量
            const badge = this.querySelector('.notification-badge');
            if (badge) {
                let count = parseInt(badge.textContent);
                if (count > 0) {
                    count--;
                    badge.textContent = count;
                    
                    if (count === 0) {
                        badge.style.opacity = '0';
                        badge.style.transform = 'scale(0)';
                    }
                }
            }
        });
    }
}

// ==========================================
// 平滑滚动
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// 工具函数：模拟数据更新
// ==========================================

// 模拟实时数据更新（演示用）
function simulateDataUpdate() {
    setInterval(() => {
        // 随机更新一个运动员的训练完成度
        const progressBars = document.querySelectorAll('.progress-fill');
        if (progressBars.length > 0) {
            const randomBar = progressBars[Math.floor(Math.random() * progressBars.length)];
            const currentWidth = parseFloat(randomBar.style.width);
            const newWidth = Math.min(100, currentWidth + Math.random() * 5);
            
            randomBar.style.width = `${newWidth}%`;
            
            // 更新对应的数值
            const progressValue = randomBar.closest('.athlete-progress').querySelector('.progress-value');
            if (progressValue) {
                const [completed, total] = progressValue.textContent.split('/');
                const newCompleted = Math.min(parseInt(total), Math.ceil(newWidth / 100 * parseInt(total)));
                progressValue.textContent = `${newCompleted}/${total}`;
            }
        }
    }, 5000); // 每5秒更新一次
}

// 可选：启用模拟数据更新（用于演示）
// simulateDataUpdate();

// ==========================================
// 响应式菜单切换（移动端）
// ==========================================

function initMobileMenu() {
    // 如果需要移动端汉堡菜单，在此实现
    // 当前设计采用简化导航，暂不需要
}

// ==========================================
// 键盘快捷键支持
// ==========================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K: 聚焦搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBtn = document.querySelector('.nav-action-btn[aria-label="搜索"]');
        if (searchBtn) {
            searchBtn.click();
        }
    }
    
    // Ctrl/Cmd + N: 添加运动员
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const addBtn = document.querySelector('.btn-primary');
        if (addBtn && addBtn.textContent.includes('添加运动员')) {
            addBtn.click();
        }
    }
});

// ==========================================
// 性能优化：懒加载图片/头像
// ==========================================

function initLazyLoad() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // 加载实际图片
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('.athlete-avatar, .user-avatar').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==========================================
// 导出接口（供外部调用）
// ==========================================

window.X_ASCENT = {
    updateAthleteData: function(athleteId, data) {
        console.log('更新运动员数据:', athleteId, data);
        // 实际项目中，这里对接API更新页面数据
    },
    
    addNotification: function(message, type = 'info') {
        console.log('新增通知:', message, type);
        // 实际项目中，这里添加新的提醒项
        
        // 更新通知徽章
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            let count = parseInt(badge.textContent) || 0;
            count++;
            badge.textContent = count;
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }
    },
    
    filterAthletes: function(status) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const targetBtn = Array.from(filterBtns).find(btn => btn.textContent.trim() === status);
        if (targetBtn) {
            targetBtn.click();
        }
    }
};

// ==========================================
// 控制台输出（开发模式）
// ==========================================

console.log('%c X_ASCENT 教练工作台 ', 'background: #1e7d8a; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
console.log('页面交互已加载');
console.log('可用接口: X_ASCENT.updateAthleteData(), X_ASCENT.addNotification(), X_ASCENT.filterAthletes()');

