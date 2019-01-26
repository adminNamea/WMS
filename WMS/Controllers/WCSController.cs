using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using System.Web.Mvc;
using WMS.Models;
using System.Data.SqlClient;
using System.Text;
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
        #endregion
        #region 监控台
        public ActionResult Console() {

            return View();
        }
        #endregion
        #region 命令分解
        public ActionResult Command() {
            return View();
        }
        //查询命令
        public ActionResult checkComm(string Name)
        {
            List<WCS_DecomposedCommand> list;
            List<checkComm_Result> list1;
            SqlParameter parameters = new SqlParameter("@Name",Name);
            using (WMSEntities wMS = new WMSEntities())
            {
                if (Name!=null)
                {
                    list1 = wMS.Database.SqlQuery<checkComm_Result>("exec checkComm @Name",parameters).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>
                    {
                        { "code", 0 },
                        { "msg", "" },
                        { "count", list1.Count() },
                        { "data", list1 }
                    };
                    return Json(map, JsonRequestBehavior.AllowGet);
                }
                else
                {
                        list = wMS.WCS_DecomposedCommand.GroupBy(p=>p.Name).Select(g=>g.FirstOrDefault()).ToList();
                }
            }
            return Json(list, JsonRequestBehavior.AllowGet);
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
            List<checkMachine_Result> list1;
           
            using (WMSEntities wMS=new WMSEntities ()) {
                Tools.builder = new StringBuilder("exec checkMachine ");
                if (type != null)
                {
                    Tools.builder.Append("@type=" + type + ",");
                }
                Tools.parameter = new SqlParameter[data.Count()];
                if (id == "1")
                {
                    Tools.SqlAll(data,null);
                    list1 = wMS.Database.SqlQuery<checkMachine_Result>(Tools.builder.ToString(),Tools.parameter).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>
                    {
                        { "code", 0 },
                        { "msg", "" },
                        { "count", list1.Count() },
                        { "data", list1 }
                    };
                    return Json(map,JsonRequestBehavior.AllowGet);
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
            StringBuilder builder = new StringBuilder("exec WcsUpAll @type="+type+",");
            SqlParameter[] parameters = new SqlParameter[data.Count()];
            int i = 0;
            using (WMSEntities wMS = new WMSEntities()) {
                foreach (var da in data)
                {
                    if (da.Key == "UpdatedBy")
                    {
                        parameters[i] = new SqlParameter("@CreatedBy", Session["user"]);
                    }
                    else {
                    parameters[i] = new SqlParameter("@" + da.Key, da.Value);
                    }
                    if (i + 1 == data.Count())
                    {
                        builder.Append("@" + da.Key + "=@" + da.Key);
                    }
                    else
                    {
                        builder.Append("@" + da.Key + "=@" + da.Key + ",");
                    }
                    i++;
                }
                wMS.Database.ExecuteSqlCommand(builder.ToString(),parameters);
            }
                return "true";
        }
        //删除单个
        public string WcsDelSingle(string type,string id) {
            using (WMSEntities wMS=new WMSEntities ()) {
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("@type",type);
                parameters[1] = new SqlParameter("@id",id);
                wMS.Database.ExecuteSqlCommand("exec WcsDelAll @type=@type,@ID=@id",parameters);
            }
                return "true";
        }
        //删除多个
        public string WcsDelAll(string type,List<string> id)
        {
            StringBuilder builder = new StringBuilder();
            using (WMSEntities wMS = new WMSEntities())
            {
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
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("@type", type);
                parameters[1] = new SqlParameter("@id", builder.ToString());
                wMS.Database.ExecuteSqlCommand("exec WcsDelAll @type=@type,@ID=@id",parameters);
            }
            return "true";
        }
        //添加机器等
        public string WcsAddAll(Dictionary<string,string> data, string type)
        {
            Tools.builder = new StringBuilder("exec WcsAddAll @CreatedBy=" + Session["user"].ToString() + ",");
            Tools.parameter = new SqlParameter[data.Count];
            using (WMSEntities ws = new WMSEntities())
            {
                if (type != null)
                {
                    Tools.builder.Append("@type=" + type + ",");
                }
                Tools.SqlAll(data,"");
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
            List<checkPlace_Result> list1;
            
            using (WMSEntities wMS = new WMSEntities())
            {
                Tools.parameter = new SqlParameter[data.Count()];
                Tools.builder = new StringBuilder("exec checkPlace ");
                if (type != null)
                {
                    Tools.builder.Append("@type=" + type + ",");
                }

                if (id == "1")
                {
                    Tools.SqlAll(data,null);
                    list1 = wMS.Database.SqlQuery<checkPlace_Result>(Tools.builder.ToString(), Tools.parameter).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>
                    {
                        { "code", 0 },
                        { "msg", "" },
                        { "count", list1.Count() },
                        { "data", list1 }
                    };
                    return Json(map, JsonRequestBehavior.AllowGet);
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