
var wb;
var rABS = false;
export default {
    template: `
<el-tabs type="border-card">
  <el-tab-pane label="库存信息" >
<el-button @click="addInformation" type="warning">{{addTitle}}</el-button>
<el-badge value="推荐" class="right">
 <el-upload :auto-upload="false" :on-change="excelImport" :show-file-list="false">
<el-button slot="trigger" type="success">excel导入库存</el-button>
</el-upload>
</el-badge>
<el-button @click="excelDownload" type="primary">excel库存模板下载</el-button>
<el-table
      :data="inventoryList" height="850" @row-click="rowClick">
       <el-table-column type="index" prop="ID">
      </el-table-column>
      <el-table-column
        label="物料名称">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.PartName"
  clearable>
</el-input>
<div v-else>{{scope.row.PartName}}</div>
</transition>
</template>
      </el-table-column>
      <el-table-column
        label="物料规格">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.PartSpec"
  clearable>
</el-input>
<div v-else>{{scope.row.PartSpec}}</div>
</transition>
</template>
      </el-table-column>
      <el-table-column
        label="物料材质">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.PartMaterial"
  clearable>
</el-input>
<div v-else>{{scope.row.PartMaterial}}</div>
</transition>
</template>
      </el-table-column>
      <el-table-column
        label="物料类型">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.Type"
  clearable>
</el-input>
<div v-else>{{scope.row.Type}}</div>
</transition>
</template>
      </el-table-column>
      <el-table-column
        label="物料库存" sortable="true">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.sum"
  clearable>
</el-input>
<div v-else>{{scope.row.sum}}</div>
</transition>
</template>
      </el-table-column>
      <el-table-column
        label="操作">
<template slot-scope="scope">
<el-button :key="scope.row.upStatus"
          size="mini"
          @click.stop="handleEdit(scope.row)" type="danger">{{scope.row.upStatus?"确定":"编辑"}}</el-button>
</template>
      </el-table-column>
    </el-table></el-tab-pane>
<el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="20%" :close-on-click-modal="false"
@close="close"
  center>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
  <el-form-item label="选择位置" prop="wh">
    <el-select v-model="ruleForm.wh" filterable placeholder="请选择所调整库存的位置">
    <el-option v-for="item in options"
      :key="item.ID"
      :label="item.Name"
      :value="item.ID">
    </el-option>
  </el-select>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm()">确 定</el-button>
  </span>
</el-dialog>
<el-dialog title="导入信息" :visible.sync="dialogTableVisible" width="50%" @close="close" :close-on-click-modal="false" center>
<el-divider content-position="left">
<el-select v-model="Priority">
    <el-option label="优先以未满货位分配" value="1"></el-option>
  </el-select><span style="margin-left:10px">注:若货位已满部分物料将无法导入</span></el-divider>
  <el-table :data="excelList">
    <el-table-column property="PartName" label="物料名称"></el-table-column>
    <el-table-column property="PartSpec" label="物料规格"></el-table-column>
    <el-table-column property="PartMaterial" label="物料材质"></el-table-column>
    <el-table-column property="Type" label="类型"></el-table-column>
    <el-table-column property="sum" label="数量"></el-table-column>
  </el-table>
<span slot="footer" class="dialog-footer">
    <el-button @click="dialogTableVisible = false">取 消</el-button>
    <el-button type="primary" @click="excelConfirm">确 定</el-button>
 </span>
</el-dialog>
<el-dialog title="库存详情" :visible.sync="rowVisible" width="30%"  center>
  <el-table :data="rowList" height="450">
    <el-table-column type="index"></el-table-column>
    <el-table-column property="Name" label="所在货位"></el-table-column>
    <el-table-column property="StockQTY" label="存放数量"></el-table-column>
  </el-table>
</el-dialog>
</el-tabs>
`,
    data() {
        var validateValue = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择位置'));
            } else {
                callback();
            }
        };
        return {
            addTitle: "新增库存信息",
            rowVisible: false,
            dialogTableVisible: false,
            inventoryList: [],
            centerDialogVisible: false,
            option: [],
            rules: {
                wh: [
                    { validator: validateValue, trigger: 'change' }
                ]
            },
            ruleForm: {
                ID: "",
                qty: "",
                wh: "",
                PartName: "",
                PartSpec: "",
                PartMaterial: "",
                Type: "",
            },
            excelList: [],
            Priority:"1",
            height: 0,
            row: {}
        }
    },
    methods: {
        rowClick(row) {
            if (row.upStatus == false || row.upStatus == "false") {
                ajaxWs(ws, { Class: "WCS", Method: "CheckDetails", Value: row.ID }, e => {
                    this.rowList = JSON.parse(e.data)
                    this.rowVisible = true;
                })
            }
        },
        excelConfirm() {
            var Status = false;
            var s=[]
            var List = this.excelList.filter(x => {
                x.Priority = this.Priority
                if (!/^\d{1,9}$/.test(x.sum)) {
                    Status = true
                    return false
                } else if (!/^\d{1,4}[*]{1}\d{1,4}[*]{1}\d{1,2}$/.test(x.PartSpec)) {
                    Status = true
                    return false
                } else {
                    s.push(x.ID)
                    return true
                }
            })
            if (s.length == this.excelList.length) {
                this.excelList.splice(0, s.length)
            } else {
                s.forEach(x => {
                    this.excelList.forEach((c,i) => {
                        if (c.ID == x) {
                            this.excelList.splice(i, 1)
                        }
                    })
                })
            }
            ajaxWs(ws, { Class: "WCS", Method: "ExcelImport", List })
            if (Status) {
                this.$message({
                    message: '部分物料数量或规格,格式错误,无法导入成功',
                    type: 'warning',
                    duration:6000
                });
            } else {
               this.dialogTableVisible = false;
                this.$message({
                    message: '导入成功',
                    type: 'success',
                    duration: 6000
                });
            }
            
        },
        addInformation() {
            this.addTitle == "取消" ? this.inventoryList.shift() : this.inventoryList.unshift({
                ID: "",
                PartName: "",
                PartSpec: "",
                PartMaterial: "",
                Type: "",
                sum: 0,
                upStatus: true
            })
            this.addTitle = this.addTitle == "取消" ? "新增库存信息" : "取消"
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
                if (rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), {
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                this.excelList = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]).map((x,i) => ({
                        ID:i,
                        PartName: x["物料名称"],
                        PartSpec: x["物料规格"],
                        PartMaterial: x["物料材质"],
                        Type: x["类型"],
                        sum: x["数量"]
                }))
                this.dialogTableVisible = true
            };
            if (rABS) {
                reader.readAsArrayBuffer(obj.raw);
            } else {
                reader.readAsBinaryString(obj.raw);
            }
        },
        excelDownload() {
            location.href = "http://localhost:58655/File/模板.xls";
        },
        init() {
            ajaxWs(ws, { Class: "WCS", Method: "CheckInventory" }, eve => {
                var data = JSON.parse(eve.data)
                data.Inventory.forEach(x => {
                    x.upStatus = false;
                })
                this.inventoryList = data.Inventory;
                this.option = data.options
                this.$nextTick(function () {
                    this.loading.close()
                })
            })
        },
        close() {
            if (this.addTitle != "取消") {
                this.init();
            }
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.resetFields();
            }
        },
        confirm() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    var message = "修改成功"
                    ajaxWs(ws, { Class: "WCS", Method: "UpInventory", data: this.ruleForm })
                    if (this.ruleForm.ID == "") {
                        this.addTitle = "新增库存信息"
                        message = "添加成功"
                    }
                    this.$message({
                        message,
                        type: 'success'
                    });
                    this.centerDialogVisible = false;
                    this.row.upStatus = false;
                } else {
                    return false;
                }
            });

        },
        handleEdit(row) {
            if (row.upStatus) {
                this.row = row;
                this.ruleForm.qty = row.sum - sessionStorage.getItem(row.ID)
                if (row.ID == "") {
                    this.ruleForm.qty = row.sum
                }
                var a = row.PartSpec
                this.height = a.substring(a.lastIndexOf("*") + 1, a.lastIndexOf("")) * Math.abs(this.ruleForm.qty)
                this.ruleForm.ID = row.ID
                this.ruleForm.PartName = row.PartName
                this.ruleForm.PartSpec = row.PartSpec
                this.ruleForm.PartMaterial = row.PartMaterial
                this.ruleForm.Type = row.Type
                if (
                    row.PartName == "" ||
                    row.PartSpec == "" ||
                    row.PartMaterial == "" ||
                    row.Type == "") {
                    this.$message({
                        message: '请填写完整',
                        type: 'error'
                    });
                } else if (!/^\d{1,4}[*]{1}\d{1,4}[*]{1}\d{1,2}$/.test(row.PartSpec)) {
                    this.$message({
                        message: '请输入正确规格格式1~4*1~4*1~2',
                        type: 'error'
                    });
                } else if (row.ID == "") {
                    if (this.ruleForm.qty != "" && this.ruleForm.qty > 0) {
                        if (this.options.length == 0) {
                            this.$message({
                                message: '没有存放的货位',
                                type: 'warning'
                            });
                        } else {
                            this.centerDialogVisible = true
                        }
                    } else {
                        this.$message({
                            message: '请输入正确数量',
                            type: 'error'
                        });
                    }
                } else if (this.ruleForm.qty != 0) {
                    if (this.options.length == 0) {
                        this.$message({
                            message: '没有可操作货位',
                            type: 'warning'
                        });
                    } else {
                        this.centerDialogVisible = true
                    }
                } else {
                    ajaxWs(ws, { Class: "WCS", Method: "UpInventory", data: this.ruleForm })
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    row.upStatus = false;
                    return false
                }
            }
            row.upStatus = true;
            sessionStorage.setItem(row.ID, row.sum)
        }
    },
    created: function () {
        this.init();
    },
    computed: {
        options() {
            return this.option.filter(x => {
                if (this.ruleForm.ID == "") {
                    return x.mid == null && this.height <= x.height
                } else if (this.ruleForm.qty < 0) {
                    return (this.ruleForm.ID == x.mid || x.mid == null) && x.StockQTY >= Math.abs(this.ruleForm.qty)
                } else if (this.ruleForm.qty > 0) {
                    return (this.ruleForm.ID == x.mid || x.mid == null) && this.height <= x.height
                }
            })
        }
    },
    watch: {
    }
}