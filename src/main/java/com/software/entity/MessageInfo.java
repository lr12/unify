package com.software.entity;


/**
 * 消息内容对象 message_info
 * 
 * @author maidou
 * @date 2020-08-08
 */
public class MessageInfo 
{

    /** 主键Id */
    private String id;

    /** 消息内容 */
    private String message;

    public void setId(String id) 
    {
        this.id = id;
    }

    public String getId() 
    {
        return id;
    }
    public void setMessage(String message) 
    {
        this.message = message;
    }

    public String getMessage() 
    {
        return message;
    }

}
