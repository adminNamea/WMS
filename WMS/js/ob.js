
!function () {
    "use strict";
    layui.use(['layer', 'util'], function () {
        var layer = layui.layer;
        var util = layui.util;
        var $ = layui.jquery;
        Vue.prototype.$echarts = echarts
        Vue.nextTick(function () {
            render()
        })
        function render() {
            $.get("/WCS/CheckAll", function (data) {
                v.mqty = data.MQTY
                v.Place = [];
                v.vals = []
                v.options1 = []
                v.datas.name = []
                v.datas.count = []
                v.Place = data.Place
                v.options = data.Huos;
                v.wcsComm = data.WcsComm;
                v.optionss = data.Huos;
                v.timelineList = []
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
                    })
                }
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
            })
        }
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
            }else {
                callback();
            }
        }
        var v = new Vue({
            el: "#app",
            data: {
                gQuantity: {
                    q1: 0,
                    q2: 0,
                    q3: 0
                },
                huoType: 1,
                title: "",
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
                        name: '入库总数',
                        value: "0",
                        type: "danger",
                        percentage: 0
                    },
                    {
                        name: '出库总数',
                        value: "0"
                        , type: "danger"
                    },
                    {
                        name: '今日入库',
                        value: "0"
                        , type: "warning",
                        percentage: 0
                    },
                    {
                        name: '今日出库',
                        value: "0"
                        , type: "warning",
                        percentage: 0
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
                    MaterialQty: 0
                },
                rules: {
                    selectedOptions3: [
                        { required: true, message: '请选择物料', trigger: 'change' }],
                    InQTY: [{ validator: CheckQTY, trigger: 'blur' }],
                    To: [{ validator: CheckTo, trigger: 'change' }]
                }
            },
            methods: {
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
                huoTypeComm(c) {
                    this.huoType = c
                },
                selected(e) {
                    v.selects = []
                    v.form.selectedOptions3 = []
                    v.form.PlaceID = e.ID
                    if (e.PartName != null) {
                        v.selectd = true
                        v.form.selectedOptions3 = [e.PartName, e.PartSpec, e.PartMaterial]
                    } else {
                        v.selectd = false
                    }
                    $.get("/WMS/CheckWhMaterial", function (data) {
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
                            } else if (x.Type == value) {
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
                    $.get("/WCS/CheckHousSum", b, function (data) {
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
                            $.post("/WMS/InMaterial", { data: this.form }, function (s) {
                                v.dialogFormVisible = false
                                v.$message({
                                    type: 'success',
                                    message: '提交成功!'
                                });
                                render()
                            })
                        } else {
                            return false;
                        }
                    });
                },
                disabled(o, t) {
                    switch (o.Type) {
                        case "可用":
                            if (o.PartName == null) {
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
                                    $.get("/WMS/PlcIn", { aid: aid }, function (res) {
                                        if (res.msg == "true") {
                                            $.get("/WCS/UpTaskStatu", { aid: aid, status: "正在执行" }, function () {
                                                render()
                                            })
                                            loading.close();
                                            v.$message({
                                                message: "任务" + x.aid + '开始执行',
                                                type: 'success'
                                            });
                                            v.setTime()
                                        } else {
                                            loading.close();
                                            $.get("/WCS/UpTaskStatu", { aid: aid, status: "错误" }, function () {
                                                render()
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
                    $.get("/WCS/CheckPlc", function (data) {
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
                    setTimeout(function () {
                        if (v.wcsComm.length < 2) {
                            v.itemStatus.boo.percentage = v.itemStatus.boo.percentage + 5
                            if (v.itemStatus.boo.percentage > 99) {
                                v.itemStatus.boo.percentage = 100
                            }
                        }
                        $.get("/WCS/CheckPlc", { ip: "192.168.3.30" }, function (data) {
                            console.log(data)
                            var rgv = false;
                            if (data.zdyxz) {
                                v.i = true
                            }
                            if (v.wcsComm[v.wcsLength].type == "入库") {
                                if (data.rkyxq) {
                                    rgv = true
                                }
                            } else if (v.wcsComm[v.wcsLength].type == "出库") {

                                if (data.rkyxc) {
                                    v.stratRgv = true
                                    rgv = true
                                }
                            } else {
                                rgv = true
                            }
                            if (data.msg) {
                                v.su = "无";
                                v.no = "信息读取失败"
                                v.$notify.error({
                                    title: '错误',
                                    message: '连接信息读取失败',
                                    duration: 0
                                });
                                $.get("/WCS/UpTaskStatu", { aid: v.thisTask, status: "错误" })
                                v.itemStatus.boo.status = "exception"
                                v.itemStatus.boo.statu = "错误"

                            } else if (data.gzbj) {
                                $.get("/WCS/Error", { aid: v.thisTask }, function () {
                                    v.$notify.error({
                                        title: '错误',
                                        message: '机器出现故障请及时处理',
                                        duration: 0
                                    });
                                    v.no = "机器故障"
                                    v.itemStatus.boo.status = "exception"
                                    v.itemStatus.boo.statu = "错误"
                                })
                            } else if (v.su == "机器检测中...") {
                                if (data.yxtd) {
                                    $.get("/WMS/PlcIn", { aid: v.itemStatus.boo.aid, wcs: new String(v.wcsLength) }, function (res) {
                                        if (rgv) {
                                            $.get("/WMS/PlcSn", { ip: "192.168.3.30" }, function (data) {

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
                                                    $.get("/WCS/UpTaskStatu", { aid: v.thisTask, status: "错误" })
                                                    v.itemStatus.boo.status = "exception"
                                                    v.itemStatus.boo.statu = "错误"
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    v.setTime()
                                }
                            } else if (v.i) {
                                if (data.ddrwwc) {
                                    v.wcsLength++
                                    var count = v.wcsComm.length - v.wcsLength

                                    if (v.stratRgv) {
                                        $.get("/WCS/StratRGV", { ip: "192.168.3.30" }, function (data) {

                                            v.stratRgv = false

                                        })
                                    }
                                    if (count > 0) {
                                        var hui = true
                                        if (v.wcsLength == 8) {
                                            hui = false
                                            if (data.hydyx) {
                                                hui = true
                                            }
                                        }
                                        if (hui) {
                                            $.get("/WMS/PlcIn", { aid: v.thisTask, wcs: new String(v.wcsLength) }, function (res) {
                                                v.itemStatus.boo.percentage = parseInt(v.itemStatus.boo.percentage + 100 / v.wcsComm.length)
                                                if (res.msg == "true") {
                                                    v.su = "机器检测中...";
                                                    v.i = false;
                                                    v.setTime()
                                                } else {
                                                    v.setTime()
                                                }
                                            })
                                        }
                                    } else {
                                        v.$message({
                                            message: "任务" + v.thisTask + '完成',
                                            type: 'success'
                                        });
                                        $.get("/WCS/SuTask", { aid: v.thisTask }, function () {
                                            render()
                                        })
                                        v.itemStatus.boo.percentage = 100
                                        v.itemStatus.boo.status = "success"
                                        v.itemStatus.boo.statu = "完成"
                                        setTimeout(function () {
                                            v.delSuTask()
                                        }, 1000)
                                    }
                                } else {
                                    v.setTime()
                                }
                            } else if (data.xzyxz) {
                                v.su = "行走运行中"
                                v.setTime()

                            } else if (data.tsyxz) {
                                v.su = "提升运行中"
                                v.setTime()

                            } else if (data.xpyxz) {
                                v.su = "吸盘运行中"
                                v.setTime()

                            } else if (data.xxyxz) {
                                v.su = "下叉运行中"
                                v.setTime()

                            } else if (data.sxyxz) {
                                v.su = "上叉运行中"
                                v.setTime()

                            } else if (data.zdjcz) {
                                v.su = "整垛进出中"
                                v.setTime()
                            } else if (data.dzlqz) {
                                v.su = "单张量取中"
                                v.setTime()

                            } else if (data.zhclz) {
                                v.su = "载货出料中"
                                v.setTime()
                            } else if (data.zhqlz) {
                                v.su = "载货取料中"
                                v.setTime()
                            } else if (data.kndbz) {
                                v.su = "库内叠板中"
                                v.setTime()

                            } else {
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
                            $.get("/WCS/WcsDelSingle", { id: aid, type: "task" }, function (data) {
                                render();
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
                        $.get("/WCS/WcsDelSingle", { id: aid, type: "task" }, function (data) {
                            render();
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
                            render()
                        }
                    });
                    layer.full(i)
                }

            },
            computed: {

                timelineStatu() {
                    return this.timelineList.length > 0 ? true : false
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
                        } else if (x.PartName == null) {
                            a.push(x)
                        }
                        })
                    }
                    return a
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
                        v.remind[1].text = a
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
    })
}()