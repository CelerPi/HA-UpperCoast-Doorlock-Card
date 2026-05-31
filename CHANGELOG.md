# 更新日志

## v0.2.1

- **修复 HACS 列表图标不显示**
  - 新增仓库根目录 `brand/icon.png` 和 `brand/logo.png`
  - 保留原有 `icon.png` 和 `assets/icon.png`，兼容卡片运行时资源

## v0.2.0

- **新版主卡片 UI**
  - 首页改为更清晰的深色玻璃卡片样式
  - 状态从“待机”调整为“在线 / 离线 / 呼叫中 / 通话中”
  - 底部状态改为“门口机 N 台”和“后端已连接 / 后端未连接”
- **支持 UI 直接添加卡片**
  - 新增 `window.customCards` 元数据，可在 HA 仪表盘编辑界面搜索添加
- **WebSocket 实时通道**
  - 优先连接 `/api/uppercoast_doorlock/ws` 获取实时视频帧和音频
  - WebSocket 不可用时自动回退原 HTTP 轮询
- **配置项增强**
  - 新增 `entity` 和 `camera_entity` 配置
  - 修复音频重复启动导致的多 interval / 多麦克风流问题
- **仓库结构整理**
  - `hacs.json` 修正为 `content_in_root: true`
  - 新增 `assets/icon.png`，卡片图标资源随仓库发布

## v0.1.9

- 卡片 header 图标替换为 logo 图片
  - 通过 `import.meta.url` 自动推断 `icon.png` 路径
  - 图片加载失败时优雅回退为 "门禁" 文字

## v0.1.8

- 移除所有 emoji，全面改为纯文字标签
  - 首页按钮、弹窗标题、拨号盘、通话记录、号机网格全部使用文字
  - 通话记录改用彩色状态指示点（呼入蓝 / 呼出绿 / 未接红）+ 文字标签
- 进一步优化 Apple 玻璃拟态 UI 的简洁度

## v0.1.7

- 修复监控视频弹窗关闭后直接回到主页的问题
  - 停止监控后自动返回到号机选择窗口

## v0.1.6

- 同步 Integration 实体 ID 变更，引用：
  - `binary_sensor.vds_call_status`
  - `camera.vds_video`

## v0.1.5

- 同步 Integration 实体 ID 变更，引用 `binary_sensor.vds_call_status`

## v0.1.4

- 增加浏览器 Console 调试日志，方便排查设备数据是否下发
- 监控选择页空状态增加更具体的排查提示

## v0.1.3

- 首页改为紧凑布局，仅保留「对讲」和「监控」两个主按钮
- 对讲弹窗拨号盘改为 3×4 布局（1-9 + 物业/0/删除）
- 物业中心机按钮移入拨号盘最后一行左侧，使用 👮 图标
- 通话记录改为默认隐藏，新增「显示/隐藏通话记录」切换按钮
- 移除独立的「记录」页面标签

## v0.1.2

- 新增双向音频通话支持（Web Audio API，8 kHz / 单声道 / 16-bit little-endian PCM）
- 新增呼入自动弹窗：来电时自动弹出视频画面，支持接听、挂断、解锁
- 新增监控号机选择流程：先选择号机，再进入视频监控画面
- 监控模式支持双向音频
- 优化整体 UI 样式、玻璃拟态效果和动画

## v0.1.1

- 改为从 Integration 动态读取楼栋名称和门口机列表，移除所有硬编码数据
- 新增摄像头实时视频流显示
- 优化状态徽章和呼叫状态展示
- 修复 `Custom element doesn't exist` 加载问题（使用完整 CDN URL 引入 Lit）

## v0.1.0

- 初始版本
- 基础 Home Assistant Lovelace 自定义卡片
- 支持对讲、监控、通话记录三个标签页
- 基础 5×2 拨号盘和呼叫功能
