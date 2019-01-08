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
    public class WMSController : Controller
    {
        // GET: WMS
        public ActionResult Index()
        {
            return View();
        }
        #region 入库
        public ActionResult Enter()
        {

            return View();
        }
        #endregion
        #region 出库
        public ActionResult Out()
        {

            return View();
        }
        #endregion
        #region 库位
        public ActionResult WarehousePosition()
        {
            return View();
        }
        #endregion
        #region 库区
        public ActionResult WarehouseArea()
        {
            return View();
        }
        #endregion
        #region 仓库
        public ActionResult Warehouse()
        {
            return View();
        }
        #endregion
        #region 货位
        public ActionResult GoodsArea()
        {
            return View();
        }
        //添加货位仓库等
        public ActionResult AddAll()
        {

            return View();
        }
        //添加仓库等
        public string AddWarehouse(Dictionary<string, string> data, string type)
        {
            string ses = Session["user"].ToString();
            StringBuilder builder = new StringBuilder("exec AddStorage @type=" + type + ",@CreatedBy="+Session["user"].ToString() + ",");
            using (WMSEntities ws = new WMSEntities())
            {
                int index = 0;
                int len = data.Count();
                SqlParameter[] parameter = new SqlParameter[len];
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
        //查询仓库信息
        public ActionResult checkWo(string id, string value, string data)
        {
           
          
            using (WMSEntities wMS = new WMSEntities())
            {

                if (id == "1")
                {
                    if (data == null)
                    {
                        data = "";
                    }
                    SqlParameter[] parameters = new SqlParameter[1];
                    parameters[0] = new SqlParameter("@id", data);
                    List<checkWo_Result> list1 = wMS.Database.SqlQuery<checkWo_Result>("exec checkWo @id", parameters).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>();
                    map.Add("code", 0);
                    map.Add("msg", "");
                    map.Add("count", "");
                    map.Add("data", list1);
                    return Json(map, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    List<WH> list;
                    if (value != null)
                    {
                        list = wMS.WH.Where(p => p.Name == value).ToList();
                    }
                    else
                    {
                        list = wMS.WH.ToList();
                    }
                    return Json(list,JsonRequestBehavior.AllowGet);
                }
            }
        }
    //查询库区信息
    public ActionResult checkkq(string id, string value, Dictionary<string, string> data)
    {
            List<WH_Area> list;
            List<checkKq_Result> list1;
            using (WMSEntities wMS = new WMSEntities())
            {

                if (id == "1")
                {
                    StringBuilder builder = new StringBuilder("exec checkKq ");
                    SqlParameter[] parameter = new SqlParameter[data.Count()];
                    int index = 0;
                    foreach (var da in data)
                    {
                        parameter[index] = new SqlParameter("@" + da.Key, da.Value);
                        if ((index + 1) == data.Count())
                        {
                            builder.Append("@" + da.Key + "=@" + da.Key);
                        }
                        else
                        {
                            builder.Append("@" + da.Key + "=@" + da.Key + ",");
                            index++;
                        }
                    }
                    list1 = wMS.Database.SqlQuery<checkKq_Result>(builder.ToString(), parameter).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>();
                    map.Add("code", 0);
                    map.Add("msg", "");
                    map.Add("count", "");
                    map.Add("data", list1);
                    return Json(map, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (value != null)
                    {
                        list = wMS.WH_Area.Where(p => p.Name == value).ToList();
                        return Json(list, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        list = wMS.WH_Area.ToList();
                        return Json(list, JsonRequestBehavior.AllowGet);
                    }

                }
            }
        }
    //查询库位信息
    public ActionResult checkkw(string id, string value, Dictionary<string,string> data)
    {
            List<WH_StorageLocation> list;
            List<checkkw_Result> list1;
            using (WMSEntities wMS = new WMSEntities())
            {

                if (id == "1")
                {
                    StringBuilder builder = new StringBuilder("exec checkkw ");
                    SqlParameter[] parameter = new SqlParameter[data.Count()];
                    int index = 0;
                    foreach (var da in data)
                    {
                        parameter[index] = new SqlParameter("@" + da.Key, da.Value);
                        if ((index + 1) == data.Count())
                        {
                            builder.Append("@" + da.Key + "=@" + da.Key);
                        }
                        else
                        {
                            builder.Append("@" + da.Key + "=@" + da.Key + ",");
                            index++;
                        }
                    }
                    list1 = wMS.Database.SqlQuery<checkkw_Result>(builder.ToString(), parameter).ToList();
                    Dictionary<string, object> map = new Dictionary<string, object>();
                    map.Add("code", 0);
                    map.Add("msg", "");
                    map.Add("count", "");
                    map.Add("data", list1);
                    return Json(map, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (value != null)
                    {
                        list = wMS.WH_StorageLocation.Where(p => p.Name == value).ToList();
                        return Json(list, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        list = wMS.WH_StorageLocation.ToList();
                        return Json(list, JsonRequestBehavior.AllowGet);
                    }

                }
            }
        }
    //查询货位信息
    public ActionResult checkhuo(string id, string value, Dictionary<string, string> data,string type)
    {
        List<WH_GoodsAllocation> list;
        List<checkHuo_Result> list1;
        using (WMSEntities wMS = new WMSEntities())
        {

            if (id == "1")
                {
                    StringBuilder builder = new StringBuilder("exec checkHuo ");
                    if (type != null)
                    {
                        builder.Append("@type=" + type);
                        if (data.Count() > 0) {
                            builder.Append(",");
                        }
                       
                    }
                    SqlParameter[] parameter = new SqlParameter[data.Count()];
                int index = 0;
                foreach (var da in data)
                {
                    parameter[index] = new SqlParameter("@" + da.Key, da.Value);
                    if ((index + 1) == data.Count())
                    {
                        builder.Append("@" + da.Key + "=@" + da.Key);
                    }
                    else
                    {
                        builder.Append("@" + da.Key + "=@" + da.Key + ",");
                        index++;
                    }
                }
                list1 = wMS.Database.SqlQuery<checkHuo_Result>(builder.ToString(), parameter).ToList();
                Dictionary<string, object> map = new Dictionary<string, object>();
                map.Add("code", 0);
                map.Add("msg", "");
                map.Add("count", "");
                map.Add("data", list1);
                return Json(map, JsonRequestBehavior.AllowGet);
            }
            else
            {
                if (value != null)
                {
                    list = wMS.WH_GoodsAllocation.Where(p => p.Name == value).ToList();
                    return Json(list, JsonRequestBehavior.AllowGet);
                }
                else
                    {
                        if (type == "add") {
                         list = wMS.WH_GoodsAllocation.Where(p=>p.Size==0||p.Size==null).ToList();
                        } else { 
                         list = wMS.WH_GoodsAllocation.ToList();
                        }
                        return Json(list, JsonRequestBehavior.AllowGet);
                }

            }
        }
    }
    //删除单个
    public string DelSingle(string id, string type)
    {
        using (WMSEntities wMS = new WMSEntities())
        {
            int i = int.Parse(id);
            if (type == "huo")
            {
                WH_GoodsAllocation wga = wMS.WH_GoodsAllocation.Where(c => c.ID == i).First();
                wMS.WH_GoodsAllocation.Remove(wga);
            }
            if (type == "kq")
            {
                WH_Area wga = wMS.WH_Area.Where(c => c.ID == i).First();
                wMS.WH_Area.Remove(wga);
            }
            if (type == "ca")
            {
                WH wga = wMS.WH.Where(c => c.ID == i).First();
                wMS.WH.Remove(wga);
            }
            if (type == "kw")
            {
                WH_StorageLocation wga = wMS.WH_StorageLocation.Where(c => c.ID == i).First();
                wMS.WH_StorageLocation.Remove(wga);
            }
           if (type =="xian") {
              var wga = wMS.WH_GoodsAllocation.Where(c => c.ID == i).ToList();
               foreach (var up in wga) {
                        up.Size = 0;
               }
           }
           if (type == "wu")
           {
              WH_Material wga = wMS.WH_Material.Where(c => c.ID == i).First();
            wMS.WH_Material.Remove(wga);
           }
             int w = wMS.SaveChanges();
            if (w > 0)
            {
                return "true";
            }
            else
            {
                return "false";
            }
        }

    }
    //删除多个
    public string DelAll(List<string> id, string type)
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
                    else {
                builder.Append(all+",");
                    }
                    i++;
            }
            SqlParameter[] parameter = new SqlParameter[2];
            parameter[0] = new SqlParameter("@type", type);
            parameter[1] = new SqlParameter("@id", builder.ToString());
            wMS.Database.ExecuteSqlCommand("exec DelAll @type=@type,@id=@id", parameter);
        }
        return "true";
    }
    //修改操作
    public string UpAll(Dictionary<string, string> data, string type)
    {
        using (WMSEntities wMS = new WMSEntities())
        {
            StringBuilder builder = new StringBuilder("exec UpAll ");
                if (type!=null) {
                    builder.Append("@type=" + type+",");
                }
            SqlParameter[] parameters = new SqlParameter[data.Count()];
            int i = 0;
                foreach (var da in data)
                {
                    if (da.Key == "Size")
                    {
                        float Size = float.Parse(da.Value.Replace(" PCS", ""));
                        parameters[i] = new SqlParameter("@" + da.Key, Size);
                    }
                    else {
                    if (da.Key == "CreatedBy") {
                        parameters[i] = new SqlParameter("@CreatedBy", Session["user"]);
                    }
                    else
                    {
                        parameters[i] = new SqlParameter("@" + da.Key, da.Value);
                    }
                    }
                    if ((i + 1) == data.Count())
                {
                    builder.Append("@" + da.Key + "=@" + da.Key);
                }
                else
                {
                    builder.Append("@" + da.Key + "=@" + da.Key + ",");
                }
                i++;
            }
            wMS.Database.ExecuteSqlCommand(builder.ToString(), parameters);
        }
        return "true";
    }
    #endregion
    #region 物料信息
    public ActionResult Material()
    {
        return View();
    }
        //查询物料
    public ActionResult checkwu(string id,Dictionary<string,string> data,int page,int limit,string type) {
            List<checkwu_Result> list;
            List<WH_Material> list1;
            StringBuilder builder = new StringBuilder("exec checkwu ");
            using (WMSEntities mSEntities=new WMSEntities ()) {
                if (id == "1")
                {
                    Dictionary<string, object> map = new Dictionary<string, object>();
                    SqlParameter[] parameters = new SqlParameter[data.Count()];
                    int i = 0;
                    foreach (var da in data)
                    {
                        parameters[i] = new SqlParameter("@" + da.Key, da.Value);
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
                    list = mSEntities.Database.SqlQuery<checkwu_Result>(builder.ToString(), parameters).ToList();
                    PageList<checkwu_Result> pageList = new PageList<checkwu_Result>(list, page, limit);
                    int count = list.Count();
                    map.Add("code", 0);
                    map.Add("msg", "");
                    map.Add("count", count);
                    map.Add("data", pageList);
                    return Json(map, JsonRequestBehavior.AllowGet);
                }
                else {
                    if (type != null)
                    {
                        List<Category> list2 = mSEntities.Category.ToList();
                        return Json(list2, JsonRequestBehavior.AllowGet);
                    }
                    else { 
                    list1 = mSEntities.WH_Material.ToList();
                    return Json(list1,JsonRequestBehavior.AllowGet);
                    }
                }

            }

    }
    #endregion
    #region 库存限制维护
    public ActionResult Inventory()
    {
        return View();
    }
    #endregion
    #region 策略
    public ActionResult Strategy()
    {
        return View();
    }
    #endregion
    #region 员工登陆
    public ActionResult login()
    {
        return View();
    }
    #endregion
}
}