// 调研内容展示
var dynrhtml1 = " <div class='row'>" +
    "<div class='col-lg-12'> " +
    "<div class='form-group'>" +
    " <div class='col-sm-1 control-label'> "
var dynrhtml2 = "</div><div class='col-sm-11'>"
var dynrhtml3 = "</div></div></div></div><br/>"
var distinctSsdl = $.ajax({
    url: 'findDistinctSsdl.do',
    method: 'get'
})

var allWspz = $.ajax({
    url: 'getDataManage.do',
    method: 'get'
    // success:function(wspzList){
    //     wspzList=wspzList.data;
    //     console.log(wspzList);
    //     var ws=wspzList.filter(function (x) {
    //         x.ssdl=='文首'
    //     })
    //     wspzhtml=dynrhtml1+"<label style='float: right;'>"+'文首'+ "</label>"+dynrhtml2
    //     $.each(wspzList,function(index,wspz){
    //         wspzhtml+=("<label><input type='checkbox' value='"+wspz.wsdm+"'>"+wspz.dmmc+"</label>&nbsp;&nbsp;")
    //
    //     })
    //     wspzhtml+=dynrhtml3
    //     $('#wsnrzsForm').append(wspzhtml);
    // },
    // error:function () {
    //
    // }
})
$(function () {
    $.when(distinctSsdl, allWspz).done(function (ssdlData, wspzData) {
        var ssdl = ssdlData[0].data
        var wspz = wspzData[0].data
        // console.log(ssdl)
        // console.log(wspz)
        $.each(ssdl, function (index, ssdlTemp) {
            var tempWspz = wspz.filter(function (x) {
                return x.ssdl == ssdlTemp;
            })
            if (tempWspz.length>0) {
                var wspzhtml = dynrhtml1 + "<label style='float: right;'>"
                    + ssdlTemp + "</label>" + dynrhtml2
                // console.log(ssdlTemp)
                // console.log(tempWspz)
                // wspzhtml+=dynrhtml2
                $.each(tempWspz, function (index, tempWspz) {
                    wspzhtml += ("<label><input type='checkbox' value='"
                        + tempWspz.wsdm + "'>" + tempWspz.dmmc + "</label>&nbsp;&nbsp;")
                })
                wspzhtml += dynrhtml3
                $('#wsnrzsForm').append(wspzhtml);
            }
        })
    })
})