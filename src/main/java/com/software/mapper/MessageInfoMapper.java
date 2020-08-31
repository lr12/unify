package com.software.mapper;

import com.software.entity.MessageInfo;

import java.util.List;



/**
 * 消息内容Mapper接口
 * 
 * @author maidou
 * @date 2020-08-08
 */
public interface MessageInfoMapper 
{
    /**
     * 查询消息内容
     * 
     * @param id 消息内容ID
     * @return 消息内容
     */
    public MessageInfo selectMessageInfoById(String id);

    /**
     * 查询消息内容列表
     * 
     * @param messageInfo 消息内容
     * @return 消息内容集合
     */
    public List<MessageInfo> selectMessageInfoList(MessageInfo messageInfo);

    /**
     * 新增消息内容
     * 
     * @param messageInfo 消息内容
     * @return 结果
     */
    public int insertMessageInfo(MessageInfo messageInfo);

    /**
     * 修改消息内容
     * 
     * @param messageInfo 消息内容
     * @return 结果
     */
    public int updateMessageInfo(MessageInfo messageInfo);

    /**
     * 删除消息内容
     * 
     * @param id 消息内容ID
     * @return 结果
     */
    public int deleteMessageInfoById(String id);

    /**
     * 批量删除消息内容
     * 
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    public int deleteMessageInfoByIds(String[] ids);
}
