newFunction();

function newFunction() {
    !function () {
        "use strict";
        layui.use(['form', 'table'], function () {
            var table = layui.table, $ = layui.jquery;
            var tableIns3, tableIns2;
            $(function () { 
                $(".Automatic").click(function () {
                    $.ajax({
                        url: "/WMS/PlcIn",
                        where: {},
                        type: "get",
                        dataType:"json",
                    }).done(function (data) {
                        
                        if (data[0].AID != null) {
                            tableIns3.reload({})
                        } else {
                            layer.msg("无可用机器")
                        }
                    })
                })
                $(".Step").click(function () { })
                table.on('row(test)', function (obj) {
                    tableIns2 = table.render({
                        elem: '#laytable1'
                        , url: '/WCS/WcsComm'
                        , where: { aid: obj.data.aid }
                        , height: 'full-20'
                        , cols: [[
                            , { hide: true }
                            , { field: 'AID', title: 'WMS命令编号'}
                            , { field: 'CID', title: 'WCS命令编号' }
                            , { field: 'Name', title: '机器类型' }
                            , { field: 'InQTY', title: '运输数量' }
                            , { field: 'Statu', title: '执行状态'}
                        ]]
                        , done: function (res) {
                            layui.each(res.data, function (index, value) {
                                if (value.Status == "正在执行") {
                                    $("tbody tr:eq(" + index + ")").css("color", "red")
                                }
                            })
                        }
                    });
                });
            tableIns3 = table.render({
                elem: '#laytable'
                , url: '/WMS/CheckIn'
                , cols: [[
                      { hide: true }
                    , { field: 'aid', title: '命令编码' }
                    , { field: 'mid', title: '物料编码' }
                    , { field: 'PartName', title: '物料名称' }
                    , { field: 'PartSpec', title: '物料规格' }
                    , { field: 'PartMaterial', title: '物料材质' }
                    , { field: 'QTY', title: '入库数量（PCS）' }
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
          
            })
        })
    }()
}