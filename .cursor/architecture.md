# X_ASCENT Web专业版 - 技术架构设计文档

## 一、架构决策总结

### 1.1 核心技术栈（最终决策）

**前端**：Vue 3 + TypeScript + Vite  
**后端**：Python + FastAPI  
**数据库**：PostgreSQL + TimescaleDB + Redis  


## 二、系统架构设计

### 2.1 整体架构图（逻辑视图）

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端层（Vue 3）                            │
│  ┌───────────────┐                       ┌──────────────┐        │
│  │ 教练端Dashboard│                       │ 运动员数据面板│        │
│  └───────────────┘                       └──────────────┘        │
│         │                   │                   │                │
│         └───────────────────┴───────────────────┘                │
│                             │                                    │
│                    ┌────────▼────────┐                           │
│                    │   Pinia Store    │  (状态管理)               │
│                    └────────┬────────┘                           │
│                             │                                    │
│                    ┌────────▼────────┐                           │
│                    │   Axios/WS客户端 │  (HTTP + WebSocket)      │
│                    └────────┬────────┘                           │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │    Nginx反向代理    │  (负载均衡/SSL)
                    └─────────┬──────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────┐
│                        后端层（FastAPI）                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│    ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐         │
│    │  API网关  │      │ WebSocket   │     │  AI服务    │         │
│    │  (REST)  │      │  实时推送   │     │  (异步队列) │         │
│    └────┬─────┘      └─────┬──────┘     └─────┬──────┘         │
│         │                   │                   │               │
│    ┌────▼──────────────────▼───────────────────▼──────┐        │
│    │            业务逻辑层（Service Layer）             │        │
│    │  - 训练计划管理  - 数据分析引擎  - 用户管理       │        │
│    │  - 设备数据解析  - 负荷计算      - 权限控制       │        │
│    └────┬──────────────────┬───────────────────┬──────┘        │
│         │                   │                   │               │
│    ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐         │
│    │SQLAlchemy│      │  数据分析   │     │  Celery    │         │
│    │   ORM    │      │(NumPy/Pandas)│    │  任务队列  │         │
│    └────┬─────┘      └────────────┘     └─────┬──────┘         │
└─────────┼─────────────────────────────────────┼───────────────┘
          │                                      │
┌─────────▼──────────────────────────────────────▼───────────────┐
│                         数据层                                   │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  PostgreSQL    │  │ TimescaleDB  │  │    Redis     │        │
│  │  (关系数据)     │  │ (时序数据)    │  │  (缓存/队列)  │        │
│  │ - 用户/教练     │  │ - 功率/心率   │  │ - Session    │        │
│  │ - 训练计划      │  │ - GPS轨迹     │  │ - 实时数据   │        │
│  └────────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈清单

#### 前端（Vue 3生态）
| 类别 | 技术选型 | 版本 | 用途 |
|------|---------|------|------|
| 核心框架 | Vue 3 | 3.4+ | 组件化开发 |
| 构建工具 | Vite | 5.x | 快速开发/HMR |
| 语言 | TypeScript | 5.x | 类型安全 |
| 状态管理 | Pinia | 2.x | 集中状态管理 |
| 路由 | Vue Router | 4.x | SPA路由 |
| 数据可视化 | Apache ECharts | 5.x | 图表（功率曲线、热力图） |
| 表单验证 | VeeValidate | 4.x | 复杂表单校验 |
| HTTP客户端 | Axios | 1.x | RESTful API调用 |
| WebSocket | Socket.io-client | 4.x | 实时数据推送 |
| 日期处理 | Day.js | 1.x | 训练日期/时区处理 |
| 单元测试 | Vitest | 1.x | 测试框架 |

#### 后端（Python生态）
| 类别 | 技术选型 | 版本 | 用途 |
|------|---------|------|------|
| 核心框架 | FastAPI | 0.110+ | Web框架 |
| ASGI服务器 | Uvicorn | 0.27+ | 异步服务器 |
| ORM | SQLAlchemy | 2.x | 数据库ORM |
| 数据库迁移 | Alembic | 1.x | Schema版本管理 |
| 数据验证 | Pydantic | 2.x | 数据模型验证 |
| 认证授权 | FastAPI-Users | 12.x | JWT/OAuth2 |
| WebSocket | python-socketio | 5.x | 实时通信 |
| 任务队列 | Celery | 5.x | 异步任务（报告生成/AI计算） |
| 消息代理 | Redis | 7.x | Celery broker |
| 数据分析 | Pandas | 2.x | 训练数据分析 |
| 数值计算 | NumPy | 1.26+ | 数值算法 |
| 科学计算 | SciPy | 1.12+ | 统计分析 |
| 机器学习 | Scikit-learn | 1.4+ | FTP预测/负荷建模 |
| FIT文件解析 | fitparse | 1.2+ | Garmin等设备数据 |
| GPX文件解析 | gpxpy | 1.6+ | GPS轨迹解析 |
| 数据可视化 | Matplotlib | 3.8+ | 后端图表生成 |
| PDF生成 | ReportLab | 4.x | 训练报告导出 |
| Excel导出 | openpyxl | 3.x | 数据导出 |
| 单元测试 | Pytest | 8.x | 测试框架 |

