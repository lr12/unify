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
                <h1 class="page-header">调研统计图表</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        信息调研统计折线图
                    </div>
                    <div class="panel-body">
                        <div id="line"  style="height:400px;overflow-y:auto">
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
                        图表调研统计折线图
                    </div>
                    <div class="panel-body">
                        <div id="reportLine"  style="height:400px;overflow-y:auto">
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
    var xData=['一月','二月','三月','四月',
        '五月','六月','七月','八月',
        '九月','十月','十一月','十二月'];
    $(function () {
        $.ajax({
            url:"getDycsBymonth.do",
            method:'get',
            success:function (result) {
                linePicture(xData,result.data,'line');
            },
            error: function(){

            }
        })
        $.ajax({
            url:"getTbDyBymonth.do",
            method:'get',
            success:function (result) {
                linePicture(xData,result.data,'reportLine');
            },
            error: function(){

            }
        })
    })

    // var yData=[10,2,4,8,5,6,9,20,21,12,13,19];

    // var yData=[2,12,14,19,15,21,5,22,10,22,13,9];
    // linePicture(xData,yData,'reportLine');

</script>

</body>


</html>
