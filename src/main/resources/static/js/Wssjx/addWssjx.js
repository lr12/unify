//�������������
function wsDataManage(){
    this.wsdm = "";     //�������
    this.dmmc = "";     //��������
    this.dmms = "";     //��������
    this.ssdl = "";     //��������
}
$("#saveDataBtn").on("click",function () {
    //��ȡ����
    $inputItems = $("#wsDataForm input");                      //��ȡ����Input
    $selectItem = $("#wsDataForm select option:selected");
    var wsDataItems = new wsDataManage();
    wsDataItems.wsdm = $inputItems[0].value;
    wsDataItems.dmmc = $inputItems[1].value;
    wsDataItems.dmms = $inputItems[2].value;
    wsDataItems.ssdl = $selectItem.val();
    //������֤
    var checkResult = requiredCheck(wsDataItems);
    if (checkResult){
        //����
        $.ajax({
            url:"addDataManage.do",
            method:'POST',
            data:JSON.stringify(wsDataItems),
            contentType:'application/json',
            success:function (result) {
                var modalContent = result.map.content === 'success'?'����ɹ�':'����ʧ�ܣ�������������ʽ���Ƿ��Ѵ��ڣ�';
                $(".modal-body").text(modalContent);
                $("#tipsModal").modal('show');
                setTimeout(function () {
                    $("#tipsModal").modal('hide');
                },2000)
            }
        })
    } else {
        //�п�ֵ
        $(".modal-body").text("�������Ϊ��");
        $("#tipsModal").modal('show');
        setTimeout(function () {
            $("#tipsModal").modal('hide');
        },2000)
    }

});
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