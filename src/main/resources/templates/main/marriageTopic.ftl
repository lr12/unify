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
                <h1 class="page-header">�������������</h1>
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
                        �����׷���
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-6" >
                                        <div id="marriageAge" class="panel-body"  style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="isFirstMarriage" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="divorseSex" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="hasChildren" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="meetWay" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="isFirstPutDivorse" class="panel-body" style="height:400px;overflow-y:auto">
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
                        �����׽������
                    </div>
                    <div class="panel-body">
                        <div id="divorseResult" class="panel-body" style="height:400px;overflow-y:auto">
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
    var data=[
        {name:"���鲻��",value:10000},
        {name:"�Ը�",value:100},
        {name:"�־�",value:2000},
        {name:"Ƣ������",value:50000},
        {name:"ȱ���˽�",value:1000},
        {name:"��������",value:1000},
        {name:"ʧ��",value:1000}
        ];
    cloudPicture('�ؼ���',data,'cloud');

    // ���������
    var marriageAgetitle='���������';
    var marriageAgeNumData=['0~7','8~15','16~25','26~35','35����'];
    var marriageAgedata=[
        {value:335, name:'0~7'},
        {value:1310, name:'8~15'},
        {value:234, name:'16~25'},
        {value:135, name:'26~35'},
        {value:148, name:'35����'}
    ];
    pie1Picture(marriageAgetitle,marriageAgeNumData,marriageAgedata,'marriageAge');

    // �����ٻ�ֲ�
    var isFirstMarriageTitle='�����ٻ�ֲ�';
    var isFirstMarriageNumData=['����','�ٻ�'];
    var isFirstMarriagedata=[
        {value:935, name:'����'},
        {value:210, name:'�ٻ�'}
    ];
    pie1Picture(isFirstMarriageTitle,isFirstMarriageNumData,isFirstMarriagedata,'isFirstMarriage');


    // ��������Ů����
    var divorseSextitle='��������Ů����';
    var divorseSexNumData=['����','Ů��'];
    var divorseSexdata=[
        {value:210, name:'����'},
        {value:935, name:'Ů��'}
    ];
    pie1Picture(divorseSextitle,divorseSexNumData,divorseSexdata,'divorseSex');

    // ��������Ů����
    var hasChildrentitle='����������Ƿ�����Ů';
    var hasChildrenNumData=['��','��'];
    var hasChildrendata=[
        {value:500, name:'��'},
        {value:678, name:'��'}
    ];
    pie1Picture(hasChildrentitle,hasChildrenNumData,hasChildrendata,'hasChildren');
    // meetWay
    //�����ʶ;��
    var meetWaytitle='������ʶ;��';
    var meetWayNumData=['����','��������','������ʶ'];
    var meetWaydata=[
        {value:500, name:'����'},
        {value:678, name:'��������'},
        {value:100, name:'������ʶ'}
    ];
    pie1Picture(meetWaytitle,meetWayNumData,meetWaydata,'meetWay');

    //�Ƿ��һ��������
    var isFirstPutDivorsetitle='�Ƿ��һ��������';
    var isFirstPutDivorseNumData=['��','��'];
    var isFirstPutDivorsedata=[
        {value:500, name:'��'},
        {value:200, name:'��'}
    ];
    pie1Picture(isFirstPutDivorsetitle,isFirstPutDivorseNumData,isFirstPutDivorsedata,'isFirstPutDivorse');

    // �����
    var divorseResult = ['���ɹ�','���ʧ��'];
    var divorseResultData = [
        {value:123, name:'���ɹ�'},
        {value:100, name:'���ʧ��'}
    ];
    pie2Picture('�����׽���ֲ�ͼ',divorseResult,divorseResultData,'divorseResult');



</script>

</body>

</html>
