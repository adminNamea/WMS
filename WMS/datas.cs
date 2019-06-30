
using System.Collections.Generic;

namespace WMS
{
    public class Datas
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
        public string IP { get; set; }
        public string Method { get; set; }
        public string Class { get; set; }
        public Dictionary<string,string> Data { get; set; }
        public object[] Obj() {
            List<object> list = new List<object>();
            if (Name != null) {
                list.Add(Name);
            }
            if (Type != null)
            {
                list.Add(Type);
            }
            if (IP != null)
            {
                list.Add(IP);
            }
            if (Value != null)
            {
                list.Add(Value);
            }
            if (Data != null) {
                list.Add(Data);
            }
            return list.ToArray();
        }
    }
}