---
title: 'Agent长久记忆实现架构：OneAndOnly项目的记忆系统设计'
published: 2026-06-02
description: 'OneAndOnly项目中混合存储架构的记忆系统设计，结合Chroma向量数据库与Markdown文档的双层存储策略'
tags: [Agent, 记忆系统, LangGraph, Chroma, 向量数据库, 多智能体, 架构设计]
category: 代码技术
image: ./cover.jpg
draft: false
pinned: false
---

# Agent长久记忆实现架构

## 概述

该项目采用**混合存储架构**实现Agent的长久记忆功能，结合向量数据库的语义检索能力和Markdown文档的结构化存储优势，构建了一个完整的记忆管理系统。

## 存储架构设计

### 双层存储策略

```
┌─────────────────────────────────────────────────────────────┐
│                    长久记忆存储系统                          │
├─────────────────────────────────────────────────────────────┤
│  向量数据库 (Chroma)           │    Markdown文档             │
│  - 动态记忆                   │    - 静态档案               │
│  - 非结构化数据               │    - 结构化数据             │
│  - 语义检索                   │    - 不常变化               │
│  - 事件、观点、情绪等         │    - 基础属性、能力等       │
└─────────────────────────────────────────────────────────────┘
```

**存储分工原则**：
- **向量库**：存储动态、非结构化、需语义检索的记忆（事件、观点、情绪、短期规划等）
- **MD文档**：存储静态、结构化、不常变化的个人档案信息（基础属性、长期能力、固定偏好等）

## 记忆分类体系

### 七大维度分类

| 维度 | 存储方式 | 内容特点 |
|------|----------|----------|
| **事件经历维度** | 向量库 | 近期/远期 + 重要/普通 四象限时间管理 |
| **三观与观念维度** | 向量库 | 世界观、价值观、人生观、恋爱观等 |
| **个人基础属性维度** | MD文档 | 年龄、性别、职业、身高体重等静态信息 |
| **性格与情绪维度** | 向量库 | 性格特质、情绪模式、表达方式等 |
| **偏好与厌恶维度** | 向量库 | 兴趣爱好、喜好倾向、厌恶排斥等 |
| **能力与规划维度** | 混合 | 技能能力(MD)、短期规划(向量)、长期目标(MD) |
| **社交与关系维度** | 向量库 | 亲密关系、亲友关系、同辈关系等 |

### 元数据设计

每条向量记忆包含以下元数据：

```python
{
    "category": "一级大类",           # 7个维度之一
    "importance": "high/medium/low",  # 重要性等级
    "timestamp": "2024-01-01",        # 时间戳
    "date": 1704067200,               # 整数时间戳（用于查询）
    "event_type": "event/memory",     # 类型标识
    "id": "uuid"                      # 唯一标识符
}
```

## 核心组件实现

### 1. 记忆管理Agent

**Memory Manager Agent** 负责记忆的检索和更新，配置如下：

- **模型**: GPT-4o-mini
- **温度**: 0.3（确保事实准确性）
- **工具**: 8个专用记忆管理工具
- **角色**: 记忆管理专家，主动识别和存储用户信息

### 2. 记忆检索流程

```
用户输入 → Memory Retrieve节点 → Memory Manager Agent 
                                      ↓
                              调用查询工具
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    │                                   │
              向量数据库查询                      MD文档读取
                    │                                   │
              语义检索+过滤                        静态档案
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      ↓
                              整合记忆内容
                                      ↓
                              返回给对话流程
```

**检索工具**：
- `query_from_category`: 按类别检索
- `query_from_category_and_time`: 按类别+时间范围检索  
- `query_events`: 按时间类型+重要性检索事件
- `read_user_info`: 读取用户静态档案

### 3. 记忆更新流程

