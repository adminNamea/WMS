
        layui.define(['jquery', 'layer', 'form'], function (exports) {
            "use strict";
            var $ = layui.jquery, layer = layui.layer, form = layui.form
            var s = {};
            var obj = {
                render: function (o, fu) {
                    s = {}
                    for (var ob in o) {
                        if (o[ob].where == undefined) {
                            o[ob].where = {}
                        }
                        if (o[ob].data != null) {
                        typeof (o[ob].data) == "object" ? !function () {
                            $(ob).empty()
                            $(ob).append("<option value=''>请选择</option>")
                            for (var j = 0; j < o[ob].data.length; j++) {
                                if (o[ob].text != undefined && o[ob].text != null) {
                                    $(ob).append("<option value=" + o[ob].data[j][o[ob].value] + ">" + o[ob].data[j][o[ob].text] + "</option>")
                                } else {
                                    $(ob).append("<option value=" + o[ob].data[j].ID + ">" + o[ob].data[j].Name + "</option>")
                                }
                            }
                        }() : !function () {
                                    $.ajax({
                                        url: o[ob].data,
                                        type: "get",
                                        data: o[ob].where,
                                        async: false,
                                        dataType: "json",
                                        success: function (data) {
                                            if (data.length > 0) { 
                                            s[ob] = { }
                                            s[ob]["data"] = data
                                            $(ob).empty()
                                            $(ob).append("<option value=''>请选择</option>")
                                            for (var j = 0; j < data.length; j++) {
                                                if (o[ob].text != undefined && o[ob].text != null) {
                                                    $(ob).append("<option value=" + data[j][o[ob].value] + ">" + data[j][o[ob].text] + "</option>")
                                                } else {
                                                    $(ob).append("<option value=" + data[j].ID + ">" + data[j].Name + "</option>")
                                                }
                                                }
                                            }
                                        }
                                    })
                            }()
                        if (o[ob].duf != undefined) { 
                            $(ob).val(o[ob].duf)
                        }
                    } else {
                        layer.msg("请输入地址或数据源", { icon: 5 })
                    }
                    }
                    if (fu != undefined) {
                        fu(s)
                    }
                    form.render()
                },
                reload: function (duf) {
                    obj.render(s)
                    for (var i = 0; i < duf.length; i++) {
                        for (var da in s) {
                            $("tbody tr:eq(" + i + ")").find(da).val(duf[i][da.replace(".","")])
                        }
                    }
                    form.render()
                }
            }
            exports('SELECT', obj);
        });