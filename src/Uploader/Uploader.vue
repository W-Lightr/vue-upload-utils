<template>
  <div class="p-4">
    <!-- Upload Section -->
    <div class="flex items-center space-x-2">
      <button :id="option.bindUploadDOMById" class="flex items-center px-4 py-2 border rounded-lg text-blue-500 border-blue-500">
        <svg t="1717124984850" class="icon size-5 mr-1 fill-blue-500" viewBox="0 0 1024 1024" version="1.1"
             xmlns="http://www.w3.org/2000/svg" p-id="5290" width="200" height="200">
          <path
              d="M833.47 337.03C804.22 187.15 672.62 73.83 511.77 73.83c-160.84 0-292.44 113.32-321.69 263.2C80.42 366.28 0 468.63 0 585.61c0 142.57 113.32 255.9 255.89 255.9h36.56v-73.12h-36.56c-102.35 0-182.78-80.42-182.78-182.78 0-102.35 80.42-182.78 182.78-182.78 0-142.57 113.32-255.89 255.89-255.89s255.9 113.32 255.9 255.89c102.35 0 182.78 80.42 182.78 182.78s-80.42 182.78-182.78 182.78h-36.56v73.12h36.56c142.57 0 255.89-113.33 255.89-255.9-0.01-116.98-80.44-219.33-190.1-248.58z m0 0"
              p-id="5291"></path>
          <path
              d="M544.68 486.91c-14.63-10.97-29.24-14.63-43.87-7.31-3.65 0-7.31 3.65-10.97 7.31L380.17 592.92c-14.62 14.63-14.62 36.56 0 51.18 14.63 14.63 40.21 14.63 54.84 0l43.86-40.21v310.73c0 21.93 18.28 36.55 36.56 36.55 21.93 0 36.55-18.27 36.55-36.55V603.88l43.87 40.21c14.62 14.63 40.21 14.63 54.83 0 14.63-14.62 14.63-36.55 0-51.18l-106-106z m0 0"
              p-id="5292"></path>
        </svg>
        <div class="hidden sm:block">点击上传</div>
      </button>
      <span class="text-zinc-500 text-ellipsis">{{ desc }}</span>
    </div>
    <div class="mt-4 space-y-2">
      <template v-for="(item,index) in props.option.taskFileList" :key="index">
        <FileItem :task-item="item" :upload="upload" :index="index"/>
      </template>
      <button @click="handleUploadAllClick" v-show="props.option.taskFileList?.length>0 && !autoUpload"
              class="inline-flex items-center px-3 py-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
        上传
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">

import {onMounted, PropType, ref, watch} from "vue-demi";
import {Uploader} from '../utils/upload'
import {options} from '../type'
import FileItem from "./FileItem.vue";

const props = defineProps({
  desc: {
    type: String,
    default: () => {
      return '支持扩展名: .rar .zip .doc .docx .pdf .jpg, 单个文件不超过10Mb。'
    }
  },
  autoUpload: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  option: {
    type: Object as PropType<options>,
    default: () => {
      return {}
    }
  }
})
//upload对象
let upload:Uploader;

if (!props.option.bindUploadDOMById){
  props.option.bindUploadDOMById = 'uploader'
}
if (!props.option.mergeUrl){
  props.option.mergeUrl = '/file/merge'
}
//使用watch监听，监听fileList的变化
watch(() => props.option.taskFileList.length, (newValue, oldValue) => {
  if (props.autoUpload) {
    this?.upload.uploadAllSubmit();
  }
}, {immediate: true});

//上传所有文件
function handleUploadAllClick() {
  upload.uploadAllSubmit()
}

onMounted(() => {
  upload = new Uploader()
  upload.initUpload(props.option)
  // console.log(upload)

})
</script>
<style scoped>
.text-ellipsis {
  display: -webkit-box;        /* 设置为弹性盒模型 */
  -webkit-box-orient: vertical; /* 垂直布局 */
  -webkit-line-clamp: 2;       /* 限制为 3 行 */
  overflow: hidden;            /* 隐藏超出的内容 */
  text-overflow: ellipsis;     /* 超出部分显示省略号 */
  line-height: 1.5;            /* 行高，可以根据需要调整 */
  max-height: calc(1.5em * 2); /* 确保容器高度限制为 3 行内容 */
}
</style>
