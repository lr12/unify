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
                <h1 class="page-header">������ģ�͹���</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="fa fa-bar-chart-o fa-fw"></i>������ģ�͹���

                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div id="morris-area-chart">

                                    <ul id="myTab" role="tablist">
                                        <li id="step1Li" class="active blue">
                                            <a href="#step1"  onclick="eventFun.setStep(1)" role="tab" data-toggle="tab">
                                                1.ѵ����������
                                            </a>
                                        </li>
                                        <li id="step2Li" class="active blue">
                                            <img id="step2Img" src="images/gray_gray.png"/>
                                            <a href="#step2"  onclick="eventFun.setStep()" role="tab" data-toggle="tab">
                                                2.��������
                                            </a>
                                        </li>
                                        <li id="step3Li"  class="gray">
                                            <img id="step3Img" src="images/gray_gray.png"/>
                                            <a href="#step3"  onclick="eventFun.setStep(3)"  role="tab" data-toggle="tab">
                                                2.ģ�Ͳ�������
                                            </a>
                                        </li>
                                        <li id="step4Li"  class="gray">
                                            <img id="step4Img" src="images/gray_gray.png"/>
                                            <a href="#step4"  onclick="eventFun.setStep(4)"  role="tab" data-toggle="tab">
                                                3.�鿴ѵ�����
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
                                                                ѵ��������
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input class="form-control"
                                                                   placeholder="����дѵ����ռ��������������" id="ah" name="ah"/>

                                                        </div>

                                                        <div class="col-sm-1 control-label">
                                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                     class="btn btn-primary"
                                                                     data-toggle="modal"
                                                                     data-target="#ajylModal" style="float: right��margin-left:50px">ѵ��������Ԥ��
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
                                                                ��֤������
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input class="form-control"
                                                                   placeholder="����д��֤��ռ��������������" id="ah" name="ah"/>

                                                        </div>

                                                        <div class="col-sm-1 control-label">
                                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                     class="btn btn-primary"
                                                                     data-toggle="modal"
                                                                     data-target="#ajylModal" style="float: right��margin-left:50px">��֤������Ԥ��
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
                                                                ���Լ�����
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input class="form-control"
                                                                   placeholder="����д���Լ�ռ��������������" id="ah" name="ah"/>

                                                        </div>

                                                        <div class="col-sm-1 control-label">
                                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                                     class="btn btn-primary"
                                                                     data-toggle="modal"
                                                                     data-target="#ajylModal" style="float: right��margin-left:50px">���Լ�����Ԥ��
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
                                        ������Ϣ
                                        </label>
                                        </div>
                                        <div class="col-sm-10">
                                        <label>
                                        <input type="checkbox" value="">���ϼ�¼��
                                        </label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">ԭ���߳ƶ�
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">�����ƶ�
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">��������
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">��������
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                        <input type="checkbox" value="">֤�ݶ�


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
                                                                ��ǩ
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">�᰸��ʽ
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">����
                                                            </label>


                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                            <br/>
                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                     class="btn btn-primary"
                                                     data-toggle="modal"
                                                     data-target="#ajylModal" style="float: right;margin-right: 273px;">��һ��
                                            </button>
                                        </div>
                                        <div id="step2" class="tab-pane fade">
                                            <hr/>
                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label" >
                                                            <label style="float: right;">
                                                                �ִʹ���
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">��ͷִ�
                                                            </label>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <label>
                                                                <input type="checkbox" value="">�Ҷ��ִ�
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
                                                                ͣ�ô�
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
                                                                ������ת��
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                <input type="checkbox" value="">�Դ�
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
                                                     data-target="#ajylModal" style="float: right;margin-right: 430px;">��һ��
                                            </button>
                                        </div>
                                        <div id="step3" class="tab-pane fade">
                                            <hr/>
                                            <div class="row" style="margin-top: 70px">
                                                <div class="col-lg-12">
                                                    <div class="form-group">

                                                        <div class="col-sm-2 control-label" >
                                                            <label style="float: right;">
                                                                ��ǰ����
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                            <label>
                                                                �᰸��ʽѵ������
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
                                                                ģ��ѡ��
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
                                                                <input type="checkbox" value="">CNN-RNN�ں�
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
                                                                ������ά��
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="���������ά��" class="form-control"
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
                                                                ���г���
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="�������г���" class="form-control"
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
                                                                �����
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="���������" class="form-control"
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
                                                                �ܵ����ִ�
                                                            </label>
                                                        </div>
                                                        <div class="col-sm-5">
                                                            <input placeholder="�����ܵ����ִ�" class="form-control"
                                                                   id="ah" name="ah"/>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <button  type="button" id='ajcxButton' name='ajcxButton'
                                                     class="btn btn-primary"
                                                     data-toggle="modal"
                                                     data-target="#ajylModal" style="float: right;margin-right: 430px;">��һ��
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
                                                                <th>���</th>
                                                                <th>׼ȷ��</th>
                                                                <th>�ٻ���</th>
                                                                <th>F1-ֵ</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>׼�賷��</td>
                                                                <td>89.96%</td>
                                                                <td>100.00%</td>
                                                                <td>93.00%</td>
                                                            </tr>
                                                            <tr>
                                                                <td>��������</td>
                                                                <td>100.00%</td>
                                                                <td>80.00%</td>
                                                                <td>88.89%</td>
                                                            </tr> <tr>
                                                                <td>��������</td>
                                                                <td>92.68%</td>
                                                                <td>95.00%</td>
                                                                <td>93.83%</td>
                                                            </tr> <tr>
                                                                <td>�˻ؼ��Ժ</td>
                                                                <td>100%</td>
                                                                <td>40.00%</td>
                                                                <td>57.14%</td>
                                                            </tr> <tr>
                                                                <td>�о�</td>
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
                                                                 data-target="#ajylModal" style="float: right">ģ�ͱ���
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

    //dom����
    var domFun={

    };

    //�¼�����
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
