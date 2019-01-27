
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
        static StringBuilder builder ;
        static SqlParameter[] parameter ;
        public static void Sql(string Name,Dictionary<string, string> data)
        {
            builder = new StringBuilder(Name);
            int i = 0;
            foreach (var da in data)
            {
                parameter[i] = new SqlParameter("@" + da.Key, da.Value);
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
        }
        public static void SqlComm(string Name, Dictionary<string, string> data)
        {
            Sql(Name,data);
            using (WMSEntities wms = new WMSEntities())
            {
                wms.Database.ExecuteSqlCommand(builder.ToString(), parameter);
            }
        }
        public static Dictionary<string,object> SqlMap(string Name, Dictionary<string, string> data)
        {
            Sql(Name, data);
            using (WMSEntities wms = new WMSEntities())
            {
                var list= wms.Database.SqlQuery<T>(builder.ToString(), parameter).ToList();
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
                List<T> list = wms.Database.SqlQuery<T>(builder.ToString(), parameter).ToList();
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
                List<T> list = wms.Database.SqlQuery<T>(Name, parameter).ToList();
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
                return wms.Database.SqlQuery<T>(builder.ToString(), parameter).ToList();
            }
        }
    }
}