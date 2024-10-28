import { uploadUtils, getTaskFileList,setTaskFileList, fileListUtils } from './common'
import {options,Chunk,TaskItem} from '../type'
import utils from "simple-uploader.js";

// 一些配置
const blockSize = 1024 * 1024 * 5 // 5MB 分块大小   minio最低合并大小是5MB
// 配置文件
let uploader
export let optionsArg:options
// 任务对象

export function initUpload(options:options):any {
    optionsArg = options
    //一些条件
    if (!optionsArg.url){
        console.error('请设置上传接口 url')
        return
    }
    if (!optionsArg.doMerge){
        if (!optionsArg.mergeUrl){
            console.error('请设置合并文件接口 mergeUrl 或者提供doMerge函数')
            return
        }
    }
    options.chunkSize?options.chunkSize = blockSize:options.chunkSize = blockSize
    //限制文件类型
    let accepts;
    if (options.accept){
        accepts = options.accept.map(item => `.${item}`).join(', ');
    }
    // 初始化配置
    const fileOptions = {
        // 根据文件片段大小决定上传目标URL
        target(file:File, chunk:number) {
            return options.url
        },
        // 单文件上传
        singleFile: options.singleFile?options.singleFile:true,
        // 设置文件片段大小
        chunkSize: options.chunkSize,
        // 强制设置文件片段大小，此处设置为false
        forceChunkSize: false,
        // 同时上传的文件片段数量  simultaneousUploads为空则默认3
        simultaneousUploads: options.simultaneousUploads? options.simultaneousUploads : 4,
        // 文件参数名
        fileParameterName: 'file',
        // 上传查询参数，此处为空
        query(file:File, chunk:number) {
            return {}
        },
        // 根据响应检查文件片段是否已上传 对应上传地址GET方法
        checkChunkUploadedByResponse: function (chunk:Chunk, message:string) {
            // 检查当前片段是否已上传
            if (options.checkChunkUploaded) {
                return options.checkChunkUploaded(chunk,message)
            }
            // message 接口响应  chunk 分片对象
            let objMessage
            try {
                objMessage = JSON.parse(message)
            }
            catch (e) {
                // 解析响应消息为JSON，失败时objMessage保持为空对象
            }
            return (objMessage.data.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0
        },
        // 最大重试次数，设置为0表示不重试
        maxChunkRetries: options.maxChunkRetries?options.maxChunkRetries:3,
        // 片段重试间隔，null表示无间隔
        chunkRetryInterval: null,
        // 进度回调间隔
        progressCallbacksInterval: 500,
        // 成功上传的状态码列表
        successStatuses: [200, 201, 202],
        // 永久性错误状态码列表
        permanentErrors: [404, 415, 500, 501],
        // 上传初始状态是否暂停
        initialPaused: false,
        //withCredentials
        withCredentials: options.withCredentials?options.withCredentials:false,
    }
    // 实例化上传对象
    uploader = new utils(fileOptions)
    // 绑定上传DOM
    uploader.assignBrowse(
        document.getElementById(options.bindUploadDOMById),
        false,
        options.singleFile?options.singleFile:true,
        {
            accept: accepts?accepts:"*",
        }
    )
    uploader.assignDrop(document.getElementById(options.bindUploadDOMById))
    // 添加文件监听
    uploader.on('filesAdded', options.filesAdded? options.filesAdded : filesAdded)
    // 上传成功监听
    uploader.on('fileSuccess', options.fileSuccess? options.fileSuccess : fileUploaded)
    // 上传进度，上传完一个分片调用一次
    uploader.on('fileProgress', options.fileProgress? options.fileProgress : uploadProgress)
    //上传失败
    uploader.on('fileError', options.fileError? options.fileError : uploadError)
    //绑定上传文件列表
    setTaskFileList(options.taskFileList)
    // console.log("fileList",this.taskFileList)
    return uploader;
}

// 添加文件后的操作
function filesAdded(files:Array<any>, fileList:Array<File>, event:Event) {
    files.forEach((f) => {
        //判断当前文件是否存在于列表中
        if (fileListUtils.getTask(f.name)) {
            fileListUtils.removeTarget(f.name)
            return
        }
        //判断文件后缀是否有限制
        if (optionsArg.accept){
            const fileSuffix = f.name.split('.').pop()
            if (!optionsArg.accept.includes(fileSuffix)) {
                console.error('文件格式不正确，请上传'+optionsArg.accept.join('/')+'格式的文件')
                return
            }
        }
        // id
        const uuid = uploadUtils.generateUUID()
        // 定义数据的结构
        const taskItem:TaskItem = {
            target: f,
            filename: f.name,
            fileSize: uploadUtils.translateFileSize(f.size),
            uploadedSize: uploadUtils.translateFileSize(0),
            status: uploadUtils.fileStatus.WAITING.code,
            statusText: uploadUtils.fileStatus.WAITING.text,
            timeRemaining: uploadUtils.translateTime(Number.POSITIVE_INFINITY),
            speed: uploadUtils.translateSpeed(f.averageSpeed),
            percentage: 0,
            parentId: uuid,
            fileId: "",
            realPath: "",
        }
        fileListUtils.add(taskItem)
    })
}
// 上传操作
export function uploadAllSubmit() {
    try {
        const taskFileList = getTaskFileList();
        const upFiles = taskFileList.filter((f:any) => {
            if (f.status == uploadUtils.fileStatus.WAITING.code) {
                return true
            }
            return false
        })
        uploadSingleSubmit(upFiles[0])
    }
    catch (e) {}
}

//上传单个文件
export function uploadSingleSubmit(taskItem:TaskItem) {
    try {
        const f:any = taskItem.target
        // 解析文件状态
        fileListUtils.updateStatus(
            {
                filename: f.name,
                status: uploadUtils.fileStatus.PARSING.code,
                statusText: uploadUtils.fileStatus.PARSING.text,
            },
        )
        // MD5解析
        uploadUtils.MD5(f.file, (e:any, md5:string) => {
            f.uniqueIdentifier = md5
            // 通过MD5校验是否秒传,这里还需要手动控制是否继续上传 f.resume()
            if (optionsArg.secUpload){
                optionsArg.secUpload(f,md5)
            }else {
                if (optionsArg.secUrl){
                    //有校验秒传地址就使用
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', optionsArg.secUrl, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            // 请求成功
                            var response = JSON.parse(xhr.responseText);
                            if (response.data.result) {
                                fileListUtils.updateProcess({
                                    filename: f.name,
                                    speed: uploadUtils.translateSpeed(f.averageSpeed),
                                    percentage: 100,
                                    uploadedSize: uploadUtils.translateFileSize(f.sizeUploaded()),
                                    timeRemaining: uploadUtils.translateTime(f.timeRemaining()),
                                })
                                // 更新状态
                                fileListUtils.updateStatus({
                                    filename: f.name,
                                    status: uploadUtils.fileStatus.SUCCESS.code,
                                    statusText: uploadUtils.fileStatus.SUCCESS.text,
                                })
                            } else {
                                // 需要上传
                                fileListUtils.retry(f.name)
                            }
                        }
                    }
                    // 设置请求发生错误时的回调函数
                    xhr.onerror = function () {
                        console.error('秒传接口请求错误!');
                        fileListUtils.updateStatus({
                            filename: f.name,
                            status: uploadUtils.fileStatus.FAIL.code,
                            statusText: uploadUtils.fileStatus.FAIL.text,
                        })
                    };
                    let taskItem = fileListUtils.getTask(f.name)
                    var data = {
                        filename: taskItem.filename,
                        identifier: md5,
                        parentId: taskItem.parentId,
                    };
                    xhr.send(JSON.stringify(data));
                }else {
                    //没有配置就直接上传
                    fileListUtils.retry(f.name)
                }
            }
        })
    }
    catch (e) {
        fileListUtils.updateStatus({
            filename: taskItem.target.name,
            status: uploadUtils.fileStatus.FAIL.code,
            statusText: uploadUtils.fileStatus.FAIL.text,
        })
    }
}
// 上传完成操作
function fileUploaded(rootFile:File, file:any, message:string){
    // 上传完成响应结果
    let res
    try {
        res = JSON.parse(message)
    }
    catch (e) {
    }
    // 需要合并
    if (res.code == '200') {
        if (res.data.mergeFlag) {
            doMerge(file)
        }
    }
    else {
        // 上传失败暂停
        file.pause()
        fileListUtils.updateStatus({
            filename: file.name,
            status: uploadUtils.fileStatus.FAIL.code,
            statusText: uploadUtils.fileStatus.FAIL.text,
        })
    }
}
function doMerge(file:any) {
    // 获取当前上传文件，修改状态为合并
    const taskItem = fileListUtils.getTask(file.name)
    fileListUtils.updateStatus({
        filename: file.name,
        status: uploadUtils.fileStatus.MERGE.code,
        statusText: uploadUtils.fileStatus.MERGE.text,
    })
    // 更新进度条
    fileListUtils.updateProcess({
        filename: file.name,
        speed: uploadUtils.translateSpeed(file.averageSpeed),
        percentage: 99,
        uploadedSize: uploadUtils.translateFileSize(file.sizeUploaded()),
        timeRemaining: uploadUtils.translateTime(file.timeRemaining()),
    })
    // 调用后端合并接口
    if (optionsArg.doMerge){
        optionsArg.doMerge(file)
    }else{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', optionsArg.mergeUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status == 200) {
                // 请求成功
                var response = JSON.parse(xhr.responseText);
                if (response.data.result) {
                    fileListUtils.updateProcess({
                        filename: file.name,
                        speed: uploadUtils.translateSpeed(file.averageSpeed),
                        percentage: 100,
                        uploadedSize: uploadUtils.translateFileSize(file.sizeUploaded()),
                        timeRemaining: uploadUtils.translateTime(file.timeRemaining()),
                    })
                    // 更新状态
                    fileListUtils.updateStatus({
                        filename: file.name,
                        status: uploadUtils.fileStatus.SUCCESS.code,
                        statusText: uploadUtils.fileStatus.SUCCESS.text,
                        fileId:response.data.data.fileId,
                        realPath:response.data.data.realPath
                    })
                    //更新状态后删除任务target
                    fileListUtils.removeTarget(file.name)
                } else {
                    // 请求失败
                    console.error('合并接口调用失败');
                }
            }
        }
        // 设置请求发生错误时的回调函数
        xhr.onerror = function () {
            console.error('合并:请求错误!');
        };
        let taskItem = fileListUtils.getTask(file.name)
        var data = {
            filename: taskItem.filename,
            identifier: taskItem.target.uniqueIdentifier,
            totalSize: taskItem.target.size,
        };
        xhr.send(JSON.stringify(data));

    }

}
// 上传进度
function uploadProgress(rootFile:File, file:any, chunk:Chunk) {
    const taskItem = fileListUtils.getTask(file.name)
    if (file.isUploading()) {
        // 更新为正在上传状态
        if (taskItem.status !== uploadUtils.fileStatus.UPLOADING.code) {
            fileListUtils.updateStatus({
                filename: file.name,
                status: uploadUtils.fileStatus.UPLOADING.code,
                statusText: uploadUtils.fileStatus.UPLOADING.text,
            })
        }
        // 更新进度条
        fileListUtils.updateProcess({
            filename: file.name,
            speed: uploadUtils.translateSpeed(file.averageSpeed),
            percentage: Math.floor(file.progress() * 100),
            uploadedSize: uploadUtils.translateFileSize(file.sizeUploaded()),
            timeRemaining: uploadUtils.translateTime(file.timeRemaining()),
        })
    }
}
function uploadError(rootFile:File, file:any, message:string) {
    console.log(rootFile.name+'上传失败:'+message)
    fileListUtils.updateStatus({
        filename: file.name,
        status: uploadUtils.fileStatus.FAIL.code,
        statusText: uploadUtils.fileStatus.FAIL.text,
    })
}

//删除上传文件
export function deleteFile(fileId:string) {
    // 删除文件
    if (optionsArg.deleteUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', optionsArg.deleteUrl, true);
        //添加请求参数
        let data = {
            fileId: fileId
        };
        // xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status == 200) {
                // 请求成功
                var response = JSON.parse(xhr.responseText);
            }
        }
        // 设置请求发生错误时的回调函数
        xhr.onerror = function () {}
        xhr.send(JSON.stringify(data));
    }
}
