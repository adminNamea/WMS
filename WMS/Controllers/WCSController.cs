using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using System.Web.Mvc;
using WMS.Models;
using System.Data.SqlClient;
using System.Text;
using org.apache.pdfbox.pdmodel;
using org.apache.pdfbox.util;
using System.IO;
using WMS.ControlPlc;


namespace WMS.Controllers
{
    public class WCSController : Controller
    {
        // GET: WCS
        public ActionResult Index()
        {
            return View();
        }
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
        //zhzy
        public string zhzy() {
            using (WMSEntities wMS=new WMSEntities ()) {
                wMS.Zhzy();
            }
                return "true";
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
        public ActionResult CheckAll(WH_Material data) {
            using (WMSEntities w=new WMSEntities()) {
                Dictionary<string, object> map = new Dictionary<string, object>
                {
                    { "MQTY", w.CheckMQTY().ToList() },
                    { "Counts", w.CheckCounts().ToList() },
                    { "HousCount", w.CheckHousCount().ToList() },
                    { "Task", w.WH_Comm.ToList() },
                    { "Place", w.WCS_Place.ToList() },
                    { "WcsComm", w.WCS_Comm.ToList() },
                    { "Huos", w.CheckHuos().ToList() },
                    { "HousSum", w.CheckHousSum(data.PartName, data.PartSpec, data.PartMaterial).FirstOrDefault() },
                    { "WCount", w.CheckWCount().FirstOrDefault() },
                    { "WhMaterial", w.CheckWhMaterial().ToList() },
                    { "MaterialStatistics", w.CheckMaterialStatistics().ToList() }
            };
                return Json(map,JsonRequestBehavior.AllowGet);
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
        public ActionResult CheckWCount(string name) {
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
               var list= wMS.WH_Comm.Where(p => p.aid == aid).FirstOrDefault();
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
        //完成任务
        public void SuTask(string aid) {
            using (WMSEntities wMS = new WMSEntities()) {
                wMS.CommSuccess(aid);
            }
        }
        //查询任务队列
        public ActionResult CheckTask() {
            using (WMSEntities wMS = new WMSEntities()) {
                return Json(wMS.WH_Comm.ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        //检查PLC情况
        public ActionResult CheckPlc(string ip) {
            Dictionary<string, bool> map = Controls.CheckPLCDate(ip);
            return Json(map,JsonRequestBehavior.AllowGet);
        }
        //运行下个指令
        public string NextComm(List<string> list) {

            return "";
        }
        //完成命令
        public string Success() {

            return "";
        }
        //故障处理
        public void Error(string aid) {
            using (WMSEntities wMS=new WMSEntities()) {
                wMS.Error(aid);
            }
        }
        #endregion
        #region 命令分解
        public ActionResult Command() {
            return View();
        }
        //查询命令
        public ActionResult checkComm(string Name)
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
        public ActionResult checkMachinType(string value) {
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
        public ActionResult checkMachine(string type, string id, Dictionary<string, string> data, string value) {
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
        public ActionResult checkPlaceType(string value)
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
        public ActionResult checkPlace(string type, string id, Dictionary<string, string> data, string value)
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
        //入库命令生成
        public ActionResult InComm(Dictionary<string,string> wc) {
            using (WMSEntities wm=new WMSEntities()) {


            }
                return Json(wc, JsonRequestBehavior.AllowGet);
        }
        public static bool ExcelToPdf(string sourcePath, string targetPath)
        {
            bool result = false;
            XlFixedFormatType xlTypePDF = XlFixedFormatType.xlTypePDF;//转换成pdf
            object missing = Type.Missing;
            Microsoft.Office.Interop.Excel.ApplicationClass applicationClass = null;
            Workbook workbook = null;
            try
            {
                applicationClass = new Microsoft.Office.Interop.Excel.ApplicationClass();
                string inputfileName = sourcePath;//需要转格式的文件路径
                string outputFileName = targetPath;//转换完成后PDF文件的路径和文件名名称
                XlFixedFormatType xlFixedFormatType = xlTypePDF;//导出文件所使用的格式
                XlFixedFormatQuality xlFixedFormatQuality = XlFixedFormatQuality.xlQualityStandard;//1.xlQualityStandard:质量标准，2.xlQualityMinimum;最低质量
                bool includeDocProperties = true;//如果设置为True，则忽略在发布时设置的任何打印区域。
                bool openAfterPublish = false;//发布后不打开
                workbook = applicationClass.Workbooks.Open(inputfileName, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing);
                if (workbook != null)
                {
                    workbook.ExportAsFixedFormat(xlFixedFormatType, outputFileName, xlFixedFormatQuality, includeDocProperties, openAfterPublish, missing, missing, missing, missing);
                }
                result = true;
            }
            catch
            {
                result = false;
            }
            finally
            {
                if (workbook != null)
                {
                    workbook.Close(true, missing, missing);
                    workbook = null;
                }
                if (applicationClass != null)
                {
                    applicationClass.Quit();
                    applicationClass = null;
                }
            }
            return result;
        }
    }
}