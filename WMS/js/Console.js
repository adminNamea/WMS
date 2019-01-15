newFunction();

function newFunction() {
    ;
    !function (e) {
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
                , done: function () {
                    $("tbody:eq(0) tr:eq(0)").css("color", "red")
                }
            });
            var tableIns2 = table.render({
                elem: '#laytable1'
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
                , done: function () {
                    $("tbody:eq(1) tr:eq(0)").css("color", "red")
                }
            });
        })
    }()
}