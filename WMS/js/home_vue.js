
var v;
var optionw;
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
export default {
    template: `
 <el-container>
                <el-header>
                    <el-row>
                        <el-col :span="8">
                            <div class="grid-content bg-purple" style="height:50px;text-align:left">
                                <div v-for="o in remind" style=" box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);height:100%;width:40%; display:inline-block;margin:5px">
                                    <el-alert :title="o.name"
                                              :type="o.type"
                                              :closable="false"
                                              :description="o.text"
                                              show-icon style="height:100%;padding:0;overflow:auto;">
                                    </el-alert>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="14" style="text-align:center;padding-top:15px">
                            <div class="grid-content bg-purple">
                                <el-tag type="warning">物料查询<i class="el-icon-search"></i></el-tag>
                                <el-cascader :options="vals"
                                             filterable
                                             @change="Change_a"
                                             placeholder="名称/规格/材质"
                                             :clearable="true">
                                </el-cascader>
                                <el-tag type="warning">位置查询<i class="el-icon-search"></i></el-tag>
                                <el-cascader :options="options1"
                                             filterable
                                             :change-on-select="true"
                                             @change="Change_a"
                                             placeholder="仓库/库区/库位"
                                             :clearable="true">
                                </el-cascader>
                                <el-button type="success" icon="el-icon-tickets" @click="zhzy" :disabled="guz" plain>智能操作</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-header>
                <el-main>
                    <el-row>
                        <el-col :span="5">
                            <div class="grid-content bg-purple">
                                <div>
                                    <div v-for="item in goodsStatus" class="text item" style="display:inline-block;margin:10px">
                                        <el-badge :value="item.quantitys" class="item">
                                            <el-tag type="warning">货位状态</el-tag>
                                            <el-button :type="typeClass(item.status)" @click="Change_a(item.status)">{{item.name}}</el-button>
                                        </el-badge>
                                    </div>
                                </div>
                                <div id="myChart" style="height:200px"></div>
                                <el-tag type="warning">预计物料<i class="el-icon-search"></i></el-tag>
                                <el-cascader :options="vals"
                                             filterable
                                             @change="selectChange_b"
                                             placeholder="名称/规格/材质"
                                             :clearable="true">
                                </el-cascader>
                                <div v-for="o in counts" style=" box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);width:40%;height:100%;display:inline-block;margin:5px">
                                    <el-tag :type="o.type" style="height:100%;width:100%;">{{o.name}}</el-tag>
                                    <el-progress v-if="o.value!=''" :text="o.value" type="circle" :percentage="o.percentage" :color="o.type=='warning'?'#8e71c7':''" :width="100"></el-progress>
                                    <el-progress v-else type="circle" :width="100" :percentage="o.percentage"></el-progress>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <div class="grid-content bg-purple">
                                <div>
                                    <el-table :data="options"
                                              style="width: 100%"
                                              height="800">
                                        <el-table-column type="expand">
                                            <template slot-scope="props">
                                                <el-form label-position="left" class="demo-table-expand">
                                                    <el-form-item label="物料：">
                                                        <span>{{props.row.PartName}}</span>
                                                    </el-form-item>
                                                    <el-form-item label="规格：">
                                                        <span>{{props.row.PartSpec}}</span>
                                                    </el-form-item>
                                                    <el-form-item label="材质：">
                                                        <span>{{props.row.PartMaterial}}</span>
                                                    </el-form-item>
                                                    <el-form-item label="已用空间：">
                                                        <div style="width:200px;display:inline-block">
                                                            <el-progress :text-inside="true"
                                                                         :stroke-width="18"
                                                                         :percentage="houPercentage(props.row)">
                                                            </el-progress>
                                                        </div>

                                                    </el-form-item>
                                                </el-form>

                                            </template>
                                        </el-table-column>
                                        <el-table-column label="货位"
                                                         prop="Name">
                                        </el-table-column>
                                        <el-table-column label="物料类型"
                                                         prop='Category'>
                                            <template slot-scope="scope">
                                                <el-tag :type="scope.row.Category=='空'?'info':typeClass(scope.row.Type)"
                                                        disable-transitions>{{scope.row.Category}}</el-tag>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="数量"
                                                         prop='StockQTY'
                                                         sortable>
                                            <template slot-scope="scope">
                                                <el-tag style="font-size:24px" :hit="true" :type="scope.row.StockQTY==0?'danger':''"
                                                        disable-transitions>{{scope.row.StockQTY}}</el-tag>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="状态"
                                                         prop="Type">
                                            <template slot-scope="scope">
                                                <el-tag :type="typeClass(scope.row.Type)"
                                                        disable-transitions>{{scope.row.Type}}</el-tag>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作">
                                            <template slot-scope="scope">
                                                <el-button size="mini"
                                                           :disabled="disabled(scope.row,'入库')"
                                                           @click="selected(scope.row,command(1))">入库</el-button>
                                                <el-button size="mini"
                                                           :disabled="disabled(scope.row,'出库')"
                                                           @click="selected(scope.row,command(2))">出库</el-button>
                                                <el-button size="mini"
                                                           type="primary"
                                                           :disabled="disabled(scope.row,'调整')"
                                                           @click="selected(scope.row,command(3))">调整</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="grid-content bg-purple">
                                <el-tabs tab-position="top">
                                    <el-tab-pane>
                                        <span slot="label"><i class="el-icon-date"></i>任务队列</span>
                                        <div>
                                            <el-timeline>
                                                <el-timeline-item v-if="timelineStatu" v-for="(item,index) in timelineList" placement="top"
                                                                  :key="index"
                                                                  :timestamp="toDateString(item.Time,'yyyy-MM-dd','创建日期：')"
                                                                  size="large"
                                                                  :type="itemStatu(item.statu).types">
                                                    <el-card>
                                                        <i :class="itemStatu(item.statu).icon" style=" float:right;cursor:pointer" @click="cofp(item.statu,item.aid)"></i>

                                                        <div class="task">
                                                            <p>任务编号：{{item.aid}}</p>
                                                            <p>任务类型：{{item.type}}</p>
                                                            <p>任务状态：{{item.statu}}</p>
                                                            <p>创建于：{{toDateString(item.Time,'HH:mm:ss')}}</p>
                                                        </div>
                                                        <div>
                                                            <p @click="progress(item.aid)" style="cursor:pointer">
                                                                <el-progress type="circle"
                                                                             :percentage="item.percentage"
                                                                             :status="item.status"
                                                                             :text="itemStatu(item.statu,item.percentage).text"
                                                                             :width="100"></el-progress>
                                                            </p>
                                                        </div>
                                                    </el-card>
                                                </el-timeline-item>
                                                <el-timeline-item v-if="!timelineStatu" :timestamp="date" size="large" placement="top" type="danger">
                                                    <el-card>
                                                        任务还没有创建
                                                    </el-card>
                                                </el-timeline-item>
                                            </el-timeline>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </el-col>
                    </el-row>
                </el-main>
<el-dialog :title="title"
                       :visible.sync="dialogFormVisible"
                       width="30%"
                       @closed="resetForm"
                       center>
                <el-form ref="form" :model="form" :rules="rules" status-icon>
                    <el-form-item :label="title+'物料'" label-width="100px" prop="selectedOptions3">
                        <el-cascader :options="selects"
                                     v-model="form.selectedOptions3"
                                     filterable
                                     placeholder="名称/规格/材质"
                                     :clearable="true"
                                     :disabled="selectd">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item :label="title+'数量'" label-width="100px" prop="InQTY">
                        <el-input v-model="form.InQTY" placeholder="请输入数量" style="width:51%"></el-input>
                    </el-form-item>
                    <el-form-item :label="title+'位置'" label-width="100px" v-if="title!='调整'" prop="To">
                        <el-select v-model="form.To" placeholder="请选择位置">
                            <el-option v-for="item in Place"
                                       :key="item.ID"
                                       :label="item.Name"
                                       :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="放置点" label-width="100px" v-if="title=='调整'" prop="To">
                        <el-select v-model="form.To" placeholder="请选择位置">
                            <el-option v-for="item in option()"
                                       :key="item.ID"
                                       :label="item.Name"
                                       :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </el-dialog>
            </el-container>
`,
    data() {
        return {
            whComm: {},
            gQuantity: {
                q1: 0,
                q2: 0,
                q3: 0
            },
            title: "",
            guz: true,
            optionss: [],
            wcsComm: [],
            timelineList: [],
            su: "机器检测中...",
            no: "无",
            thisTask: "",
            wcsLength: 0,
            date: "",
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
            rules: {
                selectedOptions3: [
                    { required: true, message: '请选择物料', trigger: 'change' }],
                InQTY: [{ validator: CheckQTY, trigger: 'blur' }],
                To: [{ validator: CheckTo, trigger: 'change' }]
            },
            rgv: false,
            sDate: ""
        }
    },
    methods: {
        taskCancel(b) {
            if (b) {
                localStorage.setItem("taskSet", JSON.stringify(this.SetData))
            }
            this.centerDialogVisible = false
            if (localStorage.getItem('taskSet')) {
                this.SetData = JSON.parse(localStorage.getItem('taskSet'))
            }
        },
        machineInfo() {
            this.$notify({
                title: '机器信息',
                position: 'top-left',
                dangerouslyUseHTMLString: true,
                message: '<strong><i>机器信息</i></strong>',
                duration: 0
            });
        },
        wcsControl(type) {

            //this.loading = this.$loading({
            //    lock: true,
            //    text: '执行中',
            //    spinner: 'el-icon-loading',
            //    background: 'rgba(0, 0, 0, 0.7)'
            //});
            //this.ajaxWs(ws,{ ip: "192.168.1.130", type: type, Method: "PlcOperation" }, (eve) => {
            //    var data = JSON.parse(eve.data)
            //    this.loading.close()
            //})
        },
        zhzy() {
            this.$http.get("/WCS/zhzy").then(() => {
                mws.send("init");
            })
        },
        digit(t, e) {
            var i = "";
            t = String(t),
                e = e || 2;
            for (var a = t.length; a < e; a++)
                i += "0";
            return t < Math.pow(10, e) ? i + (0 | t) : t
        },
        toDateString(t, e, text) {
            var i = this
                , a = new Date(t || new Date)
                , n = [i.digit(a.getFullYear(), 4), i.digit(a.getMonth() + 1), i.digit(a.getDate())]
                , r = [i.digit(a.getHours()), i.digit(a.getMinutes()), i.digit(a.getSeconds())];
            e = e || "yyyy-MM-dd HH:mm:ss"
            var date = e.replace(/yyyy/g, n[0]).replace(/MM/g, n[1]).replace(/dd/g, n[2]).replace(/HH/g, r[0]).replace(/mm/g, r[1]).replace(/ss/g, r[2])
            return text == undefined ? date : text + date
        },
        Loggings(type) {
            if (localStorage.Logging != undefined) {
                var aa = JSON.parse(localStorage.Logging)
                aa.push({ name: this.itemStatus.boo.Name, sDate: this.sDate, eDate: this.toDateString(), type: type })
                localStorage.Logging = JSON.stringify(aa)
            } else {
                var aa = []
                aa.push({ name: this.itemStatus.boo.Name, sDate: this.sDate, eDate: this.toDateString(), type: type })
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
        selected(e, fu) {
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
        },
        Change_a(value) {
            var newOption = [];
            this.options = this.optionss
            if (value.length > 0) {
                this.options.forEach(function (x) {
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
            v.$http.get("/WCS/CheckHousSum", { params: b }).then(function (res) {
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
                    this.$http.post("/WMS/InMaterial", { data: this.form }, { emulateJSON: true }).then(function () {
                        v.dialogFormVisible = false
                        v.$message({
                            type: 'success',
                            message: '提交成功!'
                        });
                        mws.send("init")
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
                                var res = data.body
                                if (res.msg == "true") {
                                    v.$http.get("/WCS/UpTaskStatu", {
                                        params: { aid: aid, status: "正在执行" }
                                    }).then(function () {
                                        mws.send("init")
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
                                    }).then(function () {
                                        mws.send("init")
                                    })
                                    v.no = res.msg
                                    v.$message.error("任务" + x.aid + '执行失败,原因:' + res.msg);
                                }
                            })
                        }, 500);
                        return true
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
                            a.bo3.forEach(va => {
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
                                a.bo1.forEach(va => {
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
            v.wcsLength == 0 ? this.sDate = this.toDateString() : ""
            setTimeout(() => {
                this.guz = true
                if (v.wcsComm.length < 2) {
                    v.itemStatus.boo.percentage += 2
                    if (v.itemStatus.boo.percentage > 99) {
                        v.itemStatus.boo.percentage = 100
                    }
                }
                v.$http.get("/WCS/CheckPlc", {
                    params: { ip: "192.168.3.30" }
                }).then((res) => {
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
                        }).then(() => {
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
                            v.$http.get("/WMS/PlcIn", {
                                params: {
                                    aid: v.itemStatus.boo.aid, wcs: new String(v.wcsLength)
                                }
                            }).then(data => {
                                if (data.msg == "true") {
                                    if (v.wcsComm[v.wcsLength].type != "回原点") {
                                        if (v.rgv) {
                                            v.$http.get("/WMS/PlcSn", {
                                                params: { ip: "192.168.3.30" }
                                            }).then((res) => {
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
                                }).then(function () {
                                    v.stratRgv = false
                                })
                            }
                            if (count > 0) {
                                var hui = true
                                if (v.wcsComm[v.wcsLength].type == "回原点") {
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
                                //     mws.send("init")
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
                                }, 20000)
                            }
                        } else {
                            v.setTime()
                        }
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
            this.timelineList.forEach(x => {
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
                        mws.send("init");
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
                    mws.send("init");
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
        arr(a) {
            if (a.length < 2) {
                return a;
            }
            var d = a[0];
            const ccc = [];
            a.forEach((x, index) => {
                if (x.children != undefined) {
                    if (index > 0) {
                        if (String(x.value) == String(d.value)) {
                            d.children = d.children.concat(x.children)
                            d.children = v.arr(d.children)
                            if (a.length - 1 == index) {
                                ccc.push(d)
                            }
                        } else {
                            ccc.push(d)
                            d = x
                            if (a.length - 1 == index) {
                                ccc.push(d)
                            }
                        }
                    }
                } else {
                    ccc.push(x)
                }
            })
            return ccc
        },
        init(data) {
            var k = 0;
            
            var h = 0;
            if (data.WhMaterial.length > 0) {
                data.WhMaterial.forEach(val => {
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
                })
                v.selects = v.arr(v.selects)
            }
            if (this.wcsComm.length > 0) {
                this.guz = true
            } else {
                this.guz = false
            }
            this.timelineList = []
            if (data.Task.length > 0) {
                data.Task.forEach(x => {
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
                        Time: x.CreatedTime,
                        status: status,
                        percentage: percentage,
                        qty: x.QTY
                    })
                    if (x.Status != "完成") {
                        data.Huos.forEach(function (x1) {
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
            data.Huos.forEach(function (x) {
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
                data.WhMaterial.forEach(val => {
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
                })
                v.vals = v.arr(v.vals)
            }
            if (data.Counts.length > 0) {
                data.Counts.forEach(val => {
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
                })
                v.options1 = v.arr(v.options1)
            }
            if (data.HousSum != null) {

                v.counts[0].value = String(data.HousSum.sum)
                v.counts[0].percentage = 100
            }
            if (data.HousCount.length > 0) {
                data.HousCount.forEach(function (value) {
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
        v = this;
        mws.onmessage = (evt) => {
            var data = JSON.parse(evt.data);
            v.mqty = data.MQTY
            v.selects = [];
            v.Place = [];
            v.vals = []
            v.options1 = []
            v.datas.name = []
            v.datas.count = []
            v.Place = data.Place
            v.wcsComm = data.WcsComm;
            v.init(data)
            console.log(1)
            v.$nextTick(function () {
                this.loading.close()
            })
        };
        mws.send("init")
    },
    computed: {
        lo() {
            return {
                jlo: this.Logging.filter(x => this.toDateString(x.sDate, "yyyy-MM-dd") == this.toDateString(new Date(), "yyyy-MM-dd")).length,
                jg: this.Logging.filter(x => x.type == "机器故障" && this.toDateString(x.sDate, "yyyy-MM-dd") == this.toDateString(new Date(), "yyyy-MM-dd")).length
            }
        },
        timelineStatu() {
            return this.timelineList.length > 0 ? true : false
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
            this.timelineList.forEach((index, x) => {
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
                val.find( (x)=> {
                    if (x.qty == null || x.qty == 0) {
                        a += x.PartName + "库存已用完；"
                        if (v.remind[1].type != "error") {
                            v.remind[1].type = "error"
                        }
                    } else if (x.qty < this.taskSetData.MaterialQty) {
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
                optionw = {
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
                if (document.getElementById('myChart') != null) {
                    if (this.myChart == "") {
                        this.myChart = this.$echarts.init(document.getElementById('myChart'))
                    }
                    this.myChart.setOption(optionw)
                }
            },
            deep: true
        }
    }
}
setInterval(() => {
    v.date = v.toDateString()
}, 1000);