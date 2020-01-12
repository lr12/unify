package com.software.business.apriori;


import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

/**
 * ��������
 * Ƶ������
 * @author lr12
 *
 */
public class AprioriUtil {

    public static void main(String[] args) throws Exception {

        // ��ʼ������
        List<Set<String>> trans = new LinkedList<Set<String>>();
        trans.add(new ItemSet(new String[] { "I1", "I2", "I5" }));
        trans.add(new ItemSet(new String[] { "I2", "I4" }));
        trans.add(new ItemSet(new String[] { "I2", "I3" }));
        trans.add(new ItemSet(new String[] { "I1", "I2", "I4" }));
        trans.add(new ItemSet(new String[] { "I1", "I3" }));
        trans.add(new ItemSet(new String[] { "I2", "I3" }));
        trans.add(new ItemSet(new String[] { "I1", "I3" }));
        trans.add(new ItemSet(new String[] { "I1", "I2", "I3", "I5" }));
        trans.add(new ItemSet(new String[] { "I1", "I2", "I3" }));

        double minSupport=0.2;
        int MSF = (int) (trans.size()*minSupport); // �趨��С֧��Ƶ��Ϊ2

        Map<Integer, Set<ItemSet>> rst = findFrequentItemSets(trans, MSF);

        // ���Ƶ���
        System.out.println("Frequent Item Sets:");
        for (Map.Entry<Integer, Set<ItemSet>> entry : rst.entrySet()) {
            Integer itemSetSize = entry.getKey();
            System.out.printf("Frequent %d Item Sets:\n", itemSetSize);
            for (ItemSet set : entry.getValue())
                System.out.printf("%s, %d\n", set, set.frequence);
        }

        double MCONF = 0.6; // �趨��С���Ŷ�Ϊ60%

        Map<ItemSet, ItemSet> directMap = new HashMap<ItemSet, ItemSet>();
        for (Map.Entry<Integer, Set<ItemSet>> entry : rst.entrySet()) {
            for (ItemSet set : entry.getValue())
                directMap.put(set, set);
        }

        // ����Ƶ��������������
        System.out.println();
        System.out.println("Association Rules:");
        for (Map.Entry<Integer, Set<ItemSet>> entry : rst.entrySet()) {
            for (ItemSet set : entry.getValue()) {
                double cnt1 = directMap.get(set).frequence;
                List<ItemSet> subSets = set.listNotEmptySubItemSets();
                for (ItemSet subSet : subSets) {
                    int cnt2 = directMap.get(subSet).frequence;
                    double conf = cnt1 / cnt2;
                    if (cnt1 / cnt2 >= MCONF) {
                        ItemSet remainSet = new ItemSet();
                        remainSet.addAll(set);
                        remainSet.removeAll(subSet);
                        System.out.printf("%s => %s, %.2f\n", subSet,
                                remainSet, conf);
                    }
                }
            }
        }
    }

    /**
     * ���������е�����Ƶ���������MapΪ��L -> ����Ƶ��L����б�
     */
    public static Map<Integer, Set<ItemSet>> findFrequentItemSets(
            Iterable<Set<String>> transIterable, int MSF) {
        Map<Integer, Set<ItemSet>> ret = new TreeMap<Integer, Set<ItemSet>>();

        // ����ȷ��Ƶ��1�
        Iterator<Set<String>> it = transIterable.iterator();
        Set<ItemSet> oneItemSets = findFrequentOneItemSets(it, MSF);
        ret.put(1, oneItemSets);

        int preItemSetSize = 1;
        Set<ItemSet> preItemSets = oneItemSets;

        // ���ڻ�õ�����Ƶ��L-1�������������Ƶ��L���ֱ��������Ƶ��L-1�
        while (!preItemSets.isEmpty()) {
            int curItemSetSize = preItemSetSize + 1;

            // ��ȡƵ��L������к�ѡL�
            List<ItemSet> candidates = aprioriGenCandidates(preItemSets);

            // ɨ��������ȷ�����к�ѡL����ֵ�Ƶ��
            it = transIterable.iterator();
            while (it.hasNext()) {
                Set<String> tran = it.next();
                for (ItemSet candidate : candidates)
                    if (tran.containsAll(candidate))
                        candidate.frequence++;
            }

            // ������Ƶ�β�С����С֧��Ƶ�εĺ�ѡL�ѡΪƵ��L�
            Set<ItemSet> curItemSets = new HashSet<ItemSet>();
            for (ItemSet candidate : candidates)
                if (candidate.frequence >= MSF)
                    curItemSets.add(candidate);
            if (!curItemSets.isEmpty())
                ret.put(curItemSetSize, curItemSets);

            preItemSetSize = curItemSetSize;
            preItemSets = curItemSets;
        }
        return ret;
    }

