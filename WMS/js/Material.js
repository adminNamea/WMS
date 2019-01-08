
layui.use(['table', 'form', 'layer'], function () {
    var table = layui.table, $ = layui.jquery, form = layui.form, layer = layui.layer;
    var datas, tableIns1;
    var map = new Map();
    var index;
    var statu = 0;
    $(document).ajaxStop(function () {
        for (var i = 0; i < datas.length; i++) {
            $("tbody tr:eq(" + i + ")").find(".Category1").val(datas[i].Category1)
            form.render()

        }
    })
    function ajax() {
        var tp = "";
        if (statu == 1) {
            tp = "tbody ";
        }
        $.get("/WMS/checkwu", { page: 0, limit: 0 }, function (data) {
            if (data != null) {
                $(tp + ".ID").empty();
                $(tp + ".ID").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(tp + ".ID").append("<option value=" + data[i].ID + ">" + data[i].PartName + "</option>")
                }
            }
            form.render()
        })
        $.get("/WMS/checkwu", { page: 0, limit: 0, type: "lei" }, function (data) {
            if (data != null) {
                $(tp + ".Category1").empty();
                $(tp + ".Category1").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(tp + ".Category1").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                }
            }
            form.render()
        })
    }
    tableIns1 = table.render({
        elem: '#laytable'
        , url: "/WMS/checkwu?data=" + null
        , where: { id: "1" }
        , height: 'full-20'
        , page: true
        , cols: [[
            { type: "checkbox" }
            , { field: 'ID', title: '物料编码' }
            , { field: 'PartName', title: '物料名称', edit: "text" }
            , { field: 'Category1', title: '物料类别', toolbar: '#selectca', width: 200 }
            , { field: 'PartSpec', title: '物料规格', edit: "text" }
            , { field: 'PartMaterial', title: '物料材质' }
            , { align: 'center', toolbar: '#barDemo' }
        ]]
        , done: function (res) {
            ajax()
            datas = res.data
        }
    });
    $("i").click(function () {
        index = layer.open({
            type: 1,
            title: '添加类别',
            shadeClose: true,
            shade: false,
            maxmin: true,
            area: ['893px', '600px'],
            content: $('#lei')
            , success: function () {
                Add("formDemo", "lei")
            }
            , end: function () {
                ajax();

            }
        });
    })
    form.on('select(tablewu)', function (data) {
        var index = $("tbody .Category1").index(data.elem)
        table.cache.laytable[index].Category1 = data.value
    })
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var tr = obj.tr;
        if (layEvent === 'del') {
            layer.confirm('确定删除么', function (index) {
                $.post("/WMS/DelSingle", { id: data.ID, type: "wu" }, function (data) {
                    obj.del();
                    layer.close(index);
                    layer.msg("删除成功")
                })
            });
        } else if (layEvent === 'edit') {
            $.post("/WMS/UpAll", { data: data, type: "wu" }, function (data) {
                layer.msg("更新完成")
            })
        }
    });
    form.on('select(lei)', function (data) {
        if ($(data.elem).parents("table").attr("class") == undefined) {
            if ($(data.elem).parents(".layui-form").attr("id") == undefined) {
                map.set(data.elem, data.value)
                var ce = new Object()
                statu = 1;
                map.forEach(function (value, key) {
                    ce[$(key).attr("name")] = value
                })
                tableIns1.reload({
                    url: "/WMS/checkwu",
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
            $.post("/WMS/DelAll", { id: arr, type: "wu" }, function () {
                layer.msg("删除成功")
                tableIns1.reload({})
            })
        })
    })
    function Add(su, type) {
        form.on('submit(' + su + ')', function (data) {
            $.post("/WMS/AddWarehouse", { data: data.field, type: type }, function () {
                layer.msg("添加成功")
                layer.close(index);
            })
            return false;
        });
    }
    $(".add").click(function () {
        index = layer.open({
            type: 1,
            title: '添加物料',
            shadeClose: true,
            shade: false,
            maxmin: true,
            area: ['893px', '600px'],
            content: $('#wu')
            , success: function () {
                Add("formDemo1", "wu")
            }
            , end: function () {
                tableIns1.reload({

                })
            }
        });
    })
    $(".up").off('click').click(function () {
        var checkStatu = table.checkStatus('laytable')
        for (var i = 0; i < checkStatu.data.length; i++) {
            $.ajax({
                url: "/WMS/UpAll",
                data: { data: checkStatu.data[i], type: "wu" },
                async: false
            })
        }
        layer.msg("更新完成")
        tableIns1.reload({})
    })
})