#### 数据库与缓存
| 类别 | 技术选型 | 版本 | 用途 |
|------|---------|------|------|
| 关系数据库 | PostgreSQL | 15+ | 结构化数据存储 |
| 时序扩展 | TimescaleDB | 2.14+ | 训练时序数据（功率/心率） |
| 缓存/队列 | Redis | 7.x | 缓存/Session/消息队列 |

#### 开发运维
| 类别 | 技术选型 | 用途 |
|------|---------|------|
| 容器化 | Docker | 环境一致性 |
| 编排 | Docker Compose | 本地开发/小规模部署 |
| 反向代理 | Nginx | 负载均衡/静态资源 |
| 日志 | Loguru (Python) | 结构化日志 |
| 监控 | Prometheus + Grafana | 性能监控（生产环境） |
| 代码规范 | ESLint + Prettier (前端) / Black + Flake8 (后端) | 代码质量 |

---

## 三、核心模块设计

### 3.1 前端模块划分

```
src/
├── main.ts                    # 应用入口
├── App.vue                    # 根组件
├── router/                    # 路由配置
│   ├── index.ts
│   └── guards.ts              # 路由守卫（权限控制）
├── stores/                    # Pinia状态管理
│   ├── auth.ts                # 用户认证
│   ├── athlete.ts             # 运动员数据
│   ├── training.ts            # 训练计划
│   └── realtime.ts            # 实时数据（WebSocket）
├── views/                     # 页面视图
│   ├── coach/                 # 教练端
│   │   ├── Dashboard.vue      # 多人监控面板
│   │   ├── AthleteList.vue    # 运动员列表
│   │   └── PlanEditor.vue     # 训练计划编辑器
│   ├── athlete/               # 运动员端
│   │   ├── Overview.vue       # 个人概览
│   │   ├── Analytics.vue      # 数据分析
│   │   └── Calendar.vue       # 训练日历
│   └── auth/                  # 认证相关
│       ├── Login.vue
│       └── Register.vue
├── components/                # 可复用组件
│   ├── charts/                # 图表组件
│   │   ├── PowerCurve.vue     # 功率曲线
│   │   ├── HeartRateZone.vue  # 心率区间分布
│   │   └── TrainingLoad.vue   # 训练负荷趋势
│   ├── training/              # 训练相关
│   │   ├── WorkoutBuilder.vue # 课程构建器
│   │   └── IntervalEditor.vue # 间歇训练编辑
│   └── common/                # 通用组件
│       ├── DataTable.vue
│       └── FileUpload.vue     # FIT/GPX上传
├── composables/               # 组合式函数
│   ├── useAuth.ts             # 认证逻辑
│   ├── useWebSocket.ts        # WebSocket连接
│   └── useTrainingCalculations.ts  # 训练计算（前端缓存）
├── services/                  # API服务层
│   ├── api.ts                 # Axios实例配置
│   ├── auth.service.ts
│   ├── training.service.ts
│   └── athlete.service.ts
├── types/                     # TypeScript类型定义
│   ├── models.ts              # 数据模型
│   └── api.ts                 # API接口类型
└── utils/                     # 工具函数
    ├── calculations.ts        # 训练计算（TSS/IF/NP）
    ├── formatters.ts          # 数据格式化
    └── validators.ts          # 表单验证规则
```

### 3.2 后端模块划分

```
app/
├── main.py                    # FastAPI应用入口
├── config.py                  # 配置管理（环境变量）
├── api/                       # API路由层
│   ├── __init__.py
│   ├── deps.py                # 依赖注入（DB会话/认证）
│   ├── v1/                    # API版本1
│   │   ├── __init__.py
│   │   ├── auth.py            # 认证端点
│   │   ├── athletes.py        # 运动员管理
│   │   ├── coaches.py         # 教练功能
│   │   ├── trainings.py       # 训练计划CRUD
│   │   ├── activities.py      # 训练活动（FIT文件上传）
│   │   ├── analytics.py       # 数据分析端点
│   │   └── realtime.py        # WebSocket端点
├── schemas/                   # Pydantic数据模型（请求/响应）
│   ├── user.py
│   ├── training.py
│   ├── activity.py
│   └── analytics.py
├── models/                    # SQLAlchemy数据库模型
│   ├── user.py                # 用户/教练/运动员
│   ├── training_plan.py       # 训练计划
│   ├── workout.py             # 单次训练课
│   ├── activity.py            # 训练活动记录
│   └── timeseries.py          # 时序数据（TimescaleDB）
├── services/                  # 业务逻辑层
│   ├── auth_service.py        # 认证逻辑
│   ├── training_service.py    # 训练计划业务
│   ├── analytics_service.py   # 数据分析引擎
│   │   ├── power_analysis.py  # 功率分析（NP/IF/TSS）
│   │   ├── ftp_detection.py   # FTP自动检测
│   │   └── load_calculation.py# 训练负荷计算（CTL/ATL/TSB）
│   ├── file_parser/           # 文件解析服务
│   │   ├── fit_parser.py      # FIT文件解析
│   │   └── gpx_parser.py      # GPX文件解析
│   └── ai_service/            # AI服务
│       ├── plan_generator.py  # 训练计划生成
│       └── ftp_predictor.py   # FTP预测模型
├── db/                        # 数据库相关
│   ├── session.py             # 数据库会话
│   ├── base.py                # Base类
│   └── init_db.py             # 数据库初始化
├── core/                      # 核心模块
│   ├── security.py            # 密码哈希/JWT令牌
│   ├── config.py              # 配置类
│   └── logger.py              # 日志配置（结构化日志）
├── tasks/                     # Celery异步任务
│   ├── celery_app.py          # Celery实例
│   ├── report_tasks.py        # 报告生成任务
│   └── ai_tasks.py            # AI计算任务（长时间运行）
├── utils/                     # 工具函数
│   ├── calculations.py        # 训练科学计算
│   │   ├── tss.py             # Training Stress Score
│   │   ├── normalized_power.py# 标准化功率
│   │   └── intensity_factor.py# 强度因子
│   ├── validators.py          # 数据验证
│   └── formatters.py          # 数据格式化
└── tests/                     # 单元测试
    ├── test_analytics.py
    └── test_file_parser.py
```

