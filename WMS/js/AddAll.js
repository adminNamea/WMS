newFunction()
function newFunction() {
    "use strict";
!function () {
    layui.config({base:'/js/'}).use(['form','SELECT'], function () {
        var form = layui.form, $ = layui.jquery,select=layui.SELECT;
        var boo = false;
        var boos = false;
        var a, b, c,s;
        form.verify({
            pass:[
                /^[1-2]$/
                , '请输入1或2'
            ],
            up: function (value) {
                var obj = {}
                obj["WHAreaID"] = s
                $.ajax({
                    url: "/WMS/checkkw/",
                    data: { id: "1", data: obj },
                    async: false,
                    success: function (data) {
                        if (data.data.length > 0) {
                            if (data.data[0].z != value) {
                                boos = true;
                            } else {
                                boos = false
                            }
                        } else {
                            boos = true;
                        }
                    }
                })
                if (!boos) {
                    return '该位置存在库位'
                } 
            }
        });
        form.on('select(up)', function (data) {
            s = data.value
        })
        $("[name=name]").css("border-color","rgba(255,0,0,0.5)")
        function sub(su, type) {
            console.log(su + type)
            form.on('submit(' + su + ')', function (data) {
                if (boo) {
                        $.post("/WMS/AddWarehouse", { data: data.field, type: type }, function () {
                            var index = parent.layer.getFrameIndex(window.name)
                            parent.layer.msg("添加成功")
                            parent.layer.close(index);
                        })
                } else {
                    layer.msg('名称重复了', { icon: 5 })
                }
                return false;
            });
            $("[name=name]").keyup(function () {
                var t;
                if (type == "ca") {
                    t = "Wo"
                } else {
                    t = type
                }
                var value = $(this).val().trim()
                if (value == "") {
                    $("[name=name]").css("border-color", "rgba(255,0,0,0.5)")
                    boo = false
                } else {
                    $.get("/WMS/check" + t, { value: value }, function (data) {
                        if (data.length > 0) {
                            $("[name=name]").css("border-color", "rgba(255,0,0,0.5)")
                            boo = false
                        } else {
                            $("[name=name]").css("border-color", "rgba(0,255,0,0.5)")
                            boo = true;
                        }
                    })
                }
            })
        }
        
        $.get("/WMS/checkWo", function (data) {
            if (data != null) {
                $(".wo").empty();
                $(".wo").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(".wo").append("<option value='" + data[i].ID + "'>" + data[i].Name + "</option>")
                }
            }
            form.render()
            var type = Number($(".layui-hide").val())
            switch (type) {
                case 1:
                    $(".ca").css("display", "block")
                    sub('formDemo', "ca")
                    break;
                case 2:
                    $(".kq").css("display", "block")
                    sub('formDemo1', "kq")
                    break;
                case 3:
                    $(".kw").css("display", "block")
                    sub('formDemo2', "kw")
                    break;
                case 4:
                    $(".huo").css("display", "block")
                    sub('formDemo3', "huo")
                    break;
            }
            form.on('select', function (data) {
                var index = $('select').index(data.elem)
                var key = $('select:eq(' + Number(index + 1) + ')').attr("class")
                var title = $('select:eq(' + Number(index + 1) + ')').attr("title")
                if (title != undefined) {
                    switch (title) {
                        case "kq":
                            a = Number(data.value);
                            break;
                        case "kw":
                            b = Number(data.value);
                            break;
                        case "huo":
                            c = Number(data.value);
                            break;
                    }
                    var obj = {}
                    console.log("type=" + type + "a=" + a)
                    obj["." + key] = {
                        data: "/WMS/Check" + title + "s", where: { a: a, b: b, c: c, type: type }
                    }
                    select.render(obj)
                }
            })
        })
    });
    }()
}