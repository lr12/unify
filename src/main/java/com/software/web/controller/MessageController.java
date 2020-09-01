package com.software.web.controller;

import com.software.model.ShareModel;
import com.software.service.MessageService;
import com.software.util.ResultVO;
import com.software.web.controller.vo.FollowVO;
import com.software.web.controller.vo.MessageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Controller
@RequestMapping("/message")
public class MessageController {
	
	//private static final Logger log = LoggerFactory.getLogger(MessageController.class);
	
	@Autowired
	private MessageService messageService;
	
	/**
	 * 我的私信列表
	 * @param userId 当前用户id
	 * @param pageSize 每页显示数量
	 * @param pageNo 当前页
	 * */
	@RequestMapping(value="msgList.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO msgList(@RequestParam("userId")String userId, @RequestParam("pageNo")Integer pageNo,
							@RequestParam("pageSize")Integer pageSize) {
		return messageService.msgList(userId,pageNo,pageSize);
	}
	
	/**
	 * 我的私信详情
	 * @param userId 当前用户id
	 * @param friendId 好友id
	 * @param pageSize 每页显示数量
	 * @param pageNo 当前页
	 * */
	@RequestMapping(value="msgDetail.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO msgDetail(@RequestParam("userId")String userId,@RequestParam("friendId")String friendId,@RequestParam("pageNo")Integer pageNo,
    					  @RequestParam("pageSize")Integer pageSize) {
		return messageService.msgDetail(userId,friendId,pageNo,pageSize);
	}
	
	/**
	 * 我的私信列表页面删除整个会话接口
	 * @param userId 当前用户id
	 * @param friendId 好友id
	 * */
	@RequestMapping(value="delDetail.do",method = RequestMethod.POST)
	@ResponseBody
    public ResultVO delDetail(HttpServletRequest request, HttpServletResponse response, @RequestBody MessageVO messageVO) {
		return messageService.delDetail(messageVO.getUserId(),messageVO.getFriendId());
	}
	
	/**
	 * 获取用户未读消息数量
	 * @param userId 当前用户id
	 * @param friendId 好友id
	 * */
	@RequestMapping(value="unReadCount.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO unReadCount(@RequestParam("userId")String userId,@RequestParam("friendId")String friendId) {
		return messageService.unReadCount(userId,friendId);
	}
	
	/**
	 * 消息发送接口
	 * @param userId 当前用户id
	 * @param friendId 好友id
	 * @param msgType 消息类型 1:普通消息 2:系统消息
	 * @param msgContext 消息内容
	 * */
	@RequestMapping(value="sendMsg.do",method = RequestMethod.POST)
	@ResponseBody
    public ResultVO sendMsg(HttpServletRequest request, HttpServletResponse response, @RequestBody MessageVO messageVO) {

		return messageService.sendMsg(messageVO.getUserId(),messageVO.getFriendId(),messageVO.getMsgType(),messageVO.getMsgContext());
	}
	
	/**
	 * 关注/取消关注好友
	 * @param userId 当前用户id
	 * @param friendId 好友id
	 * @param type 1:关注 2:取消关注
	 * */
	@RequestMapping(value="follow.do",method = RequestMethod.POST)
	@ResponseBody
    public ResultVO follow(HttpServletRequest request, HttpServletResponse response, @RequestBody FollowVO followVO) {
		return messageService.follow(followVO.getUserId(),followVO.getFriendId(),followVO.getType());
	}
	
	/**
	 * 关注列表接口
	 * @param userId 当前用户id
	 * @param name 好友名称
	 * @param pageSize 每页显示数量
	 * @param pageNo 当前页
	 * */
	@RequestMapping(value="applyList.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO applyList(@RequestParam("userId")String userId,@RequestParam(value="name", required = false)String name
    		,@RequestParam("pageNo")Integer pageNo,@RequestParam("pageSize")Integer pageSize) {
		return messageService.applyList(userId,name,pageNo,pageSize);
	}
	
	/**
	 * 粉丝列表接口
	 * @param userId 当前用户id
	 * @param pageSize 每页显示数量
	 * @param pageNo 当前页
	 * */
	@RequestMapping(value="fansList.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO fansList(@RequestParam("userId")String userId,@RequestParam("pageNo")Integer pageNo,@RequestParam("pageSize")Integer pageSize) {
		return messageService.fansList(userId,pageNo,pageSize);
	}
	
	/**
	 * 互相关注列表接口
	 * @param userId 当前用户id
	 * @param pageSize 每页显示数量
	 * @param pageNo 当前页
	 * */
	@RequestMapping(value="crossList.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO crossList(@RequestParam("userId")String userId,@RequestParam("pageNo")Integer pageNo,@RequestParam("pageSize")Integer pageSize) {
		return messageService.crossList(userId,pageNo,pageSize);
	}
	
	/**
	 * 发现共同好友列表接口
	 * @param userId 当前用户id
	 * */
	@RequestMapping(value="commonFriend.do", method = RequestMethod.GET)
	@ResponseBody
    public ResultVO commonFriend(@RequestParam("userId")String userId) {
		return messageService.commonFriend(userId);
	}
	
}
