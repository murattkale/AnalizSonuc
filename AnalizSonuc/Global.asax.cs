using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace AnalizSonuc
{
    public class Global : System.Web.HttpApplication
    {

        public static Dictionary<string, string> userList = new Dictionary<string, string>();
        protected void Application_Start(object sender, EventArgs e)
        {
            userList.Add("admin", "123_*1");
            userList.Add("oguz", "40384507900");
        }
    }
}