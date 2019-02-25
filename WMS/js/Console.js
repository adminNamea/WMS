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
                        type: "get",
                        dataType:"json",
                    }).done(function (data) {
                        if (data.length >0) {
                            if (data[0].AID != null) {
                                tableIns3.reload({})
                            } else {
                                layer.msg("无可用机器")
                            }
                        } else {
                            layer.msg("无命令")
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
          
            })
        })
    }()
}