newFunction();

function newFunction() {
    ;
    !function () {
        "use strict";
        layui.use(['form', 'table','element'], function () {
            var form = layui.form, table = layui.table, $ = layui.jquery, util = layui.util;
            var element = layui.element;
            $(function () { 
            var namem, PartSpecs, boo = true
                var tableIns3
                $.ajax({
                    url: "/WMS/PlcIn",
                    type: "post",
                    async: false,
                    datatype: "json",
                }).done(function (data) {
                    
                    console.log(data)
                   
                    tableIns3 = table.render({
                        elem: '#laytable'
                        , page: true
                        , limit: 8
                        , cols: [[
                            { hide: true }
                            , { field: 'aid', title: '命令编码' }
                            , { field: 'mid', title: '物料编码' }
                            , { field: 'PartName', title: '物料名称' }
                            , { field: 'PartSpec', title: '物料规格' }
                            , { field: 'PartMaterial', title: '物料材质' }
                            , { field: 'InQTY', title: '数量（PCS）' }
                            , { field: 'PalletQTY', title: '栈板数量' }
                            , { field: 'Name', title: '货口（出/入）' }
                            , { field: 'type', title: '类型' }
                            , { field: 'Status', title: '状态' }
                        ]]
                        , url: "/WMS/CheckIn"
                        , done: function (res) {
                            layui.each(res.data, function (index, value) {
                                if (value.Status == '正在执行') {
                                    $("tbody tr:eq(" + index + ")").css("color","red");
                                }
                            })

                            //var endTime = new Date().getTime()+55555
                            //    , serverTime = new Date().getTime();
                            //var countTime = (endTime - serverTime) / 1000
                            //var s = (100 / countTime)
                            //var b = -(100 / countTime);
                            //$(".layui-timeline").empty()
                            //util.countdown(endTime, serverTime, function (date) {
                            //    var str = date[1] + '时' + date[2] + '分' + date[3] + '秒';
                            //    $('#time').html(str);
                            //    b = s + b
                            //    if (b > 100) {
                            //        b=100
                            //    }
                            //    $("#b").html(b.toFixed(4) + "%")
                            //    element.progress('demo0', '100%');
                            //});
                            //for (var i = 0; i < res.data.length; i++) {
                            //    var pro = '<div class="layui-progress" lay-showpercent="true" lay-filter="demo' + i + '"><div class="layui-progress-bar"></div></div>'

                            //    var li = '<li class="layui-timeline-item">'
                            //    var icon = '<i class="layui-icon layui-timeline-axis">&#xe63f;</i>'
                            //    if (res.data[i].Status == "正在执行") {
                            //        icon ='<i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop layui-timeline-axis"></i>'
                            //    }
                            //    var div = ' <div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">' + res.data[i].Status + '</h3>'
                            //    var p = '<p>命令编号：<em>' + res.data[i].aid + '</em></p><p> 预计时间：<em id="time"></em></p><p>进度：<em id="b"><em><em>' + pro + '</em></p></div></li >'
                            //    if ($(".layui-timeline:eq(0)").find("li").length == 4) {
                            //        $(".layui-timeline:eq(1)").append(li + icon + div + p)
                            //    } else {
                            //        $(".layui-timeline:eq(0)").append(li + icon + div + p)
                            //    }
                            //}
                            //$(".layui-progress-bar").css('-webkit-transition', countTime + "s linear");

                        }
                    });
                })
                
            SELECT.render({
                ".Place": { data: "/WCS/checkPlace" },
                ".Category1": { data: "/WMS/checkwu",  where: { page: 0, limit: 0, type: "lei" } }
            })
            form.on('select(Category1)', function (data) {
                var index = $(".Category1").index(data.elem)
                obj = {}
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
                obj = {}
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
                obj = {}
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
                    $.post("/WMS/InMaterial", { data: data.field }, function (data) {
                       
                        if (data == "true") {
                            tableIns3.reload({
                                page: {
                                    curr: tableIns3.config.page.pages
                                }
                            })
                                layer.msg("已确认")
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