# Vue-Vite-Component-Template



## 功能

- 为 Vue2.6/2.7/3 提供库模式的开发环境
- 为 Vue2/3 提供库模式的测试/构建环境
- 提供 Vue2.7/3 库模式的 dts 解决方案（Vue 2.6 仅部分支持）
- 在发布时用于适配 package.json 的脚本



## 安装

确保先安装依赖：

```bash
# pnpm
pnpm install
```

## 开发

启动开发服务：

```bash
# Vue 2.6.x
pnpm run dev:2
# Vue 2.7.x
pnpm run dev:2.7
# Vue 3
pnpm run dev:3
```

## 构建

构建库用于生产或发布：

```bash
# build all versions
pnpm run build
```

## 如何使用 dist 文件？

```html
<script src="/dist/v3/index.umd.js"></script>
```



## License

Made with 

Published under [MIT License](./LICENSE).
