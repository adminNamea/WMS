
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using WMS.Models;
namespace WMS
{
    public class Tools
    {
        public static StringBuilder builder;
        public static SqlParameter[] parameter;
        public static void SqlAll(Dictionary<string,string> data,string o) {
            int i = 0;
                foreach (var da in data)
                {
                    parameter[i] = new SqlParameter("@"+da.Key,da.Value);
                    if (i+1 == data.Count())
                    {
                        builder.Append("@" + da.Key + "=@" + da.Key);
                    }
                    else
                    {
                        builder.Append("@" + da.Key + "=@" + da.Key + ",");
                    }
                i++;
                }
            if (o != null) {
                using (WMSEntities wms=new WMSEntities()) {
                    wms.Database.ExecuteSqlCommand(builder.ToString(),parameter);
                }

            }
        }
    }
}