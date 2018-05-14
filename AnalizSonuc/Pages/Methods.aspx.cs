using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AnalizSonuc
{
    public partial class Methods : System.Web.UI.Page
    {
        public static List<oranlarClass> list = new List<oranlarClass>();
        public static List<gameListrow> Code = new List<gameListrow>();
        public static List<gameListrow> CodeTemp = new List<gameListrow>();
        public static Dictionary<string, string> macistatistikTemp = new Dictionary<string, string>();
        public static Dictionary<string, string> rekabetTemp = new Dictionary<string, string>();

        public static string code = ""; 
        public static int codeii = 0;
        public static int ii = 0;
        public static string url = "http://istatistik.nesine.com/HeadToHead/Index.aspx?matchCode={0}";
        public static string url1 = "http://istatistik.nesine.com/headtohead/router.aspx?matchcode={0}&page={1}&languageıd=1";
        public static string codeUrl = "https://www.bilyoner.com/gamelist/games?sports=1";
        public static double oranFiltre1 = 0;
        public static double oranFiltre2 = 0;
        public static string str = "";
        public static int MacKoduMin = 0;
        public static int MacKoduMax = 0;
        public static string strZaman = "";
        public static string ok = "";

        [WebMethod]
        public static dynamic getSonuclar(double txtoranFiltre1, double txtoranFiltre2, string txtmacSayisi, string txtMacKoduMin, string txtMacKoduMax)
        {
            var user = HttpContext.Current.Session["user"];
            if (user == null)
                return null;

            #region clear variable
            list = new List<oranlarClass>();
            Code = new List<gameListrow>();
            code = "";
            codeii = 0;
            ii = 0;
            url = "http://istatistik.nesine.com/HeadToHead/Index.aspx?matchCode={0}";
            url1 = "http://istatistik.nesine.com/headtohead/router.aspx?matchcode={0}&page={1}&languageıd=1";
            codeUrl = "https://www.bilyoner.com/gamelist/games?sports=1";
            oranFiltre1 = 0;
            oranFiltre2 = 0;
            MacKoduMin = txtMacKoduMin.ToInt();
            MacKoduMax = txtMacKoduMax.ToInt();
            oranFiltre1 = txtoranFiltre1;
            oranFiltre2 = txtoranFiltre2;
            str = "";
            ok = "";
            strZaman = "";
            #endregion

            list = new List<oranlarClass>();
            var htmlParam = "";
            if (CodeTemp.Count != 0 && CodeTemp.Count != Code.Count)
            {
                Code = CodeTemp;
            }
            else
            {
                htmlParam = codeUrl.GetDocText(9000000);
                Code = htmlParam.Split(',')
                   .Where(o =>
                   o.Contains("MCODE"))
                   .Select(o =>
                   new gameListrow()
                   {
                       MCODE = o.Replace("/", "").Substring(8, 3)
                   })
                   // .OrderBy(o => o.MCODE.ToInt())
                   .ToList();
                CodeTemp = Code;
            }
            Code = Code.Where(o => (MacKoduMin > 0 ? o.MCODE.ToInt() >= MacKoduMin : true) && (MacKoduMax > 0 ? o.MCODE.ToInt() <= MacKoduMax : true)).ToList();
            if (!string.IsNullOrEmpty(txtmacSayisi))
                if (Code.Count >= txtmacSayisi.ToInt())
                    Code = Code.Take(txtmacSayisi.ToInt()).ToList();
            //Code = ((htmlParam.toJsondeCustom<gameListClass>(999999999) as gameListClass).gameList).ToList();
            Code.ForEach(o =>
            {
                codeii++;
                if (codeii == Code.Count)
                    ok = "ok";
                code = o.MCODE;
                analiz(url, code);
                strZaman = ((codeii * 100) / Code.Count).ToStr();
            });
            return list;
        }

        public static void analiz(string url, string code)
        {
            if (codeii < Code.Count && codeii > ii)
            {
                url = "http://istatistik.nesine.com/headtohead/router.aspx?matchcode=" + code + "&page=" + "Matches" + "&languageıd=1";
                url1 = "http://istatistik.nesine.com/headtohead/router.aspx?matchcode=" + code + "&page=" + "ComparedStatistics" + "&languageıd=1";

                var macistatistik = "";
                var mi = macistatistikTemp.Where(o => o.Key == url).ToList();
                if (mi.Count > 0)
                {
                    macistatistik = mi.FirstOrDefault().Value;
                }
                else
                {
                    macistatistik = url.GetDocText(3000000);
                    macistatistikTemp.Add(url, macistatistik);
                }

                var rekabet = "";
                var rek = rekabetTemp.Where(o => o.Key == url1).ToList();
                if (rek.Count > 0)
                {
                    rekabet = rek.FirstOrDefault().Value;
                }
                else
                {
                    rekabet = url1.GetDocText(3000000);
                    rekabetTemp.Add(url1, rekabet);
                }

                macistatistikleri(macistatistik, code);
                rekabetanalizi(rekabet, code);

                var remove = list.Where(o => o.MacKodu == code).ToList();
                if (remove.Count < 1)
                    return;

                var row = new oranlarClass()
                {
                    MacKodu = remove.LastOrDefault() == null ? "" : remove.LastOrDefault().MacKodu,
                    evRekabet = remove.LastOrDefault() == null ? "" : remove.LastOrDefault().evRekabet,
                    dsRekabet = remove.LastOrDefault() == null ? "" : remove.LastOrDefault().dsRekabet,
                    tg = remove.LastOrDefault() == null ? "" : remove.LastOrDefault().tg,
                };

                row.noSetValueCustom2(remove, "X,ev,ds,Sayi,MacKodu,evRekabet,dsRekabet,tg", "");

                var msOran = BaseMethods.ToMaxMin(true, row.evGalip.ToDouble(), row.dsGalip.ToDouble(), row.X.ToDouble()).ToStr();
                row.noSetValueCustomAppend(remove, "%", msOran.ToDouble(), oranFiltre1, oranFiltre2, "X,ev,ds,Sayi,MacKodu,evRekabet,dsRekabet,tg");
                remove.ForEach(o => { list.Remove(o); });

                row.ev = row.ev + "(" + row.evGalip + ")" + BaseMethods.getOran(row.evGalip.Replace("%", "").ToDouble(), msOran.ToDouble(), oranFiltre1, oranFiltre2, "$", "@", "", "!");
                row.ds = row.ds + "(" + row.dsGalip + ")" + BaseMethods.getOran(row.dsGalip.Replace("%", "").ToDouble(), msOran.ToDouble(), oranFiltre1, oranFiltre2, "$", "@", "", "!");
                row.X = row.X + BaseMethods.getOran(row.X.Replace("%", "").ToDouble(), msOran.ToDouble(), oranFiltre1, oranFiltre2, "", "", "£", "");
                list.Add(row);

            }
        }

        public static void macistatistikleri(string str, string MacKodu)
        {
            var document = str.getStr();
            if (document != null && document.DocumentNode != null && document.DocumentNode.SelectNodes("//div") != null && document.DocumentNode.SelectNodes("//div").Count > 0)
            {
                var nodes = document.DocumentNode.SelectNodes("//div[@class='matchListContent']").ToList()[0].ChildNodes.Where(o => o.Name == "div" && o.InnerText != "&nbsp;").ToList();
                var nodes1 = document.DocumentNode.SelectNodes("//div[@class='matchListContent']").ToList()[1].ChildNodes.Where(o => o.Name == "div" && o.InnerText != "&nbsp;").ToList();
                var nod = document.DocumentNode.SelectNodes("//div[@class='matchListContent']").Select(o => o.ChildNodes.Where(oo => oo.Name == "div" && oo.InnerText != "&nbsp;")).ToList();
                var ev = nodes.GroupBy(o => o.ChildNodes.Where(ol => ol.Name != null && ol.Name == "div").ToList()[6].InnerText.Trim())
                      .Select(o => new { text = o, count = o.Count() })
                      .OrderByDescending(o => o.count).FirstOrDefault().text.Key.ToStr();
                var ds = nodes1.GroupBy(o => o.ChildNodes.Where(ol => ol.Name == "div").ToList()[3].InnerText.Trim())
                .Select(o => new { text = o, count = o.Count() })
                .OrderByDescending(o => o.count).FirstOrDefault().text.Key.ToStr();
                int takim = 1;

                nod.ForEach(oo =>
                {
                    var row = new oranlarClass()
                    {
                        ev = ev,
                        ds = ds,
                        MacKodu = MacKodu,
                    };
                    row = getRow(oo.ToList(), row, takim);
                    list.Add(row);
                    takim++;
                });
            }
        }

        public static void rekabetanalizi(string str, string MacKodu)
        {
            var document = str.getStr();
            if (document != null && document.DocumentNode != null && document.DocumentNode.SelectNodes("//div") != null && document.DocumentNode.SelectNodes("//div").Count > 0)
            {
                var node = document.DocumentNode.SelectNodes("//div[@class='data']");
                if (node != null && node.Count > 0)
                {
                    List<HtmlAgilityPack.HtmlNode> rekabet = new List<HtmlAgilityPack.HtmlNode>();
                    rekabet.Add(node.LastOrDefault());
                    var nod = document.DocumentNode.SelectNodes("//div[@class='data']").LastOrDefault();
                    var ev = nod.ChildNodes.Where(ol => ol.Name != null && ol.Name == "div").GroupBy(o => o.ChildNodes.Where(ol => ol.Name != null && ol.Name == "div").ToList()[2].InnerText.Trim())
                          .Select(o => new { text = o, count = o.Count() })
                          .OrderByDescending(o => o.count).FirstOrDefault().text.Key.ToStr();
                    var ds = nod.ChildNodes.Where(ol => ol.Name != null && ol.Name == "div").GroupBy(o => o.ChildNodes.Where(ol => ol.Name == "div").ToList()[4].InnerText.Trim())
                    .Select(o => new { text = o, count = o.Count() })
                    .OrderByDescending(o => o.count).FirstOrDefault().text.Key.ToStr();
                    var row = new oranlarClass()
                    {
                        ev = ev,
                        ds = ds,
                        MacKodu = MacKodu,
                    };
                    row = getRow(rekabet.ToList(), row, 0);
                    if (string.IsNullOrEmpty(row.evRekabet) || row.evRekabet != "0")
                        list.Add(row);
                }
            }
        }

        public static oranlarClass getRow(List<HtmlAgilityPack.HtmlNode> nodes, oranlarClass row, int takim)
        {
            int toplamrekabetSayisi = 0;
            if (nodes != null)
            {
                var noodeRow = nodes.Where(o => o.Name == "div").ToList();
                List<ClassProp> listProp = new List<ClassProp>();
                noodeRow.ForEach(oranlar =>
                {
                    var node = oranlar.ChildNodes.Where(oo => oo.Name == "div" && oo.InnerText != "").ToList();
                    if (node.Count > 0)
                    {
                        var t1 = new ClassProp();
                        if (takim == 1)//takim2
                        {
                            t1 = new ClassProp()
                            {
                                ev = node[3].InnerText.Trim(),
                                msev = node[2].InnerText.Trim().Substring(0, 1),
                                ds = node[5].InnerText.Trim(),
                                msds = node[2].InnerText.Trim().Substring(2, 1),
                                iyev = node[4].InnerText.Length < 2 ? "" : node[4].InnerText.Trim().Substring(0, 1),
                                iyds = node[4].InnerText.Length < 2 ? "" : node[4].InnerText.Trim().Substring(2, 1),

                            };
                            t1 = getOranlar(t1);
                            listProp.Add(t1);
                        }
                        else if (takim > 1)//takim2
                        {
                            t1 = new ClassProp()
                            {
                                ev = node[0].InnerText.Trim(),
                                msev = node[1].InnerText.Trim().Substring(0, 1),
                                ds = node[2].InnerText.Trim(),
                                msds = node[1].InnerText.Trim().Substring(2, 1),
                                iyev = node[5].InnerText.Length < 2 ? "" : node[5].InnerText.Trim().Substring(0, 1),
                                iyds = node[5].InnerText.Length < 2 ? "" : node[5].InnerText.Trim().Substring(2, 1),
                            };

                            t1 = getOranlar(t1);

                            listProp.Add(t1);
                        }
                        else //takim1
                        {
                            node.ForEach(oran =>
                            {
                                var orans = oran.ChildNodes.Where(oo => oo.Name == "div" && oo.InnerText != "").ToList();
                                t1 = new ClassProp()
                                {
                                    ev = orans[2].InnerText.Trim(),
                                    msev = orans[3].InnerText.Trim().Substring(0, 1),
                                    ds = orans[4].InnerText.Trim(),
                                    msds = orans[3].InnerText.Trim().Substring(2, 1),
                                    iyev = orans[5].InnerText.Trim().Length < 2 ? "" : orans[5].InnerText.Trim().Substring(0, 1),
                                    iyds = orans[5].InnerText.Trim().Length < 2 ? "" : orans[5].InnerText.Trim().Substring(2, 1),
                                };

                                t1 = getOranlar(t1);
                                listProp.Add(t1);
                            });
                        }
                    }
                });
                toplamrekabetSayisi = listProp.Count();

                if (listProp.Count < 1)
                    return row;

                var ev = listProp.Where(o => o.ev.toCustomTr() == row.ev.toCustomTr()).ToList();
                var ds = listProp.Where(o => o.ev.toCustomTr() != row.ev.toCustomTr()).ToList();
                if (takim > 0)
                {
                    ev = listProp.Where(o => o.ev.toCustomTr() == row.ev.toCustomTr()).ToList();
                    ds = listProp.Where(o => o.ev.toCustomTr() != row.ev.toCustomTr()).ToList();
                }

                row.X = (listProp.Where(o => o.ms == "0").Count()).ToStr();
                row.evGalip = (ev.Where(o => o.ms == "1").Count()).ToStr();
                row.dsGalip = (ds.Where(o => o.ms == "1").Count()).ToStr();
                row.h1 = (ev.Where(o => o.ms == "1").Count()).ToStr();
                row.hX = (listProp.Where(o => o.ms == "0").Count()).ToStr();
                row.h2 = (ds.Where(o => o.ms == "1").Count()).ToStr();
                row.KgVar = (listProp.Where(o => o.kg == "1").Count()).ToStr();
                row.KgYok = (listProp.Where(o => o.kg == "0").Count()).ToStr();
                row.iy1 = (ev.Where(o => o.iyev == "1").Count()).ToStr();
                row.iy2 = (ds.Where(o => o.iyds == "1").Count()).ToStr();
                row.yr2_1 = (ev.Where(o => o.yr2 == "1").Count()).ToStr();
                row.yr2_2 = (ds.Where(o => o.yr2 == "1").Count()).ToStr();
                row.yr2_X = (listProp.Where(o => o.yr2 == "0").Count()).ToStr();
                row.alt15iy = (listProp.Where(o => o.alt15iy == "1").Count()).ToStr();
                row.ust15iy = (listProp.Where(o => o.ust15iy == "1").Count()).ToStr();
                row.alt25 = (listProp.Where(o => o.alt25 == "1").Count()).ToStr();
                row.ust25 = (listProp.Where(o => o.ust25 == "1").Count()).ToStr();
                row.alt35 = (listProp.Where(o => o.alt35 == "1").Count()).ToStr();
                row.ust35 = (listProp.Where(o => o.ust35 == "1").Count()).ToStr();
                row.csiy = (listProp.Where(o => o.csiy == "1").Count()).ToStr();
                row.cs = (listProp.Where(o => o.cs == "1").Count()).ToStr();
                row.tg = (listProp.Sum(o => o.tg.ToDecimal()) / toplamrekabetSayisi).ToString("0.##");

                row.noSetValueCustom<oranlarClass>("X,ev,ds,Sayi,MacKodu,evRekabet,dsRekabet,tg", 100, toplamrekabetSayisi);

                if (takim < 1)
                {
                    row.evRekabet = toplamrekabetSayisi.ToStr() + "/" + ((row.evGalip.ToInt() * toplamrekabetSayisi) / 100).ToStr();
                    row.dsRekabet = toplamrekabetSayisi.ToStr() + "/" + ((row.dsGalip.ToInt() * toplamrekabetSayisi) / 100).ToStr();
                }
            }
            else
            {
                row.evRekabet = "-";
                row.dsRekabet = "-";
            }
            return row;
        }

        public static ClassProp getOranlar(ClassProp t1)
        {
            t1.ms = (t1.msev.ToInt() > t1.msds.ToInt() ? "1" : (t1.msds.ToInt() > t1.msds.ToInt() ? "2" : "0"));//maç sonucu
            t1.h = t1.msev.ToInt() > t1.msds.ToInt() + 1 ? "1" : (t1.msds.ToInt() > t1.msev.ToInt() + 1 ? "2" : "0");//handikap
            t1.kg = (t1.msev.ToInt() > 0 && t1.msds.ToInt() > 0) ? "1" : ((t1.msev.ToInt() < 1 && t1.msds.ToInt() < 1) ? "0" : "");//KG var
            t1.iy = t1.iyev.ToInt() > 0 ? "1" : (t1.iyds.ToInt() > 0 ? "2" : "0");//maç sonucu iy
            t1.yr2 = (t1.msev.ToInt() > 0 ? "1" : (t1.msds.ToInt() > 0 ? "2" : "0"));//maç sonucu 2.yarı
            t1.alt15iy = (t1.iyev.ToInt() + t1.iyds.ToInt()) < 1 ? "1" : "";//1,5 alt iy
            t1.ust15iy = (t1.iyev.ToInt() + t1.iyds.ToInt()) > 1 ? "1" : "";//1,5 üst iy
            t1.alt15 = (t1.msev.ToInt() + t1.msds.ToInt()) < 1 ? "1" : "";//1,5 alt
            t1.ust15 = (t1.msev.ToInt() + t1.msds.ToInt()) > 1 ? "1" : "";//1,5 üst
            t1.alt25 = (t1.msev.ToInt() + t1.msds.ToInt()) < 2 ? "1" : "";//2,5 alt
            t1.ust25 = (t1.msev.ToInt() + t1.msds.ToInt()) > 2 ? "1" : "";//2,5 üst
            t1.alt35 = (t1.msev.ToInt() + t1.msds.ToInt()) < 3 ? "1" : "";//3,5 alt
            t1.ust35 = (t1.msev.ToInt() + t1.msds.ToInt()) > 3 ? "1" : "";//3,5 üst
            t1.tg = (t1.msev.ToInt() + t1.msds.ToInt()).ToStr();//Toplam Gol
            t1.csiy = t1.iyev.ToInt() > 0 || t1.iyds.ToInt() > 0 ? "1" : "";//çifte şans iy
            t1.cs = t1.msev.ToInt() > 0 || t1.msds.ToInt() > 0 ? "1" : "";//çifte şans 
            return t1;
        }

        [WebMethod]
        public static dynamic getZaman()
        {
            return new { strZaman = strZaman, ok = ok };
        }



        [WebMethod]
        public static dynamic Login1(string username, string password)
        {
            if (string.IsNullOrEmpty(username) && string.IsNullOrEmpty(password) && HttpContext.Current.Session["user"] == null)
                return new { sonuc = 2, mesaj = "Load" };

            if (string.IsNullOrEmpty(username) && string.IsNullOrEmpty(password) && HttpContext.Current.Session["user"] != null)
                return new { sonuc = 2, mesaj = "Load" };

            if (HttpContext.Current.Session["user"] != null)
            {
                return new { sonuc = 1, mesaj = "Giriş Başarılı" };
            }
            var user = Global.userList.Where(o => o.Key == username && o.Value == password).ToList();
            if (user.Count > 0)
            {
                HttpContext.Current.Session["user"] = user.FirstOrDefault();
                return new { sonuc = 1, mesaj = "Giriş Başarılı" };
            }
            return new { sonuc = 0, mesaj = "Hatalı Giriş" };

        }
        [WebMethod]
        public static void LogOff()
        {
            FormsAuthentication.SignOut();
            HttpContext.Current.Session["user"] = null;
            HttpContext.Current.Session.Abandon();
        }

    }
}