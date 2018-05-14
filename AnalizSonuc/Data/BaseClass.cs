using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net;
using System.Web;



public class ConfigurableWebClient : WebClient
{
    public int? Timeout { get; set; }

    public int? ConnectionLimit { get; set; }

    protected override WebRequest GetWebRequest(Uri address)
    {

        var baseRequest = base.GetWebRequest(address);

        var webRequest = baseRequest as HttpWebRequest;

        if (webRequest == null)

            return baseRequest;

        if (Timeout.HasValue)

            webRequest.Timeout = Timeout.Value;

        if (ConnectionLimit.HasValue)

            webRequest.ServicePoint.ConnectionLimit = ConnectionLimit.Value;

        return webRequest;

    }
}

public class KeyValueClass
{
    public string Key { get; set; }
    public string Value { get; set; }

}
public class ClassProp
{
    public string ev { get; set; }
    public string ds { get; set; }
    public string msev { get; set; }
    public string msds { get; set; }
    public string iyev { get; set; }
    public string iyds { get; set; }
    public string iy { get; set; }
    public string ms { get; set; }
    public string ust15iy { get; set; }
    public string alt15iy { get; set; }
    public string ust15 { get; set; }
    public string alt15 { get; set; }
    public string ust25 { get; set; }
    public string alt25 { get; set; }
    public string ust35 { get; set; }
    public string alt35 { get; set; }
    public string h { get; set; }
    public string tg { get; set; }
    public string kg { get; set; }
    public string cs { get; set; }
    public string csiy { get; set; }
    public string yr2 { get; set; }
}

public class gameListClass
{
    public List<gameListrow> gameList { get; set; }
}

public class gameListrow
{

    public string MCODE { get; set; }
}

public class oranlarClass
{
    public string MacKodu { get; set; }
    public string ev { get; set; }
    public string X { get; set; }
    public string ds { get; set; }
    public string evRekabet { get; set; }
    public string dsRekabet { get; set; }
    public string evGalip { get; set; }
    public string dsGalip { get; set; }
    public string h1 { get; set; }
    public string hX { get; set; }
    public string h2 { get; set; }
    public string KgVar { get; set; }
    public string KgYok { get; set; }
    public string iy1 { get; set; }
    public string iy2 { get; set; }
    public string yr2_1 { get; set; }
    public string yr2_2 { get; set; }
    public string yr2_X { get; set; }

    public string alt15iy { get; set; }
    public string ust15iy { get; set; }
    public string alt25 { get; set; }
    public string ust25 { get; set; }
    public string alt35 { get; set; }
    public string ust35 { get; set; }
    public string tg { get; set; }
    public string csiy { get; set; }
    public string cs { get; set; }

}

public enum SkorDurum
{
    [Description("$")]
    galip = 1,
    [Description("£")]
    berabere = -1,
    [Description("@")]
    maglup = 0,
    [Description("!")]
    yuksekoran = 2,
}


public class BaseClass
{
    public static string Title = "Sonuçlar ve Analizler";

}

