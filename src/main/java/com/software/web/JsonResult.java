package com.software.web;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * just for json result 
 * @author LUJIAN
 *
 */
public class JsonResult {
	
	private final Map<String, Object> map = Maps.newLinkedHashMap();
	
	private Map<String, List<String>> errorMap;
	
	public JsonResult(){
	}

	public static JsonResult useDefault(boolean success) {
		JsonResult jr = new JsonResult();
		jr.add("success", success);
		jr.add("message", "");
		jr.add("content", new JSONObject());
		return jr;
	}
	
	public static JsonResult useDefault(boolean success, String message) {
		JsonResult jr = new JsonResult();
		jr.add("success", success);
		jr.add("message", message);
		jr.add("content", new JSONObject());
		return jr;
	}
	
	public static JsonResult useDefault(boolean success, String message, Object content) {
		JsonResult jr = new JsonResult();
		jr.add("success", success);
		jr.add("message", message);
		jr.add("content", content);
		return jr;
	}

	public JsonResult add(String key, Object val) {
		if( key == null){
			return this;
		}
		if( val == null){
			addError(key, val);
			return this;
		}
		map.put(key, val);
		return this;
	}

	private void addError(String key, Object val) {
		if(this.errorMap == null){
			this.errorMap = Maps.newLinkedHashMap();
			this.errorMap.put("error", new ArrayList<String>());
		}
		List<String> list = (List<String>) this.errorMap.get("error");
		list.add(String.format("key:%s, val:%s", key, val));
	}

	public ImmutableMap<Object, Object> build() {
		return ImmutableMap.builder().putAll(this.map).build();
	}

}
