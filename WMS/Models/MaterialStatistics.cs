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
    
    public partial class MaterialStatistics
    {
        public int id { get; set; }
        public string InType { get; set; }
        public string QTY { get; set; }
        public Nullable<System.DateTime> CreationTime { get; set; }
        public Nullable<int> FromID { get; set; }
        public Nullable<int> ToID { get; set; }
    }
}