```
对话结束 → Final Output节点 → 异步记忆更新
                                      ↓
                              Memory Manager Agent
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    │                                   │
              识别静态信息                      识别动态信息
                    │                                   │
              edit_user_info                     store_event/store_memory
                    │                                   │
              更新MD文档                         更新向量数据库
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      ↓
                              记忆更新完成
```

**存储工具**：
- `store_event`: 存储事件记忆（带时间戳和重要性）
- `store_memory`: 存储其他类型记忆
- `edit_user_info`: 更新用户静态档案
- `update_memory_content`: 更新已有记忆内容
- `update_memory_importance`: 更新记忆重要性
- `delete_memory`: 删除记忆

## 多智能体协作机制

### 智能体角色分工

系统采用**多智能体协作**模式，每个Agent专注于特定任务，通过LangGraph工作流协调配合：

| Agent | 模型 | 温度 | 主要职责 | 记忆相关功能 |
|-------|------|------|----------|--------------|
| **Memory Manager** | GPT-4o-mini | 0.3 | 记忆检索与更新 | 检索相关记忆、识别并存储新信息 |
| **PlanExecute** | DeepSeek-v3.2 | 0.6 | 理解意图、生成回复 | 使用记忆上下文生成个性化回复 |
| **Evaluator** | DeepSeek-v4-flash | 0.2 | 评估回复质量 | 确保回复与记忆一致性 |
| **Summarizer** | GPT-4o | 0.4 | 最终总结与情绪分析 | 触发异步记忆更新 |

### 协作流程

```
┌─────────────────────────────────────────────────────────────┐
│                    多智能体协作流程                          │
└─────────────────────────────────────────────────────────────┘

用户输入
    ↓
┌───────────────────┐
│ Memory Manager    │ ← 检索相关记忆，构建上下文
│ (记忆检索模式)     │
└────────┬──────────┘
         ↓ 记忆信息
┌───────────────────┐
│ PlanExecute       │ ← 基于记忆生成个性化回复
│ (对话执行模式)     │
└────────┬──────────┘
         ↓ 回复结果
┌───────────────────┐
│ Evaluator         │ ← 评估回复质量和记忆一致性
│ (质量检查模式)     │   最多重试3次
└────────┬──────────┘
         ↓ 最终回复
┌───────────────────┐
│ Summarizer        │ ← 生成最终回复 + 触发异步记忆更新
│ (总结更新模式)     │
└────────┬──────────┘
         ↓
    用户接收
         ↓
┌───────────────────┐
│ Memory Manager    │ ← 异步更新记忆库
│ (记忆更新模式)     │
└───────────────────┘
```

### 记忆在智能体间的传递

```python
# GlobalState中的记忆字段传递
class GlobalState(TypedDict):
    memory: Optional[str]      # Memory Manager检索的记忆
    # 其他智能体通过state["memory"]访问记忆信息
```

**传递链路**：
1. **Memory Manager** → `state["memory"]` → **PlanExecute**
2. **PlanExecute** → 基于记忆生成回复 → **Evaluator**
3. **Evaluator** → 检查记忆一致性 → **Summarizer**
4. **Summarizer** → 触发异步更新 → **Memory Manager**

## 记忆更新与维护机制

### 双模式记忆管理

Memory Manager Agent采用**双模式**设计，通过不同的系统提示词实现检索和更新功能：

#### 检索模式 (memory_manager_system_prompt_find)
- **触发时机**: 每次对话开始时
- **主要任务**: 理解用户意图，检索相关记忆
- **核心策略**:
  - 分析对话主题和关键词
  - 选择合适的检索工具（类别、时间、事件）
  - 整合多维度记忆信息
  - 返回结构化记忆内容

#### 更新模式 (memory_manager_system_prompt_summarize)
- **触发时机**: 对话结束后异步执行
- **主要任务**: 主动识别并存储新信息
- **核心策略**:
  - 扫描对话内容，识别用户信息
  - 区分静态信息和动态信息
  - 选择合适的存储工具
  - 维护记忆库的准确性和完整性

### 记忆更新流程详解

