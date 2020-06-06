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
    <link href="vendor/datatables/css/dataTables.bootstrap.css" rel="stylesheet" type="text/css">

</head>

<body>

<div id="wrapper">
    <#include "../component/top.ftl">

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">文书数据配置</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="fa fa-bar-chart-o fa-fw"></i> 查看数据项
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div id="morris-area-chart">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover table-striped" id="viewWsData" style="width: 100%">
                                    <thead>
                                    <tr role = "row">
                                        <th>文书代码</th>
                                        <th>代码名称</th>
                                        <th>代码描述</th>
                                        <th>所属段落</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                    <!-- /.panel-body -->
                </div>
            </div>
            <!-- /.panel -->
        </div>
    </div>
</div>
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">文书数据配置</h4>
            </div>
            <div class="modal-body">
            <#--填充内容在此处-->
                <form role="form" id="wsDataForm" action="updateDataManage.do" method="post">
                    <div class="row">
                        <div class="col-lg-11 col-md-offset-1">
                            <div class="form-group">
                                <div class="col-sm-2 control-label">
                                    <label style="float: right;margin-top: 5px">
                                        文书代码
                                    </label>
                                </div>
                                <div class="col-sm-7">
                                    <input class="form-control" id="wsdmInput"
                                           placeholder="请输入文书代码"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-lg-11 col-md-offset-1">
                            <div class="form-group">
                                <div class="col-sm-2 control-label">
                                    <label style="float: right;margin-top: 5px">
                                        代码名称
                                    </label>
                                </div>
                                <div class="col-sm-7">
                                    <input class="form-control" id="dmmcInput"
                                           placeholder="请输入代码名称"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-lg-11 col-md-offset-1">
                            <div class="form-group">
                                <div class="col-sm-2 control-label">
                                    <label style="float: right;margin-top: 5px">
                                        代码描述
                                    </label>
                                </div>
                                <div class="col-sm-7">
                                    <input class="form-control" id="dmmsInput"
                                           placeholder="请输入代码详细描述"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-lg-11 col-md-offset-1">
                            <div class="form-group">
                                <div class="col-sm-2 control-label">
                                    <label style="float: right;margin-top: 5px">
                                        所属段落
                                    </label>
                                </div>
                                <div class="col-sm-7">
                                    <select class="form-control" name="jklx" id="jklx">
                                        <option></option>
                                        <option>文首</option>
                                        <option>诉讼参与人</option>
                                        <option>诉讼记录</option>
                                        <option>案件基本情况</option>
                                        <option>裁判分析过程</option>
                                        <option>裁判结果</option>
                                        <option>文尾</option>
                                        <option>文书模型</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" id="updateData">提交更改</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>
<!-- /.panel -->
<!-- /#wrapper -->
<!--
<div class="odometer">3252</div> -->
<#--<#include "../component/modal.ftl">-->
<#include "../pop/common_js.ftl">
<#include "../component/tipsModal.ftl">
<style>
    .editItem:hover{
        cursor: pointer;
    }
    .deleteItem:hover{
        cursor: pointer;
    }
</style>

<script src="vendor/datatables/js/jquery.dataTables.js"></script>
<script src="vendor/datatables/js/dataTables.bootstrap.js"></script>
<script src ="js/dataTableSetting.js"></script>
<script src="js/Wssjx/viewWssjx.js"></script>
</body>
</html>
