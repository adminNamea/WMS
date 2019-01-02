using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
        #endregion
        #region 物料信息
        public ActionResult Material()
        {
            return View();
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