using Sharp7;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WMS.Models;

namespace WMS.ControlPlc
{
    public class Controls
    {
        //连接PLC
        public static S7Client Operation(string IP, int array)
        {
            var client = new S7Client();
            try
            {

                int connectionresult = client.ConnectTo(IP, 0, 1);
                if (connectionresult != 0)
                {
                    return client;
                }
                var buffer = new byte[array];
                client.DBRead(1, 0, buffer.Length, buffer);

                return client;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return client;
            }
        }
        //查询控制过程信息降序
        public List<Models.ControlPlc> CheckPlcVal()
        {
            using (WMSEntities wms = new WMSEntities())
            {
                var list = wms.ControlPlc.OrderByDescending(s => s.ID).ToList();
                return list;
            }
        }


        /// <summary>
        ///  控制过程
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="array">数组长度</param>
        /// <param name="qx">取料点X坐标</param>
        /// <param name="qy">取料点Y坐标</param>
        /// <param name="fx">放料点X坐标</param>
        /// <param name="fy">放料点Y坐标</param>
        /// <param name="loadHeight">载货台，库内板高度</param>
        /// <param name="note">备用</param>
        /// <param name="ControlArray">控制数组</param>
        /// <returns>True或False</returns>
        public static bool WholePileInOut(string IP, int qx, int qy, int fx, int fy, int loadHeight, int note, int ControlArray)
        {
            try
            {
                var client = Operation(IP, 30);
                
                if (client != null)
                {
                    var writeBuffer = new byte[30];
                    S7.SetDIntAt(writeBuffer, 0, qx);
                    S7.SetDIntAt(writeBuffer, 4, qy);
                    S7.SetDIntAt(writeBuffer, 8, fx);
                    S7.SetDIntAt(writeBuffer, 12, fy);
                    S7.SetDIntAt(writeBuffer, 16, loadHeight);
                    S7.SetDIntAt(writeBuffer, 20, note);
                    S7.SetDIntAt(writeBuffer, 24, ControlArray);
                 
                    int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                    if (writeResult == 0)
                    {
                      using(WMSEntities wms = new WMSEntities())
                      {
                            Models.ControlPlc cp = new Models.ControlPlc
                            {
                                TakeMaterialX = qx,
                                TakeMaterialY = qy,
                                PutMaterialX = fx,
                                PutMaterialY = fy,
                                LoadHeight = loadHeight,
                                note = note,
                                Array = ControlArray
                            };
                            wms.ControlPlc.Add(cp);
                            wms.SaveChanges();
                      }
                        return true;
                    }
                    else
                    {
                        Console.WriteLine("No");
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

    }
}
