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
        public ActionResult WarehouseState()
        {
            

            return View();
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
            using (WMSEntities wMS=new WMSEntities()) {
                return Json(wMS.CheckPosition().ToList(),JsonRequestBehavior.AllowGet);
            }
        }
        //查询可用货位信息
        public ActionResult CheckWCount(string name) {
            using (WMSEntities wm=new WMSEntities ()) {
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
            using (WMSEntities mSEntities=new WMSEntities ()) {
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
        }
        //查询任务队列
        public ActionResult CheckTask() {
            using (WMSEntities wMS=new WMSEntities()) {
                return Json(wMS.WH_Comm.ToList(),JsonRequestBehavior.AllowGet);
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
                if (Name!=null)
                {
                    Dictionary<string, string> map = new Dictionary<string, string>
                    {
                        { "Name",Name }
                    };
                    return Json(Tools<checkComm_Result>.SqlMap("exec checkComm ",map),JsonRequestBehavior.AllowGet);
                }
                else
                {
                    List<WCS_DecomposedCommand> list = wMS.WCS_DecomposedCommand.GroupBy(p=>p.Name).Select(g=>g.FirstOrDefault()).ToList();
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
            using (WMSEntities ma=new WMSEntities ()) {
                if (value != null)
                {
                    list = ma.WCS_MachinType.Where(p=>p.Name==value).ToList();
                }
                else
                { 
                list = ma.WCS_MachinType.ToList();
                }
            }
                return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询机器
        public ActionResult checkMachine(string type,string id,Dictionary<string,string> data,string value) {
            List<WCS_Machine> list;           
            using (WMSEntities wMS=new WMSEntities ()) {
                if (type != null)
                {
                    data.Add("type",type);
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
                return Json(list,JsonRequestBehavior.AllowGet);          
        }
        //查询机器编码
        public ActionResult CheckNumber(string value) {
            List<WCS_Machine>list;
            int id = int.Parse(value);
            using (WMSEntities wMS= new WMSEntities ()) {
                list = wMS.WCS_Machine.Where(p => p.ID == id).ToList();
            }
                return Json(list,JsonRequestBehavior.AllowGet);
        }
        //修改操作
        public string WcsUpAll(string type,Dictionary<string,string> data) {
            data.Add("type", type);
            Tools<object>.SqlComm("exec WcsUpAll ",data);
            return "true";
        }
        //删除单个
        public string WcsDelSingle(string type,string id) {
            Dictionary<string, string> data = new Dictionary<string, string>
            {
                {"type",type },
                {"id",id }
            };
            Tools<object>.SqlComm("exec WcsDelAll ",data);
                return "true";
        }
        //删除多个
        public string WcsDelAll(string type,List<string> id)
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
                Tools<object>.SqlComm("exec WcsDelAll ",data);
            return "true";
        }
        //添加机器等
        public string WcsAddAll(Dictionary<string,string> data, string type)
        {
            string sql = "exec WcsAddAll @CreatedBy=" + Session["user"].ToString() + ",";
            using (WMSEntities ws = new WMSEntities())
            {
                if (type != null)
                {
                    sql += "@type=" + type + ",";
                }
                Tools<checkPlace_Result>.SqlComm(sql, data);
            }
            return "true";
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
    }
}