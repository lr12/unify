package com.software.util;

import java.util.Stack;

public class NavigationGetterUtil {
    //定义存储字符的栈
    private Stack<Character> charStack = null;

    //定义存储字符串的栈
    private Stack<String> stringStack =null;

    /**
     * 方法说明：出入口函数，获取html标签完整的导读
     * 参数说明：str 目标字符串
     * 参数说明：leng 导读的长度
     * 返回值：  html标签完整的字符串
     */
    public String getPeffectNavigation(String str,int length){
        str = getNavigWithCorrectTag(str, length);
        str = repairNavigition(str);
        return str;
    }
    /**
     * @function      获取导读，保证标签不被破坏
     * @param str  目标字符串
     * @param length 导读的长度
     * @return   标签不被破坏的字符串
     */
    //保证标签的正确
    public  String  getNavigWithCorrectTag(String str,int length){

        StringBuffer strBuffer =new StringBuffer();
        int count=0; //统计取到的字符数
        //初始化栈
        charStack = new Stack<Character>();
        for(int i=0;str!=null;i++){
            char c = str.charAt(i);

            if(c=='<'){
                //入栈操作
                charStack.push(c);
            }
            if(c=='>'){

                //出栈操作
                charStack.pop();
            }
            strBuffer.append(c);
            count++;
            if(i>=str.length()){
                break;
            }else{
                if(count>=length){

                    //空栈时
                    if(charStack.isEmpty()){
                        break;
                    }
                }
            }
        }
        return strBuffer.toString();
    }

    /**
     * @function 进一步匹配标签
     * @param str 目标字符串
     * @return  匹配好标签的字符串
     */
    public String repairNavigition(String str){

        //初始化字符串栈
        stringStack = new Stack<String>();
        StringBuffer strBuffer =new StringBuffer();
        for(int i=0;str!=null&&i<str.length();){

            char c = str.charAt(i);

            //逐个获取html标签
            if(c=='<'){
                String tempStr = "";
                tempStr = tempStr +c;
                while(true){
                    i=i+1;
                    tempStr += str.charAt(i);
                    if(str.charAt(i)=='>'){
                        i++;
                        break;
                    }
                }

                if(!(tempStr.equalsIgnoreCase("<br>")||tempStr.equalsIgnoreCase("<hr>"))){

                    //非br/hr标签时
                    if(!(tempStr.contains("</"))&&!tempStr.contains("/>")){

                        //起始标签时入栈
                        stringStack.push(tempStr);

                        //存储
                        strBuffer.append(tempStr);
                    }else{

                        //结束标签时，取栈顶元素
                        String startTag = stringStack.peek();

                        //取出temStr的2至length-1子串并判断是否匹配，看是否包含在栈顶元素中，若包含则匹配
                        if(startTag.contains(tempStr.substring(2, tempStr.length()-1))){

                            //匹配时出栈
                            stringStack.pop();
                            strBuffer.append(tempStr);
                        }else{

                            //不匹配时说明当前标签是个单标签，直接加入
                            strBuffer.append(tempStr);
                        }
                    }

                }else{

                    //br hr 标签直接加入
                    strBuffer.append(tempStr);
                }
            }else{
                //普通字符时直接加入
                strBuffer.append(str.charAt(i++));
            }
        }

        //当栈不为空时，说明有未匹配的标签
        while(!stringStack.isEmpty()){

            //取栈顶
            String startTag = stringStack.peek();

            //构造与之对应的结束标签
            for(int j=0;j<startTag.length();j++){
                if(startTag.charAt(j)!=' '&&startTag.charAt(j)!='>'){
                    strBuffer.append(startTag.charAt(j));
                }else{
                    break;
                }
            }
            strBuffer.append("/>");

            //栈顶元素出栈
            stringStack.pop();
        }
        return strBuffer.toString();
    }
}
