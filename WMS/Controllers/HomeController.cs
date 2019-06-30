
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WMS.Models;

namespace WMS.Controllers
{
    public class HomeController : Controller
    {

       
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Registered() {
            return View();
        }
        //注册-更新
        public string AddUser(Dictionary<string,string> User,string type) {
            string sql = "exec AddUser @type = '"+type+"',";
            int i= Tools<object>.SqlComm(sql,User);
            if (i > 0)
            {
                return "true";
            }
            else {
                return "false";
            }           
        }
        //登陆
        public string Login(string Name, string Pwd, bool WCS) {
            List<Employee> employees;
            using (WMSEntities mSEntities=new WMSEntities()) {
                employees = mSEntities.Employee.Where(p =>p.PWD == Pwd).Where(p => p.UserName == Name || p.Tel == Name).ToList();
                if (employees.Count() > 0){
                    Session["user"] = employees[0].UserName;
                    Session["WCS"] = WCS;
                    return "true";
                }
                else {
                    return "false";
                }
            }         
        }
        //注销
        public string OutUser() {
            Session.RemoveAll();
            return "true";
        }
        //查询用户
        public ActionResult CheckUser(string value,string id) {
            List<Employee> employees;
            int ids = 0;
            if (id != null) {
                 ids = int.Parse(id);
            }
            using (WMSEntities wm=new WMSEntities()) {
                if (id != null && id != "")
                {
                    employees = wm.Employee.Where(p => p.ID == ids).ToList();
                }
                else { 
                    employees = wm.Employee.Where(p => p.UserName == value||p.Tel==value).ToList();
                }
            }
            return Json(employees,JsonRequestBehavior.AllowGet);
        }
        //系统设置
        public ActionResult SystemSe()
        {
            return View();
        }
        public string SystemSet(Dictionary<string,string> data) {
           int i= Tools<object>.SqlComm("exec SystemSe ", data);
            if (i > 0)
            {
                return "true";
            }
            else {
                return "false";
            }
        }
        //查询立体仓基本信息
        public ActionResult CheckSystem() {
            SystemSet list;
            using (WMSEntities wMS=new WMSEntities()) {
                list = wMS.SystemSet.FirstOrDefault();
            }
                return Json(list,JsonRequestBehavior.AllowGet);
        }
        //基本资料
        //观察页i
        public ActionResult Observation() {

            return View();
        }
        public ActionResult UserData() {
            return View();
        }
    }
}