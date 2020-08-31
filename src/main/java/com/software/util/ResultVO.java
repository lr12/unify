package com.software.util;

import java.util.HashMap;
import java.util.Map;

/**
 * 返回数据
 * 
 * @author maidou
 */
public class ResultVO extends HashMap<String, Object> {
	private static final long serialVersionUID = 1L;
	
	public ResultVO() {
		put("code", 0);
		put("msg", "success");
	}
	
	public static ResultVO error() {
		return error(500, "未知异常，请联系管理员");
	}
	
	public static ResultVO error(String msg) {
		return error(500, msg);
	}
	
	public static ResultVO error(int code, String msg) {
		ResultVO r = new ResultVO();
		r.put("code", code);
		r.put("msg", msg);
		return r;
	}

	public static ResultVO ok(String msg) {
		ResultVO r = new ResultVO();
		r.put("msg", msg);
		return r;
	}
	
	public static ResultVO ok(Map<String, Object> map) {
		ResultVO r = new ResultVO();
		r.putAll(map);
		return r;
	}
	
	public static ResultVO ok() {
		return new ResultVO();
	}

	public ResultVO put(String key, Object value) {
		super.put(key, value);
		return this;
	}
}