```
对话结束 → Final Output节点
              ↓
         启动异步线程
              ↓
    ┌─────────────────────┐
    │ Memory Manager      │
    │ (更新模式)          │
    └──────────┬──────────┘
               ↓
    ┌─────────────────────┐
    │ 信息识别与分类      │
    └──────────┬──────────┘
               ↓
    ┌─────────────────────┐
    │ 静态信息？          │
    └──┬──────────────┬───┘
       │ 是           │ 否
       ↓              ↓
┌──────────────┐  ┌──────────────┐
│read_user_info│  │分析信息类型  │
│获取现有档案  │  └──────┬───────┘
└──────┬───────┘         │
       │         ┌───────┴───────┐
       │         │事件？  其他？  │
       │         ↓       ↓       │
       │    ┌────────┐ ┌────────┐ │
       │    │store_  │ │store_  │ │
       │    │event   │ │memory  │ │
       │    └────────┘ └────────┘ │
       │         │       │       │
       └─────────┴───────┴───────┘
                 ↓
        ┌────────────────┐
        │ 记忆更新完成    │
        └────────────────┘
```

### 记忆维护策略

#### 1. 主动识别机制
- **实时扫描**: 监控每轮对话内容
- **关键词匹配**: 识别个人信息表达模式
- **上下文理解**: 结合对话历史判断信息重要性

#### 2. 智能分类存储
```python
# 信息类型判断逻辑
if is_static_info(user_input):
    # 静态信息 → MD文档
    if is_new_static_info():
        read_user_info()  # 先读取现有档案
        edit_user_info()  # 整合后更新
elif is_event(user_input):
    # 事件记忆 → 向量库
    store_event(importance=assess_importance())
else:
    # 其他动态记忆 → 向量库
    category = classify_category()
    store_memory(category=category)
```

#### 3. 去重与冲突处理
- **相似度检测**: 避免存储重复信息
- **时间戳比较**: 保留最新信息
- **重要性评估**: 高重要性信息优先保留
- **冲突解决**: 新信息覆盖旧信息

#### 4. 角色信息过滤
```python
# 严格区分用户信息和角色信息
USER_PATTERNS = [
    "我是...", "我叫...", "我的...",  # 用户自称
    "我觉得...", "我想...", "我喜欢..."  # 用户表达
]

ROLE_PATTERNS = [
    "我是[角色名]...", "我是你的...",  #角色自称
    "你可以叫我...", "我的设定是..."  # 角色设定
]

# 只存储匹配USER_PATTERNS的信息
```

### 记忆质量保证

#### 1. 多层验证
- **Agent自我验证**: Memory Manager内部检查信息合理性
- **Evaluator验证**: 检查回复与记忆的一致性
- **用户反馈**: 通过对话质量间接验证记忆准确性

#### 2. 记忆重要性管理
```python
# 重要性等级定义
IMPORTANCE_LEVELS = {
    "high": "关键人生事件、重要决策、核心价值观",
    "medium": "日常经历、一般观点、常规偏好",
    "low": "琐碎小事、临时想法、无关紧要的信息"
}

# 动态调整机制
def update_importance(memory_id, new_importance):
    update_memory_importance(memory_id, new_importance)
```

#### 3. 时效性管理
- **时间衰减**: 远期记忆重要性逐渐降低
- **近期优先**: 检索时优先返回近期记忆
- **定期清理**: 删除过时或低价值记忆

### 异步更新实现

```python
# final_output.py中的异步更新
def update_memory_async(user_input: str, conversation_history: list = None):
    try:
        memory_manager = AgentFactory.create_role_agent(
            "memory_manager",
            tools_for_memory_manager,
            memory_manager_system_prompt_summarize,  # 使用更新模式提示词
        )
        
        messages = []
        if conversation_history:
            messages.extend(conversation_history)
        messages.append(HumanMessage(
            content=f"这是新的用户输入: '{user_input}'\n你不需要对用户输入回应，请你开始更新记忆"
        ))

        response = memory_manager.invoke({"messages": messages})
        logger.info("更新记忆成功")
    except Exception as e:
        logger.error(f"更新记忆失败: {e}")
```

