import { uploadUtils } from './common'
import {options,Chunk,TaskItem} from '../type'
import utils from "simple-uploader.js";

export class UploaderObject{
    private uploader: any;

    private options: options;
    private optionsArg: options;
    //实例id
    private instanceId: string;
    //文件列表
    private taskFileList: any[];


    private blockSize = 1024 * 1024 * 5; // 5MB 分块大小   minio最低合并大小是5MB
    constructor() {
        // this.options = options;
        this.instanceId = this.generateUniqueId();
        // this.initUpload.bind(this)
        // this.initUpload(options);

    }
    private generateUniqueId(): string {
        return 'taskFileList_' + Math.random().toString(36).substr(2, 9);
    }

    public initUpload(options:options):any {
        this.options = options;
        this.optionsArg = options
        //一些条件
        if (!this.optionsArg.baseUrl){
            console.error('请设置接口地址')
            return
        }
        //合并地址
        if (!this.optionsArg.doMerge){
            if (!this.optionsArg.mergeUrl){
                this.optionsArg.mergeUrl=this.optionsArg.baseUrl + '/file/merge'
            }else {
                this.optionsArg.mergeUrl=this.optionsArg.baseUrl + this.optionsArg.mergeUrl
            }
        }
        //秒传校验
        if (this.optionsArg.secUrl){
            this.optionsArg.secUrl = this.optionsArg.baseUrl+ this.optionsArg.secUrl
        }
        //上传地址
        if (!this.optionsArg.uploadUrl){
            this.optionsArg.uploadUrl = this.optionsArg.baseUrl+'/file/chunk-upload'
        }else{
            this.optionsArg.uploadUrl = this.optionsArg.baseUrl+ this.optionsArg.uploadUrl
        }
        options.uploadUrl = this.optionsArg.uploadUrl
        //删除地址
        if (this.optionsArg.deleteUrl){
            this.optionsArg.deleteUrl = this.optionsArg.baseUrl+ this.optionsArg.deleteUrl
        }
        options.chunkSize?options.chunkSize = this.blockSize:options.chunkSize = this.blockSize
        //限制文件类型
        let accepts;
        if (options.accept){
            accepts = options.accept.map(item => `.${item}`).join(', ');
        }
        // 初始化配置
        const fileOptions = {
            // 根据文件片段大小决定上传目标URL
            target(file:File, chunk:number) {
                return options.uploadUrl
            },
            // 单文件上传
            singleFile: false,
            // 设置文件片段大小
            chunkSize: options.chunkSize,
            // 强制设置文件片段大小，此处设置为false
            forceChunkSize: false,
            // 同时上传的文件片段数量  simultaneousUploads为空则默认3
            simultaneousUploads: options.simultaneousUploads? options.simultaneousUploads : 3,
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
        this.uploader = new utils(fileOptions)
        // 绑定上传DOM
        this.uploader.assignBrowse(
            document.getElementById(options.bindUploadDOMById),
            false,
            false,
            {
                accept: accepts?accepts:"*",
            }
        )
        this.uploader.assignDrop(document.getElementById(options.bindUploadDOMById))
        // 添加文件监听
        this.uploader.on('filesAdded', options.filesAdded? options.filesAdded.bind(this) : this.filesAdded.bind(this))
        // 上传成功监听
        this.uploader.on('fileSuccess', options.fileSuccess? options.fileSuccess.bind(this) : this.fileUploaded.bind(this))
        // 上传进度，上传完一个分片调用一次
        this.uploader.on('fileProgress', options.fileProgress? options.fileProgress.bind(this) : this.uploadProgress.bind(this))
        //上传失败
        this.uploader.on('fileError', options.fileError? options.fileError.bind(this) : this.uploadError.bind(this))
        //绑定上传文件列表
        this.taskFileList = options.taskFileList
        return this.uploader;
    }

    private filesAdded(files:Array<any>, fileList:Array<File>, event:Event) {

        files.forEach((f) => {
            //判断当前文件是否存在于列表中
            if (this.fileListUtils.getTask(f.name)) {
                this.fileListUtils.removeTarget(f.name)
                return
            }
            //判断文件后缀是否有限制
            if (this.optionsArg.accept){
                const fileSuffix = f.name.split('.').pop()
                if (!this.optionsArg.accept.includes(fileSuffix)) {
                    console.error('文件格式不正确，请上传'+this.optionsArg.accept.join('/')+'格式的文件')
                    return
                }
            }
            //判断文件大小是否符合 maxSize没有值就默认最大值
            if (this.optionsArg.maxSize && f.size > uploadUtils.translateMBToByte(this.optionsArg.maxSize)) {
                console.error('文件大小超过限制，请上传'+uploadUtils.translateFileSize(uploadUtils.translateMBToByte(this.optionsArg.maxSize))+'以下的文件')
                alert('文件大小超过限制，请上传'+uploadUtils.translateFileSize(uploadUtils.translateMBToByte(this.optionsArg.maxSize))+'以下的文件')
                return
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
            this.fileListUtils.add(taskItem)
        })
    }

    public uploadAllSubmit() {
        try {
            const upFiles = this.taskFileList.filter((f:any) => {
                if (f.status == uploadUtils.fileStatus.WAITING.code) {
                    return true
                }
                return false
            })
            this.uploadSingleSubmit(upFiles[0])
        }
        catch (e) {}
    }
    public uploadSingleSubmit(taskItem:TaskItem) {
        try {
            const f:any = taskItem.target
            // 解析文件状态
            this.fileListUtils.updateStatus(
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
                if (this.optionsArg.secUpload){
                    this.optionsArg.secUpload(f,md5)
                }else {
                    if (this.optionsArg.secUrl){
                        //有校验秒传地址就使用
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', this.optionsArg.secUrl, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                // 请求成功
                                var response = JSON.parse(xhr.responseText);
                                if (response.data.result) {
                                    this.fileListUtils.updateProcess({
                                        filename: f.name,
                                        speed: uploadUtils.translateSpeed(f.averageSpeed),
                                        percentage: 100,
                                        uploadedSize: uploadUtils.translateFileSize(f.sizeUploaded()),
                                        timeRemaining: uploadUtils.translateTime(f.timeRemaining()),
                                    })
                                    // 更新状态
                                    this.fileListUtils.updateStatus({
                                        filename: f.name,
                                        status: uploadUtils.fileStatus.SUCCESS.code,
                                        statusText: uploadUtils.fileStatus.SUCCESS.text,
                                        realPath: response.data.data.realPath,
                                        fileId: response.data.data.fileId,
                                    })

                                } else {
                                    // 需要上传
                                    this.fileListUtils.retry(f.name)
                                }
                            }
                        }
                        // 设置请求发生错误时的回调函数
                        xhr.onerror = function () {
                            console.error('秒传接口请求错误!');
                            this.fileListUtils.updateStatus({
                                filename: f.name,
                                status: uploadUtils.fileStatus.FAIL.code,
                                statusText: uploadUtils.fileStatus.FAIL.text,
                            })
                        };
                        let taskItem = this.fileListUtils.getTask(f.name)
                        var data = {
                            filename: taskItem.filename,
                            identifier: md5,
                            parentId: taskItem.parentId,
                        };
                        xhr.send(JSON.stringify(data));
                    }else {
                        //没有配置就直接上传
                        this.fileListUtils.retry(f.name)
                    }
                }
            })
        }
        catch (e) {
            this.fileListUtils.updateStatus({
                filename: taskItem.target.name,
                status: uploadUtils.fileStatus.FAIL.code,
                statusText: uploadUtils.fileStatus.FAIL.text,
            })
        }
    }

    private fileUploaded(rootFile:File, file:any, message:string){
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
                this.doMerge(file)
            }else {
                this.fileListUtils.updateStatus({
                    filename: file.name,
                    status: uploadUtils.fileStatus.FAIL.code,
                    statusText: uploadUtils.fileStatus.FAIL.text,
                })
            }
        }
        else {
            // 上传失败暂停
            file.pause()
            this.fileListUtils.updateStatus({
                filename: file.name,
                status: uploadUtils.fileStatus.FAIL.code,
                statusText: uploadUtils.fileStatus.FAIL.text,
            })
        }
    }

    private doMerge(file:any) {
        // 获取当前上传文件，修改状态为合并
        const taskItem = this.fileListUtils.getTask(file.name)
        this.fileListUtils.updateStatus({
            filename: file.name,
            status: uploadUtils.fileStatus.MERGE.code,
            statusText: uploadUtils.fileStatus.MERGE.text,
        })
        // 更新进度条
        this.fileListUtils.updateProcess({
            filename: file.name,
            speed: uploadUtils.translateSpeed(file.averageSpeed),
            percentage: 99,
            uploadedSize: uploadUtils.translateFileSize(file.sizeUploaded()),
            timeRemaining: uploadUtils.translateTime(file.timeRemaining()),
        })
        const that = this;
        // 调用后端合并接口
        if (this.optionsArg.doMerge){
            this.optionsArg.doMerge(file)
        }else{
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.optionsArg.mergeUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status == 200) {
                    // 请求成功
                    var response = JSON.parse(xhr.responseText);
                    if (response.data.result) {
                        that.fileListUtils.updateProcess({
                            filename: file.name,
                            speed: uploadUtils.translateSpeed(file.averageSpeed),
                            percentage: 100,
                            uploadedSize: uploadUtils.translateFileSize(file.sizeUploaded()),
                            timeRemaining: uploadUtils.translateTime(file.timeRemaining()),
                        })
                        // 更新状态
                        that.fileListUtils.updateStatus({
                            filename: file.name,
                            status: uploadUtils.fileStatus.SUCCESS.code,
                            statusText: uploadUtils.fileStatus.SUCCESS.text,
                            fileId:response.data.data.fileId,
                            realPath:response.data.data.realPath
                        })
                        //更新状态后删除任务target
                        that.fileListUtils.removeTarget(file.name)
                    } else {
                        // 请求失败
                        console.error('合并接口调用失败');
                        that.fileListUtils.updateStatus({
                            filename: file.name,
                            status: uploadUtils.fileStatus.FAIL.code,
                            statusText: uploadUtils.fileStatus.FAIL.text,
                        })
                    }
                }
            }
            // 设置请求发生错误时的回调函数
            xhr.onerror = function () {
                console.error('合并:请求错误!');
            };
            let taskItem = this.fileListUtils.getTask(file.name)
            var data = {
                filename: taskItem.filename,
                identifier: taskItem.target.uniqueIdentifier,
                totalSize: taskItem.target.size,
            };
            xhr.send(JSON.stringify(data));
            xhr.onloadend = function () {
                if (xhr.status != 200) {
                    that.fileListUtils.updateStatus({
                        filename: file.name,
                        status: uploadUtils.fileStatus.FAIL.code,
                        statusText: uploadUtils.fileStatus.FAIL.text,
                    })
                }
            }

        }

    }

    private uploadProgress(rootFile:File, file:any, chunk:Chunk) {
        const taskItem = this.fileListUtils.getTask(file.name)
        if (file.isUploading()) {
            // 更新为正在上传状态
            if (taskItem.status !== uploadUtils.fileStatus.UPLOADING.code) {
                this.fileListUtils.updateStatus({
                    filename: file.name,
                    status: uploadUtils.fileStatus.UPLOADING.code,
                    statusText: uploadUtils.fileStatus.UPLOADING.text,
                })
            }
            // 更新进度条
            this.fileListUtils.updateProcess({
                filename: file.name,
                speed: uploadUtils.translateSpeed(file.averageSpeed),
                percentage: Math.floor(file.progress() * 100),
                uploadedSize: uploadUtils.translateFileSize(file.sizeUploaded()),
                timeRemaining: uploadUtils.translateTime(file.timeRemaining()),
            })
        }
    }

    private uploadError(rootFile:File, file:any, message:string) {
        console.error(rootFile.name+'上传失败:'+message)
        this.fileListUtils.updateStatus({
            filename: file.name,
            status: uploadUtils.fileStatus.FAIL.code,
            statusText: uploadUtils.fileStatus.FAIL.text,
        })
    }

    private deleteFile(fileId:string,realPath:string) {
        // 删除文件
        if (this.optionsArg.deleteUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.optionsArg.deleteUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            //添加请求参数
            let data = {
                fileId: fileId,
                realPath: realPath,
                deleteFile: this.optionsArg.deleteFile
            };
            xhr.onload = function () {
                if (xhr.status == 200) {
                    // 请求成功
                    // let response = JSON.parse(xhr.responseText);
                    // response.data.result ? console.log(fileId+':删除成功') : console.log(fileId+':删除失败');
                }
            }
            // 设置请求发生错误时的回调函数
            xhr.onerror = function () {}
            xhr.send(JSON.stringify(data));
        }
    }

    private fileListUtils =  {
        getTask: (filename: string) => {
            return this.taskFileList.find((taskItem:any) => filename === taskItem.filename)
        },
        remove: (filename: string) => {
            for (let i = 0; i < this.taskFileList.length; i++) {
                if (filename === this.taskFileList[i].filename) {
                    let task:TaskItem = this.taskFileList[i]
                    if (task.target){
                        task.target.cancel()
                    }
                    this.taskFileList.splice(i, 1)
                    //调用删除接口
                    if (task.status === uploadUtils.fileStatus.SUCCESS.code){
                        this.deleteFile(task.fileId,task.realPath)
                    }
                    break
                }
            }
        },
        removeTarget: (filename: string) => {
            for (let i = 0; i < this.taskFileList.length; i++) {
                if (filename === this.taskFileList[i].filename) {
                    this.taskFileList[i].target.cancel()
                    break
                }
            }
        },
        add: (taskItem: any) => {
            this.taskFileList.push(taskItem)
        },
        clear: () => {
            this.taskFileList = []
        },
        pause: (filename: string) => {
            // 找到要暂停上传的对象
            const taskItem = this.fileListUtils.getTask(filename)
            // 暂停和修改状态值
            taskItem.target.pause()
            taskItem.status = uploadUtils.fileStatus.PAUSE.code
            taskItem.statusText = uploadUtils.fileStatus.PAUSE.text
        },
        resume: (filename: string) => {
            // 找到文件恢复上传
            const taskItem = this.fileListUtils.getTask(filename)
            taskItem.target.resume()
            taskItem.status = uploadUtils.fileStatus.UPLOADING.code
            taskItem.statusText = uploadUtils.fileStatus.UPLOADING.text
        },
        cancel: (filename: string) => {
            // 取消上传文件
            for (let i = 0; i < this.taskFileList.length; i++) {
                if (filename === this.taskFileList[i].filename) {
                    if (this.taskFileList[i].target){
                        this.taskFileList[i].target.cancel()
                    }
                    this.taskFileList.splice(i, 1)
                    break
                }
            }
        },
        retry: (filename: string) => {
            // 重新上传
            const taskItem = this.fileListUtils.getTask(filename)
            taskItem.target.bootstrap()
            taskItem.target.retry()
            taskItem.status = uploadUtils.fileStatus.UPLOADING.code
            taskItem.statusText = uploadUtils.fileStatus.UPLOADING.text
        },
        updateStatus: (param:any) => {
            const taskItem = this.fileListUtils.getTask(param.filename)
            taskItem.status = param.status
            taskItem.statusText = param.statusText
            if (param.fileId){
                taskItem.fileId = param.fileId
            }
            if (param.realPath){
                taskItem.realPath = param.realPath
            }
        },
        updateProcess: (param:any) => {
            const taskItem = this.fileListUtils.getTask(param.filename)
            taskItem.speed = param.speed
            taskItem.percentage = param.percentage
            taskItem.uploadedSize = param.uploadedSize
            taskItem.timeRemaining = param.timeRemaining
        },
    }

}