---

## 四、关键技术设计细节

### 4.1 数据库设计（核心表结构）

#### 关系数据库（PostgreSQL）

**用户表（users）**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL,  -- 'athlete', 'coach', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**运动员资料表（athlete_profiles）**
```sql
CREATE TABLE athlete_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    ftp INTEGER,  -- 功能性阈值功率（Watts）
    weight DECIMAL(5,2),  -- 体重（kg）
    max_hr INTEGER,  -- 最大心率
    rest_hr INTEGER,  -- 静息心率
    lthr INTEGER,  -- 乳酸阈值心率
    coach_id UUID REFERENCES users(id),  -- 教练ID
    training_zones JSONB,  -- 功率/心率区间配置
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**训练计划表（training_plans）**
```sql
CREATE TABLE training_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES users(id),
    coach_id UUID REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    goal VARCHAR(50),  -- 'endurance', 'ftp_improvement', 'race_prep'
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**训练课表（workouts）**
```sql
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES training_plans(id),
    scheduled_date DATE NOT NULL,
    name VARCHAR(200),
    workout_type VARCHAR(30),  -- 'endurance', 'intervals', 'recovery', 'race'
    duration_seconds INTEGER,
    tss_planned DECIMAL(5,1),  -- 计划训练压力分数
    structure JSONB,  -- 训练结构（间歇配置等）
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**训练活动表（activities）**
```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES users(id),
    workout_id UUID REFERENCES workouts(id),  -- 可为NULL（计划外训练）
    activity_date TIMESTAMP WITH TIME ZONE NOT NULL,
    activity_type VARCHAR(30),  -- 'ride', 'run', 'indoor'
    duration_seconds INTEGER,
    distance_meters DECIMAL(10,2),
    
    -- 功率数据
    avg_power INTEGER,
    normalized_power INTEGER,  -- NP
    max_power INTEGER,
    
    -- 心率数据
    avg_hr INTEGER,
    max_hr INTEGER,
    
    -- 训练负荷指标
    intensity_factor DECIMAL(4,3),  -- IF
    tss DECIMAL(5,1),  -- 实际TSS
    
    -- 文件相关
    file_path VARCHAR(500),  -- FIT文件存储路径
    original_filename VARCHAR(200),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 时序数据库（TimescaleDB）

**训练时序数据表（activity_timeseries）**
```sql
CREATE TABLE activity_timeseries (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    power INTEGER,  -- 功率（Watts）
    heart_rate INTEGER,  -- 心率（bpm）
    cadence INTEGER,  -- 踏频（rpm）
    speed DECIMAL(5,2),  -- 速度（m/s）
    altitude DECIMAL(7,2),  -- 海拔（m）
    latitude DECIMAL(10,8),  -- 纬度
    longitude DECIMAL(11,8),  -- 经度
    temperature DECIMAL(4,1),  -- 温度（℃）
    PRIMARY KEY (time, activity_id)
);

-- 转换为时序表（TimescaleDB扩展）
SELECT create_hypertable('activity_timeseries', 'time');

-- 创建索引优化查询
CREATE INDEX idx_activity_timeseries_activity_id ON activity_timeseries(activity_id, time DESC);
```

**训练负荷时序表（training_load_timeseries）**
```sql
CREATE TABLE training_load_timeseries (
    date DATE NOT NULL,
    athlete_id UUID NOT NULL REFERENCES users(id),
    atl DECIMAL(6,2),  -- 急性训练负荷（7天滚动平均）
    ctl DECIMAL(6,2),  -- 慢性训练负荷（42天滚动平均）
    tsb DECIMAL(6,2),  -- 训练压力平衡（CTL - ATL）
    daily_tss DECIMAL(5,1),  -- 当日TSS
    PRIMARY KEY (date, athlete_id)
);

SELECT create_hypertable('training_load_timeseries', 'date');
```

### 4.2 API设计（RESTful规范）

#### 认证相关
```
POST   /api/v1/auth/register          # 注册
POST   /api/v1/auth/login             # 登录（返回JWT）
POST   /api/v1/auth/refresh           # 刷新令牌
GET    /api/v1/auth/me                # 获取当前用户信息
```

