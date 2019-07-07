using Newtonsoft.Json;
using SuperSocket.SocketBase;
using SuperSocket.WebSocket;
using System;
using System.Collections.Generic;
using System.Reflection;
using WMS.Controllers;
using WMS.ControlPlc;

namespace WMS
{
    public class WS
    {
        private static Datas Datas = null;
        private static readonly List<WebSocketSession> list = new List<WebSocketSession>();
        public static void WsStart()
        {
            WebSocketServer ws = new WebSocketServer();
            ws.NewMessageReceived += Ws_NewMessageReceived;//当有信息传入时
            ws.NewSessionConnected += Ws_NewSessionConnected;//当有用户连入时
            ws.SessionClosed += Ws_SessionClosed;//当有用户退出时
            ws.NewDataReceived += Ws_NewDataReceived;//接受到二进制数据时
            ws.Setup(8080);
            ws.Start();
        }
        private static void Ws_NewDataReceived(WebSocketSession session, byte[] value)
        {
            session.Send(JsonConvert.SerializeObject(value, Formatting.Indented));
        }
        private static void Ws_SessionClosed(WebSocketSession session, CloseReason value)
        {
            list.Clear();
        }
        private static void Ws_NewSessionConnected(WebSocketSession session)
        {
             list.Add(session);
            
        }
        private static void Ws_NewMessageReceived(WebSocketSession session, string value)
        {
            if (value == "init")
            {
                //tmr.Start();
                WCSController.CheckAll();
            }
            else
            {
                DynamicMethod(value);
            }
        }
        public static void SendJsons(object value)
        {
            list[1].Send(JsonConvert.SerializeObject(value, Formatting.Indented));
        }
        public static void SendJson(object value)
        {
            list[0].Send(JsonConvert.SerializeObject(value, Formatting.Indented));
        }
        private static void DynamicMethod(string value)
        {
            Datas = new Datas();
            JsonConvert.PopulateObject(value, Datas);
            Type t = typeof(Controls);
            switch (Datas.Class)
            {
                case "WCS":
                    t = typeof(WCSController);
                    break;
            }
            t.InvokeMember(Datas.Method, BindingFlags.InvokeMethod, null, t, Datas.Obj());
        }
    }
}