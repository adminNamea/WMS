newFunction();
function newFunction() {
    ;
    !function () {
        "use strict";
        layui.use(['table', 'form'], function () {
            var table = layui.table, $ = layui.jquery, form = layui.form, layer = layui.layer;
            var tableIns3;
            var map = new Map();
            var statu = 0;
            var indexs

            function ajax() {
                var tp = "";
                if (statu == 1) {
                    tp = "tbody ";
                }
                var key = tp + ".ID"
                var key1 = tp + ".PlaceTypeID"
                var obj = {}
                obj[key] = { data: "/WCS/checkPlace" }
                obj[key1] = { data: "/WCS/checkPlaceType" }
                SELECT.render(obj)
            }
            var boo = false;
            function Add(name, i) {
                indexs = layer.open({
                    type: 1,
                    title: name,
                    shadeClose: true,
                    shade: false,
                    area: ['893px', '600px'],
                    content: $("" + i + "")
                    , success: function () {
                        if (i == "#go") {
                            sub("formDemo1","go");
                        } else {
                            sub("formDemo","golei");
                        }
                    }
                    
                    , end: function () {
                        statu = 0
                        tableIns3.reload({
                            url: "/WCS/checkPlace?id=1&data=" + null
                        })
                        $(":reset").click()
                    }
                });
            }
            function sub(su, type) {
                $("[name=Name]").css("border-color", "rgba(255,0,0,0.5)")
                form.on('submit(' + su + ')', function (data) {
                        if (boo) {
                            $.post("/WCS/WcsAddAll", { data: data.field, type: type }, function () {
                                layer.msg("添加成功")
                                layer.close(indexs);
                            })
                        } else {
                            layer.msg('名称重复了', { icon: 5 })
                        }
                    return false
                });
                //table.cache.id[table.cache.id.length] = table.cache.id[table.cache.id.length - 1]
                //id.reload({
                //    url: "",
                //    data: table.cache.id
                //})
                $("[name=Name]").change(function () {
                    var value = $(this).val().trim()
                    var t = "";
                    if (type == "go") {
                        t = "Place"
                    } else {
                        t = "PlaceType"
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
                , url: "/WCS/checkPlace?id=1&data=" + null
                , height: 'full-20'
                , cols: [[
                    { type: "checkbox" }
                    , { field: 'ID', hide: true }
                    , { field: 'Name', title: '位置名称', edit: "text" }
                    , { field: 'PlaceTypeID', title: '位置类型', toolbar: '#PlaceTypeID', width: 200 }
                    , { field: 'x_intercept', title: 'X坐标（mm）', edit: "text" }
                    , { field: 'y_intercept', title: 'Y坐标（mm）', edit: "text" }
                    , { field: 'z_intercept', title: 'Z坐标（mm）', edit: "text" }
                    , { field: 'Status', title: '状态', edit: "text" }
                    , { align: 'center', toolbar: '#barDemo' }
                ]]
                , done: function (res) {
                 
                    ajax()
                    datas = res.data
                }
            });
            $("i").click(function () {
                Add("添加位置类型","#golei");

            })
            form.on('select(PlaceTypeID)', function (data) {
                if ($(data.elem).parents('table').attr("class") == "layui-table") {
                    var index = $("tbody .PlaceTypeID").index(data.elem)
                    table.cache.laytable[index].PlaceTypeID = data.value
                }
            })
            table.on('tool(table)', function (obj) {
                var data = obj.data;
                var layEvent = obj.event;
                if (layEvent === 'del') {
                    layer.confirm('确定删除么', function (index) {
                        $.post("/WCS/WcsDelSingle", { id: data.ID, type: "go" }, function (data) {
                            obj.del();
                            layer.close(index);
                            layer.msg("删除成功")
                        })
                    });
                } else if (layEvent === 'edit') {
                    $.post("/WCS/WcsUpAll", { data: data, type: "go" }, function (data) {
                        layer.msg("更新完成")
                    })
                }
            });
            table.on('edit(table)', function (obj) {
                if (obj.field != "Name" && obj.field != "Status") {
                    if (isNaN(obj.value)) {
                        layer.msg("只可以输入数字", { icon: 5 })
                        var ind = $("tbody tr").index(obj.tr)
                        table.cache.laytable[ind]["" + obj.field + ""] = 0;
                        tableIns3.reload({
                            url: "",
                            data: table.cache.laytable,
                            done: function (res) {
                                SELECT.reload(res.data)
                            }
                        })
                    } 
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
                            url: "/WCS/checkPlace",
                            where: { id: "1", data: ce }
                        })
                    }
                }
            })
            $(".del").click(function () {
                var checkStatu = table.checkStatus('laytable')
                var arr = new Array();
                if (checkStatu.data.length > 0) {
                    layer.confirm('确定删除' + checkStatu.data.length + '项么', function () {

                        for (var i = 0; i < checkStatu.data.length; i++) {
                            arr[i] = checkStatu.data[i].ID
                        }
                        $.post("/WCS/WcsDelAll", { id: arr, type: "go" }, function () {
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
                Add('添加功能位置', "#go")

            })
            $(".up").click(function () {
                var checkStatu = table.checkStatus('laytable')
                for (var i = 0; i < checkStatu.data.length; i++) {
                    $.ajax({
                        url: "/WCS/WcsUpAll",
                        data: { data: checkStatu.data[i], type: "go" },
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