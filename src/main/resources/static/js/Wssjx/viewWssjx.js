//文书数据项对象
function WsDataManage(){
    this.wsdm = "";     //文书代码
    this.dmmc = "";     //代码名称
    this.dmms = "";     //代码描述
    this.ssdl = "";     //所属段落
}
window.odometerOptions = {
    format: '(ddd).dd'
};
//dataTable设置
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
<!--初始化Datatables-->
var table = null;
$(document).ready(function () {
    table= $('#viewWsData').DataTable( dataTableSettings);
});

$parentTr = null;               //存储点击的行对象
//表格项修改事件
var tempDataObj = new WsDataManage();   //用于存放点开模态框时最初始的数据
$(document).on('click','#viewWsData tr i.editItem',function () {
    //获取表格该行的数据  先获取父节点tr td
    $parentTr = $(this).parents('tr').children();
    tempDataObj.wsdm = $parentTr[0].textContent;
    tempDataObj.dmmc = $parentTr[1].textContent;
    tempDataObj.dmms = $parentTr[2].textContent;
    tempDataObj.ssdl= $parentTr[3].textContent;
    //给模态框input赋值
    $("#wsdmInput").val(tempDataObj.wsdm);
    $("#dmmcInput").val(tempDataObj.dmmc);
    $("#dmmsInput").val(tempDataObj.dmms);
    $("#jklx").val(tempDataObj.ssdl);
    $("#editModal").modal('show');
});
//提交保存
$("#updateData").click(function () {
    //获取新值
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
                if (result==='更新成功'){
                    //为表单更新
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
        //有空值
        alert("所填项不能为空");
    }
});
//表格项删除事件
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
            //删除现在表格的数据
            if (result==='success') {
                table.ajax.reload();
            }
            result = result==='success'?"删除成功":"删除失败";
            $(".modal-body").text(result);
            $("#tipsModal").modal('show');
            setTimeout(function () {
                $("#tipsModal").modal('hide');
            },2000)
        }
    })
})

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