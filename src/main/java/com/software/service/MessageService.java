package com.software.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.software.entity.FollowInfo;
import com.software.entity.MessageInfo;
import com.software.entity.PrivateMessage;
import com.software.mapper.FollowInfoMapper;
import com.software.mapper.MessageInfoMapper;
import com.software.mapper.PrivateMessageMapper;
import com.software.util.PageUtils;
import com.software.util.ResultVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;



@Service
public class MessageService {
	
	private static final Logger log = LoggerFactory.getLogger(MessageService.class);
	
	@Autowired
	private PrivateMessageMapper privateMessageMapper;
	@Autowired
	private MessageInfoMapper messageInfoMapper;
	@Autowired
	private FollowInfoMapper followInfoMapper;

	// 根据用户id获取消息列表
	public ResultVO msgList(String userId, Integer pageNo, Integer pageSize) {
		log.info(">>>>>>>>根据用户id获取消息列表>>>>userId:"+userId+">>>pageNo:"+pageNo+">>>>pageSize:"+pageSize+">>>>>");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pageSize", pageSize);
		map.put("pageNo", (pageNo - 1) * pageSize);
		map.put("userId", userId);
		List<PrivateMessage> list = privateMessageMapper.selectPrivateMessageList(map);
		int count = privateMessageMapper.countPrivateMessageList(map);
		PageUtils page = new PageUtils(list, count, pageSize, pageNo);
		return ResultVO.ok().put("page", page);
	}

