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
    
    public partial class PickUpOne
    {
        public int ID { get; set; }
        public Nullable<int> 板子厚度 { get; set; }
        public Nullable<int> 货位底部高度 { get; set; }
        public Nullable<int> 货位板子数量 { get; set; }
        public Nullable<int> 载货台高度 { get; set; }
        public Nullable<int> 载货台板子数量 { get; set; }
        public Nullable<int> 载货台与货位最大高度差 { get; set; }
        public Nullable<int> 载货台与货位最小高度差 { get; set; }
        public Nullable<int> 是否还能取 { get; set; }
    }
}