
export default {
    template: `
<el-tabs type="border-card">
  <el-tab-pane label="库存信息"><el-table
      :data="inventoryList" height="850">
       <el-table-column type="index" prop="ID">
      </el-table-column>
      <el-table-column
        label="物料名称">
<template slot-scope="scope">
<transition name="slide-fade" mode="out-in">
<el-input v-if="scope.row.upStatus==false"
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
<el-input v-if="scope.row.upStatus==false"
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
<el-input v-if="scope.row.upStatus==false"
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
<el-input v-if="scope.row.upStatus==false"
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
<el-input v-if="scope.row.upStatus==false"
  v-model="scope.row.sum"
  clearable>
</el-input>
<div v-else>{{scope.row.sum}}</div>
</transition>
</template>
      </el-table-column>
<el-table-column prop="NotQty" label="未分配数量">
      </el-table-column>
      <el-table-column
        label="操作">
<template slot-scope="scope">
<el-button :key="scope.row.upStatus"
          size="mini"
          @click="handleEdit(scope.row)">{{button}}</el-button>
        <el-button
</template>
      </el-table-column>
    </el-table></el-tab-pane>
  <el-tab-pane label="库存设置">配置管理</el-tab-pane>
<el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
<div style="text-align:center">
<el-select v-model="value" filterable placeholder="请选择所调整库存的位置">
    <el-option v-for="item in options"
      :key="item.ID"
      :label="item.Name"
      :value="item.ID">
    </el-option>
  </el-select>
</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm()">确 定</el-button>
  </span>
</el-dialog>
</el-tabs>
`,
    data() {
        return {
            inventoryList: [],
            button: "编辑",
            centerDialogVisible: false,
            option: [],
            value: "",
            rowid: 0,
            height: 0,
            qty: 0,
            objs: {}
        }
    },
    methods: {
        confirm() {
            this.objs.wh =this.value
            ajaxWs(ws, { Class: "WCS", Method: "UpInventory", data:this.objs })
        },
        handleEdit(row) {
            this.button = row.upStatus ?"确定":"编辑";
            row.upStatus = !row.upStatus;
            if (row.upStatus) {
                this.qty = row.sum - sessionStorage.getItem(row.ID)
                this.rowid = row.ID
                var a = row.PartSpec
                this.height = a.substring(a.lastIndexOf("*") + 1, a.lastIndexOf("")) * Math.abs(this.qty)
                this.objs = 
                    {
                        qty: this.qty,
                        ID: row.ID,
                        PartName: row.PartName,
                        PartSpec: row.PartSpec,
                        PartMaterial: row.PartMaterial,
                        Type: row.Type
                    }
                if (this.qty != 0) {
                    this.value = ""
                    this.centerDialogVisible = true
                    if (this.options.length == 0) {
                        this.$message({
                            message: '没有满足的货位',
                            type: 'warning'
                        });
                    }
                } else {
                   this.confirm()
                }
            }
            //ajaxWs(ws, { Class: "WCS", Method: "UpInventory", data: row  }, eve => {
                    //    var data = JSON.parse(eve.data)
                    //    console.log(data)
            //})
            sessionStorage.setItem(row.ID, row.sum)
            
        }
    },
    created: function () {
        ajaxWs(ws, { Class: "WCS", Method: "CheckInventory" }, eve => {
            var data = JSON.parse(eve.data)
            this.inventoryList = data.Inventory;
            this.option = data.options
            this.$nextTick(function () {
                this.loading.close()
            })
         })
    },
    computed: {
        options() {
            return this.option.filter(x => {
                if (this.qty < 0) {
                    return (this.rowid == x.mid || x.mid == null) && x.StockQTY >= Math.abs(this.qty)
                } else if (this.qty > 0) {
                    return (this.rowid == x.mid || x.mid == null) && this.height <= x.height
                }
            })
        }
    },
    watch: {
    }
}