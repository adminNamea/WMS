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
       

        /// <summary>
        ///  整垛进出
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="sn">调度使能</param>
        /// <param name="ms">调度模式</param>
        /// <param name="array">数组长度</param>
        /// <param name="qx">取料点X坐标</param>
        /// <param name="qy">取料点Y坐标</param>
        /// <param name="qz">取料点Z坐标</param>
        /// <param name="fx">放料点X坐标</param>
        /// <param name="fy">放料点Y坐标</param>
        /// <param name="qz">放料点Z坐标</param>
        /// <param name="loadHeight">载货台，库内板高度</param>
        /// <param name="note">备用</param>
        /// <param name="ControlArray">控制数组</param>
        /// <returns>True或False</returns>
        public static bool WholePileInOut(string IP, int qx, int qy, int qz, int fx, int fy,int fz, byte ms, bool sn)
        {
          
                var client = Operation(IP, 25);
                
                if (client != null)
                {
                    var writeBuffer = new byte[26];                                  
                    S7.SetDIntAt(writeBuffer, 0, qx);
                    S7.SetDIntAt(writeBuffer, 4, qy);
                    S7.SetDIntAt(writeBuffer, 8, qz);
                    S7.SetDIntAt(writeBuffer, 12, fx);
                    S7.SetDIntAt(writeBuffer, 16, fy);
                    S7.SetDIntAt(writeBuffer, 20, fz);
                    S7.SetByteAt(writeBuffer,24,ms);
                    S7.SetBitAt(ref writeBuffer, 25, 1, sn);
                    int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                    if (writeResult == 0)
                    {
                        //using(WMSEntities wms = new WMSEntities())
                        //{
                        //      Models.ControlPlc cp = new Models.ControlPlc
                        //      {

                        //          TakeMaterialX = qx,
                        //          TakeMaterialY = qy,
                        //          PutMaterialX = fx,
                        //          PutMaterialY = fy,

                        //      };
                        //      wms.ControlPlc.Add(cp);
                        //      wms.SaveChanges();
                        //}
                        client.Disconnect();
                        return true;
                      
                    }
                   
                }
            return false;
        }
        /// <summary>
        ///  单张量取
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="qx">取料点X坐标</param>
        /// <param name="qy">取料点Y坐标</param>
        /// <param name="qy1">取料点Y1坐标</param>
        /// <param name="qz1">取料点Z1坐标</param>
        /// <param name="qzs">取张数</param>
        /// <param name="bh">板厚</param>
        /// <param name="sn">调度使能</param>
        /// <param name="ms">调度模式</param>
        public static bool SheetMeasuring(string IP, int qx, int qy, int qy1, int qz1, int qzs, int bh, bool sn, byte ms)
        {
                var client = Operation(IP, 0);          
                var writeBuffer = new byte[0];
                //S7.SetDIntAt(writeBuffer, 0, qx);
                //S7.SetDIntAt(writeBuffer, 4, qy);
                //S7.SetDIntAt(writeBuffer, 8, qz);
                //S7.SetDIntAt(writeBuffer, 12, fx);
                //S7.SetDIntAt(writeBuffer, 16, fy);
                //S7.SetDIntAt(writeBuffer, 20, fz);
                //S7.SetByteAt(writeBuffer, 24, ms);
                // S7.SetBitAt(ref writeBuffer, 25, 1, sn);
                int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                if (writeResult == 0)
                {
                    client.Disconnect();
                    return true;
                }               
            
            return false;
        }

        /// <summary>
        ///  载货出料
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="cx">存料X坐标</param>
        /// <param name="cy">存料Y坐标</param>
        /// <param name="cz">存料Z坐标</param>   
        /// <param name="sn">调度使能</param>
        /// <param name="ms">调度模式</param>
        public static bool CargoDischarge(string IP,int cx,int cy,int cz, bool sn, byte ms)
        {
            var client = Operation(IP, 0);
            var writeBuffer = new byte[0];
            //S7.SetDIntAt(writeBuffer, 0, qx);
            //S7.SetDIntAt(writeBuffer, 4, qy);
            //S7.SetDIntAt(writeBuffer, 8, qz);
            //S7.SetDIntAt(writeBuffer, 12, fx);
            //S7.SetDIntAt(writeBuffer, 16, fy);
            //S7.SetDIntAt(writeBuffer, 20, fz);
            //S7.SetByteAt(writeBuffer, 24, ms);
            // S7.SetBitAt(ref writeBuffer, 25, 1, sn);
            int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
            if (writeResult == 0)
            {
                client.Disconnect();
                return true;
            }
            return false;
        }

        /// <summary>
        ///  载货取料
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="qx">取料X坐标</param>
        /// <param name="qy">取料Y坐标</param>
        /// <param name="qz">取料Z坐标</param>   
        /// <param name="sn">调度使能</param>
        /// <param name="ms">调度模式</param>
        public static bool LoadingMaterial(string IP,int qx,int qy,int qz,bool sn,byte ms)
        {
            var client = Operation(IP, 0);
            var writeBuffer = new byte[0];
            //S7.SetDIntAt(writeBuffer, 0, qx);
            //S7.SetDIntAt(writeBuffer, 4, qy);
            //S7.SetDIntAt(writeBuffer, 8, qz);
            //S7.SetDIntAt(writeBuffer, 12, fx);
            //S7.SetDIntAt(writeBuffer, 16, fy);
            //S7.SetDIntAt(writeBuffer, 20, fz);
            //S7.SetByteAt(writeBuffer, 24, ms);
            // S7.SetBitAt(ref writeBuffer, 25, 1, sn);
            int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
            if (writeResult == 0)
            {
                client.Disconnect();
                return true;
            }
            return false;
        }

        /// <summary>
        ///  库内量存
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="qx">存料X坐标</param>
        /// <param name="qy">存料Y坐标</param>
        /// <param name="qy1">存料Y1坐标</param>   
        /// <param name="qz1">存料Z1坐标</param> 
        /// <param name="czs">存张数</param> 
        /// <param name="bh">板厚</param> 
        /// <param name="sn">调度使能</param>
        /// <param name="ms">调度模式</param>
        public static bool StorageInStorage(string IP,int qx,int qy,int qy1,int qz1,int czs,int bh, bool sn, byte ms)
        {
            var client = Operation(IP, 0);
            var writeBuffer = new byte[0];
            //S7.SetDIntAt(writeBuffer, 0, qx);
            //S7.SetDIntAt(writeBuffer, 4, qy);
            //S7.SetDIntAt(writeBuffer, 8, qz);
            //S7.SetDIntAt(writeBuffer, 12, fx);
            //S7.SetDIntAt(writeBuffer, 16, fy);
            //S7.SetDIntAt(writeBuffer, 20, fz);
            //S7.SetByteAt(writeBuffer, 24, ms);
            // S7.SetBitAt(ref writeBuffer, 25, 1, sn);
            int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
            if (writeResult == 0)
            {
                client.Disconnect();
                return true;
            }
            return false;
        }

        public static bool WholePileInStop(string IP, int qx, int qy, int qz, int fx, int fy, int fz, byte ms, bool sn)
        {
            var client = Operation(IP, 26);
            if (client != null)
            {
                var writeBuffer = new byte[26];
                S7.SetDIntAt(writeBuffer, 0, qx);
                S7.SetDIntAt(writeBuffer, 4, qy);
                S7.SetDIntAt(writeBuffer, 8, qz);
                S7.SetDIntAt(writeBuffer, 12, fx);
                S7.SetDIntAt(writeBuffer, 16, fy);
                S7.SetDIntAt(writeBuffer, 20, fz);
                S7.SetByteAt(writeBuffer, 24, ms);
                S7.SetBitAt(ref writeBuffer, 25, 1, sn);
                int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);                
            }
            return false;
        }

        ///<summary>
        /// 读取全部
        /// </summary>
        /// <param name="IP">地址</param>
        
        public static Dictionary<string,int> CheckPLCDate(string IP)
        {
            Dictionary<string, int> ds=new Dictionary<string, int>();
            var client = Operation(IP, 26);
            var writeBuffer = new byte[26];
            int cqx=S7.GetDIntAt(writeBuffer, 0);
            int cqy = S7.GetDIntAt(writeBuffer, 4);
            int cqz = S7.GetDIntAt(writeBuffer, 8);
            int cfx = S7.GetDIntAt(writeBuffer, 12);
            int cfy = S7.GetDIntAt(writeBuffer, 16);
            int cfz = S7.GetDIntAt(writeBuffer, 20);
            ds.Add("int", cqx);
            ds.Add("int", cqy);
            ds.Add("int", cqz);
            ds.Add("int", cfx);
            ds.Add("int", cfy);
            ds.Add("int", cqz);
            return ds;
        }

        ///<summary>
        /// 上位机调度
        /// </summary>
        /// <param name="fs">上位机调度完成</param>
        /// <param name="jx">警告信息</param>
        public static bool CheckTopFinish(string IP)
        {
            bool fs;
            try
            {
                var client = Operation(IP, 40);

             
                if (client != null)
                {
                    byte[] db1Buffer = new byte[40];
                    fs = S7.GetBitAt(db1Buffer, 25,0);
                }
                    return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
