<script lang="ts" setup>
import {reactive} from 'vue-demi'
import {options, TaskItem} from "./type";
import {Uploader} from "./Uploader";
const fileList:TaskItem = reactive([]);
const fileList1:TaskItem = reactive([]);
const fileList2:TaskItem = reactive([]);
const op :options= {
  baseUrl: 'http://172.18.113.97:10847', // 上传地址
  // uploadUrl: '/file/chunk-upload', // 上传文件地址
  // secUrl: '/file/sec-upload', // 秒传地址
  // deleteUrl: '/file/delete', // 秒传地址
  // deleteFile: true, // 秒传地址
  // mergeUrl: '/file/merge', // 合并文件地址
  bindUploadDOMById: 'uploader', // 绑定上传按钮的DOM元素ID
  taskFileList: fileList, // 上传文件列表
  singleFile:false
  // accept: ['jpg','png','docx','pdf'],
  // maxSize: 10,
}
const op1 :options= {
  baseUrl: 'http://172.18.113.97:10847', // 上传地址
  // uploadUrl: '/file/chunk-upload', // 上传文件地址
  // secUrl: '/file/sec-upload', // 秒传地址
  // deleteUrl: '/file/delete', // 秒传地址
  // deleteFile: true, // 秒传地址
  // mergeUrl: '/file/merge', // 合并文件地址
  bindUploadDOMById: 'uploader1', // 绑定上传按钮的DOM元素ID
  taskFileList: fileList1, // 上传文件列表
  singleFile:false
  // accept: ['jpg','png','docx','pdf'],
  // maxSize: 10,
}
const op2 :options= {
  baseUrl: 'http://172.18.113.97:10847', // 上传地址
  // uploadUrl: '/file/chunk-upload', // 上传文件地址
  // secUrl: '/file/sec-upload', // 秒传地址
  // deleteUrl: '/file/delete', // 秒传地址
  // deleteFile: true, // 秒传地址
  // mergeUrl: '/file/merge', // 合并文件地址
  bindUploadDOMById: 'uploader2', // 绑定上传按钮的DOM元素ID
  taskFileList: fileList2, // 上传文件列表
  singleFile:false
  // accept: ['jpg','png','docx','pdf'],
  // maxSize: 10,
}
</script>

<template>
  <div>
    <div class="template-component">
      <Uploader :auto-upload="false" :option="op" desc="1支持扩展名: .rar .zip .doc .docx .pdf .jpg, 单个文件不超过10Mb。"/>
      <Uploader :auto-upload="false" :option="op1" desc="2支持扩展名: .rar .zip .doc .docx .pdf .jpg, 单个文件不超过10Mb。"/>
      <Uploader :auto-upload="false" :option="op2" desc="3支持扩展名: .rar .zip .doc .docx .pdf .jpg, 单个文件不超过10Mb。"/>
    </div>
  </div>
</template>

<style scoped>
.template-component {
  color: #2c3e50;
}
</style>
