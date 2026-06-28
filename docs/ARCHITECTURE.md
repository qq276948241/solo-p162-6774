# 麦香社区面包店 · 项目架构漫游指南

## 这个项目是干什么的

这是一个社区面包店的当日预订前端 Demo。目标用户是面包店周边的社区居民——早上想买刚出炉的面包，但又怕热门款到店就卖完了，所以提前一天晚上在手机上下单，第二天早上顺路去取。

核心使用场景非常简单：打开首页看看今天有什么面包 → 把想买的加进购物车 → 选一个明早取货的时间段 → 填手机号提交订单。还有个心愿单功能，可以把还在犹豫的面包先收藏着，想好了再一键加购。没有登录，没有支付，没有后端，刷新之后除了 persist 的数据外都会丢——这就是个纯前端 Demo，够用就行。

---

## 技术选型：为什么是这套

### Vite + React + TypeScript

Vite 图的是快，HMR 秒刷，开发体验丝滑。React 18 配合函数式组件和 hooks 写起来顺手，TS 则是大型项目的安全网——虽然这个 Demo 不大，但类型推断帮我们在 `getRemainingStock` 这种涉及 `cart` 和 `stock` 联合计算的地方避免了好几个潜在 bug。

### Tailwind CSS

手写 CSS 在这种组件多、样式细的项目里很容易变成一团意大利面。Tailwind 把设计语言直接写在组件里，改起来一眼就能看到影响范围。更重要的是我们用 Tailwind 的 `theme.extend` 把整个配色系统收拢到了一个地方（后面会展开讲），这是统一设计语言的关键。

### Zustand 而不是 Redux 或 Context

选 Zustand 的理由很简单：

- **Redux 太重了**。这个项目总共就几个状态字段，为了用 Redux 搞一套 actions/reducers/selectors 的脚手架完全是杀鸡用牛刀。
- **Context 不够用**。Context 本质上是"依赖注入"，不是状态管理工具。每次值变了，所有消费者都会 re-render，在这个项目里购物车数量一变就要刷新所有面包卡片的剩余数，用 Context 性能会很糟糕。
- **Zustand 刚刚好**。一个 `create` 调用搞定 store，`useStore(selector)` 按需订阅，不用 provider 包裹，还自带 `persist` 中间件——正好满足我们"刷新不丢心愿单和购物车"的需求。

### persist 中间件

`zustand/middleware` 自带的 `persist`，底层就是 `localStorage.setItem/getItem`。我们在 `partialize` 里只持久化 `cart`、`wishlistItems` 和 `pickupTime`，其他的（比如 `phone`、`remark`、`orderSubmitted`）属于一次性的，没必要存下来。这样用户关掉页面再打开，购物车和心愿单还在，但不会看到上次填了一半的手机号。

---

## 页面与组件架构

四个页面，一条主线：

```
首页 (/)  ──加购──▶  购物车 (/cart)  ──去结算──▶  订单 (/order)
  │                                                  │
  └──收藏──▶  心愿单 (/wishlist) ──全部加购──▶ 购物车
```

### 组件关系与数据流向

```
App.tsx
 ├── NavBar (读取 cartCount / wishlistCount)
 │
 ├── Home 页
 │    └── BreadCard × N
 │         ├── CardImage (图片 + 爱心 + 售罄遮罩)
 │         ├── CardMeta (名称 + 描述 + 剩余数)
 │         ├── CardFooter (价格 + 加购按钮)
 │         └── useCardInteraction hook (交互副作用)
 │
 ├── Cart 页
 │    ├── QuantityControl (数量加减)
 │    ├── TimeSlotPicker (取货时段选择器)
 │    └── 侧栏结算面板
 │
 ├── Wishlist 页
 │    ├── WishlistCard × N (复用卡片思路，数据源不同)
 │    └── EmptyWishlist (空状态 SVG 插画)
 │
 └── Order 页
      └── 表单 + 商品清单 + 订单摘要
```

数据流向很直接：

```
BREADS (静态 Mock)
     ↓
useBakeryStore ──subscribe──▶ 所有组件
     ↑                              │
     │ addToCart / toggleWishlist    │ 读取 remaining / wishlisted
     └──────────────────────────────┘
```

关键点：`getRemainingStock` 不是存了一个字段，而是每次调用时用 `BREADS[id].stock - cart[id].quantity` 动态算出来的。这样做的好处是——单一数据源，不需要维护一个独立的 `remaining` 状态跟 `stock` 和 `cart` 保持同步。

---

## 设计语言：从感觉落地到代码

### 配色系统

整个项目的配色基调是「温暖手工感」：米白底色像刚出炉的面包芯，焦糖色是主操作色，墨绿做点缀标签。

在 [tailwind.config.js](../tailwind.config.js) 里是这样落地的：

```
colors:
  cream  → 米白底色系列，50/100/200 三个梯度
           #FAF6F0 是 body 背景色，#F3ECE0 做卡片内图片加载区底色

  caramel → 焦糖主色系，50/100/500/600/700
            DEFAULT #A0522D 是按钮和强调色
            600 #8B4513 是 hover 态
            50 #F5E6DC 是浅底背景（选中的导航、输入框浅底）

  forest  → 墨绿点缀，50/500/600
            DEFAULT #2F5D4B 是标签和时段选中态
            50 #E0EDE7 是浅底
```

这套色系在 Tailwind 里直接写成 `bg-cream-100`、`text-caramel-700`、`border-forest` 这样，不用记 hex 值，改起来也只动 config 一个地方。

### 思源宋体的接入