    /**
     * ɨ��������ȷ��Ƶ��1�
     */
    static Set<ItemSet> findFrequentOneItemSets(Iterator<Set<String>> trans,
                                                int MSF) {

        // ɨ��������ȷ����������ֵ�Ƶ��
        Map<String, Integer> frequences = new HashMap<String, Integer>();
        while (trans.hasNext()) {
            Set<String> tran = trans.next();
            for (String item : tran) {
                Integer frequence = frequences.get(item);
                frequence = frequence == null ? 1 : frequence + 1;
                frequences.put(item, frequence);
            }
        }

        // ��ÿ������Ƶ�β�С����С֧��Ƶ�ε����һ��Ƶ��1�
        Set<ItemSet> ret = new HashSet<ItemSet>();
        for (Map.Entry<String, Integer> entry : frequences.entrySet()) {
            String item = entry.getKey();
            Integer frequence = entry.getValue();
            if (frequence >= MSF) {
                ItemSet set = new ItemSet(new String[] { item });
                set.frequence = frequence;
                ret.add(set);
            }
        }
        return ret;
    }

    /**
     * ��������Ƶ��L-1��������Ƶ��L��ĺ�ѡL�
     */
    static List<ItemSet> aprioriGenCandidates(Set<ItemSet> preItemSets) {
        List<ItemSet> ret = new LinkedList<ItemSet>();

        // ���Խ�����Ƶ��L-1���������Ȼ������֦�����Ի�ú�ѡL�
        for (ItemSet set1 : preItemSets) {
            for (ItemSet set2 : preItemSets) {
                if (set1 != set2 && set1.canMakeJoin(set2)) {

                    // ����
                    ItemSet union = new ItemSet();
                    union.addAll(set1);
                    union.add(set2.last());

                    // ��֦
                    boolean missSubSet = false;
                    List<ItemSet> subItemSets = union.listDirectSubItemSets();
                    for (ItemSet itemSet : subItemSets) {
                        if (!preItemSets.contains(itemSet)) {
                            missSubSet = true;
                            break;
                        }
                    }
                    if (!missSubSet)
                        ret.add(union);
                }
            }
        }
        return ret;
    }

    /**
     * �ɶ������ɵ����ÿ������һ���ַ�����ʹ��TreeSetʹ��е��������Ը����㷨ʵ��
     */
    public static class ItemSet extends TreeSet<String> {

        private static final long serialVersionUID = 23883315835136949L;

        public int frequence; // ����ֵ�Ƶ��

        public String toString(){
            StringBuilder stringBuilder=new StringBuilder();
            Iterator<String> it = this.iterator();
            while(it.hasNext()){
                stringBuilder.append(it.next()+",");
            }
            stringBuilder.deleteCharAt(stringBuilder.length()-1);
            return stringBuilder.toString();

        }
        public ItemSet() {
            this(new String[0]);
        }

        public ItemSet(String[] items) {
            for (String item : items)
                add(item);
        }

        /**
         * ���Ա�����ٶ���ΪL-1���ܷ����һ�������������L���
         */
        public boolean canMakeJoin(ItemSet other) {

            // ��������Ľײ�ͬ��������������L���
            if (other.size() != this.size())
                return false;

            // �ٶ���Ľ�ΪL-1�����������ǰ���£����ҽ����������ǰL-2������ͬ
            // ������ĵ�L-1����С����һ����ĵ�L-1����ʱ��������������L���
            Iterator<String> it1 = this.iterator();
            Iterator<String> it2 = other.iterator();
            while (it1.hasNext()) {
                String item1 = it1.next();
                String item2 = it2.next();
                int result = item1.compareTo(item2);
                if (result != 0) {
                    if (it1.hasNext())
                        return false;
                    return result < 0 ? true : false;
                }
            }
            return false;
        }

        /**
         * �ٶ�����Ľ�ΪL���оٱ�������н�ΪL-1�����
         */
        public List<ItemSet> listDirectSubItemSets() {
            List<ItemSet> ret = new LinkedList<ItemSet>();

            // ֻ�б���Ľ״���1���ſ��ܴ��ڷǿ����
            if (size() > 1) {
                for (String rmItem : this) {
                    ItemSet subSet = new ItemSet();
                    subSet.addAll(this);
                    subSet.remove(rmItem);
                    ret.add(subSet);
                }
            }

            return ret;
        }

        /**
         * �г����������������зǿ����
         */
        public List<ItemSet> listNotEmptySubItemSets() {
            List<ItemSet> ret = new LinkedList<ItemSet>();
            int size = size();
            if (size > 0) {
                char[] mapping = new char[size()];
                initMapping(mapping);
                while (nextMapping(mapping)) {
                    ItemSet set = new ItemSet();
                    Iterator<String> it = this.iterator();
                    for (int i = 0; i < size; i++) {
                        String item = it.next();
                        if (mapping[i] == '1')
                            set.add(item);
                    }
                    if (set.size() < size)
                        ret.add(set);
                }
            }
            return ret;
        }

        private void initMapping(char[] mapping) {
            for (int i = 0; i < mapping.length; i++)
                mapping[i] = '0';
        }

        private boolean nextMapping(char[] mapping) {
            int pos = 0;
            while (pos < mapping.length && mapping[pos] == '1') {
                mapping[pos] = '0';
                pos++;
            }
            if (pos < mapping.length) {
                mapping[pos] = '1';
                return true;
            }
            return false;
        }
    }
}