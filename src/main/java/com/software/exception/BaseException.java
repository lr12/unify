package com.software.exception;

public class BaseException extends RuntimeException {

    /**
     * @Fields serialVersionUID
     */
    private static final long serialVersionUID = 896610542617189773L;

    /**
     * BaseException�а������쳣��Ϣ
     */
    private String exceptionMessage;

    /**
     * �޲ι��췽��
     *
     */
    public BaseException() {

    }

    /**
     * �вι��췽��
     * <p>
     *
     * @param msg
     *            �쳣��Ϣ
     *
     */
    public BaseException(String msg) {
        this.exceptionMessage = msg;
    }

    /**
     * �вι��췽��
     *
     * @param msg
     *            �쳣��Ϣ
     * @param e
     *            �쳣�����ĸ�Դ,Throwable object.
     *
     */
    public BaseException(String msg, Throwable e) {
        this.exceptionMessage = msg;
        this.initCause(e);
    }

    /**
     * �����쳣�����ĸ�Դ
     *
     * @param e
     *            �쳣�����ĸ�Դ,Throwable object.
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
     * ����쳣��Ϣ. �ȼ���Exception.getMessage().
     *
     * @see java.lang.Throwable#getMessage()
     */
    public String getMessage() {
        return exceptionMessage;
    }
}
