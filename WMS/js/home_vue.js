
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
    if (!value || value == 0) {
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
<el-dialog
  title="操作详细"
  :visible.sync="centerDialogVisible"
@closed="excelList=[]"
  width="70%"
  center :close-on-click-modal="false">
<el-button @click="addInformation" type="warning">添加操作信息</el-button>
<el-badge value="推荐" style="margin-bottom: 1px;" class="right">
 <el-upload :auto-upload="false" :on-change="excelImport" :show-file-list="false">
<el-button slot="trigger" type="success">excel导入信息</el-button>
</el-upload>
</el-badge>
<el-button @click="excelDownload" type="primary">excel信息模板下载</el-button>
<el-divider content-position="left">
<span style="margin-right:10px">动作:</span>
<el-select @change="execTableChange" v-model="Action">
    <el-option label="入库" value="0"></el-option>
<el-option label="出库" value="1"></el-option>
  </el-select><span style="margin-right:10px;margin-left:10px">优先:</span>
<el-select v-model="Priority" @change="execTableChange">
    <el-option :label="Action=='0'?'放置外侧':'先进先出'" value="0"></el-option>
    <el-option v-if="Action=='0'" label="放置内侧" value="1"></el-option>
  </el-select></el-divider>
 <el-table :data="excelList" class="taskAdd">
    <el-table-column label="物料名称">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus" placeholder="请输入物料名称"
  v-model="scope.row.PartName" @blur="inputBlur"
  clearable>
</el-input>
<div v-else>{{scope.row.PartName}}</div>
</transition>
</template>
</el-table-column>
    <el-table-column label="物料规格">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus" placeholder="(1~4)*(1~4)*(1~2)"
  v-model="scope.row.PartSpec" @blur="inputBlur"
  clearable>
</el-input>
<div v-else>{{scope.row.PartSpec}}</div>
</transition>
</template>
</el-table-column>
    <el-table-column label="物料材质">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus" placeholder="请输入物料材质"
  v-model="scope.row.PartMaterial" @blur="inputBlur"
  clearable>
</el-input>
<div v-else>{{scope.row.PartMaterial}}</div>
</transition>
</template>
</el-table-column>
    <el-table-column label="类型">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus" placeholder="请输入物料类型"
  v-model="scope.row.Type" @blur="inputBlur"
  clearable>
</el-input>
<div v-else>{{scope.row.Type}}</div>
</transition>
</template>
</el-table-column>
    <el-table-column label="数量">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus" placeholder="请输入物料数量"
  v-model.number="scope.row.sum" @blur="inputBlur"
  clearable>
</el-input>
<div v-else>{{scope.row.sum}}</div>
</transition>
</template>
</el-table-column>
<el-table-column
        label="操作">
<template slot-scope="scope">
<el-button :key="scope.row.upStatus" size="small"
          @click="upConfirm(scope.row,scope.$index)" :icon="scope.row.upStatus?'el-icon-circle-check':'el-icon-edit'" :type="scope.row.upStatus?'success':'danger'">{{scope.row.upStatus?"确定":"修改"}}</el-button>
<el-button @click="del(scope.row)" size="small" icon="el-icon-delete-solid" type="danger">删除</el-button>
</template>
      </el-table-column>
  </el-table>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" v-if="excelList.length>0" @click="excelConfirm">确 认!</el-button>
  </span>
</el-dialog>
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
                        <el-col :span="10" style="padding-top:15px">
                            <div class="grid-content bg-purple">
<el-button type="success" icon="el-icon-tickets" @click="centerDialogVisible = true" plain>批量操作</el-button>
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
                                                <el-timeline-item v-if="timelineList.length>0" v-for="(item,index) in timelineList" placement="top"
                                                                  :key="index"
                                                                  :timestamp="toDateString(item.CreationTime,'yyyy-MM-dd','创建日期：')"
                                                                   size="large" :type="taskStatu(item.Status).type">
                                                    <el-card>
<div>任务编号:{{item.TaskID}}
<i style="margin-left: 40px;cursor:pointer;" 
@click="delTask(item.TaskID,item.Status)" 
:class="item.Status=='完成'?'el-icon-close':'el-icon-delete'">
</i></div>
<el-badge :value="item.TaskQty" style="margin: 10px">
   <el-button size="small" :type="taskStatu(item.Status).type" @click="taskDetails(item.TaskID)">查 看</el-button>
</el-badge>                                               
<el-button size="small" 
:loading="item.Status=='正在执行'" 
style="margin:10px" 
:type="taskStatu(item.Status).type" 
:disabled="execTaskList&&item.Status=='开始'"
@click="execTask(item.TaskID)">{{taskStatu(item.Status).text}}
</el-button>
                                                    </el-card>
                                                </el-timeline-item>
                                                <el-timeline-item v-if="timelineList.length==0" :timestamp="date" size="large" placement="top" type="danger">
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
<el-dialog
  title="任务详情"
  :visible.sync="taskDialog"
  width="95%"
  center>
<el-steps :active="execSteps.active" finish-status="success" simple>
  <el-step v-for="(item,index) in execSteps.list" :key="index" :icon="item.icon" :title="item.text" ></el-step>
</el-steps>
<el-row style="margin: 10px;">
  <el-col :span="item.span" v-for="(item,index) in el_colList" :key="index">
<div class="grid-content bg-purple-dark">
<el-tag effect="dark" type="danger">
{{item.text}}
</el-tag>
<div v-if="index<4" style="display: inline-block;">
<i class="el-icon-time" v-if="index!=0"></i>
<span>{{item.value}}</span>
</div>
<div v-else class="progress">
<el-progress class="striped active" :text="item.value==0?'未开始':''"  :text-inside="true" :stroke-width="24" :percentage="item.value" color="#39b54a"></el-progress>
</div></el-col>
</el-row>
<el-tabs tab-position="left" type="border-card" style="height: 350px;">
    <el-tab-pane label="运行列表"><el-table
    v-loading="execLoading"
    :data="execList" height="340">
    <el-table-column
      prop="TaskID"
      label="任务编号">
    </el-table-column>
    <el-table-column
      prop="PartName"
      label="任务物料"
      width="180">
    </el-table-column>
    <el-table-column
      prop="PartSpec"
      label="物料规格">
    </el-table-column>
<el-table-column
      prop="QTY"
      :label="execParent.type+'数量'">
    </el-table-column>
<el-table-column
      prop="ExecutionTime"
      label="执行时间">
<template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.ExecutionTime?scope.row.ExecutionTime:"未开始" }}</span>
      </template>
