# Vue-upload-utils

分片上传组件&上传工具

## 默认组件示例

1.内置默认上传组件

[![pkIaehD.png](https://s21.ax1x.com/2024/07/16/pkIaehD.png)](https://imgse.com/i/pkIaehD)

## 使用示例

```vue
<script setup>
import {reactive} from "vue";
import {Uploader} from "vue-upload-utils";
const fileList = reactive([]);
const op= {
  url: 'http://127.0.0.1:8080/file/chunk-upload', // 上传地址
  mergeUrl: 'http://127.0.0.1:8080/file/merge', // 合并文件地址
  secUrl: 'http://127.0.0.1:8080/file/sec-upload', // 秒传校验
  bindUploadDOMById: 'uploader', // 绑定上传按钮的DOM元素ID 默认 uploader
  taskFileList: fileList, // 上传文件列表
}
</script>
<template>
  <Uploader :auto-upload="true" :option="op" desc="支持扩展名: .rar .zip .doc .docx .pdf .jpg, 单个文件不超过10Mb。"/>
</template>
```

main.js

```bash
import 'vue-upload-utils/style.css'
```

option参数格式

```js
export interface options {
    url: string, // 上传地址
    mergeUrl?: string, // 合并地址
    secUrl?: string, // 秒传校验地址
    singleFile?: boolean, // 是否上传多个文件
    chunkSize?: number, // 分块大小
    simultaneousUploads?:number, // 同时上传的文件片段数量
    checkChunkUploaded?: Function, // 检查文件片段是否已上传
    maxChunkRetries?: number, // 最大重试次数
    bindUploadDOMById: string, // 绑定上传按钮的DOM元素
    taskFileList: any[], // 上传文件列表
    filesAdded?:Function, // 文件添加时的回调
    fileSuccess?:Function, // 文件上传成功的回调
    fileProgress?:Function, // 文件上传进度的回调
    fileError?:Function, // 文件上传进度的回调
    secUpload?:Function, // 前提：手使用默认fileSuccess 秒传检测的回调，在这里发送秒传请求
    doMerge?:Function, // 前提 使用默认fileProgress合并请求的回调,在这里发送合并请求
}
```

