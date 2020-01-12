package com.software.exception;

public class BaseException extends RuntimeException {

    /**
     * @Fields serialVersionUID
     */
    private static final long serialVersionUID = 896610542617189773L;

    /**
     * BaseException中包含的异常消息
     */
    private String exceptionMessage;

    /**
     * 无参构造方法
     *
     */
    public BaseException() {

    }

    /**
     * 有参构造方法
     * <p>
     *
     * @param msg
     *            异常消息
     *
     */
    public BaseException(String msg) {
        this.exceptionMessage = msg;
    }

    /**
     * 有参构造方法
     *
     * @param msg
     *            异常消息
     * @param e
     *            异常产生的根源,Throwable object.
     *
     */
    public BaseException(String msg, Throwable e) {
        this.exceptionMessage = msg;
        this.initCause(e);
    }

    /**
     * 设置异常产生的根源
     *
     * @param e
     *            异常产生的根源,Throwable object.
     *
     */
    public void setCause(Throwable e) {
        this.initCause(e);
    }

    /**
     *
     * @see java.lang.Object#toString()
     */
    public String toString() {
        String s = getClass().getName();
        return s + ": " + exceptionMessage;
    }

    /**
     * 获得异常消息. 等价于Exception.getMessage().
     *
     * @see java.lang.Throwable#getMessage()
     */
    public String getMessage() {
        return exceptionMessage;
    }
}
