# 云海湾门禁-Dashboard

![version](https://img.shields.io/badge/release-v0.2.0-blue)
![hacs](https://img.shields.io/badge/hacs-default-orange)
![ha-version](https://img.shields.io/badge/HA-2026.5.0%2B-41BDF5)

云海湾虚拟门禁系统的 Home Assistant Lovelace 自定义卡片，复刻虚拟室内机界面。

## 功能

- 显示门口机列表（4 列网格布局，移动端自动适配为 2 列）
- 楼层色彩条区分楼层（1层蓝色、2层紫色、-1层黄色、-2层橙色）
- 门口机状态指示（待机 / 呼叫中 / 当前通话）
- 呼入弹窗自动弹出：显示门口机信息 + 视频画面 + 解锁 / 接听 / 挂断
- 主动监控：点击任意门口机进入实时监控画面
- 楼栋切换支持：覆盖 1 栋 A~E 座、2 栋 A~C 座

## 安装

### 方式一：HACS（推荐）

1. 打开 Home Assistant，进入 **HACS -> 前端**
2. 点击右下角 **⋮ -> 自定义仓库**
3. 填入仓库地址：`https://github.com/CelerPi/HA-UpperCoast-Doorlock-Card`
4. 类别选择：**仪表盘**
5. 在 HACS 前端列表中找到 **云海湾门禁卡片**，点击 **下载**
6. 刷新浏览器（Ctrl + F5 / Cmd + Shift + R）

> 如果已经通过 HACS 安装过旧版本，请点击卡片详情页的 **重新下载** 以获取最新文件。

### 方式二：手动安装

1. 下载本仓库中的 `HA-UpperCoast-DoorLock-Card.js`
2. 将其复制到 Home Assistant 的 `config/www/` 目录下
3. 进入 **设置 -> 仪表盘 -> 右上角 ⋮ -> 资源**
4. 点击 **添加资源**
   - URL：`/local/HA-UpperCoast-DoorLock-Card.js`
   - 资源类型：**JavaScript Module**
5. 保存并刷新浏览器

## 使用

在 Lovelace 仪表盘中进入编辑模式，添加卡片时搜索 **云海湾门禁卡片**，或在 YAML 模式下手动配置：

```yaml
type: custom:doorlock-card
```

### 配置选项

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `type` | string | 是 | - | 固定填写 `custom:doorlock-card` |
| `entity` | string | 否 | `binary_sensor.vds_call_status` | 门禁呼叫状态实体 |
| `camera_entity` | string | 否 | `camera.vds_video` | 门禁视频实体 |

## 依赖

使用本卡片前，请确保以下组件已正确安装并配置：

- **Home Assistant** 2026.5.0 或更高版本
- **[uppercoast_doorlock](https://github.com/CelerPi/HA-UpperCoast-Doorlock)** 集成（Integration）
- **[uppercoast_doorlock](https://github.com/CelerPi/HA-UpperCoast-Doorlock)** Add-on

## 故障排查

### 提示 "Custom element doesn't exist: doorlock-card"

1. 确认已通过 HACS 下载或手动放置了 JS 文件
2. 检查 **设置 -> 仪表盘 -> 资源** 中是否存在对应的 JavaScript Module 资源
3. 强制刷新浏览器缓存（Ctrl + F5 / Cmd + Shift + R）
4. 查看浏览器开发者工具 Console，确认 JS 文件是否 404 或存在加载报错

### HACS 安装后找不到卡片

1. 在 HACS 中点击卡片详情页的 **重新下载**
2. 检查 Home Assistant 日志是否有前端资源加载失败的提示
3. 确认 HACS 版本为最新版

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [HA-UpperCoast-Doorlock](https://github.com/CelerPi/HA-UpperCoast-Doorlock) | 主仓库，安装指南 |
| [HA-UpperCoast-Doorlock-Integration](https://github.com/CelerPi/HA-UpperCoast-Doorlock-Integration) | 集成（Integration）源码 |
| [HA-UpperCoast-DoorLock-Addon](https://github.com/CelerPi/HA-UpperCoast-DoorLock-addon) | Addon 源码 |
| [HA-UpperCoast-DoorLock-Card](https://github.com/CelerPi/HA-UpperCoast-DoorLock-Card) | 本仓库，Dashboard 卡片源码 |

## License

[MIT](LICENSE)
