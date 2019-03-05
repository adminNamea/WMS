newFunction();

function newFunction() {
    ;
    !function () {
        "use strict";
        layui.config({
            base: '/js/'
        }).use(['form', 'table', 'element', 'SELECT', 'layer'], function () {
            var form = layui.form;
            var $ = layui.jquery;
            var SELECT = layui.SELECT;
            var c1 = {};
            var c2 = {};
            $(function () {
                $.get("/WMS/checkwu", { page: 0, limit: 0 }, function (data) {
                    if (data.length > 0) {
                        c1 = {};
                        c2 = {};
                        layui.each(data, function (index, val) {
                            var obj = { value: val.PartName, label: val.PartName, children: [] };
                            var key = val.PartName
                            var key2 = val.PartName + "_" + val.PartSpec
                            c1[key] = { value: val.PartSpec, label: val.PartSpec, children: [] }
                            c2[key2] = { value: val.PartMaterial, label: val.PartMaterial }
                            v.options.push(obj)
                        })
                    }
                })
                $.get("/WMS/CeckHCount", function (data) {
                    if (data.length > 0) {
                        layui.each(data, function (index, value) {
                            v.to.push(value)
                            v.place.push(value)
                        })
                    }
                })
                var checkAge = (rule, value, callback) => {
                    var d = {}
                    v.to.find(function (x) {
                        if (x.value == v.form.To) {
                            d = x;
                        }
                    })
                    if (!value) {
                        return callback(new Error('数量不能为空'));
                    }
                        if (!Number.isInteger(value)) {
                            callback(new Error('请输入数字'));
                        } else {
                                if (value > (d.size - d.InQTY)) {
                                callback(new Error('超过货位限制'));
                            }else {
                                callback();
                                }
                        }
                }
                var v = new Vue({
                    data: {
                        form: {
                            PartName: '',
                            PartSpec: '',
                            PartMaterial: '',
                            PlaceID: '',
                            InQTY:'',
                            To: '',
                            selectedOptions: [],
                        },
                        options: [],
                        place: [],
                        to: [],
                        rules: {
                            selectedOptions:[
                                { required: true, message: '请选择物料', trigger: 'change' }
                            ],
                            PlaceID: [{ required: true, message: '请选择取料点 ', trigger: 'change' }],
                            To: [{ required: true, message: '请选择放料点', trigger: 'change' }],
                            InQTY: [
                                { validator: checkAge, trigger: 'blur' }
                            ]
                        }
                    },
                    methods: {
                        onSubmit(formName) {
                            this.form.PartName = this.form.selectedOptions[0]
                            this.form.PartSpec = this.form.selectedOptions[1]
                            this.form.PartMaterial = this.form.selectedOptions[2]
                            this.form.selectedOptions == undefined ? false:
                            delete this.form.selectedOptions
                            this.$refs[formName].validate((valid) => {
                                if (valid) {
                                    alert('submit!');
                                 //$.post("/WMS/InMaterial", { data: this.form }, function (data) {
                                 //    layui.msg("添加成功")
                                 //})
                                } else {
                                    return false;
                                }
                            });
                           
                        },
                        resetForm(formName) {
                            this.$refs[formName].resetFields();
                        },
                        selectChange(val) {
                            this.options.find(function (x) {
                                if (val[0] == x.value) {
                                    x.children = []
                                    x.children.push(c1[val[0]])
                                    val[1] == undefined ? false :
                                        x.children.find(function (x1) {
                                            if (val[1] == x1.value) {
                                                x1.children = []
                                                var a = val[0] + "_" + val[1];
                                                x1.children.push(c2[a])
                                            }
                                        })
                                }

                            })
                        } 
                    }
                }).$mount("#tiao")
                var namem, PartSpecs, boo = true
                SELECT.render({
                    ".Place": { data: "/WCS/checkPlace" },
                    ".Category1": { data: "/WMS/checkwu", where: { page: 0, limit: 0, type: "lei" } },
                    ".GoodsAllocationID": { data: "/WMS/checkhuo" }
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
                    $(".PartSpec:eq(" + index + ")").empty()
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
                        $.post("/WMS/InMaterial", { data: data.field }, function (data) {
                            if (data == 1) {
                                parent.layer.close(layer.index)
                                parent.layer.msg("已确认", { time: 500 })
                            } else {
                                parent.layer.close(layer.index)
                                parent.layer.msg("货位已用完", { time: 500 })
                            }
                        })
                    } else {
                        $(".InQTY:eq(" + index + ")").focus()
                    }
                    return false;
                });
            })
        });
    }(window);
}