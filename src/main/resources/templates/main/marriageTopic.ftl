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
                <h1 class="page-header">离婚纠纷主题调研</h1>
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
                        离婚纠纷分析
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
                        离婚纠纷结果分析
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
        {name:"感情不和",value:10000},
        {name:"性格",value:100},
        {name:"分居",value:2000},
        {name:"脾气暴躁",value:50000},
        {name:"缺乏了解",value:1000},
        {name:"不尽责任",value:1000},
        {name:"失踪",value:1000}
        ];
    cloudPicture('关键词',data,'cloud');

    // 提出离婚婚龄
    var marriageAgetitle='提出离婚婚龄';
    var marriageAgeNumData=['0~7','8~15','16~25','26~35','35以上'];
    var marriageAgedata=[
        {value:335, name:'0~7'},
        {value:1310, name:'8~15'},
        {value:234, name:'16~25'},
        {value:135, name:'26~35'},
        {value:148, name:'35以上'}
    ];
    pie1Picture(marriageAgetitle,marriageAgeNumData,marriageAgedata,'marriageAge');

    // 初婚再婚分布
    var isFirstMarriageTitle='初婚再婚分布';
    var isFirstMarriageNumData=['初婚','再婚'];
    var isFirstMarriagedata=[
        {value:935, name:'初婚'},
        {value:210, name:'再婚'}
    ];
    pie1Picture(isFirstMarriageTitle,isFirstMarriageNumData,isFirstMarriagedata,'isFirstMarriage');


    // 提出离婚男女比例
    var divorseSextitle='提出离婚男女比例';
    var divorseSexNumData=['男性','女性'];
    var divorseSexdata=[
        {value:210, name:'男性'},
        {value:935, name:'女性'}
    ];
    pie1Picture(divorseSextitle,divorseSexNumData,divorseSexdata,'divorseSex');

    // 提出离婚男女比例
    var hasChildrentitle='提出离婚夫妻是否有子女';
    var hasChildrenNumData=['有','无'];
    var hasChildrendata=[
        {value:500, name:'有'},
        {value:678, name:'无'}
    ];
    pie1Picture(hasChildrentitle,hasChildrenNumData,hasChildrendata,'hasChildren');
    // meetWay
    //结婚相识途径
    var meetWaytitle='夫妻相识途径';
    var meetWayNumData=['介绍','自由恋爱','网络相识'];
    var meetWaydata=[
        {value:500, name:'介绍'},
        {value:678, name:'自由恋爱'},
        {value:100, name:'网络相识'}
    ];
    pie1Picture(meetWaytitle,meetWayNumData,meetWaydata,'meetWay');

    //是否第一次提出离婚
    var isFirstPutDivorsetitle='是否第一次提出离婚';
    var isFirstPutDivorseNumData=['是','否'];
    var isFirstPutDivorsedata=[
        {value:500, name:'是'},
        {value:200, name:'否'}
    ];
    pie1Picture(isFirstPutDivorsetitle,isFirstPutDivorseNumData,isFirstPutDivorsedata,'isFirstPutDivorse');

    // 离婚结果
    var divorseResult = ['离婚成功','离婚失败'];
    var divorseResultData = [
        {value:123, name:'离婚成功'},
        {value:100, name:'离婚失败'}
    ];
    pie2Picture('离婚纠纷结果分布图',divorseResult,divorseResultData,'divorseResult');



</script>

</body>

</html>
