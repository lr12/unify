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
    <style>

        ul{
            margin: 0;
            padding: 0;
        }
        li{
            margin: 0;
            padding: 0;
        }

        #myTab li{
            width:25%;
            float:left;
            height:40px;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        #myTab li img{
            float:left;
            height: 40px;
        }

        #myTab li a{
            color:white;
            text-align: center;
            position: relative;
            display: block;
            padding: 10px 15px;
        }

        .blue{
            background:#0f9af2;
        }
        .gray{
            background: #dfdfdf;
        }
        .tabPaneUl{
            width: 700px;
            margin: 0 auto;
            list-style: none;
        }

        .tabPaneUl li{
            height: 40px;
            line-height: 40px;
        }
        .tab-pane{
         /*   margin-top: 50px;*/
        }
    </style>


</head>

<body>

<div id="wrapper">
    <#include "../component/top.ftl">

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">神经网络模型构建</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="fa fa-bar-chart-o fa-fw"></i>神经网络模型构建

                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div id="morris-area-chart">

                                    <ul id="myTab" role="tablist">
                                        <li id="step1Li" class="active blue">
                                            <a href="#step1"  onclick="eventFun.setStep(1)" role="tab" data-toggle="tab">
                                                1.训练任务配置
                                            </a>
                                        </li>
                                        <li id="step2Li" class="active blue">
                                            <img id="step2Img" src="images/gray_gray.png"/>
                                            <a href="#step2"  onclick="eventFun.setStep()" role="tab" data-toggle="tab">
                                                2.样本配置
                                            </a>
                                        </li>
                                        <li id="step3Li"  class="gray">
                                            <img id="step3Img" src="images/gray_gray.png"/>
                                            <a href="#step3"  onclick="eventFun.setStep(3)"  role="tab" data-toggle="tab">
                                                2.模型参数配置
                                            </a>
                                        </li>
                                        <li id="step4Li"  class="gray">
                                            <img id="step4Img" src="images/gray_gray.png"/>
                                            <a href="#step4"  onclick="eventFun.setStep(4)"  role="tab" data-toggle="tab">
                                                3.查看训练结果
                                            </a>
                                        </li>
                                    </ul>
                                    <div id="myTabContent" class="tab-content">
                                        <div id="step1" class="tab-pane fade active in">
                                            <hr/>
                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                训练集案例
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input class="form-control"
                                                                   placeholder="请填写训练集占所有样本集比例" id="ah" name="ah"/>

                                                        </div>

                                                        <div class="col-sm-1 control-label">
                                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                     class="btn btn-primary"
                                                                     data-toggle="modal"
                                                                     data-target="#ajylModal" style="float: right；margin-left:50px">训练集案例预览
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                验证集案例
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input class="form-control"
                                                                   placeholder="请填写验证集占所有样本集比例" id="ah" name="ah"/>

                                                        </div>

                                                        <div class="col-sm-1 control-label">
                                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                     class="btn btn-primary"
                                                                     data-toggle="modal"
                                                                     data-target="#ajylModal" style="float: right；margin-left:50px">验证集案例预览
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                测试集案例
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input class="form-control"
                                                                   placeholder="请填写测试集占所有样本集比例" id="ah" name="ah"/>

                                                        </div>

                                                        <div class="col-sm-1 control-label">
                                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                     class="btn btn-primary"
                                                                     data-toggle="modal"
                                                                     data-target="#ajylModal" style="float: right；margin-left:50px">测试集案例预览
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                        <div class="row">
                                        <div class="col-lg-12">
                                        <div class="form-group">

                                        <div class="col-sm-2 control-label">
                                        <label style="float: right;">
                                        审理信息
                                        </label>
                                        </div>
                                        <div class="col-sm-10">
                                        <label>
                                        <input type="checkbox" value="">诉讼记录段
                                        </label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">原告诉称段
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">被告辩称段
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">裁判理由
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">裁判依据
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">证据段


                                        </div>


                                        </div>
                                        </div>

                                        </div>
                                        <br/>
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;">
                                                                标签
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">结案方式
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">案由
                                                            </label>


                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                            <br/>
                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                     class="btn btn-primary"
                                                     data-toggle="modal"
                                                     data-target="#ajylModal" style="float: right;margin-right: 273px;">下一步
                                            </button>
                                        </div>
                                        <div id="step2" class="tab-pane fade">
                                            <hr/>
                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label" >
                                                            <label style="float: right;">
                                                                分词工具
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">结巴分词
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">庖丁分词
                                                            </label>
                                                            &nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">IkAnalyzer
                                                            </label>

                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                            <br/>


                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                停用词
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input type="file" class="form-control"
                                                                    id="ah" name="ah"/>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <br/>

                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;">
                                                                词向量转化
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">自带
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">Word2vec
                                                            </label>


                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                            <br/>
                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                     class="btn btn-primary"
                                                     data-toggle="modal"
                                                     data-target="#ajylModal" style="float: right;margin-right: 430px;">下一步
                                            </button>
                                        </div>
                                        <div id="step3" class="tab-pane fade">
                                            <hr/>
                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label" >
                                                            <label style="float: right;">
                                                                当前任务
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                结案方式训练任务
                                                            </label>

                                                        </div>


                                                    </div>
                                                </div>

                                            </div>

                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label" >
                                                            <label style="float: right;">
                                                                模型选择
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">CNN
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">RNN
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">CNN-RNN融合
                                                            </label>

                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                            <br/>


                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                词向量维度
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="输入词向量维度" class="form-control"
                                                                   id="ah" name="ah"/>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                序列长度
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="输入序列长度" class="form-control"
                                                                   id="ah" name="ah"/>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                类别数
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="输入类别数" class="form-control"
                                                                   id="ah" name="ah"/>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div class="row" style="">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
                                                        <div class="col-sm-2 control-label">
                                                            <label style="float: right;margin-top: 5px">
                                                                总迭代轮次
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="输入总迭代轮次" class="form-control"
                                                                   id="ah" name="ah"/>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                     class="btn btn-primary"
                                                     data-toggle="modal"
                                                     data-target="#ajylModal" style="float: right;margin-right: 430px;">下一步
                                            </button>
                                        </div>
                                        <div id="step4" class="tab-pane fade">
                                            <hr/>
                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">
