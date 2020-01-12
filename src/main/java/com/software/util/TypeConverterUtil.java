package com.software.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.BeanUtils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.util.Date;

/**
 * ����ת��
 */
public class TypeConverterUtil {
    private static Logger logger = LogManager.getLogger(TypeConverterUtil.class.getName());

    /**
     * stringתboolean
     * <p>
     * strΪ"Y":true
     * strΪ"N":false
     * ����:null
     *
     * @param str
     * @return
     */
    public static Boolean strToBoolean(String str) {
        if (StringUtils.isBlank(str))
            return null;
        else if (StringUtils.equals(str, "Y"))
            return true;
        else {
            return false;
        }
    }

    /**
     * booleanתstring
     * <p>
     * booleanΪtrue����Y��
     * booleanΪfalse����N��
     * ���򣺡���
     *
     * @param boo
     * @return
     */
    public static String booleanToStr(Boolean boo) {
        return boo == null ? "" : (boo ? "Y" : "N");
    }

    /**
     * stringתdate
     * ʹ��"yyyy-MM-dd"��ʽ
     *
     * @param str
     * @return
     */
    public static Date strToDate(String str) {
        return strToDate(str, "yyyy-MM-dd");
    }

    /**
     * ���ɸ�ʽ��ʱ��רΪ�¸�ʽ��ʱ��
     * @param date
     * @param oldFormat
     * @param newFormat
     * @return
     */
    public static String dateFormatConvert(String date,String oldFormat,String newFormat){
        if (date=="")return "";
        try {
            Date D = DateUtils.parseDate(date,oldFormat);
            return DateFormatUtils.format(D,newFormat);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return "";
    }
    /**
     * dateתstring
     * ʹ��"yyyy-MM-dd"��ʽ
     *
     * @param date
     * @return
     */
    public static String dateToStr(Date date) {
        return dateToStr(date, "yyyy-MM-dd");
    }

    /**
     * stringתdate
     * <p>
     * ���ת��ʧ�ܣ�����null
     *
     * @param str
     * @return
     */
    public static Date strToDate(String str, String pattern) {
        Date res = null;
        if (StringUtils.isBlank(str)) return null;
        try {
            res = DateUtils.parseDate(str, pattern);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return res;
    }

    /**
     * dateתstring
     * <p>
     * ���dateΪnull���ء���
     *
     * @param date
     * @return
     */
    public static String dateToStr(Date date, String pattern) {
        if (date == null) return "";
        return DateFormatUtils.format(date, pattern);
    }

    public static Integer strToInt(String i) {
        return StringUtils.isBlank(i) ? 0 : Integer.parseInt(i);
    }

    /**
     * modelת��entity
     *
     * @param modelClass
     * @param entityClass
     * @param source
     * @return
     */
    public static Object modelToEntity(Class modelClass, Class entityClass, Object source) {
        return TypeConverterUtil.modelToEntity(modelClass,entityClass,source,"yyyy-MM-dd");
    }
    /**
     * modelת��entity
     *
     * @param modelClass
     * @param entityClass
     * @param source
     * @param dateFormat
     * @return
     */
    public static Object modelToEntity(Class modelClass, Class entityClass, Object source,String dateFormat) {
        if (source == null) return null;
        Object res = null;
        try {
            res = entityClass.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        BeanUtils.copyProperties(source, res);
        Field[] entityFields = entityClass.getDeclaredFields();
        Field[] modelFields = modelClass.getDeclaredFields();
        try {
            for (Field field : entityFields) {
                if (hasField(modelFields, field.getName())) {
                    if (field.getType() == Boolean.class&&modelClass.getDeclaredField(field.getName()).getType()==String.class) {
                        //��ͬ���ֶ���һ��ΪBooleanһ��ΪString
                        field.setAccessible(true);
                        Method method = entityClass.getDeclaredMethod("set" + StringUtils.capitalize(field.getName()), Boolean.class);
                        Field modelField = modelClass.getDeclaredField(field.getName());
                        modelField.setAccessible(true);
                        method.invoke(res, TypeConverterUtil.strToBoolean((String) modelField.get(source)));
                        modelField.setAccessible(false);
                        field.setAccessible(false);
                    }
                    if (field.getType() == Date.class&&modelClass.getDeclaredField(field.getName()).getType()==String.class) {
                        //��ͬ���ֶ���һ��ΪDateһ��ΪString
                        field.setAccessible(true);
                        Method method = entityClass.getDeclaredMethod("set" + StringUtils.capitalize(field.getName()), Date.class);
                        Field modelField = modelClass.getDeclaredField(field.getName());
                        modelField.setAccessible(true);
                        method.invoke(res, TypeConverterUtil.strToDate((String) modelField.get(source),dateFormat));
                        modelField.setAccessible(false);
                        field.setAccessible(false);
                    }
                }

            }
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return res;
    }

    /**
     * entityתΪmodel
     *
     * @param entityClass
     * @param modelClass
     * @param entity
     * @return
     */
    public static Object entityToModel(Class entityClass, Class modelClass, Object entity){
        return TypeConverterUtil.entityToModel(entityClass,modelClass,entity,"yyyy-MM-dd");
    }
    /**
     * entityתΪmodel
     *
     * @param entityClass
     * @param modelClass
     * @param entity
     * @return
     */
    public static Object entityToModel(Class entityClass, Class modelClass, Object entity,String dateFormat) {
        if (entity == null) return null;
        Object res = null;
        try {
            res = modelClass.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        BeanUtils.copyProperties(entity, res);
        Field[] fields = entityClass.getDeclaredFields();
        Field[] modelFields = modelClass.getDeclaredFields();
        for (Field field : fields) {
            if (hasField(modelFields, field.getName())) {
                //�ҵõ�����һ�µ��ֶ�
                try {
                    if (field.getType() == Boolean.class && modelClass.getDeclaredField(field.getName()).getType() == String.class) {
                        //һ����Boolean����һ����String
                        field.setAccessible(true);
                        Method method = modelClass.getMethod("set" + StringUtils.capitalize(field.getName()), String.class);
                        method.invoke(res, TypeConverterUtil.booleanToStr((Boolean) field.get(entity)));
                        field.setAccessible(false);
                    }

                    if (field.getType() == Date.class && modelClass.getDeclaredField(field.getName()).getType() == String.class) {
                        //��ͬ���ֶ���һ��ΪDateһ��ΪString
                        field.setAccessible(true);
                        Method method = modelClass.getMethod("set" + StringUtils.capitalize(field.getName()), String.class);
                        method.invoke(res, TypeConverterUtil.dateToStr((Date) field.get(entity),dateFormat));
                        field.setAccessible(false);
                    }
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (NoSuchFieldException e) {
                    e.printStackTrace();
                }
            }
        }
        return res;
    }

    private static boolean hasField(Field[] fields, String fieldName) {
        for (Field f : fields) {
            if (StringUtils.equals(f.getName(), fieldName)) {
                return true;
            }
        }
        return false;
    }

}

