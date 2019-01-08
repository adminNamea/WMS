
layui.use(['table', 'form', 'layer'], function () {
    var table = layui.table, $ = layui.jquery, form = layui.form, layer = layui.layer;
    var datas, tableIns3;
    var map = new Map();
    var statu = 0;
    $(document).ajaxStop(function () {
        for (var i = 0; i < datas.length; i++) {
            $("tbody tr:eq(" + i + ")").find(".WHID").val(datas[i].WHID)
            form.render()
        }
    })
    function ajax() {
        var tp = "";
        if (statu == 1) {
            tp = "tbody ";
        }
        $.get("/WMS/checkWo", function (data) {
            if (data != null) {
                $(tp + ".WHID").empty();
                $(tp + ".WHID").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(tp + ".WHID").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                }
            }
            form.render()
        })
        $.get("/WMS/checkkq", function (data) {
            if (data != null) {
                $(tp + ".WHAreaID").empty();
                $(tp + ".WHAreaID").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(tp + ".WHAreaID").append("<option value=" + data[i].ID + ">" + data[i].Name + "</option>")
                }
            }
            form.render()
        })

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
                layer.msg("加载中", { icon: 16, time: 1000 })
            }
            , end: function () {
                ajax();
                if (i == 2) {
                    tableIns3.reload({})
                }
            }
        });
    }
    tableIns3 = table.render({
        elem: '#laytable'
        , url: "/WMS/checkkq?id=1&data=" + null
        , height: 'full-20'
        , cols: [[
            { type: "checkbox" }
            , { field: 'ID', title: '库区编码' }
            , { field: 'Name', title: '库区名称', edit: "text" }
            , { field: 'WHID', title: '仓库名称', toolbar: '#selectca', width: 200 }
            , { field: 'Description', title: '描述', edit: "text" }
            , { field: 'CreatedTime', title: '创建时间' }
            , { field: 'CreatedBy', title: '创建人' }
            , { field: 'UpdatedTime', title: '更新时间' }
            , { field: 'UpdatedBy', title: '更新人' }
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
        }

    })
    form.on('select(tableca)', function (data) {
        var index = $("tbody .WHID").index(data.elem)
        table.cache.laytable[index].WHID = data.value
    })
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var tr = obj.tr;
        if (layEvent === 'del') {
            layer.confirm('确定删除么', function (index) {
                $.post("/WMS/DelSingle", { id: data.ID, type: "kq" }, function (data) {
                    obj.del();
                    layer.close(index);
                    layer.msg("删除成功")
                })
            });
        } else if (layEvent === 'edit') {
            $.post("/WMS/UpAll", { data: data, type: "kq" }, function (data) {
                layer.msg("更新完成")
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
            tableIns3.reload({
                url: "/WMS/checkkq",
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
            $.post("/WMS/DelAll", { id: arr, type: "kq" }, function () {
                layer.msg("删除成功")
                tableIns3.reload({
                })
            })
        })
    })
    $(".add").click(function () {
        Add('添加库区', 2)
    })
    $(".up").click(function () {
        var checkStatu = table.checkStatus('laytable')
        for (var i = 0; i < checkStatu.data.length; i++) {
            $.ajax({
                url: "/WMS/UpAll",
                data: { data: checkStatu.data[i], type: "kq" },
                async: false
            })
        }
        layer.msg("更新完成")
        tableIns3.reload({
        })
    })
})