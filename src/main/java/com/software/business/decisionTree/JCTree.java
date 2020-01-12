package com.software.business.decisionTree;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;



/**
 * 决策树
 * @author:lr12
 * 
 */
public class JCTree {

	/**
	 * 建立决策树
	 * @param shuXing：属性
	 * @param testData：样本数据
	 * @return
	 */
	public static TreeNode createTree(Vector<Object> shuXing,
			Vector<Object>[] testData) {
		int maxGainIndex = -1;// 记录增益最大的列
		double gain = 0;
		double maxGain = 0;
		TreeNode fatherNode = new TreeNode();
		fatherNode.setShuXing(shuXing);// 设置属性
		// 计算熵
		for (int i = 0; i < shuXing.size() - 1; i++) {
			gain = Gain.infoD(testData, shuXing.size() - 1)
					- Gain.infoSX(testData, i, shuXing.size() - 1);// 某一列的info
			if (maxGain < gain) {
				maxGainIndex = i;
				maxGain = gain;
			}
		}
		if (maxGainIndex == -1) {
			return null;
		}
		Vector<Object> splitSX = Gain.getSX(testData, maxGainIndex);
		fatherNode.setNodeName(shuXing.get(maxGainIndex));
		fatherNode.setSplitShuXing(splitSX);// 最大熵值进行分裂属性

		// 添加子节点
		for (int i = 0; i < splitSX.size(); i++) {
			Vector<Object>[] splitData = splitData(testData, maxGainIndex,
					splitSX.get(i));// //////////////////maxGainIndex没处理
			Vector<Object> lastRow = Gain
					.getSX(splitData, splitData.length - 1);// 拿到最后一列的属性
			TreeNode sonNode = new TreeNode();
			if (lastRow.size() == 1) {// 全为一种属性，unacc、acc、good、vgood，这种是最纯的属性
				sonNode.setNodeName(lastRow.get(0));
			} else {
				Vector<Object> newShuXing = new Vector<Object>();
				// 重新处理新的属性集,删掉多余的属性集
				for (Object ob : shuXing) {
					if (!ob.toString().equals(
							shuXing.get(maxGainIndex).toString())) {
						newShuXing.add(ob);
					}
				}
				// System.out.println(newShuXing);
				Vector<Object>[] newDataSet = new Vector[splitData.length - 1];
				int t = 0;
				for (int j = 0; j < splitData.length; j++) {
					if (j == maxGainIndex) {
						continue;
					}
					newDataSet[t++] = (Vector<Object>) splitData[j].clone();
				}
				// // System.out.println(newDataSet[0].size());
				sonNode = createTree(newShuXing, newDataSet);// 子节点继续扩展创建树
			}
			if (sonNode != null) {
				fatherNode.addSonNode(sonNode);
			}
		}
		return fatherNode;
	}

	/**
	 * 根据属性分离表
	 * @param testData
	 * @param maxGainIndex
	 * @param object
	 * @return
	 */
	private static Vector<Object>[] splitData(Vector<Object>[] testData,
			int maxGainIndex, Object object) {
		Vector<Object>[] splitBiao = new Vector[testData.length];
		for (int i = 0; i < splitBiao.length; i++) {
			splitBiao[i] = new Vector<Object>();
		}
		for (int i = 0; i < testData[maxGainIndex].size(); i++) {// i行
			Object object2 = testData[maxGainIndex].get(i);
			if (object2.toString().equals(object.toString())) {
				for (int j = 0; j < splitBiao.length; j++) {
					splitBiao[j].add(testData[j].get(i));
				}
			}
		}
		return splitBiao;
	}

	/**
	 * 打印决策树
	 * @param rootNode
	 */
	public static void showTree(TreeNode rootNode, int ceng) {
		System.out.println(rootNode.getNodeName());
		List<Object> splitShuXing = rootNode.getSplitShuXing();
		ArrayList<TreeNode> sonNode = rootNode.getSonNode();
		if (splitShuXing != null) {// 如果没有分支
			for (int i = 0; i < splitShuXing.size(); i++) {
				for (int j = 0; j <= ceng; j++)
					System.out.print("     ");
				System.out.print(splitShuXing.get(i) + "-->");
				showTree(sonNode.get(i), (ceng + 1));
			}
		}
	}

	/**
	 * 计算成功率，并打印出结果
	 * @param rootNode
	 * @param shuXing
	 * @param predictData
	 */
	public static double suceessGl(TreeNode rootNode, Vector<Object> shuXing,
			Vector<Object[]> predictData) {
		int sucess = 0;
		for (int i = 0; i < predictData.size(); i++) {
			Object object = getResult(rootNode, shuXing, predictData.get(i));//uacc ,acc, good,vgood
			if (object.toString().equals(
					predictData.get(i)[(predictData.get(i).length-1)].toString())) {
				sucess++;
			}
		}
		return (double) sucess / predictData.size();

	}

	/**
	 * 通过根节点开始访问，得出每一条记录的结果
	 * @param rootNode
	 * @param shuXing
	 * @param
	 * @return
	 */
	public static Object getResult(TreeNode rootNode, Vector<Object> shuXing,
			Object[] eachRow) {
			if (rootNode.getSonNode().size()==0) {
				return rootNode.getNodeName();
			}
			Object nodeName=rootNode.getNodeName();
			int index=shuXing.indexOf(nodeName);
			Object splitSX=eachRow[index];
			int sxIndex=0;
			for (int i = 0; i < rootNode.getSplitShuXing().size(); i++) {
				Object temp =rootNode.getSplitShuXing().get(i);
				if (splitSX.toString().equals(temp.toString())) {
					sxIndex=i;
				}
			}
		return getResult(rootNode.getSonNode().get(sxIndex),shuXing,eachRow);
	}


}
