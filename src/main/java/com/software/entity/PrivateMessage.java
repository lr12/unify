package com.software.entity;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 私信消息对象 private_message
 * 
 * @author maidou
 * @date 2020-08-08
 */
public class PrivateMessage {

	
    /** 主键Id */
    private String id;

    /** 发送者Id */
    private String userId;

    /** 接受者Id */
    private String friendId;

    /** 发送者id */
    private String senderId;

    /** 接受者Id */
    private String receiverId;

    /** 消息类型,1：普通消息 2：系统消息 */
    private Integer messageType;

    /** 消息内容id */
    private String messageId;
    
    /** 消息内容 **/
    private String messageContext;

    /** 消息发送时间 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date sendTime;

    /** 消息状态 1：未读 2：已读 3：删除 */
    private Integer status;
    
    /** 未读消息数量 **/
    private String messageCount;
    
    /** 发送者名称**/
    private String sendName;
    
    /** 接收者名称**/
    private String receiverName;
    
    /** 发送者头像*/
    private String sendImg;
    
    
    public String getReceiverName() {
		return receiverName;
	}

	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}

	public String getMessageContext() {
		return messageContext;
	}

	public void setMessageContext(String messageContext) {
		this.messageContext = messageContext;
	}

	public String getMessageCount() {
		return messageCount;
	}

	public void setMessageCount(String messageCount) {
		this.messageCount = messageCount;
	}

	public String getSendName() {
		return sendName;
	}

	public void setSendName(String sendName) {
		this.sendName = sendName;
	}

	public String getSendImg() {
		return sendImg;
	}

	public void setSendImg(String sendImg) {
		this.sendImg = sendImg;
	}

	public void setId(String id) 
    {
        this.id = id;
    }

    public String getId() 
    {
        return id;
    }
    public void setUserId(String userId) 
    {
        this.userId = userId;
    }

    public String getUserId() 
    {
        return userId;
    }
    public void setFriendId(String friendId) 
    {
        this.friendId = friendId;
    }

    public String getFriendId() 
    {
        return friendId;
    }
    public void setSenderId(String senderId) 
    {
        this.senderId = senderId;
    }

    public String getSenderId() 
    {
        return senderId;
    }
    public void setReceiverId(String receiverId) 
    {
        this.receiverId = receiverId;
    }

    public String getReceiverId() 
    {
        return receiverId;
    }
    public void setMessageType(Integer messageType) 
    {
        this.messageType = messageType;
    }

    public Integer getMessageType() 
    {
        return messageType;
    }
    public void setMessageId(String messageId) 
    {
        this.messageId = messageId;
    }

    public String getMessageId() 
    {
        return messageId;
    }
    public void setSendTime(Date sendTime) 
    {
        this.sendTime = sendTime;
    }

    public Date getSendTime() 
    {
        return sendTime;
    }
    public void setStatus(Integer status) 
    {
        this.status = status;
    }

    public Integer getStatus() 
    {
        return status;
    }

}
