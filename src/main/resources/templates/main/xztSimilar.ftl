<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>cpwsdyfxxt</title>
    <#include "../pop/common_css.ftl">
    <link rel="stylesheet" type="text/css" href="dist/css/webuploader.css">
    <link rel="stylesheet" type="text/css" href="vendor/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">
    <link href="vendor/datatables/css/dataTables.bootstrap.css" rel="stylesheet" type="text/css">
    <link href="vendor/bootstrap-multiselect/css/bootstrap-multiselect.css" rel="stylesheet" type="text/css">
</head>

<body>

<div id="wrapper">
    <#include "../component/top.ftl">

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">行政庭文书相似度调研</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        填写详情
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-1 control-label" style="float:left;padding:2px">
                                        <label style="margin-top: 5px">
                                            开始日期
                                        </label>
                                    </div>
                                    <div class="col-sm-2">
                                        <input class="form-control form_datetime" id="jarqStart" type="text" value="2018-12-1"
                                               placeholder="请选择开始日期">
                                    </div>
                                    <div class="col-sm-1 control-label" style="padding:2px">
                                        <label style="float: right;margin-top: 5px">
                                            结束日期
                                        </label>
                                    </div>
                                    <div class="col-sm-2">
                                        <input class="form-control form_datetime" id="jarqEnd" type="text" value="2018-12-31"
                                               placeholder="请选择开始日期">
                                    </div>
                                    <div class="col-sm-1 control-label"  style="padding:2px">
                                        <label style="float: right;margin-top: 5px">
                                            选择法院
                                        </label>
                                    </div>
                                    <div class="col-sm-2" style="width: 23%">
                                        <select class="form-control col-lg-6" name="fySel" id="fySel">
                                            <#list fyList as fy>
                                                <option value="${fy.codeValue}">${fy.remark}</option>
                                            </#list>
                                        </select>
                                    </div>
                                    <div class="col-lg-2 control-label">
                                        <button type="button" id="submitBtn" name="" class="btn btn-primary">提交
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <!-- 导航区 -->
                        <ul class="nav nav-pills" role="tablist">
                            <li role="presentation" class="active"><a href="#home" data-toggle="tab">本院认为</a></li>
                            <li role="presentation"><a href="#profile" data-toggle="tab">案件基本情况</a></li>
                        </ul>
                        <!-- 面板区 -->
                        <div class="tab-content" style="margin-top: 10px;">
                            <div role="tabpanel" class="tab-pane active" id="home">
                                <div id="morris-area-chart">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-hover table-striped" id="ahTable"
                                               style="width: 100%">
                                            <thead>
                                            <tr role="row" style="text-align: center">
                                                <th>案号</th>
                                                <th>案件名称</th>
                                                <th>立案日期</th>
                                                <th>结案日期</th>
                                                <th>审判长</th>
                                                <th>承办人</th>
                                                <th>合议庭成员</th>
                                                <th>书记员</th>
                                                <th>法官助理</th>
                                                <th>本院认为</th>
                                                <th>相似度</th>
                                            </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="profile">
                                <div id="morris-area-chart">
                                    <div class="table-responsive" style="width: 100%">
                                        <table class="table table-bordered table-hover table-striped" id="jbqkTable"
                                               style="width: 100%">
                                        <#--<table class="table table-striped table-bordered dataTable no-footer" id="viewWsData">-->
                                            <thead>
                                            <tr role="row" style="text-align: center">
                                                <th>案号</th>
                                                <th>案件名称</th>
                                                <th>立案日期</th>
                                                <th>结案日期</th>
                                                <th>审判长</th>
                                                <th>承办人</th>
                                                <th>合议庭成员</th>
                                                <th>书记员</th>
                                                <th>法官助理</th>
                                                <th>本院认为</th>
                                                <th>相似度</th>
                                            </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- /.panel -->
</div>
<#include "../component/modal.ftl">
<#include "../pop/common_js.ftl">
<script src="vendor/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
<script src="vendor/datatables/js/jquery.dataTables.js"></script>
<script src="vendor/datatables/js/dataTables.bootstrap.js"></script>
<script src="vendor/bootstrap-multiselect/js/bootstrap-multiselect.js"></script>
<script src ="js/dataTableSetting.js"></script>
<script src="js/Similarity/xztSimilarity.js"></script>
<style>
    table thead th {
        text-align: center;
    }
    th, td { white-space: nowrap; }
    #ahTable_filter{
        text-align: left;
        margin-left: 30%;
    }
    .selectPickerLabel{
        text-align: left;
        margin-left: 3%;
    }
</style>
<script>
    var init = true;      //记录案件基本情况标签 是否为第一次点击 避免重复加载数据
    /**
     * 案件基本情况标签点击事件
     */
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        if(e.target.text==='案件基本情况'){// 激活案件基本情况
            if (init){
                $.ajax({
                    url: 'getXztSimilarity.do',               // todo 立案文书无数据 先改为结案文书
                    method: 'GET',
                    contentType: 'application/json',
                    data:{
                        jarqStart:$("#jarqStart").val(),
                        jarqEnd:$("#jarqEnd").val(),
                        fydm:$("#fySel option:selected").val()
                    },
                    success: function (result) {
                        jbqkTable.clear();
                        jbqkTable.rows.add(result).draw();
                        init = false;
                        // $("#page-wrapper").hideLoading();
                    }
                })
            }
        }
    });
</script>
</body>
</html>