	// 根据用户id和好友id查询私信详情记录
	public ResultVO msgDetail(String userId, String friendId, Integer pageNo, Integer pageSize) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pageSize", pageSize);
		map.put("pageNo", (pageNo - 1) * pageSize);
		map.put("userId", userId);
		map.put("friendId", friendId);
		List<PrivateMessage> list = privateMessageMapper.selectPrivateMessageDetail(map);
		int count = privateMessageMapper.countPrivateMessageDetail(map);
		// 将当前页未读消息标记为已读
		privateMessageMapper.updatePrivateMessageDetail(map);
		PageUtils page = new PageUtils(list, count, pageSize, pageNo);
		return ResultVO.ok().put("page", page);
	}

	// 我的私信列表页面删除整个会话接口
	public ResultVO delDetail(String userId, String friendId) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userId", userId);
		map.put("friendId", friendId);
		int del = privateMessageMapper.delPrivateMessageDetail(map);
		if(del>0) {
			return ResultVO.ok("删除成功");
		}else {
			return ResultVO.error("删除失败");
		}
	}

	// 获取用户未读消息数量
	public ResultVO unReadCount(String userId, String friendId) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userId", userId);
		map.put("friendId", friendId);
		int count = privateMessageMapper.unReadCount(map);
		return ResultVO.ok().put("count", count);
	}

	// 消息发送接口
	public ResultVO sendMsg(String userId, String friendId, Integer msgType, String msgContext) {
		
		if(StringUtils.isEmpty(msgContext)) {
			return ResultVO.error("消息内容不能为空");
		}
		// 保存消息至消息详情表
		String msgInfoId = UUID.randomUUID().toString().replaceAll("-", "");
		MessageInfo msgInfo = new MessageInfo();
		msgInfo.setId(msgInfoId);
		msgInfo.setMessage(msgContext);
		int saveInfo = messageInfoMapper.insertMessageInfo(msgInfo);
		// 保存消息发送表
		PrivateMessage pMsg = new PrivateMessage();
		pMsg.setId(UUID.randomUUID().toString().replaceAll("-", ""));
		pMsg.setUserId(userId);
		pMsg.setFriendId(friendId);
		pMsg.setSenderId(userId);
		pMsg.setReceiverId(friendId);
		pMsg.setMessageType(msgType);
		pMsg.setMessageId(msgInfoId);
		pMsg.setSendTime(new Date());
		pMsg.setStatus(1);// 未读
		int save1 = privateMessageMapper.insertPrivateMessage(pMsg);
		// 将userId、friendId 对调再次存储
		pMsg.setId(UUID.randomUUID().toString().replaceAll("-", ""));
		pMsg.setUserId(friendId);
		pMsg.setFriendId(userId);
		int save2 = privateMessageMapper.insertPrivateMessage(pMsg);
		if(saveInfo>0 && save1>0 && save2>0) {
			return ResultVO.ok("发送成功");
		}else {
			return ResultVO.error("发送失败");
		}
	}

	// 关注/取消关注好友
	public ResultVO follow(String userId, String friendId, Integer type) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userId", userId);
		map.put("friendId", friendId);
		map.put("pageSize", 10);
		map.put("pageNo", 0);
		FollowInfo followInfo = new FollowInfo();
		followInfo.setUserId(userId);
		followInfo.setFriendId(friendId);
		followInfo.setCreateTime(new Date());
		List<FollowInfo> list = followInfoMapper.selectFollowInfoList(map);
		if(1==type) {
			if(list.size()>0) {
				return ResultVO.error("已关注过该好友");
			}
			int save = followInfoMapper.insertFollowInfo(followInfo);
			if(save>0) {
				return ResultVO.ok("关注成功");
			}else {
				return ResultVO.error("关注失败");
			}
		}else if(2==type) {
			int del = followInfoMapper.deleteFollowInfoById(followInfo);
			if(del>0) {
				return ResultVO.ok("取消关注成功");
			}else {
				return ResultVO.error("取消关注失败,或因未关注过该好友");
			}
		}else {
			return ResultVO.error("参数类型错误");
		}
	}

	// 关注列表接口
	public ResultVO applyList(String userId, String name, Integer pageNo, Integer pageSize) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pageSize", pageSize);
		map.put("pageNo", (pageNo - 1) * pageSize);
		map.put("userId", userId);
		map.put("friendName", name);
		List<FollowInfo> list = followInfoMapper.selectFollowInfoList(map);
		// 判断是否互相关注
		for(FollowInfo fo:list) {
			FollowInfo foll = new FollowInfo();
			foll.setUserId(fo.getFriendId());
			foll.setFriendId(userId);
			FollowInfo f = followInfoMapper.selectFollowInfoBySelective(foll);
			if(null!=f) {
				fo.setCross(true);
			}else {
				fo.setCross(false);
			}
		}
		int count = followInfoMapper.countFollowInfoList(map);
		PageUtils page = new PageUtils(list, count, pageSize, pageNo);
		return ResultVO.ok().put("page", page);
	}

	// 粉丝列表接口
	public ResultVO fansList(String userId, Integer pageNo, Integer pageSize) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pageSize", pageSize);
		map.put("pageNo", (pageNo - 1) * pageSize);
		map.put("userId", userId);
		List<FollowInfo> list = followInfoMapper.selectFansList(map);
		// 判断是否互相关注
		for(FollowInfo fo:list) {
			FollowInfo foll = new FollowInfo();
			foll.setUserId(userId);
			foll.setFriendId(fo.getFriendId());
			FollowInfo f = followInfoMapper.selectFollowInfoBySelective(foll);
			if(null!=f) {
				fo.setCross(true);
			}else {
				fo.setCross(false);
			}
		}
		int count = followInfoMapper.countFansList(map);
		PageUtils page = new PageUtils(list, count, pageSize, pageNo);
		return ResultVO.ok().put("page", page);
	}

	// 互相关注列表
	public ResultVO crossList(String userId, Integer pageNo, Integer pageSize) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pageSize", pageSize);
		map.put("pageNo", (pageNo - 1) * pageSize);
		map.put("userId", userId);
		List<FollowInfo> list = followInfoMapper.selectCrossList(map);
		for(FollowInfo fo:list) {
			fo.setCross(true);
		}
		int count = followInfoMapper.countCrossList(map);
		PageUtils page = new PageUtils(list, count, pageSize, pageNo);
		return ResultVO.ok().put("page", page);
	}

	// 发现共同好友
	public ResultVO commonFriend(String userId) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userId", userId);
		List<FollowInfo> list = followInfoMapper.selectCommonFriendList(map);
		return ResultVO.ok().put("list", list);
	}
	
	

}
