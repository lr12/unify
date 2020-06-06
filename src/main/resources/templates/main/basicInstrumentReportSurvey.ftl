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
                <h1 class="page-header">文书基础报告调研</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        关键字云图
                    </div>
                    <div class="panel-body">
                        <div id="cloud"  style="height:400px;overflow-y:auto">
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
                        文首图表
                    </div>
                    <div class="panel-body">
                        <div id="fy"  style="height:400px;overflow-y:auto">
                        </div>

                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        诉讼参与人图表
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                            <div class="col-sm-6" >
                        <div id="sex" class="panel-body"  style="height:400px;overflow-y:auto">
                        </div>
                            </div>
                                <div class="col-sm-6" >
                                    <div id="age" class="panel-body" style="height:400px;overflow-y:auto">
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

        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        裁判分析过程图表
                    </div>
                    <div class="panel-body">
                        <div id="ft" class="panel-body" style="height:400px;overflow-y:auto">
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
<
<script>
    var fytitle='文书法院分布';
    var fyNumData=['天津高院','一中院','二中院','南开法院','河西法院'];
    var data=[
        {value:335, name:'天津高院'},
        {value:310, name:'一中院'},
        {value:234, name:'二中院'},
        {value:135, name:'南开法院'},
        {value:1548, name:'河西法院'}
    ];
    pie1Picture(fytitle,fyNumData,data,'fy');


    var ageDataAxis = ['20以下','20~30', '30~40', '40~50', '50~60', '60以上' ];
    var ageData = [100,220, 182, 191, 234, 290];

    barPicture('年龄分布图',ageData,ageDataAxis,'age');

    var ftDataAxis = ['1','2', '3', '4', '5', '6','7','8','9','9以上' ];
    var ftData = [100,220, 182, 191, 234, 290,100,231,30,41];
    barPicture('引用法条分布图',ftData,ftDataAxis,'ft');

    var sexData=[
        {value:335, name:'男'},
        {value:310, name:'女'},

    ];
    var numData=['男','女'];
    var pointName='诉讼参与人性别';
    piePicture('性别分布图',pointName,numData,sexData,'sex');
    var data=[{"name":"纠纷","value":10000},{"name":"车辆","value":100},{"name":"诉讼","value":2000},{"name":"车祸","value":50000}
        ,{"name":"住院","value":1000},{"name":"斗殴","value":20000},{"name":"判决","value":70000},
        {
            name: 'Macys',
            value: 6181
        },
        {
            name: 'Amy Schumer',
            value: 4386
        },
        {
            name: 'Jurassic World',
            value: 4055
        },
        {
            name: 'Charter Communications',
            value: 2467
        },
        {
            name: 'Chick Fil A',
            value: 2244
        },
        {
            name: 'Planet Fitness',
            value: 1898
        },
        {
            name: 'Pitch Perfect',
            value: 1484
        },
        {
            name: 'Express',
            value: 1112
        },
        {
            name: 'Home',
            value: 965
        },
        {
            name: 'Johnny Depp',
            value: 847
        },
        {
            name: 'Lena Dunham',
            value: 582
        },
        {
            name: 'Lewis Hamilton',
            value: 555
        },
        {
            name: 'KXAN',
            value: 550
        },
        {
            name: 'Mary Ellen Mark',
            value: 462
        },
        {
            name: 'Farrah Abraham',
            value: 366
        },
        {
            name: 'Rita Ora',
            value: 360
        },
        {
            name: 'Serena Williams',
            value: 282
        },
        {
            name: 'NCAA baseball tournament',
            value: 273
        },
        {
            name: 'Point Break',
            value: 265
        }];
    cloudPicture('关键词',data,'cloud');

</script>

</body>

</html>
