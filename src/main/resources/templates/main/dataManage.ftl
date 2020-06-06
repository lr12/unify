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
                <h1 class="page-header">文书数据配置</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row" id="wsDataForm">
            <div class="col-lg-11 ">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        文书数据配置
                    </div>
                    <div class="panel-body">

                        <form role="form" id="wsDataForm">
                            <div class="row">
                                <div class="col-lg-11 col-md-offset-1">
                                    <div class="form-group">
                                        <div class="col-sm-2 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                文书代码
                                            </label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input class="form-control"
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
                                            <input class="form-control"
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
                                            <input class="form-control"
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

                            <br/>
                            <div class="row">
                                <div class="col-lg-8 col-md-offset-1">
                                    <button type="button" class="btn btn-primary" id="saveDataBtn"
                                            style="float:right;margin-bottom:10px;width:70px">保存
                                    </button>
                                </div>
                            </div>
                        </form>

                        <!-- /.row (nested) -->
                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>

        <br/>
    </div>

</div>
<!-- /.panel -->
</div>
<#--<#include "../component/modal.ftl">-->
<#include "../pop/common_js.ftl">
<#include "../component/tipsModal.ftl">
<script src="js/Wssjx/addWssjx.js"></script>
</body>
</html>
