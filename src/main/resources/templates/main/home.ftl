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
                <h1 class="page-header">test</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->

        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <i class="fa fa-bar-chart-o fa-fw"></i>测试1

                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">

                                    <div class="col-sm-1 control-label" style="width:86px">
                                        <label style="float: right;margin-top: 5px;">
                                            测试2
                                        </label>
                                    </div>
                                    <div class="col-sm-3">
                                        <div id='jarqStartDiv' class="input-group date form_datetime">
                                            <input type="text" id="jarqStart" name="jarqStart" class="form-control">
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-remove"></span></span>
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-calendar"></span></span>
                                        </div>
                                    </div>
                                    <div class="col-sm-1 control-label" style="width:86px">
                                        <label style="float: right;margin-top: 5px;">
                                            测试3
                                        </label>
                                    </div>
                                    <div class="col-sm-3">
                                        <div id='jarqEndDiv' class="input-group date form_datetime">
                                            <input type="text" id="jarqEnd" name="jarqEnd" class="form-control">
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-remove"></span></span>
                                            <span class="input-group-addon"><span
                                                    class="glyphicon glyphicon-calendar"></span></span>
                                        </div>
                                    </div>
                                    <div class="col-sm-2 control-label">
                                         <button  type="button" id='ajcxButton' name='ajcxButton'
                                                   class="btn btn-primary"
                                                   data-toggle="modal"
                                                   data-target="#ajylModal">测试
                                    </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <hr/>
                        <div id="morris-area-chart">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr>
                                        <th>1</th>
                                        <th>2</th>
                                        <th>3</th>
                                        <th>4</th>
                                        <th>5</th>
                                        <th>6</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>3</td>
                                        <td>4</td>
                                        <td>5</td>
                                    </tr>

                                    </tbody>
                                </table>
                                <button  type="button" id='ajcxButton' name='ajcxButton'
                                         class="btn btn-primary"
                                         data-toggle="modal"
                                         data-target="#ajylModal" style="float: right">提交
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- /.panel-body -->
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

</html>
