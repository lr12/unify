package com.software.web;

import com.google.gson.Gson;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * Http��Ӧ�Ĺ�����
 * 
 * @author zym
 * 
 */
@Component
public class ResponseBuilder {
	
	/**
	 * Ĭ�ϵ��ַ���
	 */
	private static final String DEFAULT_CHARSET = "utf-8";
	
	
	/**
	 * ����Json��ʽ�Ľ��
	 * 
	 * @param response http��Ӧ����
	 * @param content ��Ӧ����
	 * @throws IOException 
	 */
	public void writeJsonResponse(HttpServletResponse response, String content) throws IOException {
		response.addHeader("Content-Type", "application/json;charset=" + DEFAULT_CHARSET);
		//response.set
        response.setCharacterEncoding(DEFAULT_CHARSET);
        
        PrintWriter writer = response.getWriter();
        writer.write(content);
        writer.flush();
        writer.close();
	}
	
	public void writeAjaxJsonResponse(HttpServletResponse response, String content) throws IOException {
		response.addHeader("Content-Type", "text/html;charset=" + DEFAULT_CHARSET);
		//response.set
        response.setCharacterEncoding(DEFAULT_CHARSET);
        
        PrintWriter writer = response.getWriter();
        writer.write(content);
        writer.flush();
        writer.close();
	}
	
	/**
	 * 
	 * @param response
	 * @param o
	 * @throws Exception
	 */
	public void writeAjaxJsonResponse(HttpServletResponse response, Object o) throws IOException{
		Gson gson = new Gson();
		String content = gson.toJson(o);
		writeAjaxJsonResponse(response, content);
	}
	
	/**
	 * 
	 * @param response
	 * @param o
	 * @throws Exception
	 */
	public void writeJsonResponse(HttpServletResponse response, Object o) throws IOException{
		Gson gson = new Gson();
		String content = gson.toJson(o);
		writeJsonResponse(response, content);
	}
	
	/**
	 * 
	 * @param response
	 * @param o
	 * @throws Exception
	 */
	public void writeJsonResponseAH(HttpServletResponse response, String o) throws IOException{
		Gson gson = new Gson();
		String content = gson.toJson(o);
		writeJsonResponse(response, content);
	}
	
	/**
	 * ���������ת����json��ʽ����
	 *  
	 * @param response http��Ӧ����
	 * @throws Exception
	 */
	public void writeJsonResponseFafs(HttpServletResponse response, String fafs) throws Exception{
		Gson gson = new Gson();
		String strJson = gson.toJson(fafs);
		writeJsonResponse(response, strJson);
	}
}