using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WMS.Models;
using System.Data.SqlClient;
using System.Text;
using WMS.ControlPlc;

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
        //PLC交互
        public ActionResult PlcIn(string aid,string wcs)
        {
            string msgg = "无可用机器";
            Dictionary<string, object> map = new Dictionary<string, object>();
            var boo = false;
            List<WCS_Comm> list;
            using (WMSEntities wMS =new WMSEntities ()) {
                try
                {
                   
                    wMS.PlcIn(aid);
                    if (wcs != null)
                    {
                         list = wMS.WCS_Comm.Where(p => p.AID == aid && p.ids == wcs).ToList();
                        list[0].Statu = "2";
                        if (list[0].type == "回原点") {
                            boo = true;
                        }
                        wMS.SaveChanges();
                    }
                    else {
                        list = wMS.WCS_Comm.Where(p => p.AID==aid).ToList();
                    }
                    msgg = Controls.WholePileInOut(list[0].IP,false,
                    boo, false,false,false, Convert.ToByte(list[0].mo), Convert.ToInt32(list[0].qx),
                    Convert.ToInt32(list[0].qy), Convert.ToInt32(list[0].qz),
                    Convert.ToInt32(list[0].fx), Convert.ToInt32(list[0].fy),
                    Convert.ToInt32(list[0].fz), Convert.ToInt32(list[0].InQTY),
                    Convert.ToInt32(list[0].y1), Convert.ToInt32(list[0].z1));
                    map.Add("data", list);
                   
                }
                catch
                {
                    map.Add("msg", msgg);
                    return Json(map, JsonRequestBehavior.AllowGet);
                }
                map.Add("msg", msgg);
                
                return Json(map, JsonRequestBehavior.AllowGet);
            }
               
        }
        //plc使能
        public void PlcSn(string IP) {
           Controls.PlcStrat(IP);
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
            data.Add("type", type);
            data.Add("CreatedBy",Session["user"].ToString());
            Tools<object>.SqlComm("exec AddStorage ", data);
            return "true";
        }
        //查询仓库信息
        public ActionResult CheckWo(string id, string value, string data)
        {
            using (WMSEntities wMS = new WMSEntities())
            {

                if (id == "1")
                {
                    if (data == null)
                    {
                        data = "";
                    }
                    Dictionary<string, string> a = new Dictionary<string, string>
                    {
                        { "id", data }
                    };
                    return Json(Tools<checkWo_Result>.SqlMap("exec checkWo ",a), JsonRequestBehavior.AllowGet);
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
                    return Json(list, JsonRequestBehavior.AllowGet);
                }
            }
        }
        //查询库区信息
        public ActionResult Checkkq(string id, string value, Dictionary<string, string> data)
        {
            List<WH_Area> list;

            using (WMSEntities wMS = new WMSEntities())
            {

                if (id == "1")
                {
                    return Json(Tools<checkKq_Result>.SqlMap("exec checkKq ", data), JsonRequestBehavior.AllowGet);
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
        public ActionResult Checkkw(string id, string value, Dictionary<string, string> data)
        {
            List<WH_StorageLocation> list;
            using (WMSEntities wMS = new WMSEntities())
            {
                if (id == "1")
                {
                    string sql = "exec checkkw ";
                    return Json(Tools<checkkw_Result>.SqlMap(sql, data), JsonRequestBehavior.AllowGet);
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
        public ActionResult Checkkqs(int a,int type) {
            using (WMSEntities wMS=new WMSEntities ()) {
                List<Checkkqs_Result> list = wMS.Checkkqs(a,type).ToList();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Checkkws(int a, int b)
        {
            using (WMSEntities wMS = new WMSEntities())
            {
                return Json(wMS.WH_StorageLocation.Where(p => p.WHID == a&&p.WHAreaID==b).ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Checkhuos(int a,int b,int c)
        {
            using (WMSEntities wMS = new WMSEntities())
            {
                return Json(wMS.WH_GoodsAllocation.Where(p => p.WHID == a&&p.WHAreaID==b&&p.StorageLocationID==c).ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        //查询货位信息
       
        public ActionResult Checkhuo(string id, string value, Dictionary<string, string> data, string type)
        {
            List<WH_GoodsAllocation> list;
            using (WMSEntities wMS = new WMSEntities())
            {
                if (id == "1")
                {
                    string sql = "exec checkHuo ";

                    if (type != null)
                    {
                        sql += "@type=" + type;
                        if (data.Count() > 0)
                        {
                            sql += ",";
                        }
                    }
                    return Json(Tools<checkHuo_Result>.SqlMap(sql, data), JsonRequestBehavior.AllowGet);
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
                        if (type == "add")
                        {
                            list = wMS.WH_GoodsAllocation.Where(p => p.Size == 0 || p.Size == null).ToList();
                        }
                        else
                        {
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
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("@type", type);
                parameters[1] = new SqlParameter("@id", id);
                wMS.Database.ExecuteSqlCommand("exec DelAll @type=@type,@ID=@id", parameters);
            }
            return "true";

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
                    else
                    {
                        builder.Append(all + ",");
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
                if (type != null)
                {
                    builder.Append("@type=" + type + ",");
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
                    else
                    {
                        if (da.Key == "CreatedBy")
                        {
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
        //查询出库位
        public ActionResult OutHuo() {
            using (WMSEntities wMS=new WMSEntities()) {
                return Json(wMS.OutHuo().ToList(), JsonRequestBehavior.AllowGet);
            }

        }
        //查询物料
        public ActionResult Checkwu(string id, Dictionary<string, string> data, int page, int limit, string type, string value)
        {
            List<WH_Material> list1;
            using (WMSEntities mSEntities = new WMSEntities())
            {
                if (id == "1")
                {
                    return Json(Tools<checkwu_Result>.SqlMap("exec checkwu ", data, page, limit), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (type != null)
                    {
                        List<Category> list2 = mSEntities.Category.ToList();
                        return Json(list2, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        if (value != null)
                        {
                            list1 = mSEntities.WH_Material.Where(p => p.Category1 == value).GroupBy(p => p.PartName).Select(g => g.FirstOrDefault()).ToList();
                        }
                        else
                        {
                            list1 = mSEntities.WH_Material.ToList();
                        }

                        return Json(list1, JsonRequestBehavior.AllowGet);
                    }
                }

            }

        }
        public ActionResult CheckWhMaterial() {
            using (WMSEntities wMS=new WMSEntities ()) {

                return Json(wMS.CheckWhMaterial().ToList(),JsonRequestBehavior.AllowGet);

            }
        }

        //查询出入库详情
        public ActionResult CheckIn(int page, int limit)
        {
            string sql = "exec InOutMaterial @type='sel'";
            return Json(Tools<InOutMaterial_Result>.SqlMap(sql, page, limit), JsonRequestBehavior.AllowGet);
        }
        //入库出库
        public int InMaterial(Dictionary<string, string> data)
        {
           int i= Tools<object>.SqlComm("exec InOutMaterial @type='in',", data);
           return i;
        }
        //查询货位限制
        public ActionResult CeckHCount() {
            using (WMSEntities wMS =new WMSEntities()) {

                return Json(wMS.CeckHCount().ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        //查询物料规格材质
        public ActionResult CheckPartSpec(string Name)
        {
            List<WH_Material> list;
            using (WMSEntities mSEntities = new WMSEntities())
            {
                list = mSEntities.WH_Material.Where(p => p.PartName == Name).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询物料材质
        public ActionResult CheckPartMaterial(string Name, string PartSpec)
        {
            List<WH_Material> list;
            using (WMSEntities mSEntities = new WMSEntities())
            {
                list = mSEntities.WH_Material.Where(p => p.PartName == Name && p.PartSpec == PartSpec).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //查询物料托盘数
        public ActionResult CheckQTYperPallet(string Name, string PartSpec, string PartMaterial)
        {
            List<WH_Material> list;
            using (WMSEntities mSEntities = new WMSEntities())
            {
                list = mSEntities.WH_Material.Where(p => p.PartName == Name && p.PartSpec == PartSpec && p.PartMaterial == PartMaterial).ToList();
            }
            return Json(list, JsonRequestBehavior.AllowGet);
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
        public ActionResult Login()
        {
            return View();
        }
        #endregion
    }
}