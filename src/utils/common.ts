import sparkMD5 from 'spark-md5'
import {TaskItem} from "../type";
import {deleteFile} from './upload'

export const uploadUtils = {
  //MB转字节
  translateMBToByte(size: any) {
    return size * 1024 * 1024
  },
  translateFileSize(fileSize: any) {
    const KB_STR = 'K'
    const MB_STR = 'M'
    const GB_STR = 'G'
    const UNIT = 1024
    let fileSizeSuffix = KB_STR
    fileSize = fileSize / UNIT
    if (fileSize >= UNIT) {
      fileSize = fileSize / UNIT
      fileSizeSuffix = MB_STR
    }
    if (fileSize >= UNIT) {
      fileSize = fileSize / UNIT
      fileSizeSuffix = GB_STR
    }
    return fileSize.toFixed(2) + fileSizeSuffix
  },
  // 当前文件状态list
  fileStatus: {
    PARSING: {
      code: 1,
      text: '解析中',
    },
    WAITING: {
      code: 2,
      text: '等待上传',
    },
    UPLOADING: {
      code: 3,
      text: '正在上传',
    },
    PAUSE: {
      code: 4,
      text: '暂停上传',
    },
    SUCCESS: {
      code: 5,
      text: '上传成功',
    },
    FAIL: {
      code: 6,
      text: '上传失败',
    },
    MERGE: {
      code: 7,
      text: '服务器处理中',
    },
  },
  translateTime(timeRemaining: any) {
    // 计算耗时
    if (!timeRemaining || Number.POSITIVE_INFINITY === timeRemaining) {
      return '--:--:--'
    }
    let timeRemainingInt = Number.parseInt(timeRemaining),
      hNum = Math.floor(timeRemainingInt / 3600),
      mNum = Math.floor((timeRemainingInt / 60 % 60)),
      sNum = Math.floor((timeRemainingInt % 60)),
      h = hNum < 10 ? '0' + hNum : hNum,
      m = mNum < 10 ? '0' + mNum : mNum,
      s = sNum < 10 ? '0' + sNum : sNum
    return h + ':' + m + ':' + s
  },
  translateSpeed(byteSpeed:string) {
    return `${uploadUtils.translateFileSize(byteSpeed)}/s`
  },
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },
  MD5(file: File, callback:Function) {
    // 文件切片方法，兼容不同浏览器 File.prototype.mozSlice || File.prototype.webkitSlice
    const blobSlice = File.prototype.slice
    const file1 = file
    const chunkSize = 1024 * 1024 * 5 // 每个切片的大小
    const chunks = Math.ceil(file1.size / chunkSize) // 需要切分的切片数
    let currentChunk = 0 // 当前处理的切片编号
    const spark = new sparkMD5.ArrayBuffer() // MD5计算工具实例
    const fileReader = new FileReader() // 文件读取器

    fileReader.onload = function (e:any) {
      spark.append(e.target.result) // 将读取的数据用于MD5计算
      currentChunk++
      if (currentChunk < chunks) {
        loadNext() // 加载下一个切片
      }
      else {
        callback(null, spark.end()) // 计算完成，回调返回MD5值
      }
    }

    fileReader.onerror = function () {
      callback('[文件读取失败]oops, something went wrong.') // 文件读取失败，回调返回错误信息
    }

    /**
     * 加载并读取下一个文件切片。
     */
    function loadNext() {
      const start = currentChunk * chunkSize // 当前切片的起始位置
      const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize // 当前切片的结束位置
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end)) // 读取文件切片
    }

    loadNext() // 开始处理第一个文件切片
  },
}