#### 运动员管理（教练端）
```
GET    /api/v1/coaches/athletes       # 获取教练的运动员列表
POST   /api/v1/coaches/athletes       # 添加运动员关联
GET    /api/v1/athletes/{id}/profile  # 获取运动员资料
PUT    /api/v1/athletes/{id}/profile  # 更新运动员资料（FTP/体重等）
GET    /api/v1/athletes/{id}/summary  # 获取运动员训练概况
```

#### 训练计划管理
```
GET    /api/v1/training-plans                    # 获取训练计划列表
POST   /api/v1/training-plans                    # 创建训练计划
GET    /api/v1/training-plans/{id}               # 获取计划详情
PUT    /api/v1/training-plans/{id}               # 更新计划
DELETE /api/v1/training-plans/{id}               # 删除计划

GET    /api/v1/training-plans/{id}/workouts      # 获取计划的所有训练课
POST   /api/v1/training-plans/{id}/workouts      # 添加训练课
PUT    /api/v1/workouts/{id}                     # 更新训练课
DELETE /api/v1/workouts/{id}                     # 删除训练课
```

#### 训练活动（数据上传）
```
POST   /api/v1/activities/upload                 # 上传FIT/GPX文件
GET    /api/v1/activities                        # 获取活动列表
GET    /api/v1/activities/{id}                   # 获取活动详情
GET    /api/v1/activities/{id}/timeseries        # 获取时序数据（功率曲线等）
DELETE /api/v1/activities/{id}                   # 删除活动
```

#### 数据分析
```
GET    /api/v1/analytics/power-curve/{athlete_id}       # 功率曲线（1s到1h）
GET    /api/v1/analytics/training-load/{athlete_id}     # 训练负荷趋势（CTL/ATL/TSB）
GET    /api/v1/analytics/zone-distribution/{athlete_id} # 功率/心率区间分布
POST   /api/v1/analytics/ftp-detection                  # FTP自动检测
GET    /api/v1/analytics/compare/{athlete_id}           # 多活动对比分析
```

#### AI功能（异步任务）
```
POST   /api/v1/ai/generate-plan                  # 生成训练计划（返回task_id）
GET    /api/v1/ai/tasks/{task_id}                # 查询任务状态
POST   /api/v1/ai/predict-ftp                    # FTP预测
```

#### 报告导出
```
POST   /api/v1/reports/training-summary          # 生成训练总结报告（PDF）
POST   /api/v1/reports/athlete-progress          # 生成运动员进度报告
GET    /api/v1/reports/{report_id}/download      # 下载报告
```

#### WebSocket实时推送
```
WS     /ws/realtime/{athlete_id}                 # 实时数据推送（教练监控多人）
```

### 4.3 数据分析算法实现

#### 核心指标计算

**1. 标准化功率（Normalized Power, NP）**
```python
# 基于TrainingPeaks算法
def calculate_normalized_power(power_data: np.ndarray, sampling_rate: int = 1) -> float:
    """
    计算标准化功率
    算法：30秒滚动平均 -> 4次方 -> 平均 -> 4次根
    """
    if len(power_data) < 30:
        return np.mean(power_data)
    
    # 30秒滚动平均
    window_size = 30 // sampling_rate
    rolling_avg = np.convolve(power_data, np.ones(window_size)/window_size, mode='valid')
    
    # 4次方的平均值
    power_4th = np.power(rolling_avg, 4)
    avg_power_4th = np.mean(power_4th)
    
    # 4次根
    np_value = np.power(avg_power_4th, 0.25)
    return float(np_value)
```

**2. 强度因子（Intensity Factor, IF）**
```python
def calculate_intensity_factor(normalized_power: float, ftp: int) -> float:
    """
    强度因子 = NP / FTP
    用于衡量训练强度相对于阈值的比例
    """
    if ftp <= 0:
        raise ValueError("FTP must be greater than 0")
    return normalized_power / ftp
```

**3. 训练压力分数（Training Stress Score, TSS）**
```python
def calculate_tss(normalized_power: float, duration_seconds: int, 
                  intensity_factor: float, ftp: int) -> float:
    """
    TSS = (duration_hours × NP × IF) / (FTP × 3600) × 100
    
    典型值：
    - < 150: 低强度训练
    - 150-300: 中等强度训练
    - > 300: 高强度训练
    """
    duration_hours = duration_seconds / 3600
    tss = (duration_hours * normalized_power * intensity_factor) / (ftp * 3600) * 100
    return float(tss)
```

**4. 训练负荷计算（CTL/ATL/TSB）**
```python
def calculate_training_load(daily_tss: pd.Series) -> pd.DataFrame:
    """
    CTL (Chronic Training Load): 42天指数加权移动平均，反映长期训练适应
    ATL (Acute Training Load): 7天指数加权移动平均，反映短期疲劳
    TSB (Training Stress Balance): CTL - ATL，反映训练/恢复状态
    
    TSB解读：
    - TSB > +25: 过度恢复（可能丧失训练状态）
    - TSB -10 to +5: 最佳状态（比赛窗口）
    - TSB < -30: 过度训练风险
    """
    ctl = daily_tss.ewm(span=42, adjust=False).mean()
    atl = daily_tss.ewm(span=7, adjust=False).mean()
    tsb = ctl - atl
    
    return pd.DataFrame({
        'date': daily_tss.index,
        'ctl': ctl,
        'atl': atl,
        'tsb': tsb,
        'daily_tss': daily_tss.values
    })
```

