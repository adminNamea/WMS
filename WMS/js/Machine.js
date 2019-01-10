newFunction();
function newFunction() {
    ;
    !function () {
        "use strict";
        layui.use(['table', 'form'], function () {
            var table = layui.table, $ = layui.jquery, form = layui.form;
            var tableIns3;
            var map = new Map();
            var statu = 0;
            var indexs
            function ajax() {
                var tp = "";
                if (statu == 1) {
                    tp = "tbody";
                }
                $.get("/WCS/checkMachine", function (data) {
                    if (data != null) {
                        $(tp+".Machine").empty();
                        $(tp +".Machine").append("<option value='' selected>请选择</option>")
                        for (var i = 0; i < data.length; i++) {
                            $(tp +".Machine").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                        }
                    }
                    form.render()
                })
                $.get("/WCS/checkPlace", function (data) {
                    if (data != null) {
                        $(tp +".PlaceTypeID").empty();
                        $(tp +".PlaceTypeID").append("<option value='' selected>请选择</option>")
                        for (var i = 0; i < data.length; i++) {
                            $(tp +".PlaceTypeID").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                        }
                    }
                    form.render()
                })

            }
            var boo = false;
            $("[name=name]").css("border-color", "rgba(255,0,0,0.5)")
            
            function Add(name, i) {
                 indexs = layer.open({
                    type: 1,
                    title: name,
                    shadeClose: true,
                    shade: false,
                    maxmin: true,
                    area: ['893px', '600px'],
                    content: $("#'" + i + "'")
                    , end: function () {
                        tableIns3({})
                        $("reset").click()
                    }
                });
            }
            function sub(su,type) {
                form.on('submit(' + su + ')', function (data) {
                    if (boo) {
                        $.post("/WCS/WcsAddAll", { data: data.field, type: type }, function () {
                            layer.msg("添加成功")
                            layer.close(indexs);
                        })
                    } else {
                        layer.msg('名称重复了', { icon: 5 })
                    }
                    return false;
                });
                $("[name=Name]").keyup(function () {
                    var value = $(this).val().trim()
                    var t = "";
                    if (type == "ji") {
                        t ="Machine"
                    } else {
                        t ="Place"
                    }
                    if (value == "") {
                        $("[name=Name]").css("border-color", "rgba(255,0,0,0.5)")
                        boo = false
                    } else {
                        $.get("/WCS/check" + t, { value: value }, function (data) {
                            if (data.length > 0) {
                                $("[name=Name]").css("border-color", "rgba(255,0,0,0.5)")
                                boo = false
                            } else {
                                $("[name=Name]").css("border-color", "rgba(0,255,0,0.5)")
                                boo = true;
                            }
                        })
                    }
                })
            }
            tableIns3 = table.render({
                elem: '#laytable'
                , url: "/WCS/checkMachine?id=1&data=" + null
                , height: 'full-20'
                , cols: [[
                    { type: "checkbox" }
                    , { field: 'ID', title: '机器编码' }
                    , { field: 'Name', title: '机器名称', edit: "text" }
                    , { field: 'WHID', title: '机器类型', toolbar: '#PlaceType', width: 200 }
                    , { field: 'x_intercept', title: 'X坐标（cm）', edit: "text" }
                    , { field: 'y_intercept', title: 'Y坐标（cm）', edit: "text" }
                    , { field: 'z_intercept', title: 'Z坐标（cm）', edit: "text" }
                    , { field: 'RuningSpeed', title: '速度（米/分钟）', edit: "text" }
                    , { field: 'Status', title: '状态', edit: "text" }
                    , { align: 'center', toolbar: '#barDemo' }
                ]]
                , done: function (res) {
                    ajax()
                    datas = res.data
                }
            });
            $("i").click(function () {
                Add("添加机器类型", "lei");
                sub("formDemo1", "lei");
            })
            form.on('select(PlaceTypeID)', function (data) {
                var index = $("tbody .PlaceTypeID").index(data.elem)
                table.cache.laytable[index].PlaceTypeID = data.value
            })
            table.on('tool(table)', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;
                if (layEvent === 'del') {
                    layer.confirm('确定删除么', function (index) {
                        $.post("/WCS/WcsDelSingle", { id: data.ID, type: "ji" }, function (data) {
                            obj.del();
                            layer.close(index);
                            layer.msg("删除成功")
                        })
                    });
                } else if (layEvent === 'edit') {
                    $.post("/WCS/WcsUpAll", { data: data, type: "ji" }, function (data) {
                        layer.msg("更新完成")
                    })
                }
            });
            form.on('select', function (data) {
                if ($(data.elem).parents("table").attr("class") == undefined) {
                    if ($(data.elem).parents(".layui-form").attr("id") == undefined) { 
                    map.set(data.elem, data.value)
                    var ce = new Object()
                    statu = 1;
                    map.forEach(function (value, key) {
                        ce[$(key).attr("class")] = value
                    })
                    tableIns3.reload({
                        url: "/WCS/checkMachine",
                        where: { id: "1", data: ce }
                        })
                    }
                }
            })
            $(".del").click(function () {
                var checkStatu = table.checkStatus('laytable')
                var arr = new Array();
                layer.confirm('确定删除' + checkStatu.data.length + '项么', function () {

                    for (var i = 0; i < checkStatu.data.length; i++) {
                        arr[i] = checkStatu.data[i].ID
                    }
                    $.post("/WCS/WcsDelAll", { id:arr, type: "ji" }, function () {
                        layer.msg("删除成功")
                        tableIns3.reload({
                        })
                    })
                })
            })
            $(".add").click(function () {
                Add('添加机器信息', "ji")
                sub("formDemo", "ji");
            })
            $(".up").click(function () {
                var checkStatu = table.checkStatus('laytable')
                for (var i = 0; i < checkStatu.data.length; i++) {
                    $.ajax({
                        url: "/WCS/WcsUpAll",
                        data: { data: checkStatu.data[i], type: "ji" },
                        async: false
                    })
                }
                layer.msg("更新完成")
                tableIns3.reload({
                })
            })
        })
    }();
}