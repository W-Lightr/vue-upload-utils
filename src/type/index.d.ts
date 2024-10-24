export interface options {
    url: string, // 上传地址
    mergeUrl?: string, // 合并地址
    secUrl?: string, // 秒传校验地址
    deleteUrl?: string, //删除文件地址
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
export interface Chunk{
    chunkSize: number,
    endByte: number,
    loaded: number,
    offset: number,
    pendingRetry: boolean,
    preprocessState: number,
    readState: number,
    retries: number,
    startByte: number,
    tested: boolean,
    total: number
}
export interface TaskItem{
    target: File,
    filename: string,
    fileSize: string,
    uploadedSize: string,
    status: number,
    statusText: string,
    timeRemaining: string,
    speed: string,
    percentage: number,
    parentId: string,
    fileId: string,
    realPath: string,
}
