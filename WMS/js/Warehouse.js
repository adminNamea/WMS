newFunction();

function newFunction() {
    ;
    !function (e) {
        "use strict";
            layui.use(['table', 'form', 'layer'], function () {
                var table = layui.table, $ = layui.jquery, form = layui.form, layer = layui.layer, tableIns4;
                function ajax() {
                    SELECT.render({
                        ".WHID": { data: "/WMS/checkWo" }
                    })
                }
                document.body.parentNode.style.overflow = "hidden";
                function Add(name, i) {
                    var index = layer.open({
                        type: 2,
                        title: name,
                        shadeClose: true,
                        shade: false,
                        maxmin: true,
                        area: ['893px', '600px'],
                        content: '/WMS/AddAll'
                        , success: function () {
                            var body = layer.getChildFrame('body', index);
                            body.find('.layui-hide').val(i)
                        }
                        , end: function () {
                          
                                tableIns4.reload({})

                        }
                    });
                }
                tableIns4 = table.render({
                    elem: '#laytable'
                    , url: "/WMS/checkWo"
                    , where: { id: "1" }
                
                    , cols: [[
                        { type: "checkbox" }
                        , { field: 'ID', title: '仓库编码' }
                       
                        , { field: 'Name', title: '仓库名称', edit: "text" }
                        , { field: 'Description', title: '描述', edit: "text" }
                        , { field: 'CreatedTime', title: '创建时间' }
                        , { field: 'CreatedBy', title: '创建人' }
                        , { align: 'center', toolbar: '#barDemo' }
                    ]]
                    , done: function () {
                        ajax()
                        $(".layui-table-body")
                    }
                });
                $("i").click(function () {

                    Add('添加仓库', 1)

                })
                table.on('tool(table)', function (obj) {
                    var data = obj.data;
                    var layEvent = obj.event;

                    if (layEvent === 'del') {
                        layer.confirm('确定删除么', function (index) {
                            $.post("/WMS/DelSingle", { id: data.ID, type: "ca" }, function (data) {
                                obj.del();
                                layer.close(index);
                                layer.msg("删除成功")
                            })
                        });
                    } else if (layEvent === 'edit') {
                        $.post("/WMS/UpAll", { data: data, type: "ca" }, function (data) {
                            layer.msg("更新完成")
                        })
                    }
                });
                form.on('select', function (data) {
                    tableIns4.reload({
                        url: "/WMS/checkWo",
                        where: { id: "1", data: data.value }
                    })
                })
                $(".del").click(function () {
                    var checkStatu = table.checkStatus('laytable')
                    var arr = new Array();
                    if (checkStatu.data.length > 0) {
                        layer.confirm('确定删除' + checkStatu.data.length + '项么', function () {
                            for (var i = 0; i < checkStatu.data.length; i++) {
                                arr[i] = checkStatu.data[i].ID
                            }
                            console.log(arr)
                            $.post("/WMS/DelAll", { id: arr, type: "ca" }, function () {
                                layer.msg("删除成功")
                                tableIns4.reload({
                                })
                            })
                        })
                    } else {
                        layer.msg("请选择一项", {icon:5})
                    }
                })
                $(".add").click(function () {
                    Add('添加仓库', 1)
                })
                $(".up").click(function () {
                    var checkStatu = table.checkStatus('laytable')
                    for (var i = 0; i < checkStatu.data.length; i++) {
                        $.ajax({
                            url: "/WMS/UpAll",
                            data: { data: checkStatu.data[i], type: "ca" },
                            async: false
                        })
                    }
                    tableIns4.reload({ })
                    ajax()
                    layer.msg("更新完成")
                })
                ajax()
            })
    }(window);
}