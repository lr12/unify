// 填充法院和办案审判庭
$(function(){
    fillFySelect();
    $("#cbbm").append("<option value=''></option>")
    $('#bafy').change(function () {
        var selectedFydm = $(this).val()
        $.ajax({
            url:"findSptByfydm.do",
            data:{
                fydm:selectedFydm
            },
            success:function(sptList){
                // $("#cbbm").append("<option value=''></option>")
                $.each(sptList.data,function(i,val){
                    $("#cbbm").append("<option value='"+val.dmbh+"'>"+val.dmms+"</option>")
                })
            },
            error:function () {
            }
        })
    })
})
// datetime Picker
$(".form_datetime").datetimepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayBtn: true,
    todayHighlight: true,
    startView: 'decade',
    minView: 'month',//最精准的时间选择为日期0-分 1-时 2-日 3-月
    language: 'zh-CN',
    pickerPosition: "bottom-right"
});
$('#jarqStartDiv').datetimepicker('setDate',lastMonthDate())
$('#jarqEndDiv').datetimepicker('setDate',new Date())
function fillFySelect(){
    $.ajax({
        url:"findAllfy.do",
        success:function(fyList){
            $("#bafy").append("<option value=''></option>")
            $.each(fyList.data,function(i,val){
                $("#bafy").append("<option value='"+val.dmbh+"'>"+val.dmms+"</option>")
            })
        },
        error:function () {
        }
    })
}
function lastMonthDate() {
    var nowDate=new Date()
    var currentYear=nowDate.getFullYear();
    var currentMonth=nowDate.getMonth()+1;
    var currentDate=nowDate.getDate();
    var prevCurrentYear=0;
    var prevCurrentMonth=0;
    if(currentMonth==1){
        prevCurrentYear=currentYear-1;
        prevCurrentMonth=12;
    }else{
        prevCurrentYear=currentYear;
        prevCurrentMonth=currentMonth-1;
    }
    prevCurrentMonth=prevCurrentMonth<10?'0'+prevCurrentMonth:prevCurrentMonth;
    currentDate=currentDate<10?'0'+currentDate:currentDate;
    var lastMonth = prevCurrentYear+'-'+prevCurrentMonth+'-'+currentDate;
    return new Date(Date.parse(lastMonth.replace(/-/g,  "/")));
}
