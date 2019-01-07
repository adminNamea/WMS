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
            using (WMSEntities ms =new WMSEntities ()) {
                SqlParameter[] parameters = new SqlParameter[User.Count()];
               
                StringBuilder builder = new StringBuilder("exec AddUser @type='"+type+"',");
                int i = 0;
                foreach (var user in User) {
                    parameters[i] = new SqlParameter("@"+user.Key,user.Value);
                    if ((i + 1) == User.Count())
                    {
                        builder.Append("@" + user.Key + "=@" + user.Key);
                    }
                    else {
                        builder.Append("@" + user.Key + "=@" + user.Key+",");
                    }
                    i++;
                }
                ms.Database.ExecuteSqlCommand(builder.ToString(),parameters);
            }
                return "true";
        }
        //登陆
        public string Login(string Name, string Pwd, bool WCS) {
            List<Employee> employees;
            using (WMSEntities mSEntities=new WMSEntities()) {
                employees = mSEntities.Employee.Where(p =>p.PWD == Pwd).Where(p => p.UserName == Name || p.Tel == Name).ToList();
                if (employees.Count() > 0)
                {
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
        public ActionResult checkUser(string value,string id) {
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
        //基本资料
        public ActionResult UserData() {
            return View();
        }
    }
}