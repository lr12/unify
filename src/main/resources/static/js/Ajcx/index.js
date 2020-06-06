// 案件查询

$('#ajcxButton').on('click',function () {
    $('#ajcxDataTable').css('visibility','visible')
    var ah=$("#ah").val();
    var ajmc=$("#ajmc").val();
    var ajxz=$("#ajxz").val();
    var bafy=$("#bafy").val();
    var spcx=$("#spcx").val();
    var cbbm=$("#cbbm").val();
    var jarqStart=$("#jarqStart").val();
    var jarqEnd=$("#jarqEnd").val();
    var cbrxm=$("#cbrxm").val();
    var laay=$('#laay').val();
    // var dymc=$("#dymc").val()
    // var dyjc=$("#dyjc").val()
    // var ztlx=$('#ztlx').val()
    // 案件查询条件
    var ajcxtj={
        ah:ah,
        ajmc:ajmc,
        ajxz:ajxz,
        bafy:bafy,
        spcx:spcx,
        cbbm:cbbm,
        jarqStart:jarqStart,
        jarqEnd:jarqEnd,
        cbrxm:cbrxm,
        laay:laay
    }
    $.ajax({
        url:"getAjcxxxModel.do",
        data:ajcxtj,
        method:'get',
        success:function(ajList){
            $("#ajcxDataTable").dataTable({
                data:ajList.data,
                columns: [
                    { data: "ajxh" },
                    { data: "ah"},
                    { data: "ajmc" },
                    { data: "ajxz" },
                    { data: "spcx"},
                    { data: "larq" },
                    { data: "jarq" }
                ],
                searching: true,//是否支持搜索
                aoColumnDefs: [ { "bSortable": false, "aTargets": [ 1,2,3,4 ] }],
                autoFill: true,
                bAutoWidth: false,
                aLengthMenu:[10,20,50],
                destroy:true,
                language: {
                    sProcessing: "正在获取数据，请稍后...",
                    sLengthMenu: "显示 _MENU_ 条",
                    sZeroRecords: "没有您要搜索的内容",
                    sInfo: "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
                    sInfoEmpty: "记录数为0",
                    sInfoFiltered: "(全部记录数 _MAX_ 条)",
                    sInfoPostFix: "",
                    sSearch: "搜索",
                    search:" ",
                    oPaginate: {
                        "sFirst" : "第一页",
                        "sPrevious" : "上一页",
                        "sNext" : "下一页",
                        "sLast" : "最后一页"
                    }
                }
            })
        },
        error:function () {
        }
    })
});
function setCookie(){
    var vals = [];
    $('input:checkbox:checked').each(function (index, item) {
        vals.push($(this).val());
    });
    var wscxtj={
        ah:$("#ah").val(),
        ajmc:$("#ajmc").val(),
        ajxz:$("#ajxz").val(),
        bafy:$("#bafy").val(),
        spcx:$("#spcx").val(),
        cbbm:$("#cbbm").val(),
        jarqStart:$("#jarqStart").val(),
        jarqEnd:$("#jarqEnd").val(),
        cbrxm:$("#cbrxm").val(),
        laay:$('#laay').data('aybh'),
        headList:vals
    };
    var expires = 7*24 * 60 * 60 * 1000;
    var date = new Date(new Date().getTime()+expires);
    document.cookie = "wscxtj"+"="+JSON.stringify(wscxtj)+";expires="+date;
}


$("#dyButton").on('click',function () {
    var vals = [];
    $('input:checkbox:checked').each(function (index, item) {
        vals.push($(this).val());
    });

    var ah=$("#ah").val();
    var ajmc=$("#ajmc").val();
    var ajxz=$("#ajxz").val();
    var bafy=$("#bafy").val();
    var spcx=$("#spcx").val();
    var cbbm=$("#cbbm").val();
    var jarqStart=$("#jarqStart").val();
    var jarqEnd=$("#jarqEnd").val();
    var cbrxm=$("#cbrxm").val();
    var laay=$('#laay').val();
    var dymc=$("#dymc").val()
    var dyjc=$("#dyjc").val()
    var ztlx=$('#ztlx').val()

    var wscxtj={
        ah:ah,
        ajmc:ajmc,
        ajxz:ajxz,
        bafy:bafy,
        spcx:spcx,
        cbbm:cbbm,
        jarqStart:jarqStart,
        jarqEnd:jarqEnd,
        cbrxm:cbrxm,
        laay:laay,
        headList:vals,
        dymc:dymc,
        dyjc:dyjc,
        ztlx:ztlx
    };
    // $.ajax({
    //     url:"wsBasicInfoSueryShow.do",
    //     data:JSON.stringify(wscxtj),
    //     contentType:"application/json",
    //     method:"POST",
    //     success:function (result) {
    //
    //     },error:function () {
    //     }
    // })
    // $.ajax({
    //     url:"/Wsdy.do",
    //     // contentType:"application/json",
    //     data:wscxtj,
    //     // data:JSON.stringify(wscxtj),
    //     method:'get',
    //     success:function(wsList){
    //         console.log(wsList.data)
    //     },
    //     error:function () {
    //     }
    // })
})
