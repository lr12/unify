<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>cpwsdyfxxt</title>


    <style>
        .odometer {
            font-size: 20px;
        }

    </style>
<#include "../pop/common_css.ftl">
</head>

<body>

<div id="wrapper">
    <#include "../component/top.ftl">

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">数据样本管理</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="fa fa-bar-chart-o fa-fw"></i>导入数据样本

                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">

                                    <div class="col-sm-1 control-label" style="width:86px">
                                        <label style="float: right;margin-top: 5px;">
                                            开始日期
                                        </label>
                                    </div>
                                    <div class="col-sm-3">
                                        <div id='jarqStartDiv' class="input-group date form_datetime">
                                            <input type="text" id="jarqStart" name="jarqStart" class="form-control">
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-remove"></span></span>
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-calendar"></span></span>
                                        </div>
                                    </div>
                                    <div class="col-sm-1 control-label" style="width:86px">
                                        <label style="float: right;margin-top: 5px;">
                                            结束日期
                                        </label>
                                    </div>
                                    <div class="col-sm-3">
                                        <div id='jarqEndDiv' class="input-group date form_datetime">
                                            <input type="text" id="jarqEnd" name="jarqEnd" class="form-control">
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-remove"></span></span>
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-calendar"></span></span>
                                        </div>
                                    </div>
                                    <div class="col-sm-2 control-label">
                                         <button  type="button" id='ajcxButton' name='ajcxButton'
                                                   class="btn btn-primary"
                                                   data-toggle="modal"
                                                   data-target="#ajylModal">数据预览
                                    </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <hr/>
                        <div id="morris-area-chart">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr>
                                        <th>案号</th>
                                        <th>文书文件名</th>
                                        <th>案情</th>
                                        <th>裁判理由</th>
                                        <th>结案方式</th>
                                        <th>下载</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>（2015）丽行初字第xxx号</td>
                                        <td>（2015）丽行初字第xxx号行政判决书</td>
                                        <td>xxxx</td>
                                        <td>xxxx</td>
                                        <td>驳回起诉</td>
                                        <td>下载</td>
                                    </tr>
                                    <tr>
                                        <td>（2015）丽行初字第xxx号</td>
                                        <td>（2015）丽行初字第xxx号行政判决书</td>
                                        <td>xxxx</td>
                                        <td>xxxx</td>
                                        <td>驳回起诉</td>
                                        <td>下载</td>
                                    </tr> <tr>
                                        <td>（2015）丽行初字第xxx号</td>
                                        <td>（2015）丽行初字第xxx号行政判决书</td>
                                        <td>xxxx</td>
                                        <td>xxxx</td>
                                        <td>驳回起诉</td>
                                        <td>下载</td>
                                    </tr> <tr>
                                        <td>（2015）丽行初字第xxx号</td>
                                        <td>（2015）丽行初字第xxx号行政判决书</td>
                                        <td>xxxx</td>
                                        <td>xxxx</td>
                                        <td>驳回起诉</td>
                                        <td>下载</td>
                                    </tr> <tr>
                                        <td>（2015）丽行初字第xxx号</td>
                                        <td>（2015）丽行初字第xxx号行政判决书</td>
                                        <td>xxxx</td>
                                        <td>xxxx</td>
                                        <td>驳回起诉</td>
                                        <td>下载</td>
                                    </tr> <tr>
                                        <td>（2015）丽行初字第xxx号</td>
                                        <td>（2015）丽行初字第xxx号行政判决书</td>
                                        <td>xxxx</td>
                                        <td>xxxx</td>
                                        <td>驳回起诉</td>
                                        <td>下载</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <button  type="button" id='ajcxButton' name='ajcxButton'
                                         class="btn btn-primary"
                                         data-toggle="modal"
                                         data-target="#ajylModal" style="float: right">数据导入
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- /.panel-body -->
                </div>

            </div>
            <!-- /.panel -->

        </div>
        <!-- /.col-lg-8 -->

    </div>
    <!-- /.row -->
</div>
<!-- /#page-wrapper -->

</div>
<!-- /#wrapper -->
<!--
<div class="odometer">3252</div> -->
<#include "../component/modal.ftl">
<#include "../pop/common_js.ftl">

<script>
    window.odometerOptions = {
        format: '(ddd).dd'
    };
</script>
<script>
       // $("#upUser").modal();
</script>
<!-- <script>
  setTimeout(function(){
    $('.odometer').html(423234234);
  }, 1000);
</script> -->
</body>

</html>