**5. 功率曲线（Power Duration Curve）**
```python
def calculate_power_curve(power_data: np.ndarray, 
                          durations: list[int] = [1, 5, 60, 300, 600, 1200, 3600]) -> dict:
    """
    计算不同时长的最大平均功率
    
    Args:
        power_data: 功率时间序列
        durations: 时长列表（秒），默认1s, 5s, 1min, 5min, 10min, 20min, 1hr
    
    Returns:
        {duration: max_avg_power}
    """
    power_curve = {}
    for duration in durations:
        if duration > len(power_data):
            power_curve[duration] = None
            continue
        
        # 滚动窗口计算最大平均功率
        rolling_avg = np.convolve(power_data, np.ones(duration)/duration, mode='valid')
        power_curve[duration] = float(np.max(rolling_avg))
    
    return power_curve
```

**6. FTP自动检测**
```python
def detect_ftp(power_curve: dict) -> int:
    """
    基于功率曲线自动检测FTP
    方法：20分钟最大平均功率 × 0.95
    
    备选方法：
    - 60分钟最大平均功率
    - 机器学习模型基于历史数据预测
    """
    if 1200 in power_curve and power_curve[1200] is not None:  # 20分钟
        ftp = int(power_curve[1200] * 0.95)
    elif 3600 in power_curve and power_curve[3600] is not None:  # 60分钟
        ftp = int(power_curve[3600])
    else:
        raise ValueError("Insufficient data for FTP detection")
    
    return ftp
```

### 4.4 实时数据推送设计（WebSocket）

#### 场景：教练实时监控多名运动员
```python
# 后端（FastAPI + Socket.IO）
from socketio import AsyncServer

sio = AsyncServer(async_mode='asgi', cors_allowed_origins='*')

@sio.event
async def connect(sid, environ, auth):
    """客户端连接"""
    # 验证JWT令牌
    token = auth.get('token')
    user = verify_token(token)
    
    if user.role == 'coach':
        # 教练加入专属房间
        await sio.enter_room(sid, f'coach_{user.id}')
        # 订阅该教练所有运动员的数据流
        athletes = get_coach_athletes(user.id)
        for athlete in athletes:
            await sio.enter_room(sid, f'athlete_{athlete.id}')
    
    await sio.emit('connected', {'message': 'Real-time connection established'}, room=sid)

@sio.event
async def subscribe_athlete(sid, data):
    """教练订阅特定运动员的实时数据"""
    athlete_id = data['athlete_id']
    await sio.enter_room(sid, f'athlete_{athlete_id}')

# 实时数据推送（由Celery任务或流处理触发）
async def push_realtime_data(athlete_id: str, data: dict):
    """推送实时训练数据到订阅的教练"""
    await sio.emit('training_data', data, room=f'athlete_{athlete_id}')
```

```typescript
// 前端（Vue 3组合式函数）
// composables/useWebSocket.ts
import { io, Socket } from 'socket.io-client'
import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket() {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const realtimeData = ref<Map<string, any>>(new Map())

  onMounted(() => {
    const token = localStorage.getItem('access_token')
    
    socket.value = io('ws://localhost:8000', {
      auth: { token },
      transports: ['websocket']
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('WebSocket connected')
    })

    socket.value.on('training_data', (data) => {
      // 更新运动员实时数据
      realtimeData.value.set(data.athlete_id, data)
    })
  })

  onUnmounted(() => {
    socket.value?.disconnect()
  })

  const subscribeAthlete = (athleteId: string) => {
    socket.value?.emit('subscribe_athlete', { athlete_id: athleteId })
  }

  return {
    isConnected,
    realtimeData,
    subscribeAthlete
  }
}
```

### 4.5 文件上传与解析流程

#### FIT文件上传端点
```python
# app/api/v1/activities.py
from fastapi import APIRouter, UploadFile, BackgroundTasks
from app.services.file_parser.fit_parser import parse_fit_file
from app.tasks.analytics_tasks import process_activity_task

router = APIRouter()

@router.post("/upload")
async def upload_activity(
    file: UploadFile,
    workout_id: Optional[UUID] = None,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    上传训练文件（FIT/GPX）并异步处理
    
    处理流程：
    1. 验证文件格式
    2. 保存原始文件
    3. 解析文件提取元数据（时长、距离、平均功率等）
    4. 创建Activity记录
    5. 后台任务：解析时序数据并存储到TimescaleDB
    6. 后台任务：计算分析指标（NP/TSS等）
    7. 后台任务：更新训练负荷（CTL/ATL）
    """
    # 1. 验证文件类型
    if not file.filename.endswith(('.fit', '.gpx')):
        raise HTTPException(400, "Only FIT and GPX files are supported")
    
    # 2. 保存文件
    file_path = f"uploads/{current_user.id}/{uuid4()}.fit"
    await save_file(file, file_path)
    
    # 3. 解析文件（同步，快速获取元数据）
    try:
        activity_summary = parse_fit_file(file_path)
    except Exception as e:
        raise HTTPException(422, f"File parsing error: {str(e)}")
    
    # 4. 创建Activity记录
    activity = Activity(
        athlete_id=current_user.id,
        workout_id=workout_id,
        activity_date=activity_summary['start_time'],
        activity_type='ride',
        duration_seconds=activity_summary['duration'],
        distance_meters=activity_summary['distance'],
        avg_power=activity_summary['avg_power'],
        file_path=file_path,
        original_filename=file.filename
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    
    # 5. 后台任务：详细数据处理
    background_tasks.add_task(
        process_activity_task,
        activity_id=activity.id,
        file_path=file_path
    )
    
    return {
        "activity_id": activity.id,
        "status": "processing",
        "message": "File uploaded successfully, processing in background"
    }
```

