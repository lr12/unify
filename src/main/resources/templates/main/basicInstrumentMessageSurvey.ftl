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
                <h1 class="page-header">���������Ϣ����</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <#--����Ŀ��-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ����Ŀ��
                    </div>
                    <div class="panel-body">
                        <form role="form">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                ��������
                                            </label>
                                        </div>
                                        <div class="col-sm-11">
                                            <input class="form-control"
                                                   placeholder="�������������" id='dymc' />
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
                                                ���м��
                                            </label>
                                        </div>
                                        <div class="col-sm-5">
                                            <input class="form-control"
                                                   placeholder="�������������" id="dyjc" />
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                ר������
                                            </label>
                                        </div>
                                        <div class="col-sm-5">
                                            <select class="form-control" id='ztlx'name="jklx" id="jklx">
                                                <option value="˾���о�">˾���о�</option>
                                                <option value="�������">�������</option>
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
        <#--��������-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ��������
                    </div>
                    <div class="panel-body">
                        <form role="form">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">

                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px;">
                                                ��ʼ����
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
                                                ��������
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
                                                �������
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="ajxz" id="ajxz">
                                                <option value=""></option>
                                                <option value="100000">����</option>
                                                <option value="200000">����</option>
                                                <option value="600000">����</option>
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
                                                ���취Ժ
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="bafy" id="bafy">
                                            </select>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                �а첿��
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="cbbm" id="cbbm">
                                            </select>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                ���г���
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <select class="form-control" name="spcx" id="spcx">
                                                <option value=""></option>
                                                <option value="1">һ��</option>
                                                <option value="2">����</option>
                                                <option value="3">����</option>
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
                                                ����
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <input class="form-control"
                                                   placeholder="" id="ah" name="ah"/>

                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                ��������
                                            </label>
                                        </div>
                                        <div class="col-sm-3">
                                            <input class="form-control"
                                                   placeholder="" id="ajmc" name="ajmc"/>
                                        </div>
                                        <div class="col-sm-1 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                �а���
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
                                                ����
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
                                                    data-target="#ajylModal">����Ԥ��
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
        <#--չʾ��ѯͳ��-->
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
                                <th>�������</th>
                                <th>����</th>
                                <th>��������</th>
                                <th>��������</th>
                                <th>���г���</th>
                                <th>��������</th>
                                <th>�᰸����</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">�ر�
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->

        </div>
        <#--��������չʾ-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ����չʾ����
                    </div>
                    <div class="panel-body">
                        <form role="form" id="wsnrzsForm">
                            <#--<div class="row">-->
                                <#--<div class="col-lg-12">-->
                                    <#--<div class="form-group">-->
                                        <#--<div class="col-sm-2 control-label">-->
                                            <#--<label style="float: right;">-->
                                                <#--����-->
                                            <#--</label>-->
                                        <#--</div>-->
                                        <#--<div class="col-sm-10">-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">ȫ��-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">���취Ժ-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">��������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">����-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">��������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">��������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">���г���-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">��������-->
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
                                                <#--���ϲ�����-->
                                            <#--</label>-->
                                        <#--</div>-->
                                        <#--<div class="col-sm-10">-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">ȫ��-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">����������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">�������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">����������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">����-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">��������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">֤������-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">֤������-->
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
                                                <#--���ϼ�¼-->
                                            <#--</label>-->
                                        <#--</div>-->
                                        <#--<div class="col-sm-10">-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">ȫ��-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">����-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">������Դ-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">�����漰-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">�����漰-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">ǰ��Ժ-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">��ͥ������Ϣ-->
                                            <#--</label>-->
                                            <#--&nbsp;&nbsp;-->
                                            <#--<label>-->
                                                <#--<input type="checkbox" value="">����������ԭ��-->
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
                     <a href="wsBasicInfoSurveyShow.do" style="color: white;" target="_blank" onclick="setCookie()">��ʼ����</a>
                </button>
            </div>
        </div>
    <#--ztreeModal-->
        <!-- ģ̬��Modal�� -->
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
                        <button type="button" class="btn btn-default" data-dismiss="modal">�ر�
                        </button>
                        <button type="button" id="submit" class="btn btn-primary">
                            �ύ����
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
<#--��䷨Ժ������ͥ-->
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
