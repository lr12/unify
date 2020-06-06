<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <#--<meta http-equiv="refresh" content="6;url=${errorURL}">-->

    <title>error</title>
    <link rel="shortcut icon" href="image/fy_logo.png" />
    <link type="text/css" rel="stylesheet" href="css/error.css" />
</head>
<body>
<div class="error_wrapper">
    <div class="error_div">
        <h2>您访问的页面暂时无法显示</h2>
        <span>您正在浏览的页面可能已被删除、重命名或暂时不可用</span><br><br>
        <#--<span><span id="count">6</span>秒后自动跳转，如果你的浏览器没有自动跳转，请<a href=${errorURL }>点击这里>></a></span>-->
    </div>
</div>
</body>

<script>
    var timer = setInterval(function () {
        var count = document.getElementById("count").innerHTML-1
        document.getElementById("count").innerHTML = count

        if (count === 0){
            clearInterval(timer)
        }
    },1000)
</script>

</html>

