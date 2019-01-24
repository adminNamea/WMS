newFunction();

function newFunction() {
    !function () {
        "use strict";
        layui.use(['form', 'table'], function () {
            var table = layui.table, $ = layui.jquery;
            var tableIns3 = table.render({
                elem: '#laytable'
                , url: '/WMS/CheckIn'
                , cols: [[
                      { hide: true }
                    , { field: 'aid', title: '命令编码' }
                    , { field: 'mid', title: '物料编码' }
                    , { field: 'PartName', title: '物料名称' }
                    , { field: 'PartSpec', title: '物料规格' }
                    , { field: 'PartMaterial', title: '物料材质' }
                    , { field: 'InQTY', title: '入库数量（PCS）' }
                    , { field: 'PalletQTY', title: '栈板数量' }
                    , { field: 'Name', title: '入货口' }
                    , { field: 'type', title: '类型' }
                    , { field: 'Status', title: '状态' }
                ]]
                , done: function (res) {
                    layui.each(res.data, function (index, value) {
                        if (value.Status == "正在执行") {
                            $("tbody tr:eq(" + index + ")").css("color", "red")
                        }
                    })
                }
            });
            var tableIns2 = table.render({
                elem: '#laytable1'
                , url: '/WCS/checkComm'
                , where: { Name: "" }
                , height: 'full-20'
                , cols: [[
                    { type: "checkbox" }
                    , { field: 'ID', hide: true }
                    , { field: 'Name', title: '命令类型', edit: "text" }
                    , { field: 'MachineTypeID', title: '机器类型' }
                    , { field: 'Sort', title: '优先级别', edit: "text" }
                    , { field: 'Description', title: '描述', edit: "text" }
                    
                ]]
                , done: function (res) {
                   
                    layui.each(res.data, function (index, value) {
                        if (value.Status == "正在执行") {
                            $("tbody tr:eq(" + index + ")").css("color", "red")
                        }
                    })
                }
            });
        })
    }()
}