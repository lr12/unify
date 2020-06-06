<div class="modal fade" id="upUser" tabindex="-1" role="dialog"
	aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 600px; ">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">修改用户信息</h4>
			</div>
			<div class="modal-body" style="	padding-bottom:20px;">
				<div class="field-content" style="overflow-y:auto;">

					<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 22px">用户名</label>
						<div class="col-sm-10">
							<input class="form-control" name="up-userid" id="up-userid"
								placeholder="请输入用户名" readOnly="true">
						</div>
					</div>
					</br> </br>
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 40px">密码</label>
						<div class="col-sm-10">
							<input class="form-control" name="up-password" id="up-password"
								placeholder="请输入密码" readOnly="true" value="****">
						</div>
					</div>
						</br> </br>
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 40px">姓名</label>
						<div class="col-sm-10">
							<input class="form-control" name="up-name" id="up-name"
								placeholder="请输入姓名">
						</div>
					</div>


					</br> </br>
						<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 5px">用户身份</label>
						<div class="col-sm-10">
							<select class="form-control"
							style="font-size:17px" name="up-type"
							id="up-type">
							<option selected>系统管理员</option>
							<option selected>发起方</option>
							<option selected>审批方</option>

						</select>
						</div>
					</div>

                    
                    </br> </br>
						<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 5px">手机号码</label>
						<div class="col-sm-10">
							<input class="form-control" name="up-sjhm" id="up-sjhm"
								placeholder="请输入手机号码">
						</div>
					</div>
					
					 </br> </br>
						<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 5px">应用系统</label>
						<div class="col-sm-10">
							<input class="form-control" name="up-yyxt" id="up-yyxt"
								placeholder="请输入应用系统(应用系统之间用空格隔开)">
						</div>
					</div>
					
					</br> </br>
						<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:6px 0px 0px 5px">公司单位</label>
						<div class="col-sm-10">
							<input class="form-control" name="up-gs" id="up-gs"
								placeholder="请输入公司单位">
						</div>
					</div>


					</br> </br>
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label"
							style="font-size:18px;padding:10px 0px 0px 5px">个人描述</label>
						<div class="col-sm-10">
							<textArea class="form-control" placeholder="请输入个人描述" name="up-ms"
								id="up-ms" style="height:80px"></textArea>

						</div>

					</div>
				</div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				<button type="button" class="btn btn-primary" data-dismiss="modal"
					id="save">保存</button>
			</div>
		</div>
	</div>
</div>