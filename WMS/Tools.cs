
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using WMS.Models;
namespace WMS
{
    public class Tools<T>
    {
        private static StringBuilder Builder;
        private static SqlParameter[] Parameter ;
        public static void Sql(string Name,Dictionary<string, string> data)
        {
            Builder = new StringBuilder(Name);
            Parameter = new SqlParameter[data.Count()];
            int i = 0;
            foreach (var da in data)
            {
                Parameter[i] = new SqlParameter("@" + da.Key, da.Value);
                if (i + 1 == data.Count())
                {
                    Builder.Append("@" + da.Key + "=@" + da.Key);
                }
                else
                {
                    Builder.Append("@" + da.Key + "=@" + da.Key + ",");
                }
                i++;
            }
        }
        public static int SqlComm(string Name, Dictionary<string, string> data)
        {
            Sql(Name,data);
            using (WMSEntities wms = new WMSEntities())
            {
               return wms.Database.ExecuteSqlCommand(Builder.ToString(), Parameter);
            }
        }
        public static Dictionary<string,object> SqlMap(string Name,Dictionary<string, string> data)
        {
            Sql(Name, data);
            using (WMSEntities wms = new WMSEntities())
            {
                var list= wms.Database.SqlQuery<T>(Builder.ToString(), Parameter).ToList();
                Dictionary<string, object> map = new Dictionary<string, object>
                    {
                        { "code", 0 },
                        { "msg", "" },
                        { "count", list.Count() },
                        { "data", list }
                    };
                return map;
            }
        }
        public static Dictionary<string, object> SqlMap(string Name,Dictionary<string, string> data,int page,int limit)
        {
            Sql(Name, data);
            using (WMSEntities wms = new WMSEntities())
            {
                List<T> list = wms.Database.SqlQuery<T>(Builder.ToString(), Parameter).ToList();
                PageList<T> pageList = new PageList<T>(list, page, limit);
                Dictionary<string, object> map = new Dictionary<string, object>
                    {
                        { "code", 0 },
                        { "msg", "" },
                        { "count", list.Count() },
                        { "data", pageList }
                    };
                return map;
            }
        }
        public static Dictionary<string, object> SqlMap(string Name,int page,int limit)
        {
            using (WMSEntities wms = new WMSEntities())
            {
                List<T> list = wms.Database.SqlQuery<T>(Name).ToList();
                PageList<T> pageList = new PageList<T>(list, page, limit);
                Dictionary<string, object> map = new Dictionary<string, object>
                    {
                        { "code", 0 },
                        { "msg", "" },
                        { "count", list.Count() },
                        { "data", pageList }
                    };
                return map;
            }
        }
        public static List<T> SqlList(string Name, Dictionary<string, string> data)
        {
            Sql(Name, data);
            using (WMSEntities wms = new WMSEntities())
            {
                return wms.Database.SqlQuery<T>(Builder.ToString(), Parameter).ToList();
            }
        }
    }
}