#### FIT文件解析实现
```python
# app/services/file_parser/fit_parser.py
from fitparse import FitFile
import numpy as np
from datetime import datetime

def parse_fit_file(file_path: str) -> dict:
    """
    解析FIT文件
    
    Returns:
        {
            'start_time': datetime,
            'duration': int (seconds),
            'distance': float (meters),
            'avg_power': int (watts),
            'max_power': int,
            'avg_hr': int (bpm),
            'max_hr': int,
            'timeseries': [
                {'timestamp': datetime, 'power': int, 'hr': int, ...},
                ...
            ]
        }
    """
    fit_file = FitFile(file_path)
    
    # 提取session元数据
    session = next(fit_file.get_messages('session'))
    summary = {
        'start_time': session.get_value('start_time'),
        'duration': session.get_value('total_elapsed_time'),
        'distance': session.get_value('total_distance'),
        'avg_power': session.get_value('avg_power'),
        'max_power': session.get_value('max_power'),
        'avg_hr': session.get_value('avg_heart_rate'),
        'max_hr': session.get_value('max_heart_rate'),
    }
    
    # 提取时序数据（record消息）
    timeseries = []
    for record in fit_file.get_messages('record'):
        timeseries.append({
            'timestamp': record.get_value('timestamp'),
            'power': record.get_value('power'),
            'heart_rate': record.get_value('heart_rate'),
            'cadence': record.get_value('cadence'),
            'speed': record.get_value('speed'),
            'altitude': record.get_value('altitude'),
            'latitude': record.get_value('position_lat'),
            'longitude': record.get_value('position_long'),
            'temperature': record.get_value('temperature'),
        })
    
    summary['timeseries'] = timeseries
    return summary
```

#### 异步数据处理任务
```python
# app/tasks/analytics_tasks.py
from celery import shared_task
from app.services.analytics_service.power_analysis import (
    calculate_normalized_power, calculate_tss
)

@shared_task
def process_activity_task(activity_id: str, file_path: str):
    """
    后台处理训练活动数据
    
    步骤：
    1. 重新解析完整时序数据
    2. 存储到TimescaleDB
    3. 计算NP/IF/TSS
    4. 更新Activity记录
    5. 更新运动员的CTL/ATL
    """
    db = SessionLocal()
    
    # 1. 解析文件
    data = parse_fit_file(file_path)
    activity = db.query(Activity).filter_by(id=activity_id).first()
    
    # 2. 存储时序数据到TimescaleDB
    timeseries_records = [
        {
            'time': point['timestamp'],
            'activity_id': activity_id,
            'power': point['power'],
            'heart_rate': point['heart_rate'],
            'cadence': point['cadence'],
            'speed': point['speed'],
            'altitude': point['altitude'],
            'latitude': point['latitude'],
            'longitude': point['longitude'],
            'temperature': point['temperature'],
        }
        for point in data['timeseries']
    ]
    db.bulk_insert_mappings(ActivityTimeseries, timeseries_records)
    
    # 3. 计算分析指标
    power_data = np.array([p['power'] for p in data['timeseries'] if p['power']])
    
    athlete = db.query(AthleteProfile).filter_by(user_id=activity.athlete_id).first()
    ftp = athlete.ftp
    
    normalized_power = calculate_normalized_power(power_data)
    intensity_factor = normalized_power / ftp
    tss = calculate_tss(normalized_power, data['duration'], intensity_factor, ftp)
    
    # 4. 更新Activity
    activity.normalized_power = int(normalized_power)
    activity.intensity_factor = intensity_factor
    activity.tss = tss
    db.commit()
    
    # 5. 更新训练负荷（调用另一个任务）
    update_training_load_task.delay(activity.athlete_id, activity.activity_date.date())
    
    db.close()
```

### 4.6 AI训练计划生成设计

#### 两种方案

