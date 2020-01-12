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
                <h1 class="page-header">交通事故主题调研</h1>
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
                        司机年龄和驾驶车型分析
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                            <div class="col-sm-6" >
                        <div id="age" class="panel-body"  style="height:400px;overflow-y:auto">
                        </div>
                            </div>
                                <div class="col-sm-6" >
                                    <div id="carType" class="panel-body" style="height:400px;overflow-y:auto">
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
                        酒驾与刑罚分析
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

    var fytitle='年龄分布';
    var fyNumData=['18~30','30~40','40~50','50~60','60以上'];
    var data=[
        {value:335, name:'18~30'},
        {value:1310, name:'30~40'},
        {value:234, name:'40~50'},
        {value:135, name:'50~60'},
        {value:148, name:'60以上'}
    ];
    pie1Picture(fytitle,fyNumData,data,'age');
    var fytitle='车辆类型分布';
    var fyNumData=['轿车','电动车','货车','摩托车','客车'];
    var data=[
        {value:935, name:'轿车'},
        {value:210, name:'电动车'},
        {value:334, name:'货车'},
        {value:535, name:'摩托车'},
        {value:348, name:'客车'}
    ];
    pie1Picture(fytitle,fyNumData,data,'carType');


    var ftDataAxis = ['有期徒刑一年以下','有期徒刑一年到两年','有期徒刑两年到三年','有期徒刑三年到四年','有期徒刑四年以上','拘役'];
    var ftData = [
        {value:10, name:'有期徒刑一年以下'},
        {value:5, name:'有期徒刑一年到两年'},
        {value:15, name:'有期徒刑两年到三年'},
        {value:25, name:'有期徒刑三年到四年'},
        {value:20, name:'有期徒刑四年以上'},
        {value:40, name:'拘役'}
    ];
    pie2Picture('刑罚分布图',ftDataAxis,ftData,'ft');



</script>

</body>

</html>
