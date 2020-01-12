package com.software.business.decisionTree;

import java.util.Vector;

/**主函数
 * @author：Dyl
 *
 */
public class Main {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		//获取数据
		File file=new File();
		String urlTest="D:\\J2EE\\wap\\src\\main\\resources\\decide\\all.txt";
		String urlPredict="D:\\J2EE\\wap\\src\\main\\resources\\decide\\predict.txt";
		Vector<Object> shuXing=file.getShuXing(urlTest);// 获取属性
		Vector<Object>[] testDate=file.readData(urlTest);//获取样本数据-不包括头属性
		Vector<Object[]> predictData=file.readPredictData(urlPredict);//获取测试数据
		file=null;
		//建树
		TreeNode rootNode=JCTree.createTree(shuXing,testDate);
		//打印树结构
		System.out.println("决策树结构如下： ");
		JCTree.showTree(rootNode,0);
		//计算测试的成功率
		System.out.print("\n决策树的成功率为： ");
		double temp=0;
		temp=JCTree.suceessGl(rootNode,shuXing,predictData);
		System.out.println((float)temp*1000/10+"%");
	}
}
