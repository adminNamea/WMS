window.ws = new WebSocket("ws://localhost:8080/");
window.mws = new WebSocket("ws://localhost:8080/");
window.ajaxWs = (w, obj, callBack) => {
    if (callBack) {
        w.onmessage = callBack;
    }
    w.send(JSON.stringify(obj));
}
Vue.config.productionTip = false
Vue.config.silent = true
window.mws.onopen = function () {
        "use strict"
    Vue.prototype.$echarts = echarts;
    
        const routes = [
            { path: '/foo', component: () => import('/js/In_vue.js') },
            { path: '/', component: () => import('/js/Home_vue.js') },
            { path: '/bar', component: { template: "<div>666</div>" } }
        ]
        const router = new VueRouter({
            routes
        })
        var v = new Vue({
            el: "#app",
            data: {
                Logging:localStorage.Logging ?JSON.parse(localStorage.Logging):[],
                rizi: false,
                centerDialogVisible: false,
                pathStatus: false,
                SetData: localStorage.getItem("taskSet") ? JSON.parse(localStorage.getItem("taskSet")) : {
                    switchValue: false,
                    removeTask: false,
                    MonitoringTime: 1,
                    InventoryQty: 0,
                    MaterialQty: 0,
                    huoType: 1
                }
            },
            methods: {
                taskCancel(b) {
                    if (b) {
                        localStorage.setItem("taskSet", JSON.stringify(this.SetData))
                    }
                    this.centerDialogVisible = false
                    if (localStorage.getItem('taskSet')) {
                        this.SetData = JSON.parse(localStorage.getItem('taskSet'))
                    }
                },
            },
            computed: {
                lo() {
                    return {
                        jlo: this.Logging.filter(x => this.toDateString(x.sDate, "yyyy-MM-dd") == this.toDateString(new Date(), "yyyy-MM-dd")).length,
                        jg: this.Logging.filter(x => x.type == "机器故障" && this.toDateString(x.sDate, "yyyy-MM-dd") == this.toDateString(new Date(), "yyyy-MM-dd")).length
                    }
                }
            },
            router,
            watch: {
                '$route'(to) {
                   this.pathStatus = to.path == "/" ? true : false;
                }
            },
            created() {
                Vue.prototype.taskSetData = this.SetData;
                Vue.prototype.loading = this.$loading({
                    lock: true,
                    text: '数据加载中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            }
        })
}
