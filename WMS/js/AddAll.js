newFunction()
function newFunction() {
    "use strict";
!function () {
    layui.use('form', function () {
        var form = layui.form, $ = layui.jquery;
        var boo = false;
        $("[name=name]").css("border-color", "rgba(255,0,0,0.5)")
        function sub(su, type) {
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
            switch (Number($(".layui-hide").val())) {
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
        })
        $.get("/WMS/checkkq", function (data) {
            if (data != null) {
                $(".Arid").empty();
                $(".Arid").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(".Arid").append("<option value='" + data[i].ID + "'>" + data[i].Name + "</option>")
                }
            }
            form.render()
        })
        $.get("/WMS/checkkw", function (data) {
            if (data != null) {
                $(".StorageLocationID").empty();
                $(".StorageLocationID").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(".StorageLocationID").append("<option value='" + data[i].ID + "'>" + data[i].Name + "</option>")
                }
            }
            form.render()
        })
        $.get("/WMS/checkhuo", function (data) {
            if (data != null) {
                $(".h").empty();
                $(".h").append("<option value='' selected>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    $(".h").append("<option value='" + data[i].ID + "'>" + data[i].Name + "</option>")
                }
            }
            form.render()
        })
           
    });
    }()
}