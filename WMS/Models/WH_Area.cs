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
    
    public partial class WH_Area
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Nullable<int> WHID { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<int> StatusID { get; set; }
    }
}
