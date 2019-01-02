using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
        #endregion
        #region 功能位置信息注册
        public ActionResult Functional()
        {
            return View();
        }
        #endregion
    }
}