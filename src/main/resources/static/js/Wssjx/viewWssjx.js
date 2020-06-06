//�������������
function WsDataManage(){
    this.wsdm = "";     //�������
    this.dmmc = "";     //��������
    this.dmms = "";     //��������
    this.ssdl = "";     //��������
}
window.odometerOptions = {
    format: '(ddd).dd'
};
//dataTable����
var dataTableSettings = getDataTableSettings("getDataManage.do",[
    {data:'wsdm'},
    {data:'dmmc'},
    {data:'dmms'},
    {data:'ssdl'},
    {data:null,
        "defaultContent": "<i class=\"editItem fa fa-edit\" style=\"font-size: 18px;\"></i>&nbsp;&nbsp;&nbsp;<i class=\"deleteItem glyphicon glyphicon-remove\" style=\"font-size: 16px;\"></i>"
    }
]);
dataTableSettings.aLengthMenu=[20,50,100];
<!--��ʼ��Datatables-->
var table = null;
$(document).ready(function () {
    table= $('#viewWsData').DataTable( dataTableSettings);
});

$parentTr = null;               //�洢������ж���
//������޸��¼�
var tempDataObj = new WsDataManage();   //���ڴ�ŵ㿪ģ̬��ʱ���ʼ������
$(document).on('click','#viewWsData tr i.editItem',function () {
    //��ȡ�����е�����  �Ȼ�ȡ���ڵ�tr td
    $parentTr = $(this).parents('tr').children();
    tempDataObj.wsdm = $parentTr[0].textContent;
    tempDataObj.dmmc = $parentTr[1].textContent;
    tempDataObj.dmms = $parentTr[2].textContent;
    tempDataObj.ssdl= $parentTr[3].textContent;
    //��ģ̬��input��ֵ
    $("#wsdmInput").val(tempDataObj.wsdm);
    $("#dmmcInput").val(tempDataObj.dmmc);
    $("#dmmsInput").val(tempDataObj.dmms);
    $("#jklx").val(tempDataObj.ssdl);
    $("#editModal").modal('show');
});
//�ύ����
$("#updateData").click(function () {
    //��ȡ��ֵ
    var newData = new WsDataManage();
    newData.wsdm = $("#wsdmInput").val();
    newData.dmmc = $("#dmmcInput").val();
    newData.dmms = $("#dmmsInput").val();
    newData.ssdl = $("#jklx").val();
    var checkResult = requiredCheck(newData);
    if (checkResult){
        var data={
            oldData:tempDataObj,
            newData:newData
        };
        $.ajax({
            url:'updateDataManage.do',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify(data),
            success:function (result) {
                alert(result);
                if (result==='���³ɹ�'){
                    //Ϊ������
                    $parentTr[0].textContent = newData.wsdm;
                    $parentTr[1].textContent = newData.dmmc;
                    $parentTr[2].textContent = newData.dmms;
                    $parentTr[3].textContent = newData.ssdl;
                }
                setTimeout(function () {
                    $("#editModal").modal('hide');
                },1000)
            }
        })
    } else {
        //�п�ֵ
        alert("�������Ϊ��");
    }
});
//�����ɾ���¼�
$(document).on("click","#viewWsData tr i.deleteItem",function () {
    tempDataObj.wsdm = $(this).parents('tr').children()[0].textContent;
    tempDataObj.dmmc = $(this).parents('tr').children()[1].textContent;
    tempDataObj.dmms = $(this).parents('tr').children()[2].textContent;
    tempDataObj.ssdl = $(this).parents('tr').children()[3].textContent;
    $.ajax({
        url:'deleteDataManage.do',
        method:'POST',
        contentType:'application/json',
        data:JSON.stringify(tempDataObj),
        success:function (result) {
            //ɾ�����ڱ�������
            if (result==='success') {
                table.ajax.reload();
            }
            result = result==='success'?"ɾ���ɹ�":"ɾ��ʧ��";
            $(".modal-body").text(result);
            $("#tipsModal").modal('show');
            setTimeout(function () {
                $("#tipsModal").modal('hide');
            },2000)
        }
    })
})

/**
 * �ǿ���֤
 * @param obj
 */
function requiredCheck(obj) {
    for (var i in obj){
        if (obj.hasOwnProperty(i)){
            if (obj[i] ==null || obj[i] ===''){
                return false;
            }
        }
    }
    return true;
}