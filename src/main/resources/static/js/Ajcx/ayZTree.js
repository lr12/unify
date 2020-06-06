// 初始化案由树结构
$("#laay").on('click',function () {
    var selectedAjxz = $("#ajxz").val();
    var selecteAjxzValue=$("#ajxz option:selected").text();
    // console.log(selecteAjxzValue)
    $("#zTreeModalTitle").html(selecteAjxzValue+"案由选择");
    initTree(selectedAjxz);
})
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: 0
        }
    },
    check: {
        enable: true,
        chkStyle: "radio",
        chkboxType: { "Y": "ps", "N": "ps" },
        radioType: "all"
    }
};
function initTree(ajxz){
    $.ajax({
        url:"findAyByAjxz/"+ajxz,
        success:function(ayList){
            console.log(ayList)
            $.fn.zTree.init($("#treeDemo"), setting, ayList.data);
        },
        error:function () {
        }
    })
}
// 案由提交
$('#submit').on('click',function(){
    zTreeObj =  $.fn.zTree.getZTreeObj("treeDemo");
    var checkedNodes = zTreeObj.getCheckedNodes();
    var name = JSON.stringify(checkedNodes[0]['name']).slice(1,-1);
    var value = JSON.stringify(checkedNodes[0]['value']).slice(1,-1);
    $('#zTreeModal').modal('hide');
    $('#laay').val(name);
    $('#laay').data('aybh',value);
})