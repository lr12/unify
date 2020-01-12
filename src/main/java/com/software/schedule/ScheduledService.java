package com.software.schedule;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Created by lr12 on 2018/12/19.
 */
@Slf4j
@Component
public class ScheduledService {
    @Scheduled(cron = "0/5 * * * * *")
    public void scheduledImportWs(){
        log.info("=====>>>>>ʹ��cron  {}",System.currentTimeMillis());
    }
 /*   @Scheduled(cron = "0 0 1 ? * L")
    public void scheduledImportToicWs() {
        for(DataSourceEnum dataSourceEnum:DataSourceEnum.values()){
            for(String topic:Topics){
                wsdyModelService.drTopicWsSchedule(dataSourceEnum.getFydm(),topic,begin,end);
            }
        }
    }*/
}

