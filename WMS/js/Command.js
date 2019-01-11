newFunction();
function newFunction() {
    ;
    !function () {
        "use strict";
        layui.use(['table', 'form'], function () {
            var table = layui.table, $ = layui.jquery, form = layui.form, layer = layui.layer;
            var tableIns3;
            var indexs,statu = 1;
            function ajax() {

                if (statu == 1) {
                    $.get("/WCS/checkComm", function (data) {
                        if (data != null) {
                            $(" .Comm").empty();
                            $(" .Comm").append("<option value='' selected>请选择</option>")
                            for (var i = 0; i < data.length; i++) {
                                $(" .Comm").append("<option value=" + data[i].Name + ">" + data[i].Name + "</option>")
                            }
                        }
                        form.render()
                    })
                }
                $.get("/WCS/checkMachinType", function (data) {
                    if (data != null) {
                        $(" .MachineTypeID").empty();
                        $(" .MachineTypeID").append("<option value='' selected>请选择</option>")
                        for (var i = 0; i < data.length; i++) {
                            $(" .MachineTypeID").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                        }
                    }
                    form.render()
                })
            }
            tableIns3 = table.render({
                elem: '#laytable'
                , url: '/WCS/checkComm'
                , where: {Name:""}
                , height: 'full-20'
                , cols: [[
                    { type: "checkbox" }
                    , { field: 'ID', hide: true }
                    , { field: 'Name', title: '命令类型', edit: "text" }
                    , { field: 'MachineTypeID', title: '机器类型', toolbar: '#MachineTypeID', width: 200 }
                    , { field: 'Sort', title: '优先级别', edit: "text" }
                    , { field: 'Description', title: '描述', edit: "text" }
                    , { align: 'center', toolbar: '#barDemo' }
                ]]
                , done: function (res) {
                    ajax()
                    datas = res.data
                }
            });
            form.on('select(MachineType)', function (data) {
                var index = $("tbody .MachineTypeID").index(data.elem)
                table.cache.laytable[index].MachineTypeID = data.value
            })
            table.on('tool(table)', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;
                if (layEvent === 'del') {
                    layer.confirm('确定删除么', function (index) {
                        $.post("/WCS/WcsDelSingle", { id: data.ID, type: "comm" }, function (data) {
                            obj.del();
                            layer.close(index);
                            layer.msg("删除成功")
                        })
                    });
                } else if (layEvent === 'edit') {
                    $.post("/WCS/WcsUpAll", { data: data, type: "comm" }, function (data) {
                        layer.msg("更新完成")
                    })
                }
            });
            table.on('edit(table)', function (obj) {
                if (obj.field != "Name" && obj.field != "Description") {
                    if (isNaN(obj.value)) {
                        var ind = $("tbody tr").index(obj.tr)
                        table.cache.laytable[ind]["" + obj.field + ""] = 0;
                        console.log(layui.cache)
                        tableIns3.reload({
                            url: "",
                            data: table.cache.laytable,
                            done: function (res) {
                                layer.msg("只可以输入数字", { icon: 5 ,time:500})
                            }
                        })
                    } else {
                        table.cache.laytable[ind]["" + obj.field + ""] = obj.value
                    }
                }
            });
            form.on('select(Comm)', function (data) {
                statu = 0
                        tableIns3.reload({
                            url: "/WCS/checkComm",
                            where: { Name: data.value } })
            })
            $(".del").click(function () {
                var checkStatu = table.checkStatus('laytable')
                var arr = new Array();
                if (checkStatu.data.length > 0) {
                    layer.confirm('确定删除' + checkStatu.data.length + '项么', function () {

                        for (var i = 0; i < checkStatu.data.length; i++) {
                            arr[i] = checkStatu.data[i].ID
                        }
                        $.post("/WCS/WcsDelAll", { id: arr, type: "comm" }, function () {
                            layer.msg("删除成功")
                            tableIns3.reload({
                            })
                        })
                    })
                } else {
                    layer.msg("请选择一行")
                }
            })
            $(".add").click(function () {
                indexs= layer.open({
                    type: 1,
                     title: '添加命令',
                    shadeClose: true,
                    shade: false,
                    area: ['893px', '600px'],
                    content: $("#comm")
                    ,success: function () {
                        form.on('submit(formDemo)', function (data) {
                             $.post("/WCS/WcsAddAll", { data: data.field, type:"comm" }, function () {
                                 layer.msg("添加成功")
                                 layer.close(indexs);
                             })
                             return false
                         });
                     }
                    , end: function () {
                        tableIns3.reload({})
                        $(":reset").click()
                    }
                });
            })
            $(".up").off('click').click(function () {
                var checkStatu = table.checkStatus('laytable')
                if (checkStatu.data.length > 0) {
                    for (var i = 0; i < checkStatu.data.length; i++) {
                        $.ajax({
                            url: "/WCS/WcsUpAll",
                            data: { data: checkStatu.data[i], type: "comm" },
                            async: false
                        })
                    }
                    layer.msg("更新完成")
                    tableIns3.reload({
                    })
                } else {
                    layer.msg("请选择一项")
                }
            })
        })
    }();
}