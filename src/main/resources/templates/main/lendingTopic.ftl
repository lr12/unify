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
                <h1 class="page-header">民间借贷主题调研</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        欠款金额
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
                        离婚纠纷分析
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
                        <#--离婚纠纷结果分析-->
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

    // 借款金额
    var lendingMoneyAnalysisTitle='借款金额';
    var lendingMoneyAnalysisX=['1000~1万','1万~10万','10万~50万','50万~100万','100万以上'];
    var lendingMoneyAnalysisY=[
        {name:'1000~1万',value:1000},
        {name:'1万~10万',value:3000},
        {name:'10万~50万',value:1500},
        {name:'50万~100万',value:1000},
        {name:'100万以上',value:500}

    ];
    pie1Picture(lendingMoneyAnalysisTitle,lendingMoneyAnalysisX,lendingMoneyAnalysisY,'lendingMoneyAnalysis');

    //借款原因
    var lendingReasonTitle = '欠款原因'
    var lendingReasonX = ['房屋','私人','其它']
    var lendingReasonY = [
        {name:'房屋',value:500},
        {name:'私人',value:1000},
        {name:'其它',value:123}
    ]
    pie2Picture(lendingReasonTitle,lendingReasonX,lendingReasonY,'lendingReasonAnalysis')

</script>

</body>

</html>
