newFunction();

function newFunction() {
    ;
    !function () {
        "use strict";
        layui.config({
            base: '/js/'
        }).use(['form', 'table', 'element','SELECT','layer'], function () {
            var form = layui.form;
            var $ = layui.jquery;
            var SELECT = layui.SELECT;
            $(function () { 
            var namem, PartSpecs, boo = true
            SELECT.render({
                ".Place": { data: "/WCS/checkPlace" },
                ".Category1": { data: "/WMS/checkwu", where: { page: 0, limit: 0, type: "lei" } },
                ".GoodsAllocationID": {data:"/WMS/checkhuo"}
            })
            form.on('select(Category1)', function (data) {
                var index = $(".Category1").index(data.elem)
                var obj = {}
                obj[".PartName:eq(" + index + ")"] = {
                    data: "/WMS/checkwu",
                    where: { page: 0, limit: 0, value: data.value },
                    value: "PartName",
                    text: "PartName"
                }
                SELECT.render(obj)
            })
            $(":reset").click(function () {
                var index = $(":reset").index($(this))
                $(".PartSpec:eq(" + index+")").empty()
                $(".PartMaterial:eq(" + index + ")").empty()
                $(".PartName:eq(" + index + ")").empty()
                $(".PartSpec:eq(" + index + ")").append("<option value='-1'>请选择物料名称</option>");
                $(".PartMaterial:eq(" + index + ")").append("<option value='-1'>请选择物料规格</option>");
                $(".PartName:eq(" + index + ")").append("<option value='-1'>请选择物料类型</option>");
            })
            form.on('select(PartName)', function (data) {
                namem = data.value
                var index = $(".PartName").index(data.elem)
                var obj = {}
                obj[".PartSpec:eq(" + index + ")"] = {
                    data: "/WMS/CheckPartSpec",
                    where: { page: 0, limit: 0, Name: data.value },
                    value: "PartSpec",
                    text: "PartSpec"
                }
                SELECT.render(obj)
            })
            form.on('select(PartSpec)', function (data) {
                PartSpecs = data.value
                var index = $(".PartSpec").index(data.elem)
                var obj = {}
                obj[".PartMaterial:eq(" + index + ")"] = {
                    data: "/WMS/CheckPartMaterial",
                    where: { Name: namem, PartSpec: data.value },
                    value: "PartMaterial",
                    text: "PartMaterial"
                }
                SELECT.render(obj)
            })
            form.on('select(PartMaterial)', function (data) {
                var index = $(".PartMaterial").index(data.elem)
                $.get("/WMS/CheckQTYperPallet", { PartMaterial: data.value, Name: namem, PartSpec: PartSpecs }, function (data) {
                    if (data.length > 0) {
                        $(".QTYperPallet:eq(" + index + ")").val(data[0].QTYperPallet)
                    }
                })
            })
            $(".InQTY").change(function () {
                var index = $(".InQTY").index($(this))
                if ($(this).val() > $(".QTYperPallet:eq(" + index + ")").val()) {
                    layer.msg("不能超过托盘数量", { icon: 10 })
                    boo = false
                    $(this).focus();
                }
            })
            //监听提交
            form.on('submit(formDemo)', function (data) {
                var index = $(".formDemo").index(data.elem)
                if (boo) {
                    $.post("/WMS/InMaterial", { data: data.field}, function (data) {
                        if (data == 1) {
                            
                            layer.msg("已确认", { time: 500 })
                        } else {
                            parent.layer.close(layer.index)
                            parent.layer.msg("货位已用完", { time: 500 })
                        }
                    })
                } else {
                    $(".InQTY:eq("+index+")").focus()
                }
                return false;
                });
            })
        });
    }(window);
}