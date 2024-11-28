<script setup lang="ts">
import  {TaskItem} from '../type'
import {PropType} from 'vue-demi'
import { uploadUtils } from '../utils/common'
import {Uploader} from '../utils/upload'
import defaultIcon from '../static/svg/default.svg';
import pdfIcon from '../static/svg/pdf.svg';
import xlsIcon from '../static/svg/xls.svg';
import docIcon from '../static/svg/doc.svg';
import zipIcon from '../static/svg/zip.svg';
import mp3Icon from '../static/svg/mp3.svg';
import mp4Icon from '../static/svg/mp4.svg';
import imgIcon from '../static/svg/img.svg';

const props = defineProps({
  upload:{
    type: Object as PropType<Uploader>,
    required: true,
  },
  taskItem:{
    type: Object as PropType<TaskItem>,
    required: true,
  }
})
const fileSuffix = props.taskItem.filename.split('.').pop()
//上传
function handleUploadClick(filename: string) {
  props.upload.fileListUtils.resume(filename)
}
//删除
function handleDeleteClick(filename: string) {
  props.upload.fileListUtils.remove(filename)
}
//暂停
function handlePauseClick(filename: string) {
  props.upload.fileListUtils.pause(filename)
}
//重试
function handleRetryClick(filename: string) {
  props.upload.fileListUtils.retry(filename)
}

function getIcon(extension) {
  // 定义文件后缀与图标路径的映射
  const iconMap = {
    pdf: pdfIcon,
    doc:docIcon,
    docx: docIcon,
    xls: xlsIcon,
    xlsx: xlsIcon,
    zip: zipIcon,
    rar: zipIcon,
    mp3: mp3Icon,
    mp4: mp4Icon,
    jpg: imgIcon,
    png: imgIcon,
    jpeg: imgIcon
  };
  // 如果匹配不到，返回默认图标
  return iconMap[extension] || defaultIcon;
}
</script>

