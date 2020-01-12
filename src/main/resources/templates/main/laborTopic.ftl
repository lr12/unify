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
                <h1 class="page-header">劳动合同主题调研</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        性别和年龄分布
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-6">
                                        <div id="laborSexAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div id="laborAgeAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        劳动争议多发公司聚焦
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-12" >
                                        <div id="laborCompanyAnalysis" class="panel-body"  style="height:400px;overflow-y:auto">
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
    var laborSexTitle='性别分布';
    var laborSexX=['男','女'];
    var laborSexY=[
        {name:'男',value:1000},
        {name:'女',value:3000}
    ];
    pie1Picture(laborSexTitle,laborSexX,laborSexY,'laborSexAnalysis');

    //借款原因
    var laborAgeTitle = '年龄分布'
    var laborAgeX = ['18-30','30-40','40-50','50以上']
    var laborAgeY = [
        {name:'18-30',value:500},
        {name:'30-40',value:1000},
        {name:'40-50',value:123},
        {name:'50以上',value:130}
    ]
    pie2Picture(laborAgeTitle,laborAgeX,laborAgeY,'laborAgeAnalysis')
    //借款原因
    var laborCompanyTitle = '公司分布'
    var laborCompanyX = ['某商贸有限责任公司','某网络科技有限公司',
        '某时装有限公司','某科技股份有限公司',
        '某木业有限公司','某木业有限公司']
    var laborCompanyY = [120,340,240,190,140,300]
    barGraph(laborCompanyTitle,laborCompanyX,laborCompanyY,'laborCompanyAnalysis')

</script>

</body>

</html>
