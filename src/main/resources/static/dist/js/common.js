function alertMessage(message){
	bootbox.alert({  
	    buttons: {  
	       ok: {  
	            label: '确定',  
	            className: 'btn-primary'  
	        }  
	    },  
	    message: message,  
	    callback: function() {  
	     
	    },  
	   
	});  
};

function pie1Picture(title,numData,data,id){
    option = {
        title : {
            text: title,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: numData
        },
        series : [
            {
                name: '文书来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}

function piePicture(title,pointName,numData,data,id){
    option = {
        title: {
            text: title
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data:numData
        },
        series: [
            {
                name:pointName,
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:data
            }
        ]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}

function barPicture(title,data,dataAxis,id){

    var option = {
        title: {
            text: title,
            x:'center'
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                inside: true,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            { // For shadow
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',

                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data
            }
        ]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}

function cloudPicture(title,data,id){
    var option = {
        tooltip: {},
        series: [ {
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [12, 50],
            rotationRange: [-90, 90],
            shape: 'pentagon',
            width: 600,
            height: 400,
            drawOutOfBound: true,
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: data
        } ]
    };



    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}

function pie2Picture(title,numData,data,id){
    option = {
        title : {
            text: title,

            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x : 'center',
            y : 'bottom',
            data:numData
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {

                type:'pie',
                radius : [30, 110],

                roseType : 'radius',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                data:data
            }
        ]
    };

    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}
function linePicture(xData,yData,id){
    option = {
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: yData,
            type: 'line'
        }]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}

function brokenLine(title,dataX,dataY,id) {
    option = {
        title:{
            text: title,
            x: 'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b}:{c}"
        },
        xAxis: {
            type: 'category',
            data: dataX
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: dataY,
            type: 'line'
        }]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}

function DoughnutPie(title,dataX,dataY,id){
    option = {
        title:{
            text: title,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:dataX
        },
        series: [
            {
                name: title,
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:dataY
            }
        ]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);

}
function horizonalBar(title,dataX,dataY,id) {
    option = {
        title: {
            text: title,
            x:'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: dataX
        },
        series: [
            {
                type: 'bar',
                data: dataY
            }
        ]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}
function simpleBar(title,dataX,dataY,id){
    option = {
        title:{
            text:title,
            x:'center'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: dataX
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: dataY,
            type: 'bar'
        }]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}
function barGraph(title,dataX,dataY,id){
    option = {
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        title:{
            text:title,
            x:'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : dataX,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                type:'bar',
                barWidth: '60%',
                data:dataY
            }
        ]
    };
    myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
}