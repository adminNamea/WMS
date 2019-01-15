newFunction();

function newFunction() {
    ;
    !function (e) {
layui.use(['form', 'table'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery;
    var namem, PartSpecs, boo = true
    var tableIns3 = table.render({
        elem: '#laytable'
        , url: '/WMS/CheckIn'
        , height: 'full-20'
        , cols: [[
            { hide: true }
            , { field: 'aid', title: '命令编码' }
            , { field: 'mid', title: '物料编码' }
            , { field: 'PartName', title: '物料名称' }
            , { field: 'PartSpec', title: '物料规格' }
            , { field: 'PartMaterial', title: '物料材质' }
            , { field: 'InQTY', title: '入库数量（PCS）' }
            , { field: 'PalletQTY', title: '栈板数量' }
            , { field: 'Name', title: '入货口' }
            , { field: 'type', title: '类型' }
            , { field: 'Status', title: '状态' }
        ]]
        , done: function () {
            $("tbody tr:eq(0)").css("color", "red")
        }
    });
    SELECT.render({
        ".Place": { data: "/WCS/checkPlace" },
        ".Category1": { data: "/WMS/checkwu", where: { page: 0, limit: 0, type: "lei" } }
    })
    form.on('select(Category1)', function (data) {
        SELECT.render({
            ".PartName": { data: "/WMS/checkwu", where: { page: 0, limit: 0, value: data.value }, value: "PartName", text:"PartName" }
        })
    })
    $(":reset").click(function () {
        $(".PartSpec").empty()
        $(".PartMaterial").empty()
        $(".PartName").empty()
        $(".PartSpec").append("<option value='-1'>请选择物料名称</option>");
        $(".PartMaterial").append("<option value='-1'>请选择物料规格</option>");
        $(".PartName").append("<option value='-1'>请选择物料类型</option>");
    })
    form.on('select(PartName)', function (data) {
        namem = data.value
        SELECT.render({
            ".PartSpec": { data: "/WMS/CheckPartSpec", where: { Name: data.value }, value: "PartSpec", text: "PartSpec" }
        })
    })
    form.on('select(PartSpec)', function (data) {
        PartSpecs = data.value
        SELECT.render({
            ".PartMaterial": { data: "/WMS/CheckPartMaterial", where: { Name: namem, PartSpec: data.value }, value: "PartMaterial", text: "PartMaterial" }
        })
    })
    form.on('select(PartMaterial)', function (data) {
        $.get("/WMS/CheckQTYperPallet", { PartMaterial: data.value, Name: namem, PartSpec: PartSpecs }, function (data) {
            if (data.length > 0) {
                $(".QTYperPallet").val(data[0].QTYperPallet)
            }
        })
    })
    $(".InQTY").change(function () {
        if ($(this).val() > $(".QTYperPallet").val()) {
            layer.msg("不能超过托盘数量", { icon: 10 })
            boo = false
            $(this).focus();
        }
    })
    //监听提交
    form.on('submit(formDemo)', function (data) {
        if (boo) {
            $.post("/WMS/InMaterial", { data: data.field }, function (data) {
                if (data == "true") {
                    tableIns3.reload({
                        done: function () {
                            layer.msg("已确认")
                            $("tbody tr:eq(0)").css("color", "red")
                        }
                    })
                }
            })
        } else {
            $(".InQTY").focus()
        }
        return false;
        });
        });
    }(window);
}