### 记忆一致性保证

1. **状态同步**: 通过GlobalState确保所有Agent访问相同的记忆数据
2. **事务处理**: 记忆更新操作保证原子性
3. **版本控制**: 重要记忆变更保留历史记录
4. **冲突检测**: 检测并解决记忆冲突

## 技术实现细节

### 向量数据库配置

```python
# 使用Chroma向量数据库
db_path = "database/agent/vector_memory.db"
client = chromadb.PersistentClient(path=db_path)
collection = client.get_or_create_collection(name="vector_memory")
```

### 查询策略

1. **类别过滤**: 通过`where={"category": "xxx"}`过滤
2. **时间范围**: 使用整数时间戳进行范围查询
3. **语义检索**: 基于向量相似度返回最相关的结果
4. **重要性排序**: 结合距离和重要性等级

### 记忆更新策略

- **主动识别**: Agent自动扫描对话，识别需要存储的信息
- **分类存储**: 根据信息类型选择合适的存储工具
- **去重处理**: 避免重复存储相同或相似信息
- **角色过滤**: 严格区分用户信息和角色信息，只存储用户真实信息

## 集成到对话流程

### LangGraph状态管理

```python
class GlobalState(TypedDict):
    messages: list[BaseMessage]      # 对话历史
    user_input: str                  # 用户输入
    memory: Optional[str]            # 召回的长期记忆
    # ... 其他状态字段
```

### 对话流程中的记忆节点

```
START → memory_retrieve → plan_execute → evaluate → final_output → END
```

- **memory_retrieve**: 在对话开始前检索相关记忆
- **final_output**: 在对话结束后异步更新记忆

## 优势特点

1. **混合存储**: 结合向量检索和结构化存储的优势
2. **分类清晰**: 7维度分类体系，覆盖用户全方面信息
3. **时序管理**: 支持近期/远期、重要/普通的四象限管理
4. **主动更新**: Agent自动识别和存储新信息
5. **语义检索**: 基于向量相似度的智能检索
6. **灵活查询**: 支持多维度组合查询
7. **持久化存储**: 使用SQLite和Chroma确保持久化
8. **多智能体协作**: 4个专业Agent分工协作，各司其职
9. **双模式记忆管理**: 检索和更新分离，提高效率
10. **异步更新**: 不阻塞主对话流程，用户体验更佳
11. **质量保证**: 多层验证机制确保记忆准确性
12. **智能过滤**: 严格区分用户信息和角色信息

## 文件结构

```
agent/
├── graph/
│   ├── node/
│   │   ├── memory_retrieve.py      # 记忆检索节点
│   │   └── final_output.py         # 记忆更新节点
│   └── state.py                    # 全局状态定义
├── tools/
│   └── tools_for_memory_manager/
│       ├── query_vector_memory.py  # 查询工具
│       ├── store_vector_memory.py  # 存储工具
│       ├── edit_vector_memory.py   # 编辑工具
│       ├── read_user_info.py       # 读取用户档案
│       └── edit_user_info.py       # 编辑用户档案
├── prompt/
│   └── memory_manager_prompt.py    # 记忆管理提示词
└── config/
    └── memory_manager.yaml         # 记忆管理配置

database/agent/
├── vector_memory.db/               # Chroma向量数据库
├── checkpoints.db                  # LangGraph检查点
└── user_info.md                    # 用户静态档案
```

## 总结

该项目的长久记忆实现通过**混合存储架构**和**智能记忆管理Agent**，构建了一个完整的记忆系统。向量数据库提供强大的语义检索能力，Markdown文档提供结构化的静态档案存储，配合Agent的主动识别和分类存储机制，实现了对用户信息的全面管理和智能召回。