</el-table-column>
<el-table-column
      prop="Status"
      label="任务状态">
<template slot-scope="scope">
       <el-tag effect="dark" :type="taskStatu(scope.row.Status).type1">{{scope.row.Status}}
<i :class="taskStatu(scope.row.Status).icon"></i>
</el-tag>
      </template>
    </el-table-column>
  </el-table></el-tab-pane>
    <el-tab-pane label="已完成任务">配置管理</el-tab-pane>
</el-tabs>
  <span slot="footer" class="dialog-footer">
    <el-button @click="taskDialog = false">关 闭</el-button>
    <el-button type="primary" @click="execTask(false)" :disabled="execParent.time!='未开始'">开始执行</el-button>
  </span>
</el-dialog>
</el-container>
`,
    data() {
        return {
            execLoading: true,
            taskDialog: false,
            Action:'0',
            gQuantity: {
                q1: 0,
                q2: 0,
                q3: 0
            },
            title: "",
            centerDialogVisible: false,
            optionss: [],
            timelineList: [],
            date: "",
            Place: [],
            mqty: [],
            options: [],
            vals: [],
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
                    name: '货位利用率',
                    value: "",
                    type: "danger",
                    percentage: 0
                },
                {
                    name: '未利用货位',
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
                text: "无货位信息",
                type: "error"
            }, {
                name: "物料提示",
                text: "无物料信息",
                type: "error"
            }],
            Priority: "0",
            selects: [],
            selectd: false,
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
            excelList: [],
            rules: {
                selectedOptions3: [
                    { required: true, message: '请选择物料', trigger: 'change' }],
                InQTY: [{ validator: CheckQTY, trigger: 'blur' }],
                To: [{ validator: CheckTo, trigger: 'change' }]
            },
            sDate: "",
            execList: [],
            taskDate: "未开始",
            taskDate1: "未开始",
            loadings: {
                close: function () {
                    return "";
                }
            },
            pro: 0,
            WcsComm: 0,
            myVar:""
        }
    },
    methods: {
        delTask(taskID, status) {
            var Type = "0"
            if (status == "完成") {
                Type = "1"
            } else if (status == "正在执行") {
                Type = "2"
                this.$confirm('任务正在执行确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajaxWs(ws, { Method: "DelTask", Value: taskID, Type })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {

                });
                return
            }
            
            ajaxWs(ws, { Method: "DelTask", Value: taskID, Type })
            if (Type == "1") {
                this.$message({
                    title: '提示',
                    message: '移除成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    title: '提示',
                    message: '删除成功',
                    type: 'error'
                });
            }
        },
        execTask(taskID) {
            var Value = taskID ? taskID : this.execList[0].TaskID
            this.loading = this.$loading({
                lock: true,
                text: '正在执行中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            ajaxWs(ws, { Class: "WCS", Method: "ExecTask", Value }, e => {
                var data = JSON.parse(e.data);
                if (typeof (data) == "object") {
                    data.forEach(x => {
                        if (x.Status == "正在执行") {
                            x.ExecutionTime = this.toDateString(x.ExecutionTime)
                        }
                    })
                    this.execList = data;
                    this.$nextTick(() => {
                        this.loadings.close()
                    })
                } else {
                    this.$message({
                        title: '提示',
                        message: data,
                        type: 'error'
                    });
                }
            })
        },
        taskDetails(TaskID) {
            ajaxWs(ws, { Class: "WCS", Method: "ExecList", Value: TaskID }, res => {
                var data = JSON.parse(res.data)
                data.forEach(x => {
                    if (x.Status == "正在执行") {
                        x.ExecutionTime = this.toDateString(x.ExecutionTime)
                    }
                })
                this.execList = data;
                this.execLoading = false;
            })
            this.taskDialog = true;
        },
        taskStatu(status) {
            var obj = { type1:"info", type: "primary", text: "开 始", icon: "", status: true }
            if (status == "错误") {
                obj.type = "danger";
                obj.text = "机器故障";
                obj.status = false;
            } else if (status == "完成") {
                obj.type = "success";
                obj.text = "任务完成";
            } else if (status == "正在执行") {
                obj.text = "正在执行";
                obj.type1 = "warning";
                obj.icon ="el-icon-loading"
            }
            return obj;
        },
        upConfirm(row, index) {
            var a = document.querySelectorAll(".taskAdd .el-table__body tr")[index]
            a.querySelectorAll("div").forEach(x => {
                x.classList.remove("divColor")
            })
            if (row.upStatus) {
                var message = "";
                a.querySelectorAll("input").forEach((x, i) => {
                    if (x.value == "" || x.value == "空") {
                        message = `请填写完整`;
                        x.classList.add("tableBur")
                        x.focus();
                    } else if (i == 1) {
                        if (!/^\d{1,4}[*]{1}\d{1,4}[*]{1}\d{1,2}$/.test(x.value)) {
                            message = `规格${x.value},格式不正确`;
                            x.classList.add("tableBur")
                            x.focus();
                        }
                    } else if (i == 4) {
                        if (!/^\d{1,9}$/.test(x.value) || x.value <= 0) {
                            message = `数量${x.value},不是有效数值`;
                            x.classList.add("tableBur")
                            x.focus();
                        }
                    }
                })
                if (message != "") {
                    this.$message({
                        message,
                        type: 'error',
                        duration: 6000
                    });
                } else {
                    row.upStatus = false;
                }
            } else {
                row.upStatus = true;
            }
        },
        inputBlur(e) {
            if (e.target.value != "") {
                e.target.classList.remove("tableBur")
            }
        },
        del(row) {
            this.excelList.forEach((x, i) => {
                if (x.ID == row.ID) {
                    this.excelList.splice(i, 1)
                }
            })
        },
        execTableChange() {
            this.excelList.forEach(x => {
                x.Priority = this.Priority;
                x.Action = this.Action;
            })
            if (this.Action == '1') {
                this.Priority='0'
            }
        },
        fixdata(data) {
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        },
        excelImport(obj) {
            var reader = new FileReader();
            reader.onload = e => {
                var data = e.target.result;
                var wb;
                if (false) {
                    wb = XLSX.read(btoa(fixdata(data)), {
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]).forEach((x, i) => {
                    var status = true;
                    this.excelList.forEach(y => {
                        if (y.PartName == x["物料名称"] && y.PartSpec == x["物料规格"] && y.PartMaterial == x["物料材质"]) {
                            y.sum += Number(x["数量"]);
                            status = false;
                            return false
                        }
                    })
                    if (status) {
                        this.excelList.push({
                            ID: i,
                            PartName: x["物料名称"] ? x["物料名称"] : "空",
                            PartSpec: x["物料规格"] ? x["物料规格"] : "空",
                            PartMaterial: x["物料材质"] ? x["物料材质"] : "空",
                            Type: x["类型"] ? x["类型"] : "空",
                            sum: x["数量"] | 0,
                            Priority: this.Priority,
                            Action: this.Action,
                            upStatus: false
                        })
                    }
                })
            };
            if (false) {
                reader.readAsArrayBuffer(obj.raw);
            } else {
                reader.readAsBinaryString(obj.raw);
            }
        },
        excelDownload() {
            location.href = "http://localhost:58655/File/模板.xls";
        },
        excelConfirm() {
            var message = "";
            var p = [], s = [];
            if (this.excelList.some(x => x.upStatus)) {
                this.$message({
                    message: "请先确认修改",
                    type: 'warning',
                    duration: 6000
                });
                return
            }
            var a = document.querySelectorAll(".taskAdd .el-table__body tr")
            a.forEach(y => {
                y.querySelectorAll(".cell").forEach((x, i) => {
                    if (x.innerText == "" || x.innerText == "空") {
                        message = `请输入填写完整`
                        x.classList.add("divColor")
                    } else if (i == 4) {
                        if (!/^\d{1,9}$/.test(x.innerText) || x.innerText <= 0) {
                            s.push(x.innerText);
                            x.classList.add("divColor")
                        }
                    } else if (i == 1) {
                        if (!/^\d{1,4}[*]{1}\d{1,4}[*]{1}\d{1,2}$/.test(x.innerText)) {
                            p.push(x.innerText);
                            x.classList.add("divColor")
                        }
                    }
                })
            })
            if (p.length > 0) {
                message = `规格${p.toString()},格式不正确`
            }
            if (s.length > 0) {
                message = `数量${s.toString()},不是有效数值`
            }
            if (message != "") {
                this.$message({
                    message,
                    type: 'error',
                    duration: 6000
                });
                return;
            }
            var no = this.timelineList.length
            var List = this.excelList.map(x => ({
                taskID: x.Action == '0' ? 'In_' + no : 'Out_' + no,
                partName: x.PartName,
                partSpec: x.PartSpec,
                partMaterial: x.PartMaterial,
                qty: x.sum,
                action: x.Action,
                priority: x.Priority
            }))
            ajaxWs(ws, { Class: "WCS", Method: "CreateTask", List})
            this.$message({
                message: "任务创建成功",
                type: 'warning',
                duration: 6000
            });
            this.centerDialogVisible = false;
        },
        addInformation() {
            this.excelList.unshift({
                ID: this.excelList.length,
                PartName: "",
                PartSpec: "",
                PartMaterial: "",
                Type: "",
                sum: "",
                Priority: this.Priority,
                Action: this.Action,
                upStatus: true
            })
        },
        timeAgo() {
            var i = this
                i.taskDate = i.toDateString(new Date() - new Date(i.execParent.timeAll), "mm:ss");
                i.taskDate1 = i.toDateString(new Date() - new Date(i.execParent.thisTime), "mm:ss");
                if (i.myVar == "") {
                    i.myVar = setInterval(() => {
                    i.taskDate = i.toDateString(new Date() - new Date(i.execParent.timeAll), "mm:ss");
                    i.taskDate1 = i.toDateString(new Date() - new Date(i.execParent.thisTime), "mm:ss");
                }, 1000)
            }
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
            if (value.length > 1) {
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
                v.counts[1].value = data.qty
                if (data.h != 0) {
                    v.counts[1].percentage = (data.h / data.sh) * 100
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
        arr(a) {
            if (a.length < 2) {
                return a;
            }
            var d = a[0]
            const ccc = [];
            a.forEach((x, index) => {
                if (x.children != undefined) {
                    if (index > 0) {
                        if (String(x.value) == String(d.value)) {
                            d.children = d.children.concat(x.children)
                            d.children = v.arr(d.children)
                            if (a.length - 1 == index) {
                                ccc.push(Object.freeze(d))
                            }
                        } else {
                            ccc.push(Object.freeze(d))
                            d = x
                            if (a.length - 1 == index) {
                                ccc.push(Object.freeze(d))
                            }
                        }
                    }
                } else {
                    ccc.push(Object.freeze(x))
                }
            })
            return ccc
        },
        init(data) {
            var k = 0;
            var h = 0;
            this.timelineList = data.Task.map(x => Object.freeze(x));
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
            data.Huos.forEach(function (x) {
                h++;
                if (x.StockQTY > 0 || typeof x.StockQTY == "string") {
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

                v.counts[0].value = String(data.HousSum.sumQty)
                v.counts[0].percentage = 100
            }
            if (data.HousCount.length > 0) {
                data.HousCount.forEach(function (value) {
                    v.datas.name.push(value.PartName)
                    v.datas.count.push(value.count)
                })

            }
            this.options = data.Huos.map(x => Object.freeze(x));
            this.optionss = data.Huos.map(x => Object.freeze(x));
            v.counts[2].percentage = Number((k / h * 100).toFixed(0)) | 0
            v.counts[3].percentage = Number(((h - k) / h * 100).toFixed(0)) | 0
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
            v.WcsComm = data.WcsComm
            v.selects = [];
            v.Place = [];
            v.vals = []
            v.options1 = []
            v.datas.name = []
            v.datas.count = []
            v.Place = data.Place
            v.init(data)
            v.$nextTick(function () {
               this.loading.close()
            })
        };
        mws.send("init")
    },
    computed: {
        execTaskList() {
            return this.timelineList.find(x => x.Status == "正在执行")
        },
        el_colList() {
            var obj = [
                { text: "任务执行类型:", span: 4, value: this.execParent.type },
                { text: "任务开始时间:", span: 4, value: this.execParent.time },
                { text: "任务总共用时:", span: 4, value: this.taskDate},
                { text: "当前任务用时:", span: 4, value: this.taskDate1},
                { text: "当前任务进度:", span: 8, value: this.execParent.pro},
            ]
            return obj;
        },
        execParent() {
            if (this.execList.length == 0) {
                return {}
            }
            var exec = {
                type: this.execList[0].type,
                thisTime: this.execList[0].ExecutionTime
            }
            var obj = Object.assign(exec, this.timelineList.find(x => x.TaskID.includes(this.execList[0].TaskID)))
            return {
                type: obj.type == "0" ? "入库" : "出库",
                time: obj.ExecTime == null ? "未开始" : this.toDateString(obj.ExecTime),
                timeAll: obj.ExecTime == null ? 0 : this.toDateString(obj.ExecTime),
                thisTime: obj.thisTime == null ? 0 : this.toDateString(obj.thisTime),
                pro: this.pro
            }
        },
        execSteps() {
            var obj = { active: -1, list: [] }
            obj.list=this.execList.map((x, i) => {
                var icon = "";
                if (x.Status == "正在执行") {
                    obj.active = i;
                    icon="el-icon-loading"
                }
                return {
                    text: x.PartName,
                    icon
                }
            })
            return obj
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
        }

    },
    watch: {
        execList(val) {
            if (val[0].ExecutionTime != null) {
                this.timeAgo();
                if (this.WcsComm.length > 0) {
                    var len = this.WcsComm.length;
                    var a = this.WcsComm.filter(x => x.Statu == "完成").length + 1
                    this.pro = Number((a / len) * 100).toFixed(0)
                }
            } else {
                clearInterval(this.myVar)
                this.myVar = "";
                this.pro = 0;
                this.taskDate = "未开始"
                this.taskDate1 = "未开始"
            }
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
                } else {
                    v.remind[0].text = "库存充足"
                    v.remind[0].type = "success"
                }
            },
            deep: true
        },
        mqty(val) {
                var a = "";
                val.find((x) => {
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
                    } else {
                        v.remind[1].text = "物料充足"
                        v.remind[1].type = "success"
                    }
                })
                if (a != "") {
                    v.remind[1].name = ""
                    v.remind[1].text = a;
                }
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