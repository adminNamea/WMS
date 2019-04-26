
!function () {
    "use strict";
    window.onload = function () {
        var util = layui.util;
        var $ = layui.jquery;
        Vue.prototype.$echarts = echarts
        var CheckTo = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请选择放料点'));
            }
            if (value == v.form.PlaceID) {
                callback(new Error('位置不能相同'))
            } else {
                callback()
            }
        }
        var CheckQTY = (rule, value, callback) => {
            var a = {};
            var height = 0;
            var b = {};
            v.options.find(function (x) {
                if (v.form.InType == "调整") {
                    if (x.ID == v.form.To) {
                        b = x
                    }
                }
                if (x.ID == v.form.PlaceID) {
                    a = x
                }

            })
            if (v.form.selectedOptions3.length > 0) {
                var h = v.form.selectedOptions3[1];
                height = h.substring(h.lastIndexOf("*") + 1, h.lastIndexOf(""))
            } else {
                callback(new Error('请选择物料'));
            }
            if (!value) {
                callback(new Error('数量不能为空'));
            } else if (isNaN(value)) {
                callback(new Error('请输入数字'));
            } else if (v.form.InType == "出库") {
                if (value > a.StockQTY) {
                    callback(new Error('货位数量不足'));
                } else {
                    callback();
                }
            } else if (v.form.InType == "入库") {
                if (height * a.StockQTY + height * value > a.height) {
                    callback(new Error('超过货位限制'));
                } else {
                    callback();
                }
            } else if (v.form.InType == "调整") {
                if (height * b.StockQTY + height * value > b.height) {
                    callback(new Error('超过货位限制'));
                } else if (value > a.StockQTY) {
                    callback(new Error('货位数量不足'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        }
        var v = new Vue({
            el: "#app",
            data: {
                whComm: {},
                rizi: false,
                gQuantity: {
                    q1: 0,
                    q2: 0,
                    q3: 0
                },
                centerDialogVisible1: false,
                title: "",
                guz: true,
                optionss: [],
                wcsComm: [],
                timelineList: [],
                su: "机器检测中...",
                no: "无",
                thisTask: "",
               
                wcsLength: 0,
                date: '',
                Place: [],
                mqty: [],
                options: [],
                vals: [],
                i: false,
                myChart: "",
                datas: {
                    name: [],
                    count: []
                },
                options1: [],
                counts: [
                    {
                        name: '库存总数',
                        value: "0",
                        type: "",
                        percentage: 0
                    },
                    {
                        name: '预计可存',
                        value: "0",
                        type: "success",
                        percentage: 0
                    },
                    {
                        name: '已用空间',
                        value: "",
                        type: "danger",
                        percentage: 0
                    },
                    {
                        name: '剩余空间',
                        value: ""
                        , type: "danger"
                        , percentage: 0
                    },
                    {
                        name: '今日入库',
                        value: "0"
                        , type: "warning",
                        percentage: 60
                    },
                    {
                        name: '今日出库',
                        value: "0"
                        , type: "warning",
                        percentage: 60
                    }
                ],
                remind: [{
                    name: "库存提示",
                    text: "当前库存充足",
                    type: "success"
                }, {
                    name: "物料提示",
                    text: "物料数量充足",
                    type: "success"
                }],
                selects: [],
                selectd: false,
                stratRgv: false,
                dialogFormVisible: false,
                form: {
                    PartName: "",
                    PartSpec: "",
                    PartMaterial: "",
                    InQTY: "",
                    PlaceID: "",
                    To: "",
                    InType: "",
                    selectedOptions3: []
                },
                centerDialogVisible: false,
                taskSetData: {
                    switchValue: false,
                    removeTask: false,
                    MonitoringTime: 1,
                    InventoryQty: 0,
                    MaterialQty: 0,
                    huoType: 1
                },
                rules: {
                    selectedOptions3: [
                        { required: true, message: '请选择物料', trigger: 'change' }],
                    InQTY: [{ validator: CheckQTY, trigger: 'blur' }],
                    To: [{ validator: CheckTo, trigger: 'change' }]
                },
                rgv: false,
                Logging: [],
                sDate:""
            },
            methods: {
                zhzy() {
                    this.$http.get("/WCS/zhzy").then(function (res) {
                        v.get();
                    })
                },
                Loggings(type) {
                    if (localStorage.Logging != undefined) {
                        var aa = JSON.parse(localStorage.Logging)
                        aa.push({ name: this.itemStatus.boo.Name, sDate: this.sDate, eDate: this.toDateString(new Date()), type: type })
                        localStorage.Logging = JSON.stringify(aa)
                    } else {
                        var aa = []
                        aa.push({ name: this.itemStatus.boo.Name, sDate: this.sDate, eDate: this.toDateString(new Date()), type: type })
                        localStorage.Logging = JSON.stringify(aa)
                    }
                },
                resetForm() {
                    this.$refs['form'].resetFields();
                },
                typeClass(status) {
                    switch (status) {
                        case "可用":
                            return "success";
                            break;
                        case "占用":
                            return "warning";
                            break;
                        case "已满":
                            return "danger";
                            break;
                        default:
                            return "primary";
                            break;
                    }
                },
                command(c) {
                    switch (Number(c)) {
                        case 1:
                            v.title = "入库"
                            break;
                        case 2:
                            v.title = "出库"
                            break;
                        case 3:
                            v.title = "调整"
                            break;
                    }
                    this.form.InType = this.title
                    this.dialogFormVisible = true
                },
                houPercentage(o) {
                    var a = o.PartSpec
                    if (a != "空") {
                        var qty = o.StockQTY
                        if (typeof (qty) == "string") {
                            qty = qty.substring(qty.indexOf(">") + 1, qty.lastIndexOf(""));
                        }
                        var he = Number(a.substring(a.lastIndexOf("*") + 1, a.lastIndexOf("")));
                        if (qty * he + he > o.height) {
                            qty = 100
                        } else {
                            qty = (((qty * he) / o.height) * 100).toFixed(0)
                        }
                        return Number(qty)
                    } else {
                        return 0
                    }
                },
                huoTypeComm(c) {
                    this.taskSetData.huoType = c
                    layui.data("taskSet", {
                        key: 'taskSetData'
                        , value: this.taskSetData
                    })
                },
                selected(e, fu) {
                    v.selects = []
                    v.form.selectedOptions3 = []
                    v.form.PlaceID = e.ID
                    if (e.PartName != "空") {
                        v.selectd = true
                        v.form.selectedOptions3 = [e.PartName, e.PartSpec, e.PartMaterial]
                    } else {
                        v.selectd = false
                    }
                    if (fu != undefined) {
                        fu
                    }
                    v.$http.get("/WMS/CheckWhMaterial").then(function (res) {
                        var data = res.body
                        if (data.length > 0) {
                            layui.each(data, function (index, val) {
                                var d = true
                                if (v.selects.length > 0) {
                                    v.selects.find(function (v1) {
                                        var q = true
                                        if (v1.value == val.PartName) {
                                            d = false
                                            v1.children.find(function (x) {
                                                if (x.value == val.PartSpec) {
                                                    q = false
                                                    x.children.push({
                                                        value: val.PartMaterial,
                                                        label: val.PartMaterial
                                                    })
                                                }
                                            })
                                            if (q) {
                                                v1.children.push({
                                                    value: val.PartSpec, label: val.PartSpec, children: [
                                                        {
                                                            value: val.PartMaterial,
                                                            label: val.PartMaterial
                                                        }
                                                    ]
                                                })
                                            }
                                        }
                                    })
                                    if (d) {
                                        v.selects.push({
                                            value: val.PartName,
                                            label: val.PartName,
                                            children: [{
                                                value: val.PartSpec,
                                                label: val.PartSpec,
                                                children: [{
                                                    value: val.PartMaterial,
                                                    label: val.PartMaterial,
                                                }]
                                            }]

                                        })
                                    }
                                } else {
                                    v.selects.push({
                                        value: val.PartName,
                                        label: val.PartName,
                                        children: [{
                                            value: val.PartSpec,
                                            label: val.PartSpec,
                                            children: [{
                                                value: val.PartMaterial,
                                                label: val.PartMaterial,
                                            }]
                                        }]
                                    })
                                }
                            })
                        }
                    })
                },
                Change_a(value) {
                    var newOption = [];
                    this.options = this.optionss
                    if (value.length > 0) {
                        this.options.find(function (x) {
                            if (x.PartName == value[0] && x.PartSpec == value[1] && x.PartMaterial == value[2]) {
                                newOption.push(x)
                            } else if (x.Type == value || "总数" == value) {
                                newOption.push(x)
                            } else if (x.hid == value[0] && x.aid == value[1] && x.gid == value[2]) {
                                newOption.push(x)
                            } else if (value.length == 2 && x.hid == value[0] && x.aid == value[1]) {
                                newOption.push(x)
                            } else {
                                v.options = []
                            }
                        })
                    }
                    if (newOption.length > 0) {
                        this.options = newOption
                    }
                },
                selectChange_b(value) {
                    var b = {};
                    if (value.length > 0) {
                        b.PartName = value[0];
                        b.PartSpec = value[1];
                        b.PartMaterial = value[2]
                    }
                    v.$http.get("/WCS/CheckHousSum",{ params: b }).then(function (res) {
                        var data = res.body
                        v.counts[1].value = data.suQty

                        if (data.sumQty != null) {
                            v.counts[1].percentage = (data.suQty / data.sumQty) * 100
                        } else {
                            v.counts[1].percentage = 0
                            v.counts[1].value = 0
                        }

                    })
                },
                submit() {
                    this.form.PartName = this.form.selectedOptions3[0]
                    this.form.PartSpec = this.form.selectedOptions3[1]
                    this.form.PartMaterial = this.form.selectedOptions3[2]
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            this.form.selectedOptions3 != undefined ? delete this.form.selectedOptions3 : "";
                            this.$http.post("/WMS/InMaterial", { data: this.form }, { emulateJSON: true }).then( function () {
                                v.dialogFormVisible = false
                                v.$message({
                                    type: 'success',
                                    message: '提交成功!'
                                });
                                v.get()
                            })
                        } else {
                            return false;
                        }
                    });
                },
                disabled(o, t) {
                    switch (o.Type) {
                        case "可用":
                            if (o.PartName == "空") {
                                if (t == "出库" || t == "调整") {
                                    return "disabled"
                                }
                            }
                            break;
                        case "占用":
                            return "disabled"
                            break;
                        case "已满":
                            if (t == "入库") {
                                return "disabled"
                            }
                            break;
                    }
                },
                run(boo, aid) {
                    if (boo) {
                        v.timelineList.find(function (x) {
                            if (x.aid == aid) {
                                const loading = v.$loading({
                                    lock: true,
                                    text: '机器连接中',
                                    spinner: 'el-icon-loading',
                                    background: 'rgba(0, 0, 0, 0.7)'
                                });
                                setTimeout(() => {
                                    v.$http.get("/WMS/PlcIn", { params: { aid: aid } }).then(function (data) {
                                        var res=data.body
                                        if (res.msg == "true") {
                                            v.$http.get("/WCS/UpTaskStatu", {
                                                params: { aid: aid, status: "正在执行" }
                                            }).then( function () {
                                                v.get()
                                            })
                                            loading.close();
                                            v.$message({
                                                message: "任务" + x.aid + '开始执行',
                                                type: 'success'
                                            });
                                        } else {
                                            loading.close();
                                            v.$http.get("/WCS/UpTaskStatu", {
                                                params: { aid: aid, status: "错误" }
                                            }).then( function () {
                                                v.get()
                                            })
                                            v.no = res.msg
                                            v.$message.error("任务" + x.aid + '执行失败,原因:' + res.msg);
                                        }
                                    })
                                }, 500);
                            }
                        })
                    }

                },
                progress(aid) {
                    v.$http.get("/WCS/CheckPlc").then(function (res) {
                        var data = res.body
                        if (!data.ldms) {
                            v.$message.error("非联动模式，请更改模式");
                        } else {
                            if (!data.ddjzc) {
                                v.$message.error("堆垛机不正常");
                            } else {
                                var boo = true
                                var booo = true
                                var a = v.itemStatus
                                if (a.bo3 != null) {
                                    layui.each(a.bo3, function (i, va) {
                                        if (va.aid == aid) {
                                            booo = false;
                                            return false;
                                        }
                                    })
                                }
                                if (booo) {
                                    if (a.boo != null) {
                                        v.$message({
                                            message: '请等待任务完成',
                                            type: 'warning'
                                        });
                                        boo = false;
                                        return false;
                                    }
                                    if (a.bo1 != null) {
                                        var t = false
                                        layui.each(a.bo1, function (i, va) {
                                            if (va.aid == aid) {
                                                t = true;
                                                return false;
                                            }
                                        })
                                        if (t) {
                                            v.$confirm('已确保机器信息正确？, 是否重试?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning',
                                                center: true
                                            }).then(() => {
                                                boo = true
                                                v.$message({
                                                    type: 'success',
                                                    message: '开始重试!'
                                                });
                                                v.run(boo, aid)
                                            }).catch(() => {
                                                v.$message({
                                                    type: 'info',
                                                    message: '已取消重试'
                                                });
                                            });
                                        } else {
                                            v.run(boo, aid)
                                        }
                                    } else {
                                        v.run(boo, aid)
                                    }
                                } else {
                                    v.$message({
                                        message: '任务已完成',
                                        type: 'warning'
                                    });
                                }
                            }
                        }
                    })
                },
                setTime() {
                    
                    v.wcsLength == 0 ? this.sDate = util.toDateString(new Date()):""
                    var st = setTimeout( ()=> {
                        this.guz = true
                        if (v.wcsComm.length < 2) {
                            v.itemStatus.boo.percentage += 2
                            if (v.itemStatus.boo.percentage > 99) {
                                v.itemStatus.boo.percentage = 100
                            }
                        }
                        v.$http.get("/WCS/CheckPlc", {
                            params: { ip: "192.168.3.30" }
                        }).then((res) =>{
                            var data = res.body
                            if (data.zdyxz) {
                                v.i = true
                            }
                            if (v.wcsComm[v.wcsLength].type == "入库") {
                                if (data.rkyxq) {
                                    v.rgv = true
                                }
                            } else if (v.wcsComm[v.wcsLength].type == "出库") {
                                if (data.rkyxc) {
                                    v.stratRgv = true
                                    v.rgv = true
                                }
                            } else {
                                v.rgv = true
                            }
                            if (data.msg) {
                                v.su = "无";
                                v.no = "信息读取失败"
                                v.$notify.error({
                                    title: '错误',
                                    message: '连接信息读取失败',
                                    duration: 0
                                });
                                v.$http.get("/WCS/UpTaskStatu", { params: { aid: v.thisTask, status: "错误" } })
                                v.itemStatus.boo.status = "exception"
                                v.itemStatus.boo.statu = "错误"
                            } else if (data.gzbj) {
                                v.$http.get("/WCS/Error", {
                                    params: { aid: v.thisTask }
                                }).then( ()=> {
                                    v.$notify.error({
                                        title: '错误',
                                        message: '机器出现故障请及时处理',
                                        duration: 0
                                    });
                                    v.no = "机器故障"
                                    v.itemStatus.boo.status = "exception"
                                    v.itemStatus.boo.statu = "错误"
                                    v.Loggings("机器故障")
                                })
                            } else if (v.su == "机器检测中...") {
                                if (data.yxtd) {
                                    $.get("/WMS/PlcIn", {
                                        aid:v.itemStatus.boo.aid,wcs: new String(v.wcsLength)
                                    }, (data)=> {
                                        if (data.msg == "true") {
                                            if (v.wcsComm[v.wcsLength].type != "回原点") {
                                                if (v.rgv) {
                                                    v.$http.get("/WMS/PlcSn", {
                                                        params: { ip: "192.168.3.30" }
                                                    }).then( (res)=> {
                                                        var data = res.body
                                                        if (data == "true") {
                                                            v.su = "机器正在运行"
                                                            v.setTime()
                                                        } else {
                                                            v.su = "无";
                                                            v.no = "信息读取失败"
                                                            v.$notify.error({
                                                                title: '错误',
                                                                message: '连接信息读取失败',
                                                                duration: 0
                                                            });
                                                            v.$http.get("/WCS/UpTaskStatu", { params: { aid: v.thisTask, status: "错误" } })
                                                            v.itemStatus.boo.status = "exception"
                                                            v.itemStatus.boo.statu = "错误"
                                                            v.Loggings("连接信息读取失败")
                                                        }
                                                    })
                                                } else {
                                                    v.setTime()
                                                }
                                            } else {
                                                v.su = "机器正在运行"
                                                v.setTime()
                                            }
                                        } else {
                                            v.setTime()
                                        }
                                    })
                                } else {
                                    v.setTime()
                                }
                            } else if (v.i) {
                                if (data.ddrwwc) {
                                    v.wcsLength++;
                                    var count = v.wcsComm.length - v.wcsLength
                                    if (v.stratRgv) {
                                        v.$http.get("/WCS/StratRGV", {
                                            params: { ip: "192.168.3.30" }
                                        }).then(function() {
                                            v.stratRgv = false
                                           })
                                    }
                                    if (count > 0) {
                                        var hui = true
                                        if (v.wcsComm[v.wcsLength].type=="回原点") {
                                            hui = false
                                            if (data.hydyx) {
                                                hui = true
                                            }
                                        }
                                        if (hui) {
                                            var jd = 0;
                                            if (v.wcsLength > 0) {
                                                jd = parseInt(v.itemStatus.boo.percentage + 100 / v.wcsComm.length)
                                                v.itemStatus.boo.percentage = jd
                                            }
                                            //layui.data("wcs", {
                                            //    key: 'wcsLength'
                                            //    , value: v.wcsLength
                                            //})
                                            //layui.data("wcs", {
                                            //    key: 'percentage'
                                            //    , value: jd
                                            //})
                                                    v.su = "机器检测中...";
                                                    v.i = false;
                                                    v.setTime()
                                        }
                                    } else {
                                        //v.$message({
                                        //    message: "任务" + v.thisTask + '完成',
                                        //    type: 'success'
                                        //});
                                        //v.$http.get("/WCS/SuTask", {
                                        //    params: { aid: v.thisTask }
                                        //}).then( function () {
                                        //    v.get()
                                        //    })
                                        //if (v.wcsLength > 0) {
                                        //    layui.data("wcs", null)
                                        //}
                                        //v.rgv = false;
                                        //v.thisTask = "";
                                        //v.su = "机器检测中...";
                                        //v.itemStatus.boo.percentage = 100
                                        //v.itemStatus.boo.status = "success"
                                        //v.itemStatus.boo.statu = "完成"
                                        //v.wcsLength = 0;
                                        //v.i = false
                                        //clearTimeout(st)
                                        v.Loggings("正常运行")
                                        setTimeout(function () {
                                            location.reload()
                                        },20000)
                                    }
                                } else {
                                    v.setTime()
                                }
                            } else  {
                                v.setTime()
                            }
                        })
                    }, v.MoniTime)
                },
                itemStatu(statu, percentage) {
                    var text = "";
                    var icon = "";
                    var types = "primary";
                    if (this.itemStatus.boo == null) {
                        text = statu == "正在执行" ? percentage + "%" : "点击执行"
                    } else {
                        text = statu == "正在执行" ? percentage + "%" : "等待执行"
                    }
                    switch (statu) {
                        case "等待执行":
                            types = "warning"
                            icon = "el-icon-delete";
                            break;
                        case "正在执行":
                            types = "danger"
                            icon = "el-icon-loading";
                            break;
                        case "完成":
                            types = "success"
                            icon = "el-icon-close";
                            break;
                        case "错误":
                            types = "danger"
                            icon = "el-icon-delete";

                            break;
                    }
                    return {
                        text: text,
                        icon: icon,
                        types: types
                    }
                },
                colse(aid) {
                    var boo = true
                    layui.each(this.timelineList, function (index, x) {
                        if (x.aid == aid) {
                            boo = x.statu == "完成" ? false : true
                        }
                    })
                    if (boo) {
                        this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(() => {
                            v.$http.get("/WCS/WcsDelSingle", { params: { id: aid, type: "task" } }).then(function (res) {
                                var data = res.body
                                v.get();
                                if (data == "true") {
                                    v.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                    } else {
                        v.$http.get("/WCS/WcsDelSingle", { params: { id: aid, type: "task" } }).then(function (res) {
                            v.get();
                            var data = res.body
                            if (data == "true") {
                                v.$message({
                                    type: 'success',
                                    message: '已移除!'
                                });
                            }
                        })
                    }
                },
                cofp(statu, aid) {
                    return statu == "正在执行" ? this.progress(aid) : this.colse(aid)

                },
                toDateString(d, f, text) {
                    return text == undefined ? util.toDateString(d, f) : text + util.toDateString(d, f)
                },
                taskCancel(b) {
                    if (b) {
                        layui.data("taskSet", {
                            key: 'taskSetData'
                            , value: v.taskSetData
                        })
                    }
                    v.centerDialogVisible = false
                    v.taskSetData = layui.data('taskSet').taskSetData

                },
                delSuTask() {
                    var a = this.itemStatus
                    var New = [];
                    
                    if (v.taskSetData.removeTask) {
                        $.ajax({
                            url: "/WCS/DelSuTask"
                        })
                        this.timelineList.forEach(function (va) {
                            if (va.statu != "完成") {
                                New.push(va)
                            }
                        })
                        this.timelineList = New
                    }
                    if (a.bo2.length > 0) {
                        if (v.taskSetData.switchValue) {
                            v.progress(a.bo2[0].aid)
                        }
                    }
                },
                Background() {
                    var i = layer.open({
                        type: 2,
                        content: '/Home/Index',
                        maxmin: true,
                        end: function () {
                            v.get()
                        }
                    });
                    layer.full(i)
                },
                get: function () {
                    this.$http.get("/WCS/CheckAll").then(function (res) {
                        var data=res.body
                        this.mqty = data.MQTY
                        var k = 0;
                        if (localStorage.Logging != undefined) {
                            this.Logging = JSON.parse(localStorage.Logging)
                        }
                        var h = 0;
                        this.Place = [];
                        this.vals = []
                        this.options1 = []
                        this.datas.name = []
                        this.datas.count = []
                        this.Place = data.Place
                        this.wcsComm = data.WcsComm;
                        if (this.wcsComm.length > 0) {
                            this.guz = true
                        } else {
                            this.guz = false
                        }
                        this.timelineList = []
                        data.Huos.find(function (x) {
                            h++;
                            if (x.StockQTY > 0) {
                                k++;
                            }
                        })
                        if (data.WCount != null) {
                            v.gQuantity.q1 = Number(data.WCount.yse)
                            v.gQuantity.q2 = Number(data.WCount.no)
                            v.gQuantity.q3 = Number(data.WCount.nos)
                        }
                        if (data.WhMaterial.length > 0) {
                            layui.each(data.WhMaterial, function (index, val) {
                                var d = true
                                if (v.vals.length > 0) {
                                    v.vals.find(function (v1) {
                                        var q = true
                                        if (v1.value == val.PartName) {
                                            d = false
                                            v1.children.find(function (x) {
                                                if (x.value == val.PartSpec) {
                                                    q = false
                                                    x.children.push({
                                                        value: val.PartMaterial,
                                                        label: val.PartMaterial
                                                    })
                                                }
                                            })
                                            if (q) {
                                                v1.children.push({
                                                    value: val.PartSpec, label: val.PartSpec, children: [
                                                        {
                                                            value: val.PartMaterial,
                                                            label: val.PartMaterial
                                                        }
                                                    ]
                                                })
                                            }
                                        }
                                    })
                                    if (d) {
                                        v.vals.push({
                                            value: val.PartName,
                                            label: val.PartName,
                                            children: [{
                                                value: val.PartSpec,
                                                label: val.PartSpec,
                                                children: [{
                                                    value: val.PartMaterial,
                                                    label: val.PartMaterial,
                                                }]
                                            }]

                                        })
                                    }
                                } else {
                                    v.vals.push({
                                        value: val.PartName,
                                        label: val.PartName,
                                        children: [{
                                            value: val.PartSpec,
                                            label: val.PartSpec,
                                            children: [{
                                                value: val.PartMaterial,
                                                label: val.PartMaterial,
                                            }]
                                        }]
                                    })
                                }
                            })
                        }
                        if (data.Counts.length > 0) {
                            layui.each(data.Counts, function (index, val) {
                                var d = true
                                if (v.options1.length > 0) {
                                    v.options1.find(function (v1) {
                                        var q = true
                                        if (v1.value == val.hid) {
                                            d = false
                                            v1.children.find(function (x) {

                                                if (x.value == val.aid) {
                                                    q = false
                                                    x.children.push({
                                                        value: val.gid,
                                                        label: val.gname
                                                    })
                                                }
                                            })
                                            if (q) {
                                                v1.children.push({
                                                    value: val.aid, label: val.aname, children: [
                                                        {
                                                            value: val.gid,
                                                            label: val.gname
                                                        }
                                                    ]
                                                })
                                            }
                                        }
                                    })
                                    if (d) {
                                        v.options1.push({
                                            value: val.hid,
                                            label: val.hname,
                                            children: [{
                                                value: val.aid,
                                                label: val.aname,
                                                children: [{
                                                    value: val.gid,
                                                    label: val.gname,
                                                }]
                                            }]
                                        })
                                    }
                                } else {
                                    v.options1.push({
                                        value: val.hid,
                                        label: val.hname,
                                        children: [{
                                            value: val.aid,
                                            label: val.aname,
                                            children: [{
                                                value: val.gid,
                                                label: val.gname,
                                            }]
                                        }]
                                    })
                                }
                            })
                        }
                        if (data.HousSum != null) {
                            v.counts[0].value = new String(data.HousSum.sum)
                            v.counts[0].percentage = 100
                        }
                        if (data.HousCount.length > 0) {
                            data.HousCount.forEach(function (value, i) {
                                v.datas.name.push(value.PartName)
                                v.datas.count.push(value.count)
                            })

                        }
                        this.options = data.Huos;
                        this.optionss = data.Huos;
                        v.counts[2].percentage = Number((k / h * 100).toFixed(0))
                        v.counts[3].percentage = Number(((h - k) / h * 100).toFixed(0))
                        if (data.MaterialStatistics.length > 0) {
                            data.MaterialStatistics.forEach(function (val, i) {
                                if (val.InType == '出库') {
                                    v.counts[5].value = val.thisQty
                                } else {
                                    v.counts[4].value = val.thisQty
                                }
                            })
                        }
                        if (data.Task.length > 0) {
                           
                            layui.each(data.Task, function (index, x) {
                                var date = x.CreatedTime.substring(x.CreatedTime.indexOf("(") + 1, x.CreatedTime.indexOf(")"))
                                var status = "text"
                                var percentage = 0;
                                switch (x.Status) {
                                    case "完成":
                                        status = "success"
                                        percentage = 100;
                                        break;
                                    case "错误":
                                        status = "exception"
                                        break;
                                    case "正在执行":
                                        v.thisTask = x.aid
                                        break;
                                }
                                v.timelineList.push({
                                    aid: x.aid,
                                    statu: x.Status,
                                    type: x.type,
                                    date: parseInt(date),
                                    status: status,
                                    percentage: percentage,
                                    qty: x.QTY
                                })
                                if (x.Status != "完成") {
                                    data.Huos.find(function (x1) {

                                        if (x.ToID == x1.ID) {
                                            var q = x1.StockQTY + x.QTY
                                            x1.PartName = x.PartName
                                            x1.PartSpec = x.PartSpec
                                            x1.Category = '板'
                                            x1.PartMaterial = x.PartMaterial
                                            x1.StockQTY = x1.StockQTY + "=>" + q
                                        } else if (x.FromID == x1.ID) {
                                            var q = x1.StockQTY - x.QTY
                                            x1.StockQTY = x1.StockQTY + "=>" + q
                                            x1.Category = '板'
                                        }

                                    })
                                }
                                if (x.Status == '正在执行') {
                                    v.whComm = x
                                }
                            })
                        }
                    })
                },
                option() {
                    var a = []
                    if (v.form.selectedOptions3 != undefined) {
                        this.options.find(function (x) {
                            if (v.form.selectedOptions3[0] == x.PartName) {
                                if (v.form.selectedOptions3[1] == x.PartSpec) {
                                    if (v.form.selectedOptions3[2] == x.PartMaterial) {
                                        a.push(x)
                                    }
                                }
                            } else if (x.PartName == "空") {
                                a.push(x)
                            }
                        })
                    }
                    return a
                }
            },
            created: function () {
                    this.get()
            },
            computed: {
                timelineStatu() {
                    return this.timelineList.length > 0 ? true : false
                },
                lo() {
                    return {
                        jlo: this.Logging.filter(x => this.toDateString(x.sDate, "yyyy-MM-dd") == this.toDateString(new Date(), "yyyy-MM-dd")).length,
                        jg: this.Logging.filter(x => x.type == "机器故障" && this.toDateString(x.sDate, "yyyy-MM-dd") == this.toDateString(new Date(), "yyyy-MM-dd")).length
                    }
                },
                goodsStatus() {
                    return [{
                        status: '可用',
                        name: '可用',
                        quantitys: this.gQuantity.q1
                    }, {
                        status: '占用',
                        name: '占用',
                        quantitys: this.gQuantity.q2
                    }, {
                        status: '已满',
                        name: '已满',
                        quantitys: this.gQuantity.q3
                    }, {
                        status: '总数',
                        name: '总数',
                        quantitys: this.count
                    }]
                },
                count() {
                    return this.gQuantity.q1 + this.gQuantity.q2 + this.gQuantity.q3
                },
                itemStatus() {
                    var boo = null;
                    var bo1 = [];
                    var bo2 = [];
                    var bo3 = [];
                    layui.each(this.timelineList, function (index, x) {
                        if (x.statu == "正在执行") {
                            boo = x
                        } else if (x.statu == "错误") {
                            bo1.push(x)
                        } else if (x.statu == "完成") {
                            bo3.push(x)
                        } else {
                            bo2.push(x)
                        }
                    })
                    return {
                        boo: boo,
                        bo1: bo1,
                        bo2: bo2,
                        bo3: bo3
                    }
                },
                MoniTime() {
                    return this.taskSetData.MonitoringTime * 1000
                }

            },
            watch: {
                thisTask() {
                    if (this.thisTask != "") {
                            this.setTime()
                    }
                },
                taskSetData() {
                    v.delSuTask()
                },
                counts: {
                    handler: function (val) {
                        if (val[0].value == 0) {
                            v.remind[0].text = "库存已用完"
                            v.remind[0].type = "error"
                            v.remind[0].name = ""
                        } else if (val[0].value < this.taskSetData.InventoryQty) {
                            v.remind[0].text = "当前库存过低，请及时补充"
                            v.remind[0].type = "warning"
                            v.remind[0].name = ""
                        }
                    },
                    deep: true
                },
                mqty: {
                    handler: function (val) {
                        var a = "";
                        val.find(function (x) {
                            if (x.qty == null || x.qty == 0) {
                                a += x.PartName + "库存已用完；"
                                if (v.remind[1].type != "error") {
                                    v.remind[1].type = "error"
                                }
                            } else if (x.qty < v.taskSetData.MaterialQty) {
                                a += x.PartName + "库存过低；"
                                if (v.remind[1].type != "warning" && v.remind[1].type != "error") {
                                    v.remind[1].type = "warning"
                                }
                            }
                        })
                        if (a != "") {
                            v.remind[1].name = ""
                        }
                        v.remind[1].text = "当前物料充足"
                    },
                    deep: true
                },
                datas: {
                    handler: function (val) {
                        var optionw = {
                            title: {
                                text: '物料统计'
                            },
                            color: ['#3398DB'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: val.name,
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '库存数量',
                                    type: 'bar',
                                    barWidth: '60%',
                                    data: val.count
                                }
                            ]
                        }
                        if (this.myChart == "") {
                            this.myChart = this.$echarts.init(document.getElementById('myChart'))
                        }
                        this.myChart.setOption(optionw)
                    },
                    deep: true
                }
            }
        })
        setInterval(() => {
            v.date = util.toDateString(new Date())
        }, 1000);
        if (layui.data('taskSet').taskSetData != undefined) {
            v.taskSetData = layui.data('taskSet').taskSetData
        }
        //if (layui.data('wcs').wcsLength != undefined) {
        //    if (layui.data('wcs').wcsLength > 0) {
        //    v.wcsLength = layui.data('wcs').wcsLength;
        //        v.itemStatus.boo.percentage = layui.data('wcs').percentage;
        //    }
        //}
    }
}()