<img src="images/1.png" style="width:25%"/><img src="images/2.png" style="width:25%"/><img src="images/3.png" style="width:25%"/><img src="images/4.png" style="width:25%"/>
                                                        <table class="table table-bordered table-hover table-striped">
                                                            <thead>
                                                            <tr>
                                                                <th>类别</th>
                                                                <th>准确率</th>
                                                                <th>召回率</th>
                                                                <th>F1-值</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>准予撤诉</td>
                                                                <td>89.96%</td>
                                                                <td>100.00%</td>
                                                                <td>93.00%</td>
                                                            </tr>
                                                            <tr>
                                                                <td>驳回起诉</td>
                                                                <td>100.00%</td>
                                                                <td>80.00%</td>
                                                                <td>88.89%</td>
                                                            </tr> <tr>
                                                                <td>不予受理</td>
                                                                <td>92.68%</td>
                                                                <td>95.00%</td>
                                                                <td>93.83%</td>
                                                            </tr> <tr>
                                                                <td>退回检察院</td>
                                                                <td>100%</td>
                                                                <td>40.00%</td>
                                                                <td>57.14%</td>
                                                            </tr> <tr>
                                                                <td>判决</td>
                                                                <td>99.90%</td>
                                                                <td>100%</td>
                                                                <td>99.85%</td>
                                                            </tr>
                                                            <tr>
                                                                <td>weighted avg</td>
                                                                <td>99.38%</td>
                                                                <td>99.34%</td>
                                                                <td>99.28%</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                 class="btn btn-primary"
                                                                 data-toggle="modal"
                                                                 data-target="#ajylModal" style="float: right">模型保存
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            </div>
                        </div>

                </div>

            </div>
            <!-- /.panel -->

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
<!-- <script>
  setTimeout(function(){
    $('.odometer').html(423234234);
  }, 1000);
</script> -->
</body>
<script>
    $(document).ready(function(){

    });

    //dom操作
    var domFun={

    };

    //事件操作
    var eventFun={
        setStep:function(index){
            for(var i=2;i<=index;i++){
                $("#step"+i+"Li").addClass("blue").removeClass("gray");
                $("#step"+i+"Img").attr("src","images/blue_blue.png");
            }
            for(var i=index+1;i<=4;i++){
                $("#step"+i+"Li").addClass("gray").removeClass("blue");
                $("#step"+i+"Img").attr("src","images/gray_gray.png");
            }
            $("#step"+(index+1)+"Img").attr("src","images/blue_gray.png");
        }
    };
</script>

</html>
