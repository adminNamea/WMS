//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace WMS.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class WH_GoodsAllocation
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public double x_intercept { get; set; }
        public double y_intercept { get; set; }
        public double z_intercept { get; set; }
        public Nullable<double> Size { get; set; }
        public string Description { get; set; }
        public Nullable<int> TempPlate { get; set; }
        public Nullable<int> StorageLocationID { get; set; }
        public Nullable<int> WHAreaID { get; set; }
        public Nullable<int> WHID { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public string UpdatedBy { get; set; }
        public string StatusID { get; set; }
        public Nullable<int> height { get; set; }
        public Nullable<bool> IsTempPlate { get; set; }
        public Nullable<bool> IsTransit { get; set; }
    }
}