**方案A：基于规则的智能生成（MVP推荐）**
```python
# app/services/ai_service/plan_generator.py
from datetime import date, timedelta
from app.schemas.training import TrainingPlanCreate, WorkoutCreate

def generate_training_plan(
    athlete_id: UUID,
    goal: str,  # 'ftp_improvement', 'endurance', 'race_prep'
    start_date: date,
    duration_weeks: int,
    current_ftp: int,
    weekly_hours: float,
    db: Session
) -> TrainingPlanCreate:
    """
    基于训练原则的规则生成
    
    原则：
    1. 周期化训练（基础期 -> 强化期 -> 巅峰期 -> 恢复期）
    2. 极化训练模型（80%低强度 Z1-Z2 + 20%高强度 Z4-Z6）
    3. 逐步增加负荷（每周TSS增加不超过5-10%）
    4. 每3-4周安排恢复周（负荷减少40%）
    """
    total_days = duration_weeks * 7
    workouts = []
    
    # 计算每周目标TSS
    base_weekly_tss = weekly_hours * 50  # 假设平均每小时50 TSS
    
    for week in range(duration_weeks):
        # 恢复周
        if (week + 1) % 4 == 0:
            weekly_tss = base_weekly_tss * 0.6
        else:
            # 渐进超负荷
            weekly_tss = base_weekly_tss * (1 + 0.05 * (week // 4))
        
        # 生成该周的训练课
        week_workouts = generate_week_workouts(
            start_date + timedelta(weeks=week),
            weekly_tss,
            current_ftp,
            goal,
            week_phase=get_phase(week, duration_weeks)
        )
        workouts.extend(week_workouts)
    
    return TrainingPlanCreate(
        athlete_id=athlete_id,
        name=f"{goal.title()} Training Plan",
        start_date=start_date,
        end_date=start_date + timedelta(weeks=duration_weeks),
        goal=goal,
        workouts=workouts
    )

def generate_week_workouts(
    week_start: date,
    weekly_tss: float,
    ftp: int,
    goal: str,
    week_phase: str
) -> list[WorkoutCreate]:
    """
    生成一周的训练课
    
    典型一周结构（极化训练）：
    - 周一：恢复骑行（Z1-Z2，60 TSS）
    - 周二：间歇训练（Z4-Z5，90 TSS）
    - 周三：休息或交叉训练
    - 周四：耐力骑行（Z2，70 TSS）
    - 周五：休息
    - 周六：长距离耐力（Z2，120 TSS）
    - 周日：Tempo或Sweet Spot（Z3-Z4，100 TSS）
    """
    workouts = []
    
    # 周二：间歇训练
    workouts.append(WorkoutCreate(
        scheduled_date=week_start + timedelta(days=1),
        name="VO2 Max Intervals",
        workout_type="intervals",
        duration_seconds=3600,
        tss_planned=weekly_tss * 0.25,
        structure={
            "warmup": {"duration": 600, "power_zone": 1},
            "intervals": [
                {"duration": 300, "power_zone": 5, "rest": 300, "repeats": 5}
            ],
            "cooldown": {"duration": 600, "power_zone": 1}
        }
    ))
    
    # ... 其他训练课
    
    return workouts
```

**方案B：基于LLM的个性化生成（未来迭代）**
```python
# app/services/ai_service/llm_plan_generator.py
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

async def generate_plan_with_llm(
    athlete_profile: dict,
    training_history: list[dict],
    goal: str,
    constraints: dict
) -> str:
    """
    使用大语言模型生成个性化训练计划
    
    优势：
    - 考虑更多上下文（历史表现、反馈、伤病史）
    - 自然语言理解目标
    - 生成解释和建议
    """
    llm = ChatOpenAI(model="gpt-4", temperature=0.7)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """你是一位专业的自行车教练，精通训练科学和周期化训练理论。
        基于运动员的资料、训练历史和目标，生成一份详细的训练计划。
        
        训练原则：
        1. 遵循极化训练模型（80/20法则）
        2. 周期化训练（基础期、强化期、巅峰期、恢复期）
        3. 逐步增加负荷，避免过度训练
        4. 个性化调整（考虑运动员的强弱项）
        """),
        ("user", """
        运动员资料：
        - FTP: {ftp}W
        - 体重: {weight}kg
        - 每周可训练时间: {weekly_hours}小时
        - 当前CTL: {ctl}
        
        训练历史：
        {training_history}
        
        目标：{goal}
        时间：{duration_weeks}周
        
        请生成详细的训练计划（JSON格式，包含每周的训练课结构）。
        """)
    ])
    
    chain = prompt | llm
    response = await chain.ainvoke({
        "ftp": athlete_profile['ftp'],
        "weight": athlete_profile['weight'],
        "weekly_hours": constraints['weekly_hours'],
        "ctl": athlete_profile['ctl'],
        "training_history": format_history(training_history),
        "goal": goal,
        "duration_weeks": constraints['duration_weeks']
    })
    
    return response.content
```

---

## 五、部署架构

### 5.1 开发环境
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # 前端开发服务器
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"  # Vite开发服务器
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000
  
  # 后端API服务器
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"  # FastAPI
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/x_ascent
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  
  # PostgreSQL + TimescaleDB
  postgres:
    image: timescale/timescaledb:latest-pg15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=x_ascent
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  # Celery Worker（异步任务）
  celery_worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/x_ascent
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis
    command: celery -A app.tasks.celery_app worker --loglevel=info

volumes:
  postgres_data:
