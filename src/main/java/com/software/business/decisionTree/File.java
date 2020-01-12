package com.software.business.decisionTree;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Vector;

/**文件操作类
 * @author：Dyl
 * 
 */
public class File {

	/**
	 *读数据
	 * @throws Exception 
	 */
	public  Vector<Object>[] readData(String url) throws Exception {
		Vector<Object>[]vector = null;
		String[] list;
		InputStreamReader in = new InputStreamReader(new FileInputStream(url));
		BufferedReader reader = new BufferedReader(in);
		String line = reader.readLine();
		line = reader.readLine();//读了两行，跳过属性
		if (line!=null) {
			vector=new Vector[line.split(",").length];
			for (int i = 0; i < vector.length; i++) {
				vector[i]=new Vector<Object>();
			}
		}
		while ((line=reader.readLine()) != null) {
			String []s=line.split(",");
			for (int i = 0; i < vector.length; i++) {
				vector[i].add(s[i]);
			}
		}
		in.close();
		reader.close();
		return vector;		
	}
	
	
	
	/**获取属性
	 * @param urlTest：文件路径
	 * @return
	 * @throws IOException
	 */
	public Vector<Object> getShuXing(String urlTest) throws IOException {
		Vector<Object> vector=new Vector<Object>();
		InputStreamReader in = new InputStreamReader(new FileInputStream(urlTest));
		BufferedReader reader = new BufferedReader(in);
		String string=reader.readLine();
		if (!string.equals("")) {
			String []t=string.split(",");//读了两行
			for (String st : t) {
				vector.add(st);
			}
		}
		in.close();
		reader.close();
		return vector;
	}



	/**横着保存predict的数据
	 * @param urlPredict：文件路径
	 * @return
	 * @throws IOException 
	 */
	public Vector<Object[]> readPredictData(String urlPredict) throws IOException {
		Vector<Object[]>vector = new Vector<Object[]>();
		InputStreamReader in = new InputStreamReader(new FileInputStream(urlPredict));
		BufferedReader reader = new BufferedReader(in);
		String line = reader.readLine();
		line = reader.readLine();//读了两行，跳过属性
		while ((line=reader.readLine()) != null) {
			String []s=line.split(",");
			vector.add(s);
		}
		in.close();
		reader.close();
		return vector;		
	}
}
