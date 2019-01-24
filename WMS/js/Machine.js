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
                var key1 = tp + ".MachineTypeID"
                var obj = {}
                obj[key] = { data: "/WCS/checkMachine" }
                obj[key1] = { data: "/WCS/checkMachinType" }
                SELECT.render(obj)
            }
            var boo = false;
            var boo1 = false;
            
            function Add(name, i) {
                 indexs = layer.open({
                    type: 1,
                    title: name,
                    shadeClose: true,
                    shade: false,
                    area: ['893px', '600px'],
                     content: $("" + i + "")
                     , success: function () {
                      
                         if (i == "#ji") {
                             sub("formDemo1","ji");
                         } else {
                             sub("formDemo","lei");
                         }
                     }
                     , end: function () {
                         statu=0
                        tableIns3.reload({})
                        $(":reset").click()
                    }
                });
            }
            function sub(su,type) {
                $("[name=Name]").css("border-color", "rgba(255,0,0,0.5)")
                $("[name=ID]").css("border-color", "rgba(255,0,0,0.5)")
                form.on('submit(' + su + ')', function (data) {
                    if (type == "lei") {
                        boo1 = true;
                    }
                    if (boo1) {
                        if (boo) {
                            $.post("/WCS/WcsAddAll", { data: data.field, type: type }, function () {
                                layer.msg("添加成功")
                                layer.close(indexs);
                            })
                        } else {
                            layer.msg('名称重复了', { icon: 5 })
                        }
                    } else {
                        layer.msg('编号重复了', { icon: 5 })
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
                    if (type == "ji") {
                        t ="Machine"
                    } else {
                        t ="MachinType"
                    }
                    if (value == "") {
                        $("[name=Name]").css("border-color","rgba(255,0,0,0.5)")
                        $("[name=ID]").css("border-color","rgba(255,0,0,0.5)")
                        boo = false
                    } else {
                        $.get("/WCS/check" + t, { value: value }, function (data) {
                            if (data.length > 0) {
                                $("[name=Name]").css("border-color","rgba(255,0,0,0.5)")
                                boo = false
                            } else {
                                $("[name=Name]").css("border-color","rgba(0,255,0,0.5)")
                                boo = true;
                            }
                        })
                    }
                })
                $("[name=ID]").change(function () {
                    var value = $(this).val().trim()
                    if (value == "") {
                        $("[name=ID]").css("border-color", "rgba(255,0,0,0.5)")
                        boo1 = false
                    } else {
                        $.get("/WCS/CheckNumber", { value: value }, function (data) {
                            if (data.length > 0) {
                                $("[name=ID]").css("border-color","rgba(255,0,0,0.5)")
                                boo1 = false
                            } else {
                                $("[name=ID]").css("border-color","rgba(0,255,0,0.5)")
                                boo1 = true;
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
                    , { field: 'IP', title: 'IP地址' }
                    , { field: 'MachineTypeID', title: '机器类型', toolbar: '#MachineTypeID', width: 200 }
                    , { field: 'x_intercept', title: 'X坐标（cm）', edit: "text" }
                    , { field: 'y_intercept', title: 'Y坐标（cm）', edit: "text" }
                    , { field: 'z_intercept', title: 'Z坐标（cm）', edit: "text" }
                    , { field: 'RuningSpeed', title: '速度（米/分钟）', edit: "text" }
                    , { field: 'Status', title: '状态', edit: "text" }
                    , { align: 'center', toolbar: '#barDemo' }
                ]]
                , done: function (res) {
                    ajax()
                    console.log(layui.cache)
                    datas = res.data
                }
            });
            $("i").click(function () {
                Add("添加机器类型","#lei");

            })
            form.on('select(MachineTypeID)', function (data) {
                if ($(data.elem).parents('table').attr("class") == "layui-table") { 
                    var index = $("tbody .MachineTypeID").index(data.elem)
                    table.cache.laytable[index].MachineTypeID = data.value
                }
            })
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
                } else {
                    table.cache.laytable[ind]["" + obj.field + ""] = obj.value
                    }
                }
            });
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
                if (checkStatu.data.length > 0) {
                    layer.confirm('确定删除' + checkStatu.data.length + '项么', function () {

                        for (var i = 0; i < checkStatu.data.length; i++) {
                            arr[i] = checkStatu.data[i].ID
                        }
                        $.post("/WCS/WcsDelAll", { id: arr, type: "ji" }, function () {
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
                Add('添加机器信息', "#ji")

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