```

### 5.2 生产环境
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Nginx反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/dist:/usr/share/nginx/html
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
  
  # 后端API（多实例）
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    deploy:
      replicas: 3  # 负载均衡
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/x_ascent
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - postgres
      - redis
  
  # 数据库（生产环境建议外部托管）
  postgres:
    image: timescale/timescaledb:latest-pg15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=x_ascent
    restart: always
  
  redis:
    image: redis:7-alpine
    restart: always
  
  celery_worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    deploy:
      replicas: 2
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/x_ascent
      - REDIS_URL=redis://redis:6379/0
    command: celery -A app.tasks.celery_app worker --loglevel=info
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 六、技术风险与缓解措施

### 6.1 主要风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| **大规模时序数据查询性能** | 图表加载慢 | 高 | 1. TimescaleDB自动分区<br>2. 查询加入时间范围限制<br>3. Redis缓存常用查询<br>4. 前端数据抽样显示 |
| **FIT文件解析兼容性** | 部分设备数据无法读取 | 中 | 1. 支持多种解析库fallback<br>2. 建立设备兼容性测试套件<br>3. 用户反馈机制快速修复 |
| **并发上传文件导致服务器负载** | 服务器宕机 | 中 | 1. Celery异步处理<br>2. 文件上传限流<br>3. 对象存储（S3）解耦文件处理 |
| **AI模型预测不准确** | 用户不满 | 中 | 1. MVP先用规则引擎<br>2. 提供手动调整选项<br>3. 收集反馈持续优化模型 |
| **WebSocket连接不稳定** | 实时监控中断 | 低 | 1. 自动重连机制<br>2. 降级为轮询模式<br>3. 连接状态UI提示 |

### 6.2 性能优化策略

1. **数据库优化**
   - 创建合适的索引（activity_id, athlete_id, date）
   - TimescaleDB自动数据压缩和分区
   - 读写分离（主从复制）

2. **API性能**
   - Redis缓存热点数据（用户资料、训练区间配置）
   - 分页查询（训练列表、活动列表）
   - 异步处理重任务（文件解析、报告生成）

3. **前端优化**
   - 路由懒加载
   - ECharts按需引入
   - 虚拟滚动（长列表）
   - Service Worker缓存静态资源

---

## 七、开发路线图（MVP到完整版）

### Phase 1: MVP核心功能（8-12周）
1. **Week 1-2：基础架构搭建**
   - 项目初始化（前后端脚手架）
   - Docker开发环境配置
   - 数据库设计与迁移脚本
   - CI/CD管道搭建

2. **Week 3-4：用户认证与基础UI**
   - 用户注册/登录（JWT）
   - 角色权限系统（运动员/教练）
   - 基础布局（导航、侧边栏）
   - 响应式设计框架

3. **Week 5-6：文件上传与数据展示**
   - FIT文件上传端点
   - 文件解析服务（同步+异步）
   - 训练列表页面
   - 单次训练详情页（功率曲线、地图）

4. **Week 7-8：数据分析核心**
   - NP/IF/TSS计算实现
   - 功率曲线生成
   - CTL/ATL/TSB计算
   - 分析Dashboard页面（ECharts可视化）

5. **Week 9-10：训练计划基础**
   - 训练计划CRUD API
   - 训练课编辑器（基础版）
   - 训练日历视图
   - 计划与活动关联

6. **Week 11-12：教练端功能**
   - 教练-运动员关联
   - 多人监控Dashboard（基础版）
   - 训练计划分配
   - MVP测试与修复

### Phase 2: 进阶功能（12-16周）
1. **AI训练计划生成**（规则引擎版）
2. **实时数据推送**（WebSocket）
3. **报告导出**（PDF/Excel）
4. **高级图表**（心率区间分布、对比分析）
5. **设备API集成**（Strava同步）
6. **性能优化**（查询优化、缓存策略）

### Phase 3: 企业级功能（16周+）
1. **团队协作**（多教练、团体训练）
2. **移动App**（React Native/Flutter）
3. **高级AI**（LLM个性化计划、受伤风险预测）
4. **社区功能**（排行榜、挑战赛）
5. **付费订阅系统**
6. **国际化**（多语言支持）

---

## 八、总结与建议

### 8.1 架构优势

1. **前后端分离**：独立开发、部署和扩展
2. **异步处理**：FastAPI + Celery处理复杂计算不阻塞API
3. **时序数据优化**：TimescaleDB专为训练数据设计
4. **类型安全**：TypeScript + Pydantic减少运行时错误
5. **可扩展性**：微服务架构预留，初期单体降低复杂度
6. **现代化栈**：Vue 3 Composition API + FastAPI代表最佳实践

### 8.2 技术选型最终决策

| 类别 | 选型 | 理由 |
|------|------|------|
| 前端框架 | **Vue 3** ✅ | 响应式、性能、组合式API适合复杂业务 |
| 后端框架 | **FastAPI** ✅ | 异步、高性能、自动文档、易集成ML |
| 数据库 | **PostgreSQL + TimescaleDB** ✅ | 关系+时序混合，查询性能优秀 |
| 缓存 | **Redis** ✅ | 缓存、会话、消息队列多用途 |
| 任务队列 | **Celery** ✅ | Python生态成熟的异步方案 |
| 可视化 | **Apache ECharts** ✅ | 性能好、图表丰富、中文文档 |

### 8.3 下一步行动

1. **确认技术栈**：审核本文档，确认是否有需要调整的地方
2. **细化需求**：梳理MVP的具体功能优先级
3. **搭建基础架构**：初始化项目、配置开发环境
4. **开始迭代开发**：按Phase 1路线图执行

### 8.4 文档维护

本文档将作为技术基准，随项目进展持续更新：
- 新增技术决策记录（ADR）
- 性能测试结果
- API文档链接
- 部署指南

---

**文档版本**：v1.0  
**最后更新**：2025-10-28  
**作者**：项目架构师  
**审核状态**：待审核

