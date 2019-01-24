
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using WMS.Models;
namespace WMS
{
    public class Builder
    {
        public static object SqlAll(StringBuilder builder,Dictionary<string,string> data,string type) {
         
            using (WMSEntities mSEntities=new WMSEntities ()) {
                SqlParameter[] parameter = new SqlParameter[data.Count()];
                int i = 0;
                foreach (var da in data)
                {
                    parameter[i] = new SqlParameter("@"+da.Key,da.Value);
                    if (i + 1 == data.Count())
                    {
                        builder.Append("@" + da.Key + "@=" + da.Key);
                    }
                    else
                    {
                        builder.Append("@" + da.Key + "@=" + da.Key + ",");
                    }
                    i++;
                }
                if (type != "select") {
                    return mSEntities.Database.ExecuteSqlCommand(builder.ToString(), parameter);
                } else {
                    return mSEntities.Database.SqlQuery<object>(builder.ToString(),parameter).ToList();
                }
               
            }
           
        }
    }
}