
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WMS.Models;
using System.Text;
using WMS.ControlPlc;
using System.Timers;

namespace WMS.Controllers
{

    public class WCSController : Controller
    {
        public static bool taskStatus=false;
        public static bool taskStatus1 = false;
        public static Timer tmr = new Timer
        {
            Interval = 1000,
            AutoReset = true
        };
        // GET: WCS
        public ActionResult Index()
        {
            return View();
        }
        //执行列表
        public static void ExecList(string taskId) {
            using (WMSEntities wm = new WMSEntities()) {
                WS.SendJson(wm.WH_Comm.Where(p=>p.TaskID==taskId).ToList());
            }
                
        }
        //机器故障
        public static void Fault(string taid)
        {
            tmr.Stop();
            using (WMSEntities wm =new WMSEntities()) {
                wm.Error();
                ExecList(taid);
                CheckAll();
            }
        }
        //删除任务
        public static void DelTask(string type ,string taid) {
            using (WMSEntities wm = new WMSEntities())
            {
                _ = wm.DelTask(taid,type);
                CheckAll();
            }
        }
        //任务运行
        public static void RunTask(bool run,bool Complete,bool zdjcyxtd) {
            try
            {
                if (run)
                {
                    if (Complete)
                    {
                        using (WMSEntities w = new WMSEntities())
                        {
                            if (taskStatus)
                            {
                               var comm= w.CommSuccess().FirstOrDefault();
                                if (comm.type == "出库") {
                                    Controls.StratRGV(comm.IP);
                                }
                                var task = w.WCS_Task.Where(p => p.TaskID == comm.AID).ToList();
                                if (task.Count == 0) {
                                    tmr.Stop();
                                }
                                CheckAll();
                                ExecList(comm.AID);
                            }
                            List<WCS_Comm> list = w.WCS_Comm.Where(p => p.Statu == "执行中").ToList();
                            if (list.Count > 0)
                            {
                                var a = list[0];
                                w.RunComm(a.id);
                                taskStatus = true;
                                Controls.WholePileInOut(a.IP, byte.Parse(a.mo), a.qx.Value, a.qy.Value, a.qz.Value, a.fx.Value, a.fy.Value, a.fz.Value);
                                if (a.type=="出库" || a.type == "入库") {
                                    if (zdjcyxtd) {
                                        Controls.PlcStrat(a.IP);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch {
                WS.SendJson("发生错误");
                tmr.Stop();
            }
        }
        //重试
        public static void Retry() {
            tmr.Start();
        }
        //开始执行
        static void Tmr_Elapsed(object sender, ElapsedEventArgs e) {
            if (Controls.CheckPLCDate()==0) {
                tmr.Stop();
            }
        }
        public static void ExecTask(string taid) {
            tmr.Elapsed += new ElapsedEventHandler(Tmr_Elapsed);
            using (WMSEntities wm=new WMSEntities()) {
                if (Controls.CheckPLCDate() == 1) { 
                _ = wm.ExecTask(taid);
                CheckAll();
                ExecList(taid);
                taskStatus1 = true;
                tmr.Start();
                }
            }
               
        }
        //创建任务
        private static void AddTask(Dictionary<string, string> data)
        {
            Tools<object>.SqlComm("exec CreateTask ", data);
        }
        public static void CreateTask(List<Dictionary<string, string>> data)
        {
            data.ForEach(AddTask);
            CheckAll();
        }
        #region 库存管理
        //库存查询
        public static void CheckInventory() {
            using (WMSEntities wm = new WMSEntities())
            {

                Dictionary<string, object> map = new Dictionary<string, object>()
            {
                {"Inventory",wm.CheckInventory().ToList() },
                {"options",wm.CheckHw().ToList() },

            };
                WS.SendJson(map);
            }
        }
        //更新库存
        public static void UpInventory(Dictionary<string,string> data) {
            Tools<object>.SqlComm("exec UpInventory ", data);
        }
        //查询行详情
        public static void CheckDetails(string id) {
            using (WMSEntities wm = new WMSEntities())
            {
                WS.SendJson(wm.CheckDetails(id).ToList());
            }
        }
        //excel导入
        private static void Import(Dictionary<string, string> data) {
            Tools<object>.SqlComm("exec AddExcel ", data);
        }
        public static void ExcelImport(List<Dictionary<string,string>> data) {
            data.ForEach(Import);
        }
        #endregion
        #region 货位管理
        //查询货位
        public static void CheckGoods() {
            using (WMSEntities wm =new WMSEntities()) {
                WS.SendJson(wm.CheckGoods().ToList());
            }
        }
        //修改货位
        public static void UpGoods(Dictionary<string,string> data) {
            Tools<object>.SqlComm("exec UpGoods ", data);
        }
        //添加货位
        private static void Add(Dictionary<string, string> data) {
            Tools<object>.SqlComm("exec AddGoods ", data);
        }
        public static void AddGoods(List<Dictionary<string,string>> data) {
            data.ForEach(Add);
        }
        #endregion
        #region 仓库实时运行状况
        //启动RGV
        public string StratRGV(string ip) {
            return Controls.StratRGV(ip);
        }
        public ActionResult WarehouseState()
        {
            return View();
        }
        //物料统计
        public ActionResult CheckHousCount() {
            using (WMSEntities wm=new WMSEntities ()) {
                return Json(wm.CheckHousCount().ToList(),JsonRequestBehavior.AllowGet);
            }
        }
       
        //库存统计
        public ActionResult CheckHousSum(WH_Material data) {
            using (WMSEntities wMS=new WMSEntities ()) {
                return Json(wMS.CheckHousSum(data.PartName,data.PartSpec,data.PartMaterial).FirstOrDefault(),JsonRequestBehavior.AllowGet);
            }

        }
        //懒得注释了
        public ActionResult CheckCounts() {

            using (WMSEntities w=new WMSEntities ()) {
                return Json(w.CheckCounts().ToList(),JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult CheckMQTY() {
            using (WMSEntities w = new WMSEntities())
            {
                return Json(w.CheckMQTY().ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        public static void CheckAll() {
            using (WMSEntities w=new WMSEntities()) {
                Dictionary<string, object> map = new Dictionary<string, object>
                {
                    { "MQTY", w.CheckMQTY().ToList() },
                    { "Counts", w.CheckCounts().ToList() },
                    { "HousCount", w.CheckHousCount().ToList() },
                    { "Task", w.WCS_Task.ToList() },
                    { "Place", w.WCS_Place.ToList() },
                    { "WcsComm", w.WCS_Comm.ToList() },
                    { "Huos", w.CheckHuos().ToList() },
                    { "HousSum", w.Database.SqlQuery<CheckHousSum_Result>("exec CheckHousSum").FirstOrDefault() },
                    { "WCount", w.CheckWCount().FirstOrDefault() },
                    { "WhMaterial", w.CheckWhMaterial().ToList() },
                    { "MaterialStatistics", w.CheckMaterialStatistics().ToList() }
            };
                WS.SendJsons(map);
            }
        }
        //public ActionResult pdf2txt(HttpPostedFileBase file)
        //{
        //    var fileName1 = Path.Combine(Request.MapPath("~/Upload"), Path.GetFileName(file.FileName));
        //    file.SaveAs(fileName1);
        //    PDDocument doc = PDDocument.load(fileName1);

        //    PDFTextStripper pdfStripper = new PDFTextStripper();

        //    string text = pdfStripper.getText(doc);

        //    Dictionary<string, object> map = new Dictionary<string, object>
        //            {
        //                { "code", 0 },
        //                { "msg", "" },
        //                { "data",  text}
        //            };
        //    return Json(map,JsonRequestBehavior.AllowGet);
        //}
        //位置信息
        public ActionResult CheckPosition() {
            using (WMSEntities wMS = new WMSEntities()) {
                return Json(wMS.CheckPosition().ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        //查询可用货位信息
        public ActionResult CheckWCount() {
            using (WMSEntities wm = new WMSEntities()) {
                return Json(wm.CheckWCount().FirstOrDefault(), JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
        #region 监控台
        public ActionResult Console() {

            return View();
        }
        //查询wcs命令
        public ActionResult WcsComm(string aid) {
            using (WMSEntities mSEntities = new WMSEntities()) {
                return Json(mSEntities.WCS_Comm.Where(p => p.AID == aid).ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        //查询wcs命令2
        public ActionResult CheckWcsComm()
        {
            using (WMSEntities mSEntities = new WMSEntities())
            {
                return Json(mSEntities.WCS_Comm.ToList(), JsonRequestBehavior.AllowGet);
            }
        }//展会专用
        public void ZH() {
            using (WMSEntities wMS=new WMSEntities()) {
                wMS.Zhzy();
            }
        }
        //修改任务状态
        public void UpTaskStatu(string aid,string status) {
            using (WMSEntities wMS=new WMSEntities ()) {
               var list= wMS.WH_Comm.Where(p =>p.TaskID == aid).FirstOrDefault();
                list.Status = status;
                wMS.SaveChanges();
            }
        }
        //清理完成任务
        public void DelSuTask() {
            using (WMSEntities wms =new WMSEntities()) {
                wms.delSuTask();
            }
        }
        //运行下个指令
        public string NextComm() {

            return "";
        }
        #endregion
        #region 命令分解
        public ActionResult Command() {
            return View();
        }
        //查询命令
        public ActionResult CheckComm(string Name)
        {
            using (WMSEntities wMS = new WMSEntities())
            {
                if (Name != null)
                {
                    Dictionary<string, string> map = new Dictionary<string, string>
                    {
                        { "Name",Name }
                    };
                    return Json(Tools<checkComm_Result>.SqlMap("exec checkComm ", map), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    List<WCS_DecomposedCommand> list = wMS.WCS_DecomposedCommand.GroupBy(p => p.Name).Select(g => g.FirstOrDefault()).ToList();
                    return Json(list, JsonRequestBehavior.AllowGet);
                }
            }

        }
        #endregion
        #region 机器信息注册
        public ActionResult Machine()
        {
            return View();
        }
        //查询机器类型
        public ActionResult CheckMachinType(string value) {
            List<WCS_MachinType> list;
            using (WMSEntities ma = new WMSEntities()) {
                if (value != null)
                {
                    list = ma.WCS_MachinType.Where(p => p.Name == value).ToList();
                }
                else
                {
                    list = ma.WCS_MachinType.ToList();
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询可用仓库
        public ActionResult CheckWo(string type) {
            using (WMSEntities wMS = new WMSEntities()) {
                return Json(wMS.checkWo("", type).ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        //查询机器
        public ActionResult CheckMachine(string type, string id, Dictionary<string, string> data, string value) {
            List<WCS_Machine> list;
            using (WMSEntities wMS = new WMSEntities()) {
                if (type != null)
                {
                    data.Add("type", type);
                }
                if (id == "1")
                {
                    return Json(Tools<checkMachine_Result>.SqlMap("exec checkMachine ", data), JsonRequestBehavior.AllowGet);
                }
                else {
                    if (value != null)
                    {
                        list = wMS.WCS_Machine.Where(p => p.Name == value).ToList();
                    }
                    else {
                        list = wMS.WCS_Machine.ToList();
                    }
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询机器编码
        public ActionResult CheckNumber(string value) {
            List<WCS_Machine> list;
            int id = int.Parse(value);
            using (WMSEntities wMS = new WMSEntities()) {
                list = wMS.WCS_Machine.Where(p => p.ID == id).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //修改操作
        public string WcsUpAll(string type, Dictionary<string, string> data) {
            data.Add("type", type);
            Tools<object>.SqlComm("exec WcsUpAll ", data);
            return "true";
        }
        //删除单个
        public string WcsDelSingle(string type, string id) {
            Dictionary<string, string> data = new Dictionary<string, string>
            {
                {"type",type },
                {"id",id }
            };
            Tools<object>.SqlComm("exec WcsDelAll ", data);
            return "true";
        }
        //删除多个
        public string WcsDelAll(string type, List<string> id)
        {
            StringBuilder builder = new StringBuilder();
            int i = 0;
            foreach (var all in id)
            {
                if ((i + 1) == id.Count())
                {
                    builder.Append(all);
                }
                else
                {
                    builder.Append(all + ",");
                }
                i++;
            }
            Dictionary<string, string> data = new Dictionary<string, string>
                {
                    {"type",type },
                    {"id",builder.ToString()}
                };
            Tools<object>.SqlComm("exec WcsDelAll ", data);
            return "true";
        }
        //添加机器等
        public string WcsAddAll(Dictionary<string, string> data, string type)
        {
            string sql = "exec WcsAddAll ";
            data.Add("CreatedBy", Session["user"].ToString());
            using (WMSEntities ws = new WMSEntities())
            {
                if (type != null)
                {
                    data.Add("type", type);
                }
                Tools<checkPlace_Result>.SqlComm(sql, data);
            }
            return "true";
        }
        //查询货位状态
        public ActionResult CheckHous() {
            using (WMSEntities wMS =new WMSEntities()) {
                return Json(wMS.CheckHuos().ToList(),JsonRequestBehavior.AllowGet);
            }
                
        }

        #endregion
        #region 功能位置信息注册
        public ActionResult Functional()
        {
            return View();
        }
        //查询功能位置类型
        public ActionResult CheckPlaceType(string value)
        {
            List<WCS_PlaceType> list;
            using (WMSEntities ma = new WMSEntities())
            {
                if (value != null)
                {
                    list = ma.WCS_PlaceType.Where(p => p.Name == value).ToList();
                }
                else
                {
                    list = ma.WCS_PlaceType.ToList();
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询功能位置
        public ActionResult CheckPlace(string type, string id, Dictionary<string, string> data, string value)
        {
            List<WCS_Place> list;
            using (WMSEntities wMS = new WMSEntities())
            {
                string sql = "exec checkPlace ";
                if (type != null)
                {
                    sql += "@type=" + type + ",";
                }
                if (id == "1")
                {
                    return Json(Tools<checkPlace_Result>.SqlMap(sql,data), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (value != null)
                    {
                        list = wMS.WCS_Place.Where(p => p.Name == value).ToList();
                    }
                    else
                    {
                        list = wMS.WCS_Place.ToList();
                    }
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        #endregion
       
    }
}