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
    
    public partial class WH_MaterialList
    {
        public int ID { get; set; }
        public Nullable<int> MaterialID { get; set; }
        public Nullable<int> ApplierID { get; set; }
        public string DateCode { get; set; }
        public string LotCode { get; set; }
        public Nullable<double> InQTY { get; set; }
        public Nullable<System.DateTime> IQCTime { get; set; }
        public string IQCBy { get; set; }
        public Nullable<int> IQC_DefectID { get; set; }
        public Nullable<int> IQC_RejectQTY { get; set; }
        public Nullable<int> IQC_ReceivedQTY { get; set; }
        public Nullable<double> OutQTY { get; set; }
        public Nullable<double> StockQTY { get; set; }
        public string Units { get; set; }
        public Nullable<int> GoodsAllocationID { get; set; }
        public Nullable<int> FromID { get; set; }
        public string ToID { get; set; }
        public string Status { get; set; }
        public string CreatedTime { get; set; }
        public string PlaceID { get; set; }
    }
}
