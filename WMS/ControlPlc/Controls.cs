using Sharp7;
using System;
using WMS.Controllers;

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
                    return null;
                }
                var buffer = new byte[array];
                client.DBRead(1, 0, buffer.Length, buffer);

                return client;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        /// <summary>
        ///  写进出
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="sn">调度使能</param>
        /// <param name="hydqd">回原点启动</param>
        /// <param name="swjjt">上位机急停</param>
        /// <param name="swjtz">上位机停止</param>
        /// <param name="swgzfw">上位故障复位</param>
        /// <param name="ms">调度模式</param>
        /// <param name="qx">取料点X坐标</param>
        /// <param name="qy">取料点Y坐标</param>
        /// <param name="qz">取料点Z坐标</param>
        /// <param name="cx">存货点X坐标</param>
        /// <param name="cy">存货点Y坐标</param>
        /// <param name="cz">存货点Z坐标</param>
        /// <param name="cqbs">存取板数</param>
        /// <param name="xpjzb">吸盘架坐标</param>
        /// <param name="sxzb">升叉坐标</param>     
        /// <param name="ccbh">存取板厚</param>  
        public static void WholePileInOut(string IP,byte ms,
            int qx,int qy,int qz,int cx,int cy,int cz)
        {
               var client = Operation(IP, 24);
                if (client != null)
                {
                try {
                    var writeBuffer = new byte[24];
                    S7.SetByteAt(writeBuffer, 1, ms);
                    S7.SetDIntAt(writeBuffer, 2, qx);
                    S7.SetDIntAt(writeBuffer, 6, qy);
                    S7.SetDIntAt(writeBuffer, 10, qz);
                    S7.SetDIntAt(writeBuffer, 14, cx);
                    S7.SetDIntAt(writeBuffer, 18, cy);
                    S7.SetDIntAt(writeBuffer, 22, cz);
                    int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                    if (writeResult == 0)
                    {
                        client.Disconnect();
                    }
                } catch{
                }
                }
        }

        ///<summary>
        /// 读取行驶状态
        /// </summary>
        /// <param name="IP">地址</param>
        /// <param name="ldms">联动模式</param>
        /// <param name="sdms">手动模式</param>
        /// <param name="ddjzc">堆垛机正常</param>
        /// <param name="gzbj">故障报警</param>
        /// <param name="jtz">急停中</param>
        /// <param name="xzyxz">行走运行中</param>
        /// <param name="tsyxz">提升运行中</param>
        /// <param name="xpyxz">吸盘运行中</param>
        /// <param name="xxyxz">下叉运行中</param>
        /// <param name="sxyxz">上叉运行中</param>
        /// <param name="zdjcz">整垛进出中（1）</param>
        /// <param name="dzlqz">单张量取中（1）</param>
        /// <param name="zhclz">载货出料中（1）</param>
        /// <param name="zhqlz">载货取料中（1）</param>
        /// <param name="kndbz">库内叠板中（1）</param>
        /// <param name="ddrwwc">调度任务完成（1）</param>
        /// <param name="ldqd">联动启动</param>
        /// <param name="rkyxc">入库允许存</param>
        /// <param name="rkyxq">入库允许取</param>
        /// <param name="yxtd">允许调度</param>
        /// <param name="zdjcyxtd">整垛进出允许调度</param>
        /// <param name="dzlqyxtd">单张量取允许调度</param>
        /// <param name="zhclyxtd">载货出料允许调度</param>
        /// <param name="zhqlyxtd">载货取料允许调度</param>
        /// <param name="kndbyxtd">库内叠板允许调度</param>
        /// <param name="hydyx">回原点允许</param>
        /// <param name="zdyxz">自动运行中</param>
        /// <param name="rgvzdclz">RGV自动出料中</param>
        /// <param name="rgvzdclqd">RGV自动出料启动</param>
        /// <param name="rgvzdclwc">RGV自动出料完成</param>

        public static int CheckPLCDate(string IP= "192.168.3.30") 
        {
                try
                {
                var client = new S7Client();
                int connectionresult = client.ConnectTo(IP, 0, 1);
                if (connectionresult == 0)
                {
                    var buffer = new byte[46];
                    int readResult = client.DBRead(1, 0, buffer.Length, buffer);
                    Boolean ldms = S7.GetBitAt(buffer, 38, 0);
                    Boolean sdms = S7.GetBitAt(buffer, 38, 1);
                    Boolean ddjzc = S7.GetBitAt(buffer, 38, 2);
                    Boolean gzbj = S7.GetBitAt(buffer, 38, 3);
                    Boolean jtz = S7.GetBitAt(buffer, 38, 4);
                    Boolean xzyxz = S7.GetBitAt(buffer, 38, 5);
                    Boolean tsyxz = S7.GetBitAt(buffer, 38, 6);
                    Boolean xpyxz = S7.GetBitAt(buffer, 38, 7);
                    Boolean xxyxz = S7.GetBitAt(buffer, 39, 0);
                    Boolean sxyxz = S7.GetBitAt(buffer, 39, 1);
                    Boolean zdjcz = S7.GetBitAt(buffer, 39, 2);
                    Boolean dzlqz = S7.GetBitAt(buffer, 39, 3);
                    Boolean zhclz = S7.GetBitAt(buffer, 39, 4);
                    Boolean zhqlz = S7.GetBitAt(buffer, 39, 5);
                    Boolean kndbz = S7.GetBitAt(buffer, 39, 6);
                    Boolean ddrwwc = S7.GetBitAt(buffer, 39, 7);
                    Boolean ldqd = S7.GetBitAt(buffer, 44, 0);
                    Boolean rkyxc = S7.GetBitAt(buffer, 44, 1);
                    Boolean rkyxq = S7.GetBitAt(buffer, 44, 2);
                    Boolean yxtd = S7.GetBitAt(buffer, 44, 3);
                    Boolean zdjcyxtd = S7.GetBitAt(buffer, 44, 4);
                    Boolean dzlqyxtd = S7.GetBitAt(buffer, 44, 5);
                    Boolean zhclyxtd = S7.GetBitAt(buffer, 44, 6);
                    Boolean zhqlyxtd = S7.GetBitAt(buffer, 44, 7);
                    Boolean kndbyxtd = S7.GetBitAt(buffer, 45, 0);
                    Boolean hydyx = S7.GetBitAt(buffer, 45, 1);
                    Boolean zdyxz = S7.GetBitAt(buffer, 45, 2);
                    Boolean rgvzdclz = S7.GetBitAt(buffer, 45, 3);
                    Boolean rgvzdclwc = S7.GetBitAt(buffer, 45, 5);
                    client.Disconnect();
                    if (!ldms)
                    {
                        WS.SendJson("非联动模式");
                        return 0;
                    } else if (!ddjzc) {
                        WS.SendJson("堆垛机存在问题");
                        return 0;
                    }
                    else {
                        if (WCSController.taskStatus1) {
                            WCSController.RunTask(yxtd, ddrwwc, zdjcyxtd);
                        }
                        return 1;
                    }
                }
                else {
                    WS.SendJson("机器连接失败");
                    return 0;
                }
                }
                catch
                {
                WS.SendJson("机器连接失败");
                return 0;
                }           
        }

        //使能
        public static void PlcStrat(string IP) {
            var client = Operation(IP, 1);
            if (client != null)
            {
               
                    var writeBuffer = new byte[1];
                    S7.SetBitAt(ref writeBuffer, 0, 0, true);
                    int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                    if (writeResult == 0)
                    {
                        client.Disconnect();
                    }
            }
        }
        //启动RGV
        public static string StratRGV(string IP)
        {
            var client = Operation(IP, 46);
            if (client != null)
            {
                try
                {
                    var writeBuffer = new byte[46];
                    S7.SetBitAt(ref writeBuffer, 45, 4,true);
                    int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                    if (writeResult == 0)
                    {
                        client.Disconnect();
                        return "true";
                    }
                }
                catch
                {
                    return "机器连接失败,请联系技术人员";
                }
            }
            return "机器连接失败,请联系技术人员";
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
        public static void PlcOperation(string ip,string type) {
            var client = Operation(ip,4);
            if (client != null)
            {
                try
                {
                    var writeBuffer = new byte[4];
                    switch (type) {
                        case "a":
                            S7.SetBitAt(ref writeBuffer, 1, 1, true);
                            break;
                        case "b":
                            S7.SetBitAt(ref writeBuffer, 2, 1, true);
                            break;
                        case "c":
                            S7.SetBitAt(ref writeBuffer, 3, 1, true);
                            break;
                    };
                    int writeResult = client.DBWrite(1, 0, writeBuffer.Length, writeBuffer);
                    if (writeResult == 0)
                    {
                        client.Disconnect();
                        WS.SendJson("true");
                    }
                }
                catch
                {
                    WS.SendJson("机器连接失败,请联系技术人员");
                }
            }
            WS.SendJson("机器连接失败,请联系技术人员");
        }
    }
}
