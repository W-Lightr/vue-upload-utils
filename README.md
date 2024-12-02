# Vue-upload-utils

![visitors](https://visitor-badge.laobi.icu/badge?page_id=vue-upload-utils)  ![Static Badge](https://img.shields.io/badge/vue-2.x-brightgreen)  ![Static Badge](https://img.shields.io/badge/vue-3.x-brightgreen) 

分片上传组件&上传工具 `支持Vue2和Vue3`

## 默认组件示例

内置默认上传组件

[![pkIaehD.png](https://s21.ax1x.com/2024/07/16/pkIaehD.png)](https://imgse.com/i/pkIaehD)

## 使用示例

安装

```bash
npm i vue-upload-utils
```

main.js

```bash
import 'vue-upload-utils/style.css'
```

vue：

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

## option参数格式

|      参数名称      |   类型   |                             描述                             |
| :----------------: | :------: | :----------------------------------------------------------: |
|     `baseUrl`      |  string  |             服务地址，例：http://127.0.0.1:8080              |
|     uploadUrl      |  string  |             上传文件地址，例：/file/chunk-upload             |
|      mergeUrl      |  string  |                  合并地址，例：/file/merge                   |
|       secUrl       |  string  |              秒传校验地址，例：/file/sec-upload              |
|   `taskFileList`   | object[] |                         上传文件列表                         |
| bindUploadDOMById  |  string  |         上传按钮的DOM元素(一个页面嵌套两个需要更改)          |
| checkChunkUploaded | Function | 和秒传校验地址搭配，校验文件片段是否已上传:function (chunk:Chunk, message:string)  return boolean |
|      maxSize       |  number  |               限制最大上传文件大小（单位：MB）               |
|       accept       | string[] |             限制上传文件类型，例：['jpg','png']              |
|     deleteUrl      |  string  |         文件删除地址（有值就会调用）例：/file/delete         |
|     deleteFile     | boolean  | 该值会被传入后端，用于判断是否删除真实文件，搭配`deleteUrl`参数使用 |



## 自定义组件示例

```vue
<template>
  <div>
    <div class="bt" id="upBtn">上传文件</div>
    <br />
    <table>
      <thead>
      <tr>
        <th>序号</th>
        <th>文件名</th>
        <th>文件大小</th>
        <th>状态</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(file, index) in fileList" :key="file.id">
        <td>{{ index + 1 }}</td>
        <td>{{ file.filename }}</td>
        <td>{{ file.fileSize }}</td>
        <td>{{ file.statusText }}</td>
      </tr>
      </tbody>
    </table>
    <button v-show="fileList.length > 0" style="padding: 2px; border: 1px solid #ccc;" @click="uploadFile">
      开始上传
    </button>
  </div>
</template>

<script>
import { UploaderObject } from 'vue-upload-utils';

export default {
  data() {
    return {
      fileList: [], // 初始化文件列表
      upload: null
    };
  },
  mounted() {
    const op = {
      baseUrl: 'http://127.0.0.1:8080', // 上传地址
      bindUploadDOMById: 'upBtn', // 绑定上传按钮的DOM元素ID
      taskFileList: this.fileList // 上传文件列表
    };
    // 初始化上传功能
    this.upload = new UploaderObject()
    this.upload.initUpload(op);

    // 监听 fileList 的变化
    this.$watch('fileList', (newVal, oldVal) => {
      console.log(newVal);
    });
  },
  methods: {
    uploadFile() {
      this.upload.uploadAllSubmit();
    }
  }
};
</script>

<style scoped>
.bt {
  border: 1px solid #ccc;
  padding: 0.75rem;
  margin-bottom: 1rem;
}
</style>

```





## 后端服务

可以参考下面后端服务来测试。

github:https://github.com/W-Lightr/fileUpload









