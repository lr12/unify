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
                <h1 class="page-header">刑事主题调研</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
    <#--犯罪人群分析-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        犯罪人群分析
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-6" >
                                        <div id="sexAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="ageAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="educationAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="accusedAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="workAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="nativeplaceAnalysis" style="height:400px;overflow-y:auto">
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

    <#--主刑分析-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        主刑分析
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-12">
                                        <div id="pepaltyAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <div id="probationAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
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

    <#--罪行分析-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        罪行分析
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-12">
                                        <div id="crimeAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
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
    <#--罚金分析-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        罚金分析
                    </div>
                    <div class="panel-body">
                        <div id="fineAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                        </div>

                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
    <#--犯罪时间-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        犯罪时间
                    </div>
                    <div class="panel-body">
                        <div id="crimeTimeAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                        </div>

                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
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
    /*   $("#upUser").modal(); */
</script>

<script>
    var sexTitle = '性别分布'
    var sexX = ['男','女']
    var sexY = [
        {name: '男', value: 190},
        {name: '女', value: 230}
    ]
    pie1Picture(sexTitle, sexX, sexY, 'sexAnalysis');

    var ageTitle = '年龄分布'
    var ageX = ['18-30','30-40','40-50','50以上']
    var ageY =[190, 230,450,230]
    barPicture(ageTitle, ageY, ageX, 'ageAnalysis')

    var educationTitle = '文化分布'
    var educationX = ['小学', '中学', '高中', '本科']
    var educationY = [120,234,454,132,14]
    brokenLine(educationTitle, educationX, educationY, 'educationAnalysis')

    var accusedTitle = '被告人数'
    var accusedX = ['单人', '2-4人', '3人以上']
    var accusedY = [
        {name:'单人',value:780},
        {name:'2-4人',value:120},
        {name:'3人以上',value:230}
    ]
    DoughnutPie(accusedTitle, accusedX, accusedY, 'accusedAnalysis')

    var workTitle = '职业分布'
    var workX = ['工人', '农民', '职工','老师']
    var workY = [120,232,450,90]
    horizonalBar(workTitle, workX, workY, 'workAnalysis')

    var nativeplaceTitle = '籍贯分布'
    var nativeplaceX = ['河北','天津','山东','河北','北京','内蒙古']
    var nativeplaceY = [190, 2000, 120, 450, 120, 40]
    simpleBar(nativeplaceTitle, nativeplaceX, nativeplaceY, 'nativeplaceAnalysis');

    var pepaltyTitle = '刑罚分布图'
    var pepaltyX = ['有期徒刑一年以下','有期徒刑一年到两年','有期徒刑两年到三年','有期徒刑三年到四年','有期徒刑四年以上','拘役'];
    var pepaltyY = [
        {value:10, name:'有期徒刑一年以下'},
        {value:5, name:'有期徒刑一年到两年'},
        {value:15, name:'有期徒刑两年到三年'},
        {value:25, name:'有期徒刑三年到四年'},
        {value:20, name:'有期徒刑四年以上'},
        {value:40, name:'拘役'}
    ];
    pie2Picture(pepaltyTitle,pepaltyX,pepaltyY,'pepaltyAnalysis');

    // 是否缓刑
    var probationTitle = '缓刑分布'
    var probationX = ['缓刑','立即执行']
    var probationY = [
        {name: '缓刑', value: 190},
        {name: '立即执行', value: 230}
    ]
    pie1Picture(probationTitle, probationX, probationY, 'probationAnalysis');
    // 罪行分布 crimeAnalysis
    var crimeTitle = '罪行分布'
    var crimeX = ['故意伤害罪','盗窃罪','故意杀人罪','放火罪','投毒罪','其它']
    var crimeY = [
        {name: '故意伤害罪', value: 190},
        {name: '盗窃罪', value: 430},
        {name: '故意杀人罪', value: 600},
        {name: '放火罪', value: 500},
        {name: '投毒罪', value: 450},
        {name: '其它', value: 200}
    ]
    pie1Picture(crimeTitle, crimeX, crimeY, 'crimeAnalysis');
    // 罚金分析 fineAnalysis
    var fineTitle = '罚金分布'
    var fineX = ['1000-3000','3000-7000','8000-10000','10000以上']
    var fineY = [190, 2000, 120, 450]
    simpleBar(fineTitle, fineX, fineY, 'fineAnalysis');
    // 犯罪时间 crimeTimeAnalysis
    var crimeTimeTitle = '犯罪时间'
    var crimeTimeX = ['早上','中午','下午','晚上', '凌晨']
    var crimeTimeY = [190, 2000, 1000, 2000, 2500]
    barGraph(crimeTimeTitle, crimeTimeX, crimeTimeY, 'crimeTimeAnalysis');
</script>

</body>

</html>
