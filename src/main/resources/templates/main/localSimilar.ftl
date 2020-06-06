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
    <link rel="stylesheet" type="text/css" href="dist/css/webuploader.css">
</head>

<body>

<div id="wrapper">
    <#include "../component/top.ftl">

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">���ز����������ƶȵ���</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        �ϴ�����
                    </div>
                    <div class="panel-body">
                        <div id="uploader" class="wu-example" style="margin: 6%;">

                            <div class="8i btns">
                                <i id="picker">ѡ���ļ�</i>
                                <button id="ctlBtn" class="btn btn-default" style="margin-top: -31px;height: 43px;margin-left: 63px;">��ʼ�ϴ�</button>
                                <button id="ctlBtn" class="btn btn-primary" style="margin-top: -31px;height: 43px;margin-left: 63px;">�Ա����ƶ�</button>
                            </div>
                            <!--��������ļ���Ϣ-->
                            <div id="list" class="uploader-list"></div>
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
<script type="text/javascript" src="dist/js/webuploader.min.js"></script>
<script>
    window.odometerOptions = {
        format: '(ddd).dd'
    };
</script>
<script>
    /*   $("#upUser").modal(); */
</script>

<script>
    var $ = jQuery, $list = $('#list'), $btn = $('#ctlBtn'), state = 'pending', uploader;

    uploader = WebUploader.create({

        // ��ѹ��image
        resize : false,

        // swf�ļ�·��
        swf : '/Uploader.swf',

        // �ļ����շ���ˡ�
        server : '/upload.do',

        // ѡ���ļ��İ�ť����ѡ��
        // �ڲ����ݵ�ǰ�����Ǵ�����������inputԪ�أ�Ҳ������flash.
        pick : '#picker'
    });

    // �����ļ���ӽ�����ʱ��
    uploader.on('fileQueued', function(file) {
        $list.append('<div id="' + file.id + '" class="item">'
                + '<h4 class="info">' + file.name + '</h4>'
                + '<p class="state">�ȴ��ϴ�...</p>' + '</div>');

    });
    // �ļ��ϴ������д���������ʵʱ��ʾ��
    uploader
            .on(
                    'uploadProgress',
                    function(file, percentage) {
                        var $li = $('#' + file.id), $percent = $li
                                .find('.progress .progress-bar');
                        // console.log(percentage);
                        // �����ظ�����
                        if (!$percent.length) {
                            $percent = $(
                                    '<div class="progress progress-striped active">'
                                    + '<div class="progress-bar" role="progressbar" style="width: 0%">'
                                    + '</div>' + '</div>')
                                    .appendTo($li).find('.progress-bar');
                        }

                        $li.find('p.state').text('�ϴ���');

                        $percent.css('width', percentage * 100 + '%');
                    });

    uploader.on('uploadSuccess', function(file, response) {
        $('#' + file.id).find('p.state').text('���ϴ�');
    });

    uploader.on('uploadError', function(file, reason) {
      //  alert(reason);
        $('#' + file.id).find('p.state').text('�ϴ�����');
    });

    uploader.on('uploadComplete', function(file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    uploader.on('all', function(type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.text('��ͣ�ϴ�');
        } else {
            $btn.text('��ʼ�ϴ�');
        }
    });

    $btn.on('click', function() {
        if (state === 'uploading') {
            uploader.stop();
        } else {
            uploader.upload();
        }
    });

</script>

</body>

</html>
