$(function () {

    var setInt = [];

    if (window.addEventListener) {
        window.addEventListener('load', general_Load, false);
    }
    else {
        window.attachEvent('onload', general_Load);
    }

    function general_Load() {
        window.onbeforeunload = setClick;
    }

    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t },
        decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }
    }

    var postArray = [];
    function post(url, data, successMethod, error) {
        if (typeof data != "string" && data != null) {
            data = JSON.stringify(data);
        }
        var post = $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: data,
            dataType: "json",
            success: successMethod,
            error: function (e, exception) {
                componentError = e;
                if (error) {
                    error = errorSend(e, exception);
                    console.log(error);
                }

            }
        });
        postArray.push(post);
    }

    function setClick() {
        for (var i = 0; i < postArray.length; i++) {
            postArray[i].abort();
        }
        // cl();
    }

    function errorSend(e, exception) {
        var error = '';
        if (e.status == 0) {
            error = 'Not connect. Verify Network.';
        } else if (e.status == 404) {
            error = 'Requested page not found. [404]';
        } else if (e.status == 500) {
            error = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            error = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            error = 'Time out error.';
        } else if (exception === 'abort') {
            error = 'Ajax request aborted.';
        } else {
            error = 'Uncaught Error. \n' + error.responseText;
        }
        var data = { error: error };
        //AjaxPOST("/Pages/Methods.aspx/sendErrorMail", data, null, false, null);

        return error;
    }

    /*Convert*/
    var toStr = function (e) {
        return e == null ? "" : e.toString();
    };

    var toInt = function (e) {
        return e == null || e == "" ? null : parseInt(e);
    };

    var toIntNull = function (e) {
        return e == -1 || e == null || e == "" ? 0 : parseInt(e);
    };

    var toDouble = function (e) {
        return e == null || e == "" ? null : parseFloat(e);
    };

    var isNull = function (e) {
        return e == null || e == "undefined" || e == undefined ? "" : e;
    };


    function isBool(variable) {
        if (typeof (variable) === "boolean") {
            return true;
        }
        else {
            return false;
        }
    }

    function toBool(value) {
        return value == true ? "True" : "False";
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var toDateList = function (obj) {
        for (var i = 0; i < obj.length; i++) {
            var value = obj[i];
            var array = $.map(value, function (value, index) {
                return [value];
            });
            var properties = Object.keys(value);
            array.forEach(function (subValue, key) {
                if (subValue && !isNumeric(subValue) && !isBool(subValue) && subValue.indexOf('/Date(') > -1) {
                    var property = properties[key];
                    value[property] = toDate(subValue, '.');
                }
            });
        }
        return obj;
    }

    Array.prototype.toObject = function () {
        var Obj = {};
        for (var i in this) {
            if (typeof this[i] != "function") {
                Obj[i] = this[i];
            }
        }
        return Obj;
    }

    function forData(obj, data) {
        for (var i = 0; i < data.length; i++) {
            obj.push(data[i]);
        }
        return obj;
    }

    function getRow(data, el) {
        var obj = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].value.indexOf(el) != -1) {
                obj = data[i];
                break;
            }
        }
        return obj;
    }

    function toArray(d) {
        var dd = new Array();
        for (var i = 0; i < d.length; i++) {
            var arr = new Array();
            for (var j in d[i]) {
                arr.push(d[i][j]);
            }
            dd.push(arr);
        }
        return dd;
    }

    function DataParse(datas) {
        if (!datas) return null;
        if (!datas && !datas.d) return null;
        else {
            if (datas.d)
                datas = datas.d;
        }
        if (datas.MethodResultType && datas.MethodResultType == parseInt(MethodResultType.Error)) {
            var error = datas.Result;
            logMessage(error);
            datas = [];
        }
        return datas;
    }

    function getModelNameEnum(model, index) {
        var data = [];
        for (var key in model) {
            if (!model.hasOwnProperty(key)) continue;

            data.push({ key: key, value: model[key] });

            //if (model[key] == name) return key;
        }
        return data[index];

    }

    function getModelNameEnumCustom(model, index) {
        var data = [];
        for (var key in model) {
            if (!model.hasOwnProperty(key)) continue;
            if (model[key] == index) return key;
        }
        return "";
    }

    function toArrayEnum(d) {

        var data = [];
        for (var key in d) {
            if (!d.hasOwnProperty(key)) continue;

            data.push({ key: key, value: d[key] });

            //if (model[key] == name) return key;
        }



        return data;
    }

    function dp(datas) {
        if (!datas) return null;
        if (!datas && !datas.d) return null;
        else {
            if (datas.d)
                datas = datas.d;
        }
        if (datas.MethodResultType && datas.MethodResultType == parseInt(MethodResultType.Error)) {
            var error = datas.Result;
            logMessage(error);
            datas = [];
        }
        return datas;
    }

    function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else
                if (i == key && obj[i] == val || i == key && val == '') { //
                    objects.push(obj);
                } else if (obj[i] == val && key == '') {
                    if (objects.lastIndexOf(obj) == -1) {
                        objects.push(obj);
                    }
                }
        }
        return objects;
    }

    NodeList.prototype.getattr = function (key) {
        var d = [];
        for (var i = 0; i < $(this).length; i++) {
            d[i] = $(this)[i].attr(key);
        }
        return d;
    }

    NodeList.prototype.setattr = function (key, value) {
        var d = [];
        for (var i = 0; i < $(this).length; i++) {
            d[i] = $(this)[i].attr(key, value);
        }
        return d;
    }

    function setattr(data, key, value) {

        for (var i = 0; i < $(data).length; i++) {
            $(data)[i].attr(key, value);
        }
    }

    function getattr(data, key, type) {
        var d = [];
        for (var i = 0; i < $(data).length; i++) {
            var row = $(data[i]);
            if (type == "int")
                d[i] = (row[0].tagName == "SELECT" ? parseInt(row).val() : parseInt((row).attr(key)));
            else
                d[i] = (row[0].tagName == "SELECT" ? row.val() : $(row).attr(key));;


        }
        return d;
    }

    function getattrValue(data) {
        var d = [];
        for (var i = 0; i < $(data).length; i++) {
            d[i] = $(data[i]).val();
        }
        return d;
    }


    /*END Convert*/


    HTMLElement.prototype.setSelect = function (data, value, innerHTML, selectName, selectValue) {
        $("#select2-" + this.id + "-container").empty();
        this.clearContainer(0);
        if (selectValue != "-2")
            this.addOption("Seçiniz", "-1", "true", "", "");

        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var option = document.createElement("option");
            option.innerHTML = d[innerHTML];
            option.value = d[value];
            if (selectValue == "-2" && i == 0)
                option.selected = true;
            //if ((selectValue && (selectValue == option.value)) || (selectName && (option.innerHTML.toLowerCase().indexOf(selectName.toLowerCase()) != -1))) {
            //    option.selected = true;
            //    option.setAttribute("selected", 'selected');
            //    $("#select2-" + this.id + "-container").text(option.innerHTML)
            //}
            this.appendChild(option);

            if (d.Sub) {
                var tire = " &nbsp;- ";
                for (var j = 0; j < d.Sub.length; j++) {
                    var sub = d.Sub[j];
                    this.addOption(tire + " " + sub[innerHTML], sub[value], null, null, null);
                    if (sub.Sub.length > 0) {
                        subMenu(this, sub.Sub, value, innerHTML, selectName, selectValue);
                    }
                }
            }


        }

        if (selectValue && selectValue != "-2") {
            $(this).val(selectValue).prop("selected", "selected");
            $("#select2-" + this.id + "-container").text($(this).text())
        }

        if (selectName) {
            $("#" + this.id + " option[text=" + selectName + "]").prop("selected", "selected");
        }


    }

    jQuery.fn.setSelectText = function (item) {
        if (item || item == 0) {
            $(this).val(item);
            $("#" + $(this).attr("id") + " option[value='" + item + "']").prop('selected', "selected");
            //$(this).val(item).prop("selected", "selected");
            $("#select2-" + $(this).attr("id") + "-container").text($("#" + $(this).attr("id") + " option[value='" + item + "']").text())
        }
    }

    $.fn.avg = function () {
        var sum = 0;
        for (var i = 0; i < this.length; i++) {
            sum += parseInt(elmt[i], 10); //don't forget to add the base
        }

        var avg = sum / this.length;

        return avg;
    }


    function subMenu(elem, data, value, innerHTML, selectName, selectValue) {
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var option = document.createElement("option");
            var tire = " &nbsp;&nbsp;&nbsp; -- ";

            option.innerHTML = tire + d[innerHTML];
            option.value = d[value];
            elem.appendChild(option);

            if (d.Sub) {
                var tire = " &nbsp;&nbsp;&nbsp;&nbsp; --- ";
                for (var j = 0; j < d.Sub.length; j++) {
                    var sub = d.Sub[j];
                    elem.addOption(tire + " " + sub[innerHTML], sub[value], null, null, null);
                    if (sub.Sub.length > 0) {
                        subMenu(this, sub.Sub);
                    }
                }
            }


        }




    }

    HTMLElement.prototype.addOption = function (text, value, select, attr, attrValue) {
        var option = document.createElement("option");
        option.value = value;
        option.innerHTML = text;
        if (attr)
            option.setAttribute(attr, attrValue)
        if (select)
            option.selected = true;
        $("#select2-" + this.id + "-container").text(option.innerHTML)
        this.appendChild(option);
    }

    HTMLElement.prototype.clearContainer = function (skipCount) {
        if (!skipCount || skipCount === 0) {
            this.innerHTML = "";
            return;
        }

        while (this.childElementCount > skipCount) {
            this.removeChild(this.childNodes[skipCount]);
        }
    }

    function PostAndRedirect(url, data, formname) {
        var form = document.createElement("form");
        form.action = url;
        form.method = "post";
        form.style.display = "none";
        form.name = formname;

        for (var item in data) {
            var input = document.createElement("input");
            input.type = "hidden";
            input.value = data[item];
            input.name = item;
            form.appendChild(input);
        }
        document.body.appendChild(form);
        console.log(form);
        form.submit();
    }


    var loadingdiv = loadingdiv || (function ($) {
        'use strict';
        return {
            show: function (message) {
                message = message || "Lütfen Bekleyiniz";
                App.blockUI({
                    boxed: true,
                    message: message
                });
            },
            hide: function (time) {
                App.unblockUI();
            }
        };

    })(jQuery);

    function excelExport(id, excelName) {
        $('#').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Turkish.json"
            },
            "lengthMenu": [[25, 50, 75, -1], [25, 50, 75, "Hepsi"]]
        });

        var excelDurum = false;
        $(".excelImport").click(function () {

            //$(".disappear").remove();
            //$("tr").css("display", "block");
            //$(".islem").remove();
            if (excelDurum) {
                alert("İşleminiz devam ediyor");
                return;
            }
            loadingdiv.show('Lütfen Bekleyiniz');

            var exInter = setInterval(function () {

                excelDurum = false;
                var dt = new Date();
                var day = dt.getDate();
                var month = dt.getMonth() + 1;
                var year = dt.getFullYear();
                var hour = dt.getHours();
                var mins = dt.getMinutes();
                var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
                //creating a temporary HTML link element (they support setting file names)
                var a = document.createElement('a');
                //getting data from our div that contains the HTML table
                var data_type = 'data:application/vnd.ms-excel';
                var table_div = document.getElementById(id);
                var html = table_div.outerHTML.replace(/ /g, '%20');


                while (html.indexOf('ç') != -1) html = html.replace('ç', '&ccedil;');
                while (html.indexOf('ğ') != -1) html = html.replace('ğ', '&#287;');
                while (html.indexOf('ı') != -1) html = html.replace('ı', '&#305;');
                while (html.indexOf('ö') != -1) html = html.replace('ö', '&ouml;');
                while (html.indexOf('ş') != -1) html = html.replace('ş', '&#351;');
                while (html.indexOf('ü') != -1) html = html.replace('ü', '&uuml;');

                while (html.indexOf('Ç') != -1) html = html.replace('Ç', '&Ccedil;');
                while (html.indexOf('Ğ') != -1) html = html.replace('Ğ', '&#286;');
                while (html.indexOf('İ') != -1) html = html.replace('İ', '&#304;');
                while (html.indexOf('Ö') != -1) html = html.replace('Ö', '&Ouml;');
                while (html.indexOf('Ş') != -1) html = html.replace('Ş', '&#350;');
                while (html.indexOf('Ü') != -1) html = html.replace('Ü', '&Uuml;');


                a.href = data_type + ', ' + encodeURIComponent(html);
                //setting the file name
                a.download = excelName + '_' + postfix + '.xls';
                //triggering the function
                a.click();
                excelDurum = false;
                loadingdiv.hide();

                //just in case, prevent default behaviour
                //a.preventDefault();

                //location.reload();

                clearInterval(exInter);
            }, 500);


        });

    }


    function toColumns(data) {

        var col = {
            columns: []
        };

        for (var i = 0; i < data.length; i++) {
            col.columns.push({ title: data[i] });
        }

        return col.columns;
    }

    function confirmCustom(message, button, call) {
        var but = [];
        if (button == "yesno") {
            but = {
                confirm: {
                    label: "Evet",
                    className: 'btn-success'
                },
                cancel: {
                    label: "Hayır",
                    className: 'btn-danger'
                }
            };
        }
        else if (button == "ok") {
            but = {
                confirm: {
                    label: "Tamam",
                    className: 'btn-success'
                }
            };
        }


        bootbox.confirm({
            message: message,
            buttons: but,
            callback: call
        });
    }

    function toForm(id) {//serialize data function
        formArray = $(id).serializeArray()
        returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        $(id + ' select[disabled]').each(function () {
            returnArray[$(this).attr('name')] = $(this).val();
        });
        $(id + ' input[disabled]').each(function () {
            returnArray[$(this).attr('name')] = $(this).val();
        });

        return returnArray;
    }

    function alerts(message, button, call) {
        var but = [];
        if (button == "yesno") {
            but = {
                confirm: {
                    label: "Evet",
                    className: 'btn-success'
                },
                cancel: {
                    label: "Hayır",
                    className: 'btn-danger'
                }
            };
        }
        else if (button == "ok") {
            but = {
                confirm: {
                    label: "Tamam",
                    className: 'btn-success'
                }
            };
        }


        bootbox.confirm({
            message: message,
            buttons: but,
            callback: call
        });
    }

    function alertJson(baslik, data) {
        data = JSON.parse(data);
        var msg = "";
        $.each(data, function (index, item) {
            msg += baslik + ": " + item + "</br></br>";

        });
        bootbox.alert(msg);
    }


    function alertJsonText(baslik, msg) {
        bootbox.alert(msg);
    }

    /*toDate*/
    function DateParseFormat(date, format) {
        var dates = $.datepicker.formatDate('dd' + format + 'mm' + format + 'yy', date);
        return dates.split('.')[0] + format + dates.split('.')[1] + format + dates.split('.')[2];
    }

    function ParseFormat(date, format) {
        return date.split("/")[0] + format + date.split("/")[1] + format + date.split("/")[2];
    }

    function toSplitFormat(text, format) {
        var resultText = "";
        var resultFormat = "";
        if (text.indexOf('.') != -1) {
            resultFormat = '.';
        }
        else if (text.indexOf('/') != -1) {
            resultFormat = '/';
        }
        else if (text.indexOf('-') != -1) {
            resultFormat = '-';
        }
        var data = text.split(resultFormat);
        for (var i = 0; i < data.length; i++) {
            if (data.length - 1 == i)
                format = '';
            resultText += data[i] + format;
        }
        return resultText;
    }

    function DateParse(date) {
        if (date == null) return null;
        var result = new Date(parseInt(date.replace('/Date(', '').replace(')/', '')));
        return result;
    }

    function todayDate(format) {
        var dates = $.datepicker.formatDate('dd' + format + 'mm' + format + 'yy', new Date());
        return dates;
    }

    function toDate(date, format) {
        if (!date) return dates;
        var dates = new Date(parseInt(date.replace('/Date(', '').replace(')/', '')));
        dates = $.datepicker.formatDate('dd' + format + 'mm' + format + 'yy', dates);
        return dates;
    }

    function toDateScript(date, format) {
        var dates = $.datepicker.formatDate('dd' + format + 'mm' + format + 'yy', date);
        return dates;
    }

    function toStrDate(date, format) {
        date = date.split(format);
        return new Date(date[2], parseInt(date[1]) - 1, date[0]);
    }

    function toStrDateNew(date, format) {
        date = date.split(format);
        return new Date(date[0], parseInt(date[1]) - 1, date[2]);
    }

    function clearIntervalAll() {
        var interval_id = window.setInterval("", 9999); // Get a reference to the last
        // interval +1
        for (var i = 1; i < interval_id; i++)
            window.clearInterval(i);
        //for clearing all intervals
    }

    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
        })
        clearInterval()
    }


    //datatable
    var dataTable = null;

    function dTable(id) {
        if (dataTable != null) {
            dataTable.fnClearTable();
        }
        dtAyar();
        if (id) {
            id = id + " ";
        }
        id = $(id + 'table');

        dataTable = id.dataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Turkish.json",
                //"decimal": ",",
                //"thousands": "."
            },
            dom: 'lBfrtip',
            "lengthMenu": [[500, 1000, 1500, -1], [500, 1000, 1500, "Hepsi"]],
            buttons: [
                 { extend: 'print', className: 'btn default' },
                    { extend: 'copy', className: 'btn default' },
                    { extend: 'pdf', className: 'btn default' },
                    { extend: 'excel', className: 'btn default' },
                    { extend: 'csv', className: 'btn default' },
                    { extend: 'colvis', className: 'btn default', text: 'Sütunlar' }
            ],
            "scrollX": true,
        });


        tdRight("")

    }

    function dTableColumns(columns) {
        if (dataTable != null) {
            dataTable.fnClearTable();
        }
        dtAyar();

        columns = toColumns(columns);
        dataTable = $('table').dataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Turkish.json",
                "decimal": ",",
                "thousands": "."
            },
            dom: 'lBfrtip',
            "lengthMenu": [[500, 1000, 1500, -1], [500, 1000, 1500, "Hepsi"]],
            buttons: [
                 { extend: 'print', className: 'btn default' },
                    { extend: 'copy', className: 'btn default' },
                    { extend: 'pdf', className: 'btn default' },
                    { extend: 'excel', className: 'btn default' },
                    { extend: 'csv', className: 'btn default' },
                    { extend: 'colvis', className: 'btn default', text: 'Sütunlar' }
            ],
            "scrollX": true,

            columns: columns,
        });


        tdRight("")

    }

    function dTableColumnsID(columnsAll, id) {
        if (id)
            id = id + " ";
        columnsAll = toColumns(columnsAll);
        dataTable = $(id + 'table').dataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Turkish.json",
                "decimal": ",",
                "thousands": "."
            },
            dom: 'lBfrti',
            "lengthMenu": [[500, 1000, 1500, -1], [500, 1000, 1500, "Hepsi"]],
            buttons: [
                 { extend: 'print', className: 'btn default' },
                    { extend: 'copy', className: 'btn default' },
                    { extend: 'pdf', className: 'btn default' },
                    { extend: 'excel', className: 'btn default' },
                    { extend: 'csv', className: 'btn default' },
                    { extend: 'colvis', className: 'btn default', text: 'Sütunlar' }
            ],
            "scrollX": true,
            "paging": false,
            "autoWidth": true,
            "fixedHeader": true,
            columns: columnsAll,

        });


        var ayarInt = setInterval(function () {
            dtAyar();
            clearInterval(ayarInt);
        }, 250);
    }

    function dTableColumnsIDNoProp(columns, id) {
        dtAyar();
        columns = toColumns(columns);
        if (id) {
            id = id + " ";
        }
        dataTable = $(id + 'table').dataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Turkish.json",
                "decimal": ",",
                "thousands": "."
            },
            buttons: [

            ],
            dom: 'Bfrtip',
            "scrollX": true,
            "searching": false,
            columns: columns,
        });

        tdRight("")
    }

    function tdRight(id) {
        var tdRight = $(id + " table td," + id + " table th");
        $.each(tdRight, function (i, item) {
            if ($.isNumeric($(this).text()) == true || $(this).text().indexOf("%") != -1) {
                $(this).addClass("tdRight");
            }
        });
    }

    function dtAyar() {

        jQuery.fn.dataTable.Api.register('sum()', function () {
            return this.flatten().reduce(function (a, b) {
                if (typeof a === 'string') {
                    a = a.replace(/[^\d.-]/g, '') * 1;
                }
                if (typeof b === 'string') {
                    b = b.replace(/[^\d.-]/g, '') * 1;
                }

                return a + b;
            }, 0);
        });

        jQuery.fn.dataTable.Api.register('avg()', function () {
            var data = this.flatten();
            var sum = data.reduce(function (a, b) {
                return (a * 1) + (b * 1); // cast values in-case they are strings
            }, 0);

            return sum / data.length;
        });

        $.fn.dataTable.Api.register('column().title()', function () {
            var colheader = this.header();
            return $(colheader).text().trim();
        });


        //İNPUT FORM  CONTROL
        $("input[type*='number'],input[type*='text'],input[type*='password'],input[type*='search']").addClass("form-control");

        //İS NUMERİC
        jQuery('.isnumeric').keyup(function () {
            this.value = this.value.replace(/[^0-9\.]/g, '');
        });

        //DATE PİCKER
        $('.date-picker').datepicker({
            //rtl: App.isRTL(),
            //orientation: "left",
            autoclose: true,
            minDate: 0
        });
        //TİME PİCKER
        $('.timepicker-24').timepicker({
            autoclose: true,
            minuteStep: 5,
            showSeconds: false,
            showMeridian: false,
            defaultTime: false,
            timeFormat: 'h:mm:ss p'
        });

        //SELECT
        $.fn.select2.defaults.set("theme", "bootstrap");
        var placeholder = "Seçiniz";
        $("select").select2({
            placeholder: placeholder,
            width: null
        });

        $("select").on("select2:open", function () {
            if ($(this).parents("[class*='has-']").length) {
                var classNames = $(this).parents("[class*='has-']")[0].className.split(/\s+/);
                for (var i = 0; i < classNames.length; ++i) {
                    if (classNames[i].match("has-")) {
                        $("body > .select2-container").addClass(classNames[i]);
                    }
                }
            }
        });

        $(".select2").click(function () {
            $(".select2-container--open").addClass("z99999");
        });


    }

    $('.closed').click(function () {
        $('.close').click();

    });
    //datatable END


    //login
    if ($('.login-form').length > 0)
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: ":hidden",
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "Username is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                setlogin();
                return false;

            }
        });
    if ($('.login-form').length > 0)
        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    setlogin();
                }
                return false;
            }
        });
  
    function setlogin() {
        loadingdiv.show();
        var username = $("[name='username']").val(),
        password = $("[name='password']").val();
        post("/Pages/Methods.aspx/Login1", {
            username: username == null ? "" : username,
            password: password == null ? "" : password,
        }, function (d) {
            d = dp(d);
            if (d.sonuc == 1) {
                window.location = "/Pages/Index.html";
            }
            else if (d.sonuc == 2) {
               //load
            }
            else {
                loadingdiv.hide();
                var dialog = bootbox.dialog({
                    message: d.mesaj
                });
                dialog.init(function () {
                    setTimeout(function () {
                        dialog.modal('hide');
                    }, 2000);
                });
            }
            loadingdiv.hide();

        }, function () { loadingdiv.hide(); });

    }

    function logoff() {
        post("/Pages/Methods.aspx/LogOff", null, function (d) {
            window.location = "/Pages/Login.html";
        }, function () { loadingdiv.hide(); });
    }
    $("#btnLogOff").click(function (e) {
        e.preventDefault();
        logoff();
    });

    //end login


    $(".form-group input").keydown(function (e) {
        if (e.keyCode == 13) {
            if (setInt)
                clearInterval(setInt);
            get();
        }
    });
    $("#btnAra.btn-success").click(function (e) {
        e.preventDefault();
        if (setInt)
            clearInterval(setInt);
        get();
    });

    function get() {
        loadingdiv.show(zaman);
        getZaman();
        post("/Pages/Methods.aspx/getSonuclar", {
            txtoranFiltre1: $("#txtoranFiltre1").val(),
            txtoranFiltre2: $("#txtoranFiltre2").val(),
            txtmacSayisi: $("#txtmacSayisi").val() == "" ? "" : $("#txtmacSayisi").val(),
            txtMacKoduMin: $("#txtMacKoduMin").val() == "" ? "" : $("#txtMacKoduMin").val(),
            txtMacKoduMax: $("#txtMacKoduMax").val() == "" ? "" : $("#txtMacKoduMax").val()
        }, set);

    }
    function set(d) {
        if (d.d) {
            d = dp(d);
            toTable("#dt", d, "table table-striped table-bordered table-hover dataTable no-footer full");
            clearInterval(setInt);
            loadingdiv.hide();
        }
        else {
            window.location = "/Pages/Login.html";
        }

    }
    var zaman = "";
    function getZaman() {
        setInt = setInterval(function () {
            post("/Pages/Methods.aspx/getZaman", null, function (d) {
                d = d.d;
                zaman = d.strZaman + "%";

            });

        }, 1);
    }

    //if (window.location.toString().indexOf('Login.html') != -1) {
    //    window.location = "/Pages/Index.html";
    //}
    //if (window.location.toString().indexOf('Index.html') != -1) {
    //    get();
    //}
    function toTable(id, DataList, classList) {
        $(id).html('<table class="' + classList + '"><tbody></tbody></table>');
        var columns = [];
        for (var key in DataList[0]) {
            columns.push(key);
        }

        for (var i = 1; i < DataList.length; i++) {
            var str = "<tr>";
            for (var key in DataList[i]) {
                if (key) {
                    var value = "";
                    var style = "";
                    if (DataList[i][key]) {
                        value = DataList[i][key];
                        var valueIndex = [];
                        if (value.indexOf("@") != -1)
                            valueIndex.push(value.indexOf("@"));
                        if (value.indexOf("$") != -1)
                            valueIndex.push(value.indexOf("$"));
                        if (value.indexOf("£") != -1)
                            valueIndex.push(value.indexOf("£"));
                        if (value.indexOf("!") != -1)
                            valueIndex.push(value.indexOf("!"));

                        if (valueIndex.length > 0) {
                            var cssProp = value.substr(valueIndex, 1);
                            style = getModelNameEnumCustom(enumSkorDurum, cssProp);
                            value = value.replace(cssProp, '');
                        }
                    }
                    else {
                        console.log(key + " is null.");
                    }
                    str += "<td class='" + style + "'>" + value + "</td>";
                }

            }
            str += "</tr>";
            $(id + " table tbody").append(str);
        }

        dTableColumnsID(columns, "#dt");
    }


    function splitArray(data, split) {
        return data.split(split);
    }

    function toTable2(id, DataList, classList) {
        //table
        document.getElementById("dt").clearContainer();
        var table = document.createElement("table");
        var tblthead = document.createElement("thead");
        var tblBody = document.createElement("tbody");
        var splt = splitArray(classList, ' ');
        for (var i = 0; i < splt.length; i++)
            table.classList.add(splt[i]);
        //columns
        var columns = [];
        for (var key in DataList[0]) {
            columns.push(key);
            var td = document.createElement('td');
            td.innerHTML = key;
            tblthead.appendChild(td);
        }

        table.appendChild(tblthead);

        //tr
        for (var i = 1; i < DataList.length; i++) {
            var tr = document.createElement('tr');
            for (var key in DataList[i]) {
                if (key) {
                    var value = "";
                    var classItem = "";

                    if (DataList[i][key]) {
                        value = DataList[i][key];
                        var valueIndex = [];
                        if (value.indexOf("@") != -1)
                            valueIndex.push(value.indexOf("@"));
                        if (value.indexOf("$") != -1)
                            valueIndex.push(value.indexOf("$"));
                        if (value.indexOf("£") != -1)
                            valueIndex.push(value.indexOf("£"));
                        if (value.indexOf("!") != -1)
                            valueIndex.push(value.indexOf("!"));

                        if (valueIndex.length > 0) {
                            var cssProp = value.substr(valueIndex, 1);
                            classItem = getModelNameEnumCustom(enumSkorDurum, cssProp);
                            value = value.replace(cssProp, '');
                        }
                    }
                    else {
                        console.log(key + " is null.");
                    }
                    var td = document.createElement('td');
                    if (classItem)
                        td.classList.add(classItem);
                    td.innerHTML = value;
                    tr.appendChild(td);
                }


                tblBody.appendChild(tr);
            }
        }

        table.appendChild(tblBody);
        document.getElementById("dt").appendChild(table)

        dTableColumnsID(columns, "dt");
    }

    var enumSkorDurum = {
        galip: '$',
        maglup: '@',
        berabere: '£',
        yuksekoran: '!',

    }

    setlogin();

});