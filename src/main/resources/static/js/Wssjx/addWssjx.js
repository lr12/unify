//文书数据项对象
function wsDataManage(){
    this.wsdm = "";     //文书代码
    this.dmmc = "";     //代码名称
    this.dmms = "";     //代码描述
    this.ssdl = "";     //所属段落
}
$("#saveDataBtn").on("click",function () {
    //获取数据
    $inputItems = $("#wsDataForm input");                      //获取所有Input
    $selectItem = $("#wsDataForm select option:selected");
    var wsDataItems = new wsDataManage();
    wsDataItems.wsdm = $inputItems[0].value;
    wsDataItems.dmmc = $inputItems[1].value;
    wsDataItems.dmms = $inputItems[2].value;
    wsDataItems.ssdl = $selectItem.val();
    //必填验证
    var checkResult = requiredCheck(wsDataItems);
    if (checkResult){
        //发送
        $.ajax({
            url:"addDataManage.do",
            method:'POST',
            data:JSON.stringify(wsDataItems),
            contentType:'application/json',
            success:function (result) {
                var modalContent = result.map.content === 'success'?'保存成功':'保存失败，请检查该数据项格式或是否已存在！';
                $(".modal-body").text(modalContent);
                $("#tipsModal").modal('show');
                setTimeout(function () {
                    $("#tipsModal").modal('hide');
                },2000)
            }
        })
    } else {
        //有空值
        $(".modal-body").text("所填项不能为空");
        $("#tipsModal").modal('show');
        setTimeout(function () {
            $("#tipsModal").modal('hide');
        },2000)
    }

});
/**
 * 非空验证
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