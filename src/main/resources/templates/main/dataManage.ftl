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
                <h1 class="page-header">������������</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row" id="wsDataForm">
            <div class="col-lg-11 ">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ������������
                    </div>
                    <div class="panel-body">

                        <form role="form" id="wsDataForm">
                            <div class="row">
                                <div class="col-lg-11 col-md-offset-1">
                                    <div class="form-group">
                                        <div class="col-sm-2 control-label">
                                            <label style="float: right;margin-top: 5px">
                                                �������
                                            </label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input class="form-control"
                                                   placeholder="�������������"/>
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
                                                ��������
                                            </label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input class="form-control"
                                                   placeholder="�������������"/>
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
                                                ��������
                                            </label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input class="form-control"
                                                   placeholder="�����������ϸ����"/>
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
                                                ��������
                                            </label>
                                        </div>
                                        <div class="col-sm-7">
                                            <select class="form-control" name="jklx" id="jklx">
                                                <option>����</option>
                                                <option>���ϲ�����</option>
                                                <option>���ϼ�¼</option>
                                                <option>�����������</option>
                                                <option>���з�������</option>
                                                <option>���н��</option>
                                                <option>��β</option>
                                                <option>����ģ��</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br/>
                            <div class="row">
                                <div class="col-lg-8 col-md-offset-1">
                                    <button type="button" class="btn btn-primary" id="saveDataBtn"
                                            style="float:right;margin-bottom:10px;width:70px">����
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
