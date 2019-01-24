newFunction();

function newFunction() {
    ;
    !function (e) {
        "use strict";
       layui.use(['table', 'form', 'layer'], function () {
    var table = layui.table, $ = layui.jquery, form = layui.form, layer = layui.layer;
    var tableIns;
    var map = new Map();
    var statu = 0;
    function ajax() {
        var tp = "";
        if (statu == 1) {
            tp = "tbody ";
        }
        var key = tp + ".WHID"
        var key1 = tp + ".WHAreaID"
        var key2 = tp + ".StorageLocationID"
        var key3 = tp + ".TempPlate"
        var obj = {}
        obj[key] = { data: "/WMS/checkWo" }
        obj[key1] = { data: "/WMS/checkkq" }
        obj[key2] = { data: "/WMS/checkkw" }
        obj[key3] = { data: "/WMS/checkhuo" }
        SELECT.render(obj)
    }
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
                ajax();
                tableIns.reload({})
            }
        });
    }
    tableIns = table.render({
        elem: '#laytable'
        , url: "/WMS/checkhuo?id=1&data=" + null
        , height: 'full-20'
        , cols: [[
            { type: "checkbox" }
            , { field: 'ID', hide: true }
            , { field: 'Name', title: '货位名称', edit: "text" }
            , { field: 'x_intercept', title: 'X坐标（mm）', edit: "text" }
            , { field: 'y_intercept', title: 'Y坐标（mm）', edit: "text" }
            , { field: 'z_intercept', title: 'Z坐标（mm）', edit: "text" }
            , { field: 'StorageLocationID', title: '库位名称', toolbar: '#selectkw', width: 200 }
            , { field: 'WHAreaID', title: '库区名称', toolbar: '#selectkq', width: 200 }
            , { field: 'WHID', title: '仓库名称', toolbar: '#selectca', width: 200 }
            , { field: 'Description', title: '描述', edit: "text" }
            , { field: 'Size', title: '货位限制', edit: "text" }
            , { align: 'center', toolbar: '#barDemo' }
        ]]
        , done: function (res) {
            ajax()
            datas = res.data

        }
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
    form.on('select(tableca)', function (data) {
        var index = $("tbody .WHID").index(data.elem)
        table.cache.laytable[index].WHID = data.value
    })
    form.on('select(tablekq)', function (data) {
        var index = $("tbody .WHAreaID").index(data.elem)
        table.cache.laytable[index].WHAreaID = data.value
    })
    form.on('select(tablekw)', function (data) {
        var index = $("tbody .StorageLocationID").index(data.elem)
        table.cache.laytable[index].StorageLocationID = data.value
    })
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var tr = obj.tr;
        if (layEvent === 'del') {
            layer.confirm('确定删除么', function (index) {
                $.post("/WMS/DelSingle", { id: data.ID, type: "huo" }, function (data) {
                    obj.del();
                    layer.close(index);
                    layer.msg("删除成功")
                })
            });
        } else if (layEvent === 'edit') {
            $.post("/WMS/UpHuo", { data: data }, function (data) {
                layer.msg("更新完成")
                tableIns.reload({
                })

            })
        }
    });

    form.on('select', function (data) {
        if ($(data.elem).parents("table").attr("class") == undefined) {
            map.set(data.elem, data.value)
            var ce = new Object()
            statu = 1;
            map.forEach(function (value, key) {
                ce[$(key).attr("class")] = value
            })
            tableIns.reload({
                url: "/WMS/checkhuo",
                where: { id: "1", data: ce }
            })

        }
    })
    $(".del").click(function () {
        var checkStatu = table.checkStatus('laytable')
        var arr = new Array();
        layer.confirm('确定删除' + checkStatu.data.length + '项么', function () {

            for (var i = 0; i < checkStatu.data.length; i++) {
                arr[i] = checkStatu.data[i].ID
            }
            $.post("/WMS/DelAll", { id: arr, type: "huo" }, function () {
                layer.msg("删除成功")
                tableIns.reload({
                })
            })
        })
    })
    $(".add").click(function () {
        Add('添加货位', 4)
    })
    $(".up").click(function () {
        var checkStatu = table.checkStatus('laytable')
        for (var i = 0; i < checkStatu.data.length; i++) {
            $.post("/WMS/UpAll", { data: checkStatu.data[i], type: "huo" }, function (data) {

            })
        }
        layer.msg("更新完成")
        tableIns.reload({
        })
    })
     })
    }(window);
}