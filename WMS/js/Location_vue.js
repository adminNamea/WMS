
export default {
    template: `<el-tabs type="border-card">
  <el-tab-pane label="货位信息" >
<el-button type="primary" @click="dialogFormVisible = true">货位创建</el-button>
<el-button :type="heightStatus?'danger':'success'" @click="setHeight">{{heightStatus?"高度设置":"确认设置"}}</el-button>
<el-input-number v-model="num" @change="handleChange" :class="{heightClass:heightStatus}" :min="1" :max="999" label="请输入高度"></el-input-number>
<el-table
      :data="tableData" height="765" @row-click="rowClick">
       <el-table-column type="index" prop="ID">
      </el-table-column>
      <el-table-column>
<template slot="header">
<i class="el-icon-house"></i>
<span>货位名称</span>
 </template>
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.Name"
  clearable>
</el-input>
<div v-else>
<i class="el-icon-house"></i>
<span>{{scope.row.Name}}</span>
</div>
</transition>
</template>
      </el-table-column>
      <el-table-column>
<template slot="header">
<i class="el-icon-rank"></i>
<span>货位高度</span>
 </template>
<template slot-scope="scope">
<el-tag effect="dark">{{scope.row.height}}</el-tag>
</template>
 </el-table-column>
<el-table-column>
<template slot="header">
<i class="el-icon-location"></i>
<span>x坐标</span>
 </template>
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.x"
  clearable>
</el-input>
<div v-else>
<i class="el-icon-location"></i>
<span>{{scope.row.x}}</span>
</div>
</transition>
</template>
      </el-table-column>
<el-table-column>
<template slot="header">
<i class="el-icon-location"></i>
<span>y坐标</span>
 </template>
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.y"
  clearable>
</el-input>
<div v-else><i class="el-icon-location"></i>
<span>{{scope.row.y}}</span></div>
</transition>
</template>
      </el-table-column>
<el-table-column>
<template slot="header">
<i class="el-icon-location"></i>
<span>z坐标</span>
 </template>
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus"
  v-model="scope.row.z"
  clearable>
</el-input>
<div v-else><i class="el-icon-location"></i>
<span>{{scope.row.z}}</span></div>
</transition>
</template>
      </el-table-column>
      <el-table-column>
<template slot="header">
<i class="el-icon-setting"></i>
<span>操作</span>
 </template>
<template slot-scope="scope">
<el-button :key="scope.row.upStatus"
          size="mini"
          @click.stop="handleEdit(scope.row)" :icon="scope.row.upStatus?'el-icon-circle-check':'el-icon-edit'" :type="scope.row.upStatus?'success':'danger'">{{scope.row.upStatus?"确定":"编辑"}}</el-button>
</template>
      </el-table-column>
    </el-table>
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15, 20, 25]"
      :page-size="page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-tab-pane>
<el-dialog title="货位自动生成" :visible.sync="dialogFormVisible" center :close-on-click-modal="false">
  <el-form :model="form" ref="form" :rules="rules">
<el-form-item label="x初始坐标" label-width="120px" prop="newx">
      <el-input v-model.number="form.newx" placeholder="请输入x坐标初始值"></el-input>
    </el-form-item>
<el-form-item label="y初始坐标" label-width="120px" prop="newy">
      <el-input v-model.number="form.newy" placeholder="请输入y坐标初始值"></el-input>
    </el-form-item>
<el-form-item label="x坐标增量" label-width="120px" prop="x">
      <el-input v-model.number="form.x" placeholder="请输入x坐标增量"></el-input>
    </el-form-item>
<el-form-item label="y坐标增量" label-width="120px" prop="y">
      <el-input v-model.number="form.y" placeholder="请输入y坐标增量"></el-input>
    </el-form-item>
<el-form-item label="x最大生成数" label-width="120px" prop="max">
      <el-input v-model.number="form.max" placeholder="请输入x最大生成数"></el-input>
    </el-form-item>
<el-form-item label="y最大生成数" label-width="120px" prop="may">
      <el-input v-model.number="form.may" placeholder="请输入y最大生成数"></el-input>
    </el-form-item>
<el-form-item label="货位高度" label-width="120px" prop="height">
      <el-input v-model.number="form.height" placeholder="请输入货位高度"></el-input>
    </el-form-item>
    <el-form-item label="库位" label-width="120px" prop="z">
      <el-select v-model="form.z" placeholder="选择库位">
        <el-option value="1380" label="库位1"></el-option>
        <el-option value="-1380" label="库位2"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button @click="resetForm">重 置</el-button>
    <el-button type="primary" @click="addConfirm">确 定</el-button>
  </div>
</el-dialog>
<el-dialog
  title="生成结果" :visible.sync="dialogVisible" width="70%" center :close-on-click-modal="false">
<el-divider content-position="left">
<el-select v-model="type" placeholder="选择库位">
        <el-option value="0" label="不覆盖相同货位信息"></el-option>
        <el-option value="1" label="覆盖相同货位信息"></el-option>
      </el-select></el-divider>
  <el-table
      :data="resultData" height="550">
      <el-table-column
        prop="name"
        label="货位名称">
      </el-table-column>
<el-table-column
        prop="height"
        label="货位高度">
      </el-table-column>
      <el-table-column
        prop="x"
        label="x坐标">
      </el-table-column>
      <el-table-column
        prop="y"
        label="y坐标">
      </el-table-column>
<el-table-column
        prop="z"
        label="z坐标">
      </el-table-column>
    </el-table>
<el-pagination
      @size-change="handleSizeChange1"
      @current-change="handleCurrentChange1"
      :current-page="currentPage1"
      :page-sizes="[10, 20, 30]"
      :page-size="page1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total1">
    </el-pagination>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">保 存</el-button>
  </span>
</el-dialog>
</el-tabs>`,
    data() {
        return {
            type:'0',
            dialogVisible: false,
            dialogFormVisible: false,
            goosList: [],
            currentPage: 1,
            total: 0,
            page: 15,
            currentPage1: 1,
            total1: 0,
            page1: 10,
            num: 0,
            form: {
                max: '',
                newx: '',
                newy: '',
                may:'',
                x: '',
                y: '',
                z: '',
                height:''
            },
            rules: {
                height: [
                    { required: true, message: '请输入高度', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }

                ],
                newx: [
                    { required: true, message: '请输入x初始坐标', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }

                ],
                newy: [
                    { required: true, message: '请输入y初始坐标', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }
                ],
                max: [
                    { required: true, message: '请输入y最大生成数', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }
                ],
                may: [
                    { required: true, message: '请输入y最大生成数', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }
                ],
                x: [
                    { required: true, message: '请输入x坐标增量', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }
                ],
                y: [
                    { required: true, message: '请输入y坐标增量', trigger: 'blur' },
                    { type: 'number', message: '请输入数字' }
                ],
                z: [
                    { required: true, message: '请选择库位', trigger: 'change' }
                ]
            },
            heightStatus: true,
            resultList:[]
        }
    },
    methods: {
        submit() {
           var List= this.resultList.map(x => ({
                name: x.name,
                x: x.x,
                y: x.y,
                z: x.z,
                height: x.height,
                type: this.type
            }))
            ajaxWs(ws, { Class: "WCS", Method: "AddGoods", List })
            this.dialogVisible = false;
            this.$message({
                message: '保存成功',
                type: 'success'
            });
            this.init();
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        addConfirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    var obj = [];
                    var name = this.form.z>0?'1':'2'
                    for (var i = 0; i < this.form.max; i++) {
                        for (var j = 0; j < this.form.may; j++) {
                            obj.push(
                                {
                                    name: name + (i+1) + (j+1),
                                    x: this.form.newx + i * this.form.x,
                                    y: this.form.newy + j * this.form.y,
                                    z: this.form.z,
                                    height: this.form.height
                                })
                        }
                    }
                    this.currentPage1 = 1;
                    this.total1 = obj.length
                    this.resultList = obj;
                    this.dialogVisible = true;
                } 
            });
        },
        handleEdit(row) {
            if (row.upStatus) {
                var data = { name: row.Name, x: row.x, y: row.y, z: row.z, ID: row.ID }
                ajaxWs(ws, { Class: "WCS", Method: "UpGoods", data })
            } else {
                this.$notify({
                    title: '提示',
                    message: '如无特殊情况请勿更改坐标',
                    type: 'warning'
                });
            }
            row.upStatus = !row.upStatus;
        },
        setHeight() {
            this.heightStatus = !this.heightStatus
            if (this.heightStatus) {
                ajaxWs(ws, { Class: "WCS", Method: "UpGoods", data: { height: this.num } })
                this.init();
            }
        },
        handleSizeChange(a) {
            this.page = a;
        },
        handleCurrentChange(a) {
            this.currentPage = a;
        },
        handleSizeChange1(a) {
            this.page1 = a;
        },
        handleCurrentChange1(a) {
            this.currentPage1 = a;
        },
        init() {
            ajaxWs(ws, { Class: "WCS", Method: "CheckGoods" }, e => {
                var a = JSON.parse(e.data);
                this.goosList = a.filter(x => {
                    x.upStatus = false;
                    return true;
                })
                this.total = this.goosList.length
                this.num = this.goosList[0] ? this.goosList[0].height:0
                this.$nextTick(() => {
                    this.loading.close()
                })
            })
        }
    },
    created: function () {
        this.init();
    },
    computed: {
        resultData(){
            return this.resultList.slice(this.page1 * (this.currentPage1 - 1), this.page1 * this.currentPage1)
        },
        tableData() {
            return this.goosList.slice(this.page * (this.currentPage - 1), this.page * this.currentPage)
        }
    },
    watch: {
    }
}