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
                <h1 class="page-header">�����������</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
    <#--������Ⱥ����-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ������Ⱥ����
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-6" >
                                        <div id="sexAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="ageAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="educationAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="accusedAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="workAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-6" >
                                        <div id="nativeplaceAnalysis" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>

    <#--���̷���-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ���̷���
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-12">
                                        <div id="pepaltyAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <div id="probationAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
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

    <#--���з���-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ���з���
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <div class="col-sm-12">
                                        <div id="crimeAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
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
    <#--�������-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        �������
                    </div>
                    <div class="panel-body">
                        <div id="fineAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
                        </div>

                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
    <#--����ʱ��-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        ����ʱ��
                    </div>
                    <div class="panel-body">
                        <div id="crimeTimeAnalysis" class="panel-body" style="height:400px;overflow-y:auto">
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

<script>
    var sexTitle = '�Ա�ֲ�'
    var sexX = ['��','Ů']
    var sexY = [
        {name: '��', value: 190},
        {name: 'Ů', value: 230}
    ]
    pie1Picture(sexTitle, sexX, sexY, 'sexAnalysis');

    var ageTitle = '����ֲ�'
    var ageX = ['18-30','30-40','40-50','50����']
    var ageY =[190, 230,450,230]
    barPicture(ageTitle, ageY, ageX, 'ageAnalysis')

    var educationTitle = '�Ļ��ֲ�'
    var educationX = ['Сѧ', '��ѧ', '����', '����']
    var educationY = [120,234,454,132,14]
    brokenLine(educationTitle, educationX, educationY, 'educationAnalysis')

    var accusedTitle = '��������'
    var accusedX = ['����', '2-4��', '3������']
    var accusedY = [
        {name:'����',value:780},
        {name:'2-4��',value:120},
        {name:'3������',value:230}
    ]
    DoughnutPie(accusedTitle, accusedX, accusedY, 'accusedAnalysis')

    var workTitle = 'ְҵ�ֲ�'
    var workX = ['����', 'ũ��', 'ְ��','��ʦ']
    var workY = [120,232,450,90]
    horizonalBar(workTitle, workX, workY, 'workAnalysis')

    var nativeplaceTitle = '����ֲ�'
    var nativeplaceX = ['�ӱ�','���','ɽ��','�ӱ�','����','���ɹ�']
    var nativeplaceY = [190, 2000, 120, 450, 120, 40]
    simpleBar(nativeplaceTitle, nativeplaceX, nativeplaceY, 'nativeplaceAnalysis');

    var pepaltyTitle = '�̷��ֲ�ͼ'
    var pepaltyX = ['����ͽ��һ������','����ͽ��һ�굽����','����ͽ�����굽����','����ͽ�����굽����','����ͽ����������','����'];
    var pepaltyY = [
        {value:10, name:'����ͽ��һ������'},
        {value:5, name:'����ͽ��һ�굽����'},
        {value:15, name:'����ͽ�����굽����'},
        {value:25, name:'����ͽ�����굽����'},
        {value:20, name:'����ͽ����������'},
        {value:40, name:'����'}
    ];
    pie2Picture(pepaltyTitle,pepaltyX,pepaltyY,'pepaltyAnalysis');

    // �Ƿ���
    var probationTitle = '���̷ֲ�'
    var probationX = ['����','����ִ��']
    var probationY = [
        {name: '����', value: 190},
        {name: '����ִ��', value: 230}
    ]
    pie1Picture(probationTitle, probationX, probationY, 'probationAnalysis');
    // ���зֲ� crimeAnalysis
    var crimeTitle = '���зֲ�'
    var crimeX = ['�����˺���','������','����ɱ����','�Ż���','Ͷ����','����']
    var crimeY = [
        {name: '�����˺���', value: 190},
        {name: '������', value: 430},
        {name: '����ɱ����', value: 600},
        {name: '�Ż���', value: 500},
        {name: 'Ͷ����', value: 450},
        {name: '����', value: 200}
    ]
    pie1Picture(crimeTitle, crimeX, crimeY, 'crimeAnalysis');
    // ������� fineAnalysis
    var fineTitle = '����ֲ�'
    var fineX = ['1000-3000','3000-7000','8000-10000','10000����']
    var fineY = [190, 2000, 120, 450]
    simpleBar(fineTitle, fineX, fineY, 'fineAnalysis');
    // ����ʱ�� crimeTimeAnalysis
    var crimeTimeTitle = '����ʱ��'
    var crimeTimeX = ['����','����','����','����', '�賿']
    var crimeTimeY = [190, 2000, 1000, 2000, 2500]
    barGraph(crimeTimeTitle, crimeTimeX, crimeTimeY, 'crimeTimeAnalysis');
</script>

</body>

</html>
