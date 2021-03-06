﻿newFunction();

function newFunction() {
    ;
    !function (e) {
            "use strict";
                layui.use(['table', 'form'], function () {
                    var table = layui.table, $ = layui.jquery, form = layui.form;
                    var ta;
                    var map = new Map();
                    function ajax() {
                        var obj = {}
                        obj[".WHID"] = { data: "/WMS/checkWo" }
                        obj[".WHAreaID"] = { data: "/WMS/checkkq" }
                        obj[".StorageLocationID"] = { data: "/WMS/checkkw" }
                        obj[".TempPlate"] = { data: "/WMS/checkhuo" }
                        SELECT.render(obj)
                    }
                    ajax()
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
                                ajax()
                            }
                        });
                    }
                    ta = table.render({
                        elem: '#laytable'
                        , url: "/WMS/checkhuo?id=1&data=" + null
                        , where: { type: "huo" }
                        , height: 'full-20'
                        , cols: [[
                            { type: "checkbox" }
                            , { field: 'ID', hide: true }
                            , { field: 'type', hide: true }
                            , { field: 'Name', title: '货位名称' }
                            , { field: 'x_intercept', title: 'X坐标（mm）' }
                            , { field: 'y_intercept', title: 'Y坐标（mm）' }
                            , { field: 'z_intercept', title: 'Z坐标（mm）' }
                            , { field: 'Description', title: '描述' }
                            , { field: 'Size', title: '货位限制', edit: "text" }
                            , { align: 'center', toolbar: '#barDemo' }
                        ]]
                    });
                    $("i").click(function () {
                        var name = 'layui-icon layui-icon-add-1 '
                        switch ($(this).attr("class")) {
                            case name + 'ca':
                                Add('添加仓库', 1)
                                break;
                            case name + 'kq':
                                Add('添加库区', 2)
                                break;
                            case name + 'kw':
                                Add('添加库位', 3)
                                break;
                            case name + 'huo':
                                Add('添加货位', 4)
                                break;
                        }
                    })
                    table.on('edit(table1)', function (obj) {
                        if (isNaN(obj.value)) {
                            layer.msg("只可以输入数字", { icon: 5 })
                            var ind = $("tbody tr").index(obj.tr)
                            table.cache.laytable[ind].Size = 0;
                            ta.reload({
                                url: "",
                                data: table.cache.laytable
                            })
                        }
                    });
                    table.on('tool(table1)', function (obj) {
                        var data = obj.data;
                        var layEvent = obj.event;
                        if (layEvent === 'del') {
                            layer.confirm('确定删除限制么', function (index) {
                                $.post("/WMS/DelSingle", { id: data.ID, type: "xian" }, function (data) {
                                    obj.del();
                                    layer.close(index);
                                    layer.msg("删除成功")
                                })
                            });
                        } else if (layEvent === 'edit') {
                            if (data.Size == 0) {
                                layer.confirm('此操作将去除限制，确定么', function (index) {
                                    $.post("/WMS/UpAll", { data: data, type: "xian" }, function (data) {
                                        obj.del();
                                        layer.close(index);
                                        layer.msg("更新完成")
                                    })
                                })
                            } else {
                                $.post("/WMS/UpAll", { data: data, type: "xian" }, function (data) {
                                    layer.msg("更新完成")
                                })
                            }
                        }
                    });
                    form.on('select', function (data) {
                        if ($(data.elem).attr('class') != 'xian') {
                            map.set(data.elem, data.value)
                            var ce = new Object()
                            map.forEach(function (value, key) {
                                ce[$(key).attr("class")] = value
                            })
                            ta.reload({
                                url: "/WMS/checkhuo",
                                where: { id: "1", type: 'xian', data: ce }
                            })
                        }
                    })
                    $(".del").click(function () {
                        var checkStatu = table.checkStatus('laytable')
                        var arr = new Array();
                        if (checkStatu.data.length > 0) {
                            layer.confirm('确定删除' + checkStatu.data.length + '项限制么', function () {

                                for (var i = 0; i < checkStatu.data.length; i++) {
                                    arr[i] = checkStatu.data[i].ID
                                }
                                $.post("/WMS/DelAll", { id: arr, type: "xian" }, function () {
                                    layer.msg("删除成功")
                                    ta.reload({
                                    })
                                })
                            })
                        } else {
                            layer.msg("请选择一项", { icon: 9 })
                        }
                    })
                    $(".add").click(function () {
                        var index = layer.open({
                            type: 1,
                            title: '添加限制',
                            shadeClose: true,
                            shade: false,
                            maxmin: true,
                            area: ['893px', '600px'],
                            content: $('#xian')
                            , end: function () {
                                ta.reload({})
                            }
                        });
                        $.get("/WMS/checkhuo", { type: "add" }, function (data) {
                            if (data != null) {
                                $(".xian").empty();
                                for (var i = 0; i < data.length; i++) {
                                    $(".xian").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                                }
                            }
                            form.render()
                        })
                        form.on('submit(formDemo)', function (data) {
                            $.post("/WMS/AddWarehouse", { data: data.field, type: 'xian' }, function () {
                                layer.msg("添加成功")
                                layer.close(index);
                            })
                            return false;
                        });
                    })
                    $(".up").click(function () {
                        var checkStatu = table.checkStatus('laytable')
                        if (checkStatu.data.length > 0) {
                            for (var i = 0; i < checkStatu.data.length; i++) {
                                if (checkStatu.data[i] == 0) {
                                    layer.confirm('第' + checkStatu.data.length + '限制为零将会去除限制，确定么', function () {
                                        $.ajax({
                                            url: "/WMS/UpAll",
                                            data: { data: checkStatu.data[i], type: "xian" },
                                            async: false
                                        })
                                    })
                                } else {
                                    $.ajax({
                                        url: "/WMS/UpAll",
                                        data: { data: checkStatu.data[i], type: "xian" },
                                        async: false
                                    })
                                }
                            }
                            ta.reload({})
                        layer.msg("更新完成")
                        } else {
                            layer.msg("请选择一项", { icon: 9 })
                        }
                    })
                })
    }(window);
}