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
        <h2>�����ʵ�ҳ����ʱ�޷���ʾ</h2>
        <span>�����������ҳ������ѱ�ɾ��������������ʱ������</span><br><br>
        <#--<span><span id="count">6</span>����Զ���ת�������������û���Զ���ת����<a href=${errorURL }>�������>></a></span>-->
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

