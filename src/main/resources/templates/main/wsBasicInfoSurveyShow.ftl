<#--文书基础信息调研展示页-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>文书调研信息展示</title>
    <#include "../pop/common_css.ftl">
    <link rel="stylesheet" href="vendor/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="vendor/datatables/css/jquery.dataTables.css">
</head>

<body>
<!-- Navigation -->
<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
    <div class="navbar-header">
        <a class="navbar-brand">裁判文书调研分析系统</a>
    </div>
</nav>
<div id="wrapper">
    <div id="page-wrapper" style="margin: 0 20px 0 20px">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">文书基础信息调研详情</h1>
            </div>
        </div>
    <#--调研条件-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        调研条件
                    </div>
                    <div class="panel-body">
                        <form role="form">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-2"></div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px;">
                                                开始日期:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                             <span id="jarqStart"></span>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px;">
                                                结束日期:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="jarqEnd"></span>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案件类别:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="ajlb"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-2"></div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                经办法院:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan" >
                                            <span id="jbfy"></span>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                承办部门:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="cbbm"></span>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                审判程序:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="spcx"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-1 col-sm-offset-2 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="ah"></span>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案件名称:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="ajmc"></span>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                承&nbsp;&nbsp;办&nbsp;&nbsp;人:
                                            </label>
                                        </div>
                                        <div class="col-sm-2 showSpan">
                                            <span id="cbr"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-lg-1 col-sm-offset-2 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;由:
                                            </label>
                                        </div>
                                        <div class="col-lg-3 showSpan">
                                            <span id="ay"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <!-- /.row (nested) -->
                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        调研结果
                    </div>
                    <div class="panel-body">
                        <div id="morris-area-chart">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover table-striped" id="wsSurveyTable" style="width: 100%">
                                    <thead>
                                    <tr role = "row" id="wsSurveyTableHead">
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.panel -->
            </div>
        </div>

    </div>
</div>

<#include "../pop/common_js.ftl">
<#include "../component/tipsModal.ftl">

<script src="vendor/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
<script src="vendor/datatables/js/jquery.dataTables.js"></script>
<style>
    .row .control-label {
        padding-left: 2px;
    }
    .showSpan{
        margin-top: 5px;
    }
</style>
</body>
<script>
    /**
     * 从cookie中通过name获取cookie
     * @param c_name
     * @returns {string}
     */
    function getCookie(c_name)
    {
        if (document.cookie.length>0)
        {
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1;
              var c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return document.cookie.substring(c_start,c_end);
            }
        }
        return "";
    }
    //从cookie获取查询条件
    var wscxtj = JSON.parse(getCookie("wscxtj"));
    $("#jarqStart").html(wscxtj.jarqStart);
    $("#jarqEnd").html(wscxtj.jarqEnd)
    $("#ajlb").html(wscxtj.ajxz)
    $("#jbfy").html(wscxtj.bafy)
    $("#cbbm").html(wscxtj.cbbm)
    $("#spcx").html(wscxtj.spcx)
    $("#ah").html(wscxtj.ah)
    $("#ajmc").html(wscxtj.ajmc)
    $("#cbr").html(wscxtj.cbrxm)
    $("#ay").html(wscxtj.laay)
    $.ajax({
        url:"getWsBasicInfoSurveyData.do",
        data:JSON.stringify(wscxtj),
        contentType:"application/json",
        method:"POST",
        success:function (result) {
            console.log(result);
            var headArr = result.head;
            var len = headArr.length;
            var headHtml ="";
            for(var i= 0;i <len;i++ ){
                headHtml =headHtml+"<th>"+headArr[i]+"</th>";
            }
            $("#wsSurveyTableHead").html(headHtml);
            $("#wsSurveyTable").dataTable({
                data:result.wsList,
                aLengthMenu:[20,50,100]
            });
        },error:function () {
            $("#tips-body").text("获取信息失败");
            $("#tipsModal").modal('show');
            setTimeout(function () {
                $("#tipsModal").modal('hide');
            },2000)
        }
    })
</script>
</html>