字体通过 Google Fonts 在 [index.html](../index.html) 里加载 `Noto Serif SC`（思源宋体的 Google Fonts 版本），Tailwind config 里 `fontFamily.serif` 设了 fallback 链：

```
"Source Han Serif SC" → "Noto Serif SC" → "SimSun" → serif
```

全局 CSS 里直接用 `font-family: "Noto Serif SC", "Source Han Serif SC", ...` 设在 `:root` 上，整个项目默认就是宋体。

### 交互动效的统一实现

项目里用到的动效就两种：**微弹**和**上浮**，都在 Tailwind config 里注册了对应的 keyframes 和 animation：

- `animate-bounce-sm`：scale 1 → 0.92 → 1，0.3s ease，用于加购按钮和爱心按钮点击时的反馈
- `card-hover`（CSS component class）：`hover:-translate-y-1.5 hover:shadow-lg`，用于卡片悬停上浮

微弹的触发逻辑抽在了 [useCardInteraction.ts](../src/hooks/useCardInteraction.ts) 这个 hook 里，核心就是一个 `triggerBounce` 函数：设 `true`，300ms 后设 `false`，配合 `className` 里的条件判断 `'animate-bounce-sm'` 挂上或移除。这样不管哪个按钮需要微弹，逻辑都是一样的，保持交互语言统一。

---

## Store 设计

### 状态全景

[useBakeryStore](../src/store/useBakeryStore.ts) 里有这几类数据：

| 字段 | 类型 | 持久化 | 说明 |
|------|------|--------|------|
| `cart` | `CartItem[]` | ✅ | 购物车，每项是 `{ breadId, quantity }` |
| `wishlistItems` | `string[]` | ✅ | 心愿单，直接存 breadId 数组 |
| `pickupTime` | `PickupTimeSlot \| null` | ✅ | 选中的取货时段 |
| `phone` | `string` | ❌ | 手机号，一次性 |
| `remark` | `string` | ❌ | 备注，一次性 |
| `orderSubmitted` | `boolean` | ❌ | 订单是否已提交（展示成功页用） |

### 为什么 cart 和 wishlist 不上服务端

因为这个 Demo 没有**后端**。面包库存数据是写死在 [breads.ts](../src/data/breads.ts) 里的 Mock，购物车和心愿单只是前端临时状态。`persist` 中间件把关键数据存到 `localStorage`，关闭页面再打开还在，这对 Demo 来说已经够用了。

如果要上生产，真正需要服务端的是：库存扣减（防止超卖）、订单持久化、手机号验证。这些在这个 Demo 里都不是目标。

### 几个值得注意的设计决策

**`getRemainingStock` 是计算函数，不是存储字段。** 每次调用都从 `BREADS[id].stock - cart[id].quantity` 算出来，不存在"改了 cart 忘了改 remaining"的同步问题。组件通过 `useBakeryStore((s) => s.getRemainingStock(breadId))` 订阅计算结果，store 更新后自动 re-render。

**`addToCart` 用函数式更新。** 这是之前修的一个 bug——批量操作（比如心愿单一键加购）时，如果用 `get()` 拿快照再 `set()`，循环里前一次的 `set` 还没生效，后一次拿到的就是旧数据。改成 `set(state => { ... })` 函数式更新后，每次都能拿到最新 state。

**`toggleItemById` 是个通用工具。** wishlist 的 toggle 逻辑抽成了泛型函数 `toggleItemById<T extends string>`，将来如果别的地方也需要类似的"在不在列表里就加/移除"逻辑，直接复用。

**订阅方式要注意。** `useBakeryStore((s) => s.getRemainingStock)` 订阅的是函数引用，函数本身是稳定的，不会触发 re-render。正确写法是 `useBakeryStore((s) => s.getRemainingStock(breadId))`，直接订阅调用结果。这个坑踩过一次，后来全局统一改了。

---

## 文件目录一览

```
src/
├── components/
│   ├── BreadCard.tsx      ← 卡片主组件 + CardImage / CardMeta / CardFooter
│   ├── NavBar.tsx          ← 全局导航栏
│   ├── QuantityControl.tsx ← 购物车数量加减控件
│   └── TimeSlotPicker.tsx  ← 取货时段胶囊选择器
├── data/
│   └── breads.ts           ← 8 款面包的 Mock 数据
├── hooks/
│   └── useCardInteraction.ts ← 卡片交互副作用（微弹 / 爱心切换）
├── pages/
│   ├── Home.tsx            ← 首页 - 面包卡片网格
│   ├── Cart.tsx            ← 购物车页
│   ├── Wishlist.tsx        ← 心愿单页
│   └── Order.tsx           ← 订单页
├── store/
│   └── useBakeryStore.ts   ← 全局状态（cart / wishlist / pickupTime）
├── types/
│   └── index.ts            ← 类型定义 + 取货时段常量
├── App.tsx                 ← 路由配置
├── main.tsx                ← 入口
└── index.css               ← Tailwind 指令 + 全局样式 + 组件类
```

---

## 后续可以做的事

这份文档写的时候项目还在纯前端 Demo 阶段。如果后面要往生产走，几个方向：

- **库存扣减**：现在库存是静态数据，多个人同时买不会扣减。需要后端接口 + 乐观锁。
- **订单持久化**：提交的订单现在只是前端状态，刷新就没了。需要接后端存储。
- **手机号验证**：现在只做了正则校验，没有短信验证码。
- **图片优化**：目前图片走的是外部 API 生成，加载慢还会有失败的情况。CardImage 里已经加了 `onError` 兜底 SVG，但生产环境应该用 CDN + 压缩图。
