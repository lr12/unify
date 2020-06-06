//�������
$(".form_datetime").datetimepicker({
    bootcssVer: 3,           //ָ��ʹ��bootstrap3
    format: 'yyyy-mm-dd',   //��ʾ��ʽ
    todayHighlight: 1,      //�������
    minView: "month",       //����ֻ��ʾ���·�
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    autoclose: 1,           //ѡ����Զ��ر�
    language: 'cn'
});
//�ύ��ȡ����
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
//����dataTableͨ������
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
//���ű��dataTables��ʼ��
var ahTable = $("#ahTable").DataTable(dataTableSettings);
//���������ͬʱʹ��dataTableSettings��ʼ������������
var jbqkTable =$("#jbqkTable").DataTable(dataTableSettings);


//��dataTable ��� ������ʾ�а�ť
var originHtml = $("#ahTable_filter").html();
originHtml = originHtml + '<label class="selectPickerLabel">������:&nbsp<select class="selectpicker"  multiple>\n' +
    '                                    <option data-col="0">����</option>\n' +
    '                                    <option data-col="1">��������</option>\n' +
    '                                    <option data-col="2">��������</option>\n' +
    '                                    <option data-col="3">�᰸����</option>\n' +
    '                                    <option data-col="4">���г�</option>\n' +
    '                                    <option data-col="5">�а���</option>\n' +
    '                                    <option data-col="6">����ͥ��Ա</option>\n' +
    '                                    <option data-col="7">���Ա</option>\n' +
    '                                    <option data-col="8">��������</option>\n' +
    '                                    <option data-col="9">������Ϊ</option>\n' +
    '                                    <option data-col="10">���ƶ�</option>\n' +
    '                                </select>\n</label>';

$("#ahTable_filter").html(originHtml);

//bootstrap multiselect��ѡ��ʼ��
$(".selectpicker").multiselect({
    //onchange�¼�
    onChange:function (option, checked, select) {
        var item = option.context.value;
        var status = checked;
        var index = getColumIndex(item);
        ahTable.column(index).visible(!status);
    }
});

/**
 * ����������ȡ���
 * @param str
 * @returns {*}
 */
function getColumIndex(str) {
    return {
        '����':'0',
        '��������':'1',
        '��������':'2',
        '�᰸����':'3',
        '���г�':'4',
        '�а���':'5',
        '����ͥ��Ա':'6',
        '���Ա':'7',
        '��������':'8',
        '������Ϊ':'9',
        '���ƶ�':'10'
    }[str]
}