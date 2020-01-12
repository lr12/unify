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
    <link rel="stylesheet" href="vendor/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="vendor/ztree/css/zTreeStyle/zTreeStyle.css">
    <link rel="stylesheet" href="vendor/datatables/css/jquery.dataTables.css">
</head>

<body>

<div id="wrapper">
    <#include "../component/top.ftl">

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">文书基础信息调研</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <#--调研目的-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        调研目的
                    </div>
                    <div class="panel-body">
                        <form role="form">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                调研名称
                                            </label>
                                        </div>
                                        <div class="col-sm-11">
                                            <input class="form-control"
                                                   placeholder="请输入调研名称" id='dymc' />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                调研简称
                                            </label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input class="form-control"
                                                   placeholder="请输入调研名称" id="dyjc" />
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                专题类型
                                            </label>
                                        </div>
                                        <div class="col-sm-5">
                                            <select class="form-control" id='ztlx'name="jklx" id="jklx">
                                                <option value="司法研究">司法研究</option>
                                                <option value="社会综治">社会综治</option>
                                            </select>
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
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
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

                                        <div class="col-sm-1 control-label">
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
                                        <div class="col-sm-1 control-label">
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
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案件类别
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="ajxz" id="ajxz">
                                                <option value=""></option>
                                                <option value="100000">刑事</option>
                                                <option value="200000">民事</option>
                                                <option value="600000">行政</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                经办法院
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="bafy" id="bafy">
                                            </select>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                承办部门
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="cbbm" id="cbbm">
                                            </select>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                审判程序
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="spcx" id="spcx">
                                                <option value=""></option>
                                                <option value="1">一审</option>
                                                <option value="2">二审</option>
                                                <option value="3">再审</option>
                                            </select>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案号
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <input class="form-control"
                                                   placeholder="" id="ah" name="ah"/>

                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案件名称
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <input class="form-control"
                                                   placeholder="" id="ajmc" name="ajmc"/>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                承办人
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <input class="form-control"
                                                   placeholder="" id="cbrxm" name="cbrxm"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-lg-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                案由
                                            </label>
                                        </div>
                                        <div class="col-lg-7">
                                            <input data-toggle="modal" id='laay' name='laay' data-target="#zTreeModal"
                                                   class="form-control"
                                                   placeholder=""/>
                                        </div>
                                        <div class="col-lg-4 control-label">
                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                    class="btn btn-primary"
                                                     data-toggle="modal"
                                                    data-target="#ajylModal">案件预览
                                            </button>
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
        <#--展示查询统计-->
        <div class="modal fade" id="ajylModal"
             tabindex="-1" role="dialog" aria-hidden="true"
             aria-labelledby="ajylModalLabel">
            <div class="modal-dialog" style="width: 800px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="ajylModalTitle">
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div style="height: 500px;overflow: auto;">
                        <table id="ajcxDataTable" style="visibility:hidden" class="dataTable" border="1">
                            <thead id = 'headDataTable' >
                            <tr>
                                <th>案件序号</th>
                                <th>案号</th>
                                <th>案件名称</th>
                                <th>案件性质</th>
                                <th>审判程序</th>
                                <th>立案日期</th>
                                <th>结案日期</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->

        </div>
        <#--调研内容展示-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        调研展示内容
                    </div>
                    <div class="panel-body">
                        <form role="form" id="wsnrzsForm">
                            <#--<div class="row">-->
                                <#--<div class="col-lg-12">-->
                                    <#--<div class="form-group">-->
                                        <#--<div class="col-sm-2 control-label">-->
                                            <#--<label style="float: right;">-->
                                                <#--文首-->
                                            <#--</label>-->
                                        <#--</div>-->
                                        <#--<div class="col-sm-10">-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">全部-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">经办法院-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">文书名称-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案号-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">文书种类-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案件性质-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">审判程序-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案件类型-->
                                            <#--</label>-->

                                        <#--</div>-->
                                    <#--</div>-->
                                <#--</div>-->

                            <#--</div>-->
                            <#--<br/>-->
                            <#--<div class="row">-->
                                <#--<div class="col-lg-12">-->
                                    <#--<div class="form-group">-->

                                        <#--<div class="col-sm-2 control-label">-->
                                            <#--<label style="float: right;">-->
                                                <#--诉讼参与人-->
                                            <#--</label>-->
                                        <#--</div>-->
                                        <#--<div class="col-sm-10">-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">全部-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">诉讼人姓名-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">诉讼身份-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">当事人类型-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">民族-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">出生日期-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">证件类型-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">证件号码-->
                                            <#--</label>-->

                                        <#--</div>-->


                                    <#--</div>-->
                                <#--</div>-->

                            <#--</div>-->
                            <#--<br/>-->
                            <#--<div class="row">-->
                                <#--<div class="col-lg-12">-->
                                    <#--<div class="form-group">-->

                                        <#--<div class="col-sm-2 control-label">-->
                                            <#--<label style="float: right;">-->
                                                <#--诉讼记录-->
                                            <#--</label>-->
                                        <#--</div>-->
                                        <#--<div class="col-sm-10">-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">全部-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案由-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案件来源-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案件涉及-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">案件涉及-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">前审法院-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">开庭审理信息-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">不公开审理原因-->
                                            <#--</label>-->

                                        <#--</div>-->


                                    <#--</div>-->
                                <#--</div>-->

                            <#--</div>-->
                            <#--<br/>-->
                        </form>
                        <!-- /.row (nested) -->
                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <div class="row">
            <div >
                <button  type="button" id="dyButton"
                         class="btn btn-info btn-lg"
                         style="float:right;margin-bottom: 40px;margin-right: 20px;">
                     <a href="wsBasicInfoSurveyShow.do" style="color: white;" target="_blank" onclick="setCookie()">开始调研</a>
                </button>
            </div>
        </div>
    <#--ztreeModal-->
        <!-- 模态框（Modal） -->
        <div class="modal fade" id="zTreeModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" >
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="zTreeModalTitle">
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div style="height: 200px;overflow: auto;">
                            <ul id="treeDemo" class="ztree"></ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭
                        </button>
                        <button type="button" id="submit" class="btn btn-primary">
                            提交案由
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

    </div>
</div>
</div>
<#include "../component/modal.ftl">
<#include "../pop/common_js.ftl">
<script src="vendor/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
<script src="vendor/bootstrap-datetimepicker/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="vendor/datatables/js/jquery.dataTables.js"></script>
<#--填充法院和审判庭-->
<script src="js/Ajcx/fillFySpt.js"></script>
<script src="vendor/ztree/js/jquery.ztree.core.js"></script>
<script src="vendor/ztree/js/jquery.ztree.excheck.js"></script>
<#--ztree-->
<script src="js/Ajcx/ayZTree.js"></script>
<script src="js/Ajcx/index.js"></script>
<script src="js/Ajcx/dynrzs.js"></script>
<style>
    #ajcxDataTable th,td{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    #ajcxDataTable{
        table-layout: fixed;
    }
    .row .control-label{
        padding-left: 2px;
    }
</style>
</body>

</html>