<template>
  <div class="flex items-center justify-between p-2 border rounded-lg">
    <div style="flex: 6" class="flex items-center">
      <img :src="getIcon(fileSuffix)" :alt="`icon for ${fileSuffix}`" class="file-icon" />
      <div class=" w-10/12">
        <span :title="props.taskItem.filename" class="text-ellipsiss">{{ props.taskItem.filename }}</span>
      </div>

    </div>
    <div style="flex: 2" class="flex items-center space-x-2">

      <div class="w-full flex items-center text-xs mr-2">
        <svg v-if="props.taskItem.status == uploadUtils.fileStatus.UPLOADING.code" t="1717568323694" class="icon size-5 mr-1" viewBox="0 0 1221 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22317" width="200" height="200"><path d="M629.718504 18.002505C849.043922 18.002505 1026.836015 195.794598 1026.836015 415.102052c0 4.311418-0.053893 8.604871-0.197607 12.880361C1140.819124 473.306193 1221.568387 584.810236 1221.568387 715.140805 1221.568387 885.711273 1083.27966 1024 912.709192 1024H308.859195C138.288727 1024 0 885.711273 0 715.140805c0-136.941409 89.102635-253.044299 212.516971-293.535698-0.053893-2.155709-0.071857-4.311418-0.071857-6.503055C212.445114 195.794598 390.237207 18.002505 609.544661 18.002505h20.173843z" fill="#12EC93" p-id="22318"></path><path d="M629.718504 18.002505C849.043922 18.002505 1026.836015 195.794598 1026.836015 415.102052c0 4.311418-0.053893 8.604871-0.197607 12.880361C1140.819124 473.306193 1221.568387 584.810236 1221.568387 715.140805 1221.568387 885.711273 1083.27966 1024 912.709192 1024H308.859195C138.288727 1024 0 885.711273 0 715.140805c0-136.941409 89.102635-253.044299 212.516971-293.535698-0.053893-2.155709-0.071857-4.311418-0.071857-6.503055C212.445114 195.794598 390.237207 18.002505 609.544661 18.002505h20.173843z" fill="#12EC93" p-id="22319"></path><path d="M907.912739 117.686078c73.24021 72.539605 111.899257 165.809944 116.048997 260.212031C1014.548474 597.421134 833.612639 772.500626 611.790191 772.500626h-1.239533C468.327762 772.500626 342.93736 700.535877 268.745045 591.025864c-88.905029-151.797836-66.180264-348.685918 67.294047-477.220062 159.019461-153.199047 415.027859-151.438552 571.891612 3.880276z" fill="#2AF3A1" p-id="22320"></path><path d="M716.234288 14.840798l0.952105 1.005998a279.954732 279.954732 0 0 1 78.593554 194.858122c0 155.139185-125.749687 280.906836-280.888872 280.906836h-0.844319c-119.264596 0-221.157771-74.336029-261.918634-179.193304 7.167732-78.162413 42.539323-154.402651 105.971058-213.774467C455.555187 7.34971 593.861878-20.458935 716.216324 14.840798z" fill="#51FAB5" p-id="22321"></path><path d="M568.783798 41.625482l1.796424 1.670674a157.995499 157.995499 0 0 1-108.611801 272.751071h-0.485034a158.067356 158.067356 0 0 1-154.31283-123.863442c7.724624-37.239872 27.431396-72.791104 59.156245-101.40814 55.15022-49.796876 132.647955-66.108407 202.456996-49.150163z" fill="#86FFCE" p-id="22322"></path><path d="M588.292964 370.389056c17.40735-14.748642 45.575279-14.748642 62.982629 0l126.162864 107.21059 3.68267 3.55692c14.371393 15.808532 11.838435 38.353655-5.766522 51.557372-17.604956 13.203717-44.245926 12.503112-60.862848-1.580854l-50.120233-42.575251v264.056378c0 20.910377-19.940307 37.850656-44.515389 37.850656-24.593046 0-44.515389-16.940279-44.515389-37.850656V488.432084l-50.263946 42.701c-17.371421 14.78457-45.557315 14.78457-62.928736 0l-3.700634-3.556919c-13.742644-15.071998-12.161791-36.485373 3.700634-49.976519l126.1449-107.21059z" fill="#FFFA06" p-id="22323"></path></svg>
        <svg v-if="props.taskItem.status == uploadUtils.fileStatus.SUCCESS.code" t="1717559768507" class="icon size-5 mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1189" width="200" height="200"><path d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m-50.432-326.101333L310.613333 504.32a32 32 0 0 0-45.226666 45.226667l174.72 174.762666a32.341333 32.341333 0 0 0 0.341333 0.341334l0.256 0.213333a32 32 0 0 0 50.048-6.144l337.450667-379.605333a32 32 0 1 0-47.872-42.496l-318.762667 358.613333z" fill="#52C41A" p-id="1190"></path></svg>
        <svg v-if="props.taskItem.status == uploadUtils.fileStatus.FAIL.code" t="1717559833369" class="icon size-5 mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1345" width="200" height="200"><path d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m44.245333-469.333333l159.914667-159.914667a31.274667 31.274667 0 1 0-44.245333-44.245333L512 467.754667 352.085333 307.84a31.274667 31.274667 0 1 0-44.245333 44.245333L467.754667 512l-159.914667 159.914667a31.274667 31.274667 0 1 0 44.245333 44.245333L512 556.245333l159.914667 159.914667a31.274667 31.274667 0 1 0 44.245333-44.245333L556.245333 512z" fill="#F5222D" p-id="1346"></path></svg>
        <svg v-if="props.taskItem.status == uploadUtils.fileStatus.WAITING.code" t="1717559923939" class="icon size-5 mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4731" width="200" height="200"><path d="M988.16 517.888C988.16 249.0368 774.9632 35.84 506.112 35.84 249.0368 35.84 35.84 249.0368 35.84 517.888c0 257.0752 213.1968 470.272 470.272 470.272 268.8512 0 482.048-213.1968 482.048-470.272z" fill="#10AEFF" p-id="4732"></path><path d="M530.1248 556.032l159.6928 108.032a45.2608 45.2608 0 0 1 14.1312 58.88l20.48-35.4304a45.2608 45.2608 0 0 1-58.0096 17.5616l-179.3024-85.504a40.96 40.96 0 0 1-21.504-24.576 38.656 38.656 0 0 1-13.824-31.3856l12.0832-297.7792a42.8032 42.8032 0 0 1 41.984-40.5504h-29.4912c22.272 0 41.1136 18.2784 41.984 40.5504l11.776 290.2016z" fill="#FFFFFF" p-id="4733"></path></svg>
        <svg v-if="props.taskItem.status == uploadUtils.fileStatus.PARSING.code" t="1717564363780" class="icon size-5 mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6856" width="200" height="200"><path d="M851.017143 556.525714a27.428571 27.428571 0 0 1 19.931428 33.28C831.542857 747.154286 689.554286 859.428571 525.092571 859.428571A356.717714 356.717714 0 0 1 210.834286 671.597714l-10.422857 45.129143a27.428571 27.428571 0 0 1-30.281143 21.028572l-2.596572-0.475429a27.428571 27.428571 0 0 1-21.028571-30.299429l0.475428-2.596571 22.710858-98.377143a45.714286 45.714286 0 0 1 54.820571-34.267428c19.382857 4.48 35.510857 9.161143 53.997714 15.396571l38.582857 13.348571c4.352 1.408 5.449143 1.554286 9.673143 2.523429a27.428571 27.428571 0 0 1-12.342857 53.449143 210.56 210.56 0 0 1-17.188571-4.827429l-7.314286-2.413714-20.059429-7.04c-5.302857-1.865143-10.313143-3.565714-15.177142-5.138286a301.842286 301.842286 0 0 0 563.017142-60.580571 27.428571 27.428571 0 0 1 33.298286-19.931429zM504.283429 164.571429a356.717714 356.717714 0 0 1 314.221714 187.812571l10.404571-45.092571a27.428571 27.428571 0 0 1 30.281143-21.028572l2.614857 0.475429a27.428571 27.428571 0 0 1 21.028572 30.281143l-0.475429 2.614857-22.710857 98.377143a45.714286 45.714286 0 0 1-54.838857 34.249142 541.878857 541.878857 0 0 1-53.979429-15.378285l-37.540571-13.001143c-5.248-1.737143-6.180571-1.828571-10.715429-2.870857a27.428571 27.428571 0 0 1 12.342857-53.467429c5.412571 1.261714 10.916571 2.816 17.188572 4.827429l9.874286 3.309714 17.499428 6.162286c5.302857 1.846857 10.294857 3.547429 15.158857 5.12a301.878857 301.878857 0 0 0-563.017143 60.580571 27.428571 27.428571 0 0 1-53.211428-13.330286C197.814857 276.845714 339.785143 164.571429 504.265143 164.571429z" fill="#1296db" p-id="6857"></path></svg>
        <span :title="props.taskItem.statusText" class="no-wrap"> {{props.taskItem.statusText}}</span>
      </div>

      <!--进度条-->
      <div class="w-full bg-gray-200 rounded-lg min-w-20 overflow-hidden" v-show="props.taskItem.status == uploadUtils.fileStatus.UPLOADING.code || props.taskItem.status == uploadUtils.fileStatus.PAUSE.code">
        <div :class="{
       'bg-green-500': props.taskItem.status === uploadUtils.fileStatus.UPLOADING.code,
       'bg-gray-500': props.taskItem.status === uploadUtils.fileStatus.PAUSE.code
     }" class="rounded-lg text-xs leading-none py-1 text-center text-white" :style="{width: props.taskItem.percentage+'%'}"><span class="ml-2">{{props.taskItem.percentage}}%</span></div>
      </div>
      <!--速度-->
      <div v-show="props.taskItem.status == uploadUtils.fileStatus.UPLOADING.code" class="text-xs">{{props.taskItem.speed}}</div>
      <div class="cursor-pointer" @click="handleUploadClick(props.taskItem.filename)" v-show="props.taskItem.status == uploadUtils.fileStatus.PAUSE.code">
        <!--开始-->
        <svg t="1717145999458" class="icon size-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2112" width="200" height="200"><path d="M400.43759 732.273456a71.33239 71.33239 0 0 0 34.157473 8.810938 75.556813 75.556813 0 0 0 41.157944-12.069778l219.790665-144.837341a85.574729 85.574729 0 0 0 38.502593-72.418671 83.402169 83.402169 0 0 0-37.295615-70.608203l-221.842527-144.837341a72.41867 72.41867 0 0 0-74.591231-3.741631 84.488449 84.488449 0 0 0-41.761433 75.436115v289.674681a84.488449 84.488449 0 0 0 41.882131 74.591231z m42.002829-82.315889V374.163131l207.600188 135.664309v0.965582a13.156058 13.156058 0 0 1 0 2.293258z" fill="#4D4D4D" p-id="2113"></path><path d="M149.989688 874.093352a509.948138 509.948138 0 1 0-109.714286-162.700613 513.206978 513.206978 0 0 0 109.714286 162.700613zM84.571489 512a428.11504 428.11504 0 1 1 427.511551 428.11504A428.597831 428.597831 0 0 1 84.571489 512z" fill="#4D4D4D" p-id="2114"></path></svg>
      </div>
      <div class="cursor-pointer" @click="handlePauseClick(props.taskItem.filename)" v-show="props.taskItem.status == uploadUtils.fileStatus.UPLOADING.code">
        <!--暂停-->
        <svg t="1717145983862" class="icon size-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1957" width="200" height="200"><path d="M874.058005 149.941995a510.06838 510.06838 0 1 0 109.740156 162.738976 511.396369 511.396369 0 0 0-109.740156-162.738976z m66.278708 362.178731A428.336713 428.336713 0 1 1 512 83.663287a428.698892 428.698892 0 0 1 428.336713 428.336713z" fill="#4D4D4D" p-id="1958"></path><path d="M417.954256 281.533601a41.046923 41.046923 0 0 0-41.77128 40.201839v385.116718a41.892007 41.892007 0 0 0 83.663287 0v-385.116718a41.167649 41.167649 0 0 0-41.892007-40.201839zM606.045744 281.533601a41.046923 41.046923 0 0 0-41.77128 40.201839v385.116718a41.892007 41.892007 0 0 0 83.663287 0v-385.116718a41.167649 41.167649 0 0 0-41.892007-40.201839z" fill="#4D4D4D" p-id="1959"></path></svg>
      </div>
      <!--重试-->
      <div class="cursor-pointer" @click="handleRetryClick(props.taskItem.filename)" v-show="props.taskItem.status == uploadUtils.fileStatus.FAIL.code">
        <svg t="1717745395082" class="icon size-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6736" width="200" height="200"><path d="M361 361H237.65C291 263.66 393.71 197.29 512.48 197.29c156.42 0 285.53 114.85 309.76 264.38h88.83a398.38 398.38 0 0 0-28.32-106.12C796.27 151.05 560.51 55 355.51 140.68 297.76 165.09 249 202.21 210 247v-87.33l-100.67-0.23 1.15 302.41 250.52-0.18z m553.66 503.56l-1.15-302.42-250.51 0.19V663h123.35C733 760.33 630.28 826.71 511.52 826.71c-156.42 0-285.52-114.85-309.77-264.38h-88.82a398.38 398.38 0 0 0 28.32 106.12C227.73 873 463.49 969 668.49 883.32 726.25 858.91 775 821.78 814 777v87.33z" fill="#484948" p-id="6737"></path></svg>
      </div>
      <div class="cursor-pointer" @click="handleDeleteClick(props.taskItem.filename)" v-show="props.taskItem.status != uploadUtils.fileStatus.UPLOADING.code">
        <!--删除-->
        <svg t="1717146016587" class="icon size-4" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2267" width="200" height="200"><path d="M446.824314 513.714078L13.647658 947.300164a45.173747 45.173747 0 0 0 0 63.598085 46.129083 46.129083 0 0 0 63.598085 0L510.422399 577.312163l433.586086 433.586086a45.037271 45.037271 0 0 0 63.598085-63.598085L574.020484 513.714078 1007.60657 79.991515A45.037271 45.037271 0 1 0 944.008485 16.939336L510.422399 450.115993 76.699836 16.939336A45.037271 45.037271 0 0 0 13.647658 79.991515z" fill="#4D4D4D" p-id="2268"></path></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-ellipsiss {
  display: -webkit-box;        /* 设置为弹性盒模型 */
  -webkit-box-orient: vertical; /* 垂直布局 */
  -webkit-line-clamp: 1;       /* 限制为 3 行 */
  overflow: hidden;            /* 隐藏超出的内容 */
  text-overflow: ellipsis;     /* 超出部分显示省略号 */
  line-height: 1.5;            /* 行高，可以根据需要调整 */
  max-height: calc(1.5em * 1); /* 确保容器高度限制为 3 行内容 */
}
.no-wrap {
  white-space: nowrap;       /* 禁止换行 */   /* 隐藏超出容器的内容 */
  text-overflow: ellipsis;   /* 超出部分显示省略号 */
  max-width: 100%;           /* 设置容器宽度 */
  display: inline-block;     /* 保证内容正常布局 */
}
.file-icon {
  width: 28px; /* 根据需求调整大小 */
  height: 28px;
}
</style>
