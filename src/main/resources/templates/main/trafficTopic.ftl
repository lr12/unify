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
                <h1 class="page-header">��ͨ�¹��������</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        �ؼ�����ͼ
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
                        ˾������ͼ�ʻ���ͷ���
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
                        �Ƽ����̷�����
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
    var data=[{"name":"����","value":10000},{"name":"����","value":100},{"name":"����","value":2000},{"name":"����","value":50000}
        ,{"name":"סԺ","value":1000},{"name":"��Ź","value":20000},{"name":"�о�","value":70000},
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
    cloudPicture('�ؼ���',data,'cloud');

    var fytitle='����ֲ�';
    var fyNumData=['18~30','30~40','40~50','50~60','60����'];
    var data=[
        {value:335, name:'18~30'},
        {value:1310, name:'30~40'},
        {value:234, name:'40~50'},
        {value:135, name:'50~60'},
        {value:148, name:'60����'}
    ];
    pie1Picture(fytitle,fyNumData,data,'age');
    var fytitle='�������ͷֲ�';
    var fyNumData=['�γ�','�綯��','����','Ħ�г�','�ͳ�'];
    var data=[
        {value:935, name:'�γ�'},
        {value:210, name:'�綯��'},
        {value:334, name:'����'},
        {value:535, name:'Ħ�г�'},
        {value:348, name:'�ͳ�'}
    ];
    pie1Picture(fytitle,fyNumData,data,'carType');


    var ftDataAxis = ['����ͽ��һ������','����ͽ��һ�굽����','����ͽ�����굽����','����ͽ�����굽����','����ͽ����������','����'];
    var ftData = [
        {value:10, name:'����ͽ��һ������'},
        {value:5, name:'����ͽ��һ�굽����'},
        {value:15, name:'����ͽ�����굽����'},
        {value:25, name:'����ͽ�����굽����'},
        {value:20, name:'����ͽ����������'},
        {value:40, name:'����'}
    ];
    pie2Picture('�̷��ֲ�ͼ',ftDataAxis,ftData,'ft');



</script>

</body>

</html>
