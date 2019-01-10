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
        #endregion
        #region 机器信息注册
        public ActionResult Machine()
        {
            return View();
        }
        //查询机器类型
        public ActionResult checkPlace() {
            List<WCS_Place> list;
            using (WMSEntities ma=new WMSEntities ()) {
                list = ma.WCS_Place.ToList();
            }
                return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询机器
        public ActionResult checkMachine(string type,string id,Dictionary<string,string> data) {
            List<WCS_Machine> list;
            List<checkMachine_Result> list1;
            StringBuilder builder = new StringBuilder("exec checkMachine ");
            if (type != null) {
                builder.Append("@type="+type+",");
            }
            SqlParameter[] parameters = new SqlParameter[data.Count()];
            int i = 0;
            using (WMSEntities wMS=new WMSEntities ()) {
                if (id == "1")
                {
                    foreach (var da in data) {
                        parameters[i] = new SqlParameter("@"+da.Key,da.Value);
                        if (i + 1 == data.Count())
                        {
                            builder.Append("@" + da.Key + "=@" + da.Key);
                        }
                        else {
                            builder.Append("@" + da.Key + "=@" + da.Key+",");
                        }
                    }
                    list1 = wMS.Database.SqlQuery<checkMachine_Result>(builder.ToString(),parameters).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>();
                    map.Add("code",0);
                    map.Add("msg","");
                    map.Add("count",list1.Count());
                    map.Add("data",list1);
                    return Json(map,JsonRequestBehavior.AllowGet);
                }
                else {
                    list = wMS.WCS_Machine.ToList();
                }
            }
                return Json(list,JsonRequestBehavior.AllowGet);          
        }
        //修改操作
        public string WcsUpAll(string type,Dictionary<string,string> data) {
            StringBuilder builder = new StringBuilder("exec WcsUpdAll ");
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
                parameters[0] = new SqlParameter("@id",id);
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
                parameters[0] = new SqlParameter("@id",id);
                wMS.Database.ExecuteSqlCommand("exec WcsDelAll @type=@type,@ID=@id");
            }
            return "true";
        }
        //添加机器等
        public string WcsAddAll(Dictionary<string, string> data, string type)
        {
            StringBuilder builder = new StringBuilder("exec WcsAddAll @type=" + type + ",@CreatedBy=" + Session["user"].ToString() + ",");
            using (WMSEntities ws = new WMSEntities())
            {
                int index = 0;
                SqlParameter[] parameter = new SqlParameter[data.Count()];
                foreach (var add in data)
                {
                    parameter[index] = new SqlParameter("@" + add.Key, add.Value);
                    builder.Append("@" + add.Key + "=@" + add.Key + ",");
                    index++;
                }
                string sql = builder.ToString().Substring(0, builder.ToString().LastIndexOf(","));
                ws.Database.ExecuteSqlCommand(sql, parameter);
            }
            return "true";
        }
        #endregion
        #region 功能位置信息注册
        public ActionResult Functional()
        {
            return View();
        }
        #endregion
    }
}