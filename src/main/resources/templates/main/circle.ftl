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
                <h1 class="page-header">恬恬相片集</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="fa fa-bar-chart-o fa-fw"></i>恬恬照片

                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">

                        <hr/>
                        <div id="morris-area-chart">
                            <div class="table-responsive">

                                <div id="myCarousel" class="carousel slide">
                                    <!-- 轮播（Carousel）指标 -->
                                    <ol class="carousel-indicators">
                                        <li data-target="#myCarousel" data-slide-o="0" class="active"></li>
                                        <li data-target="#myCarousel" data-slide-to="1"></li>
                                        <li data-target="#myCarousel" data-slide-to="2"></li>
                                        <li data-target="#myCarousel" data-slide-to="3"></li>
                                        <li data-target="#myCarousel" data-slide-to="4"></li>
                                        <li data-target="#myCarousel" data-slide-to="5"></li>
                                        <li data-target="#myCarousel" data-slide-to="6"></li>
                                    </ol>
                                    <!-- 轮播（Carousel）项目 -->
                                    <div class="carousel-inner">
                                        <div class="item active">
                                            <img src="png/2.jpeg" style="display: inline-block;"  alt="First slide" >
                                            <div class="carousel-caption" style="font-size:20px">惺忪的双眼看着妈妈</div>
                                        </div>
                                        <div class="item">
                                            <img src="png/3.jpeg" style="display: inline-block;"  alt="First slide" >
                                            <div class="carousel-caption" style="font-size:20px">我宣誓要当个好宝宝</div>
                                        </div>
                                        <div class="item">
                                            <img src="png/5.jpeg" style="display: inline-block;"  alt="First slide" >

                                            <div class="carousel-caption" style="font-size:20px">全家福，原来这是我父母</div>
                                        </div>
                                        <div class="item">

                                            <img src="png/6.jpeg" style="display: inline-block;"  alt="First slide"  >
                                            <div class="carousel-caption" style="font-size:20px">这是啥，红红的</div>
                                        </div>
                                        <div class="item">
                                            <img src="png/7.jpeg" style="display: inline-block;"  alt="First slide" >

                                            <div class="carousel-caption" style="font-size:20px">我和爸爸玩耍</div>
                                        </div>
                                        <div class="item">

                                            <img src="png/8.jpeg" style="display: inline-block;"  alt="First slide" >
                                            <div class="carousel-caption" style="font-size:20px">我和奶奶学说话</div>
                                        </div>
                                        <div class="item">
                                            <img src="png/9.jpeg" style="display: inline-block;"  alt="First slide" >

                                            <div class="carousel-caption" style="font-size:20px">小猪小象伴我成长</div>
                                        </div>
                                    </div>
                                    <!-- 轮播（Carousel）导航 -->
                                    <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- /.panel-body -->
                </div>

            </div>
            <!-- /.panel -->
            <audio src="someaudio.wav">
            </audio>
        </div>
        <!-- /.col-lg-8 -->

    </div>
    <!-- /.row -->
</div>
<!-- /#page-wrapper -->

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
       // $("#upUser").modal();
</script>
 <script>
     $('.carousel').carousel({
         interval: 4000
     });
</script>
</body>

</html>
