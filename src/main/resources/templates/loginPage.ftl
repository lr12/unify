<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>登录界面</title>

<#include "./pop/common_css.ftl">


</head>

<body>
<!-- Navigation -->

<div class="container">
    <div class="row">
        <div class="col-md-4 col-md-offset-4">
            <div class="login-panel panel panel-default" style="width: 360px;height: 310px;">
                <!--  <div class="panel-heading">
                     <h3 class="panel-title">Please Sign In</h3>
                 </div> -->
                <div class="panel-body" style="padding-left: 30px;padding-right: 30px;">
                    <form role="form" action="login.do"  method="post" style="margin-top: 36px;">
                        <fieldset>
                            <div class="form-group" style="margin-bottom: 20px;">
                                <input class="form-control" id="userid" name="userid" style="height: 40px;" placeholder="请输入用户名" <#if loginFail?if_exists >value="${userid}" </#if>
                            </div>
                            <div class="form-group"  style="margin-bottom: 20px;margin-top: 30px;">
                                <input class="form-control" id="password" name="password" style="height: 40px;" placeholder="请输入密码" name="password" type="password" <#if loginFail?if_exists >value="${password}" </#if>>
                            </div>
                        <#if loginFail?if_exists ><p style="color:red">用户名密码错误</p></#if>
                            <div class="checkbox">
                                <label>
                                    <input name="remember" type="checkbox" value="Remember Me">记住密码
                                </label>
                            </div>

                            <!-- Change this to a button or input when using this as a form -->
                            <button  style="background-color: #337ab7;border-color: #337ab7;margin-top: 17px;" class="btn btn-lg btn-success btn-block">登录</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<#include "./pop/common_js.ftl">

</body>

</html>
