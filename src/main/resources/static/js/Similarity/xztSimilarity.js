//日期组件
$(".form_datetime").datetimepicker({
    bootcssVer: 3,           //指定使用bootstrap3
    format: 'yyyy-mm-dd',   //显示格式
    todayHighlight: 1,      //今天高亮
    minView: "month",       //设置只显示到月份
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    autoclose: 1,           //选择后自动关闭
    language: 'cn'
});
//提交获取数据
$("#submitBtn").click(function () {
    // $("#page-wrapper").showLoading();
    $.ajax({
        url: 'getXztSimilarity.do',
        method: 'GET',
        contentType: 'application/json',
        data:{
            jarqStart:$("#jarqStart").val(),
            jarqEnd:$("#jarqEnd").val(),
            fydm:$("#fySel option:selected").val()
        },
        success: function (result) {
            ahTable.clear();
            ahTable.rows.add(result).draw();
            // $("#page-wrapper").hideLoading();
        }
    })
});
//引入dataTable通用设置
var dataTableSettings = getCNlanguage();
dataTableSettings.autoWidth = true;
dataTableSettings.scrollX = true;
dataTableSettings.date="";
dataTableSettings.columns =[
    {data:"ah"},
    {data:"ajmc"},
    {data:"larq"},
    {data:"jarq"},
    {data:"spz"},
    {data:"cbr"},
    {data:"hytcy"},
    {data:"sjy"},
    {data:"fgzl"},
    {data:"ah"},
    {data:"degree"}
];
dataTableSettings.aLengthMenu=[20,50,100];
//案号表格dataTables初始化
var ahTable = $("#ahTable").DataTable(dataTableSettings);
//两个表格不能同时使用dataTableSettings初始化否则有问题
var jbqkTable =$("#jbqkTable").DataTable(dataTableSettings);


//向dataTable 添加 隐藏显示列按钮
var originHtml = $("#ahTable_filter").html();
originHtml = originHtml + '<label class="selectPickerLabel">隐藏列:&nbsp<select class="selectpicker"  multiple>\n' +
    '                                    <option data-col="0">案号</option>\n' +
    '                                    <option data-col="1">案件名称</option>\n' +
    '                                    <option data-col="2">立案日期</option>\n' +
    '                                    <option data-col="3">结案日期</option>\n' +
    '                                    <option data-col="4">审判长</option>\n' +
    '                                    <option data-col="5">承办人</option>\n' +
    '                                    <option data-col="6">合议庭成员</option>\n' +
    '                                    <option data-col="7">书记员</option>\n' +
    '                                    <option data-col="8">法官助理</option>\n' +
    '                                    <option data-col="9">本案认为</option>\n' +
    '                                    <option data-col="10">相似度</option>\n' +
    '                                </select>\n</label>';

$("#ahTable_filter").html(originHtml);

//bootstrap multiselect多选初始化
$(".selectpicker").multiselect({
    //onchange事件
    onChange:function (option, checked, select) {
        var item = option.context.value;
        var status = checked;
        var index = getColumIndex(item);
        ahTable.column(index).visible(!status);
    }
});

/**
 * 根据列名获取序号
 * @param str
 * @returns {*}
 */
function getColumIndex(str) {
    return {
        '案号':'0',
        '案件名称':'1',
        '立案日期':'2',
        '结案日期':'3',
        '审判长':'4',
        '承办人':'5',
        '合议庭成员':'6',
        '书记员':'7',
        '法官助理':'8',
        '本案认为':'9',
        '相似度':'10'
    }[str]
}