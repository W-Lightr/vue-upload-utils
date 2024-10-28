# Vue-upload-utils

分片上传组件&上传工具 `支持Vue2和Vue3`

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
  baseUrl: 'http://127.0.0.1:8080', // 上传服务地址
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

## option参数格式

|      参数名称      |   类型   |                             描述                             |
| :----------------: | :------: | :----------------------------------------------------------: |
|     `baseUrl`      |  string  |             服务地址，例：http://127.0.0.1:8080              |
|     uploadUrl      |  string  |             上传文件地址，例：/file/chunk-upload             |
|      mergeUrl      |  string  |                  合并地址，例：/file/merge                   |
|       secUrl       |  string  |              秒传校验地址，例：/file/sec-upload              |
|     singleFile     | boolean  |                       是否上传多个文件                       |
|   `taskFileList`   | object[] |                         上传文件列表                         |
| bindUploadDOMById  |  string  |         上传按钮的DOM元素(一个页面嵌套两个需要更改)          |
| checkChunkUploaded | Function | 和秒传校验地址搭配，校验文件片段是否已上传:function (chunk:Chunk, message:string)  return boolean |
|      maxSize       |  number  |               限制最大上传文件大小（单位：MB）               |
|       accept       | string[] |             限制上传文件类型，例：['jpg','png']              |



















