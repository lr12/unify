package com.software.datasource;

public class getpasswd {
    String l_fydm;
    String l_xlh;
    public String l_cnt;
    public String l_return;
    String l_temp;
    String ls_logid;
    int i, l_pos, li_row, li_col;
    char[][] temp = new char[4][4];

    public String f_char_changed(String l_char) {
        String l_return = "";
        String l_item;
        int lcl = l_char.length();
        for (i = 0; i < lcl; i++) {
            l_item = (l_char.substring(i, i + 1)).toLowerCase();
            int l = l_item.charAt(0);
            switch (l) {
                case 'a':
                    l_item = "75";
                    break;
                case 'b':
                    l_item = "61";
                    break;
                case 'c':
                    l_item = "94";
                    break;
                case 'd':
                    l_item = "71";
                    break;
                case 'e':
                    l_item = "80";
                    break;
                case 'f':
                    l_item = "34";
                    break;
                case 'g':
                    l_item = "80";
                    break;
                case 'h':
                    l_item = "23";
                    break;
                case 'i':
                    l_item = "80";
                    break;
                case 'j':
                    l_item = "34";
                    break;
                case 'k':
                    l_item = "23";
                    break;
                case 'l':
                    l_item = "34";
                    break;
                case 'm':
                    l_item = "94";
                    break;
                case 'n':
                    l_item = "23";
                    break;
                case 'o':
                    l_item = "34";
                    break;
                case 'p':
                    l_item = "94";
                    break;
                case 'q':
                    l_item = "23";
                    break;
                case 'r':
                    l_item = "75";
                    break;
                case 's':
                    l_item = "61";
                    break;
                case 't':
                    l_item = "71";
                    break;
                case 'u':
                    l_item = "61";
                    break;
                case 'v':
                    l_item = "75";
                    break;
                case 'w':
                    l_item = "61";
                    break;
                case 'x':
                    l_item = "23";
                    break;
                case 'y':
                    l_item = "71";
                    break;
                case 'z':
                    l_item = "23";
                    break;
                case '0':
                    l_item = "64";
                    break;
                case '1':
                    l_item = "36";
                    break;
                case '2':
                    l_item = "64";
                    break;
                case '3':
                    l_item = "33";
                    break;
                case '4':
                    l_item = "33";
                    break;
                case '5':
                    l_item = "36";
                    break;
                case '6':
                    l_item = "83";
                    break;
                case '7':
                    l_item = "36";
                    break;
                case '8':
                    l_item = "83";
                    break;
                case '9':
                    l_item = "83";
                    break;
                case ' ':
                    l_item = "64";
                    break;
                case '-':
                    l_item = "02";
                    break;


                default:
                    System.out.println(" switch default ");
            }
            l_return = l_return + l_item;
        }
        return l_return;
    }

    public String passwd(String l_fydm, String l_xlh) {
        this.l_fydm = l_fydm;
        this.l_xlh = l_xlh;
        l_temp = l_fydm;
        int lf = l_fydm.length();
        int lx = l_xlh.length();
        String l_return = "";

        if (lf < 10 || lx < 19)
            System.out.println("程序注册错误");
        else
            l_fydm = f_char_changed(l_fydm);
        l_cnt = f_char_changed(l_xlh);
        int lf1 = l_fydm.length();
        for (i = 0; i < lf1; i++) {
            l_return = l_return + l_fydm.substring(i, i + 1);
        }
        for (i = 0; i < lf1; i++) {
            l_pos = Integer.parseInt(l_fydm.substring(i, i + 1));
            l_return = l_return.substring(0, l_pos - 1) + l_xlh.substring(l_pos - 1, l_pos) + l_return.substring(l_pos - 1);
        }
        l_return = l_return.substring(0, 15);

        for (int i = 0; i < 16; i++) {
            if (l_return.contains("-")) {
                int lr = l_return.indexOf("-");
                l_return = l_return.substring(0, lr) + "_" + l_return.substring(lr + 1);
            }
        }
        l_return = "nju" + l_return;
        return l_return;
    }
}

       