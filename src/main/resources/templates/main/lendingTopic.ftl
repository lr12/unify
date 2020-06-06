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
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Ƿ����
                    </div>
                    <div class="panel-body">
                        <div id="lendingMoneyAnalysis"  style="height:400px;overflow-y:auto">
                        </div>

                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>


        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        �����׷���
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-12" >
                                        <div id="lendingReasonAnalysis" class="panel-body"  style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <!-- /.panel-body -->
                    </div>
                    <!-- /.panel -->
                </div>
            </div>
            <!-- /.col-lg-12 -->
        </div>

        <#--<div class="row">-->
            <#--<div class="col-lg-12">-->
                <#--<div class="panel panel-default">-->
                    <#--<div class="panel-heading">-->
                        <#--�����׽������-->
                    <#--</div>-->
                    <#--<div class="panel-body">-->
                        <#--<div id="divorseResult" class="panel-body" style="height:400px;overflow-y:auto">-->
                        <#--</div>-->

                    <#--</div>-->
                    <#--<!-- /.panel-body &ndash;&gt;-->
                <#--</div>-->
                <#--<!-- /.panel &ndash;&gt;-->
            <#--</div>-->
            <#--<!-- /.col-lg-12 &ndash;&gt;-->
        <#--</div>-->
    </div>

</div>
<!-- /.panel -->

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

    // �����
    var lendingMoneyAnalysisTitle='�����';
    var lendingMoneyAnalysisX=['1000~1��','1��~10��','10��~50��','50��~100��','100������'];
    var lendingMoneyAnalysisY=[
        {name:'1000~1��',value:1000},
        {name:'1��~10��',value:3000},
        {name:'10��~50��',value:1500},
        {name:'50��~100��',value:1000},
        {name:'100������',value:500}

    ];
    pie1Picture(lendingMoneyAnalysisTitle,lendingMoneyAnalysisX,lendingMoneyAnalysisY,'lendingMoneyAnalysis');

    //���ԭ��
    var lendingReasonTitle = 'Ƿ��ԭ��'
    var lendingReasonX = ['����','˽��','����']
    var lendingReasonY = [
        {name:'����',value:500},
        {name:'˽��',value:1000},
        {name:'����',value:123}
    ]
    pie2Picture(lendingReasonTitle,lendingReasonX,lendingReasonY,'lendingReasonAnalysis')

</script>

</body>

</html>
