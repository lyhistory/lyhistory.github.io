network:
could you name the layers of TCP/IP Model and You can elaborate on the functions of each layer

you should know the 3 way handshake for tcp connection, how about tcp termination, is it the same 3 way or different? why?

you devlelped restful api before, I assume your restful api was built on http protocol, 
could you name another protocol or products build on the protocol and elaborate the differences between http?

please brief the tcp/ip model (OR the Open Systems Interconnection model )
https://lyhistory.com/docs/software/network/network.html#_1-%E7%BD%91%E7%BB%9C%E5%88%86%E5%B1%82-tcp-ip%E5%8D%8F%E8%AE%AE%E7%BB%84

could you name some of the typical protocols for the top 3 layer（application/transport/network）

do you know why TCP uses 4 way finishing connection termination instead of 3 way like the establishment handshake?

explain the difference between HTTP and HTTTPS

which layer does the tls/ssl work on

does TLS handshake happen after or before TCP handshake?

https://lyhistory.com/docs/software/highlevel/publickey_infrastructure.html#clarification

## java
以下是5个能够有效评估Java开发人员技术水平的核心面试问题，涵盖基础能力、进阶原理和系统设计三个维度，并附考察要点及参考答案方向：

### ​1. HashMap底层实现与优化（考察数据结构与JDK源码理解）​​
​问题​：

请描述HashMap的底层数据结构，JDK 1.8中如何解决哈希冲突？当发生哈希碰撞时，链表转红黑树的阈值是多少？如何优化高并发场景下的HashMap线程安全问题？

​考察点​：

数据结构基础（数组+链表/红黑树）

JDK版本特性（1.8的链表树化优化）

并发问题解决方案（ConcurrentHashMap或手动加锁）

性能调优经验（初始容量、负载因子设置）

​参考答案方向​：

底层结构：数组+链表（JDK 1.7）或数组+链表/红黑树（JDK 1.8）。

链表转红黑树阈值：默认8（当链表长度超过8且数组长度≥64时触发）。

线程安全方案：使用ConcurrentHashMap（分段锁或CAS）、Collections.synchronizedMap，或手动加锁（如ReentrantLock）。

---
概念点1：数组 - 最简单的存储方式
```
// 初始方案：把所有书按顺序放在一个大书架上
String[] library = new String[10];
library[0] = "Java编程思想";
library[1] = "算法导论";
// 找《Java编程思想》需要检查每个位置，时间复杂度 O(n)
```
概念点2：哈希函数 - 给每本书一个编号
```
// 给每本书一个编号（哈希值）
public int getBookCode(String bookName) {
    return bookName.length() % 10; // 简单的哈希函数：用书名长度取模
}

// 现在书可以按编号放置了
library[getBookCode("Java编程思想")] = "Java编程思想"; // 放在位置4
library[getBookCode("算法导论")] = "算法导论";         // 放在位置4  问题出现​：两本书的编号都是4！这就是哈希冲突
```
概念点3：链表 - 解决哈希冲突
```
class Book {
    String name;
    Book next; // 下一本书的引用
    
    Book(String name) {
        this.name = name;
    }
}

// 每个书架位置变成一个链表
Book[] library = new Book[10];

// 当发生冲突时，把书挂在同一位置的链表上
public void addBook(String bookName) {
    int index = getBookCode(bookName);
    Book newBook = new Book(bookName);
    
    if (library[index] == null) {
        library[index] = newBook; // 第一个书
    } else {
        // 找到链表末尾挂上新书
        Book current = library[index];
        while (current.next != null) {
            current = current.next;
        }
        current.next = newBook;
    }
}
```
概念点4：红黑树 - 优化长链表查询
```
import java.util.ArrayList;
import java.util.List;

// 完整的图书馆管理系统（包含红黑树转换）
public class CompleteLibrarySystem {
    
    // 书架（桶数组）的节点定义
    static class BookNode {
        String bookName;
        String location;
        BookNode next;  // 链表下一个节点
        
        BookNode(String bookName, String location) {
            this.bookName = bookName;
            this.location = location;
        }
    }
    
    // 红黑树节点定义（扩展自BookNode）
    static class TreeNode extends BookNode {
        TreeNode parent, left, right;
        boolean isRed;
        
        TreeNode(String bookName, String location) {
            super(bookName, location);
        }
    }
    
    static class Library {
        private BookNode[] shelves;           // 书架数组（桶数组）
        private int totalShelves;            // 总书架数量（数组长度）
        private int bookCount;               // 总书籍数量
        private static final int TREEIFY_THRESHOLD = 8;    // 树化阈值
        private static final int MIN_SHELVES_FOR_TREE = 64; // 最小树化书架数
        
        public Library(int shelfCount) {
            this.totalShelves = shelfCount;
            this.shelves = new BookNode[shelfCount];
            this.bookCount = 0;
        }
        
        // 添加书籍到图书馆
        public void addBook(String bookName, String location) {
            int shelfIndex = getShelfIndex(bookName);
            BookNode newBook = new BookNode(bookName, location);
            
            // 如果书架为空，直接放置
            if (shelves[shelfIndex] == null) {
                shelves[shelfIndex] = newBook;
            } else {
                // 否则添加到链表末尾（JDK 1.8 尾插法）
                addToLinkedList(shelfIndex, newBook);
            }
            
            bookCount++;
            checkAndConvertToTree(shelfIndex);
        }
        
        // 添加到链表（计算链表长度）
        private void addToLinkedList(int shelfIndex, BookNode newBook) {
            BookNode current = shelves[shelfIndex];
            int linkedListSize = 1;  // 链表长度计数器
            
            // 遍历到链表末尾
            while (current.next != null) {
                current = current.next;
                linkedListSize++;
            }
            
            // 尾插法添加新书
            current.next = newBook;
            linkedListSize++;  // 链表长度+1
            
            System.out.printf("书架[%d] 链表长度: %d, 总书架数: %d%n", 
                shelfIndex, linkedListSize, totalShelves);
        }
        
        // 检查并转换为红黑树
        private void checkAndConvertToTree(int shelfIndex) {
            BookNode firstBook = shelves[shelfIndex];
            
            // 计算当前链表的长度
            int linkedListSize = calculateLinkedListSize(firstBook);
            
            // 树化条件判断
            if (linkedListSize >= TREEIFY_THRESHOLD && totalShelves >= MIN_SHELVES_FOR_TREE) {
                System.out.printf("🚀 触发树化条件! 书架[%d] 链表长度=%d, 总书架数=%d%n", 
                    shelfIndex, linkedListSize, totalShelves);
                
                // 执行链表转红黑树
                shelves[shelfIndex] = convertToRedBlackTree(firstBook);
                System.out.println("✅ 链表已转换为红黑树，查询效率提升!");
            }
        }
        
        // 计算链表长度
        private int calculateLinkedListSize(BookNode first) {
            int size = 0;
            BookNode current = first;
            while (current != null) {
                size++;
                current = current.next;
            }
            return size;
        }
        
        // 链表转红黑树（简化实现）
        private TreeNode convertToRedBlackTree(BookNode first) {
            System.out.println("📚 开始构建红黑树...");
            
            // 将链表转换为列表以便构建平衡树
            List<BookNode> bookList = new ArrayList<>();
            BookNode current = first;
            while (current != null) {
                bookList.add(current);
                current = current.next;
            }
            
            // 构建平衡的二叉搜索树（简化的红黑树）
            return buildBalancedTree(bookList, 0, bookList.size() - 1, null);
        }
        
        // 构建平衡二叉树（模拟红黑树构建）
        private TreeNode buildBalancedTree(List<BookNode> books, int start, int end, TreeNode parent) {
            if (start > end) return null;
            
            int mid = (start + end) / 2;
            BookNode book = books.get(mid);
            
            // 将BookNode转换为TreeNode
            TreeNode treeNode = new TreeNode(book.bookName, book.location);
            treeNode.parent = parent;
            treeNode.isRed = (mid % 2 == 0); // 简化的红黑着色
            
            // 递归构建左右子树
            treeNode.left = buildBalancedTree(books, start, mid - 1, treeNode);
            treeNode.right = buildBalancedTree(books, mid + 1, end, treeNode);
            
            return treeNode;
        }
        
        // 计算书架索引（哈希函数）
        private int getShelfIndex(String bookName) {
            return Math.abs(bookName.hashCode()) % totalShelves;
        }
        
        // 查找书籍
        public String findBook(String bookName) {
            int shelfIndex = getShelfIndex(bookName);
            BookNode bookLocation = shelves[shelfIndex];
            
            if (bookLocation instanceof TreeNode) {
                // 红黑树查找 O(log n)
                System.out.printf("🔍 在书架[%d]的红黑树中查找...%n", shelfIndex);
                return findInTree((TreeNode) bookLocation, bookName);
            } else {
                // 链表查找 O(n)
                System.out.printf("🔍 在书架[%d]的链表中查找...%n", shelfIndex);
                return findInLinkedList(bookLocation, bookName);
            }
        }
        
        // 在链表中查找
        private String findInLinkedList(BookNode first, String bookName) {
            BookNode current = first;
            int steps = 0;
            
            while (current != null) {
                steps++;
                if (current.bookName.equals(bookName)) {
                    System.out.printf("✅ 找到书籍，遍历了 %d 个节点%n", steps);
                    return current.location;
                }
                current = current.next;
            }
            
            System.out.printf("❌ 未找到书籍，遍历了 %d 个节点%n", steps);
            return null;
        }
        
        // 在红黑树中查找
        private String findInTree(TreeNode root, String bookName) {
            int steps = 0;
            TreeNode current = root;
            
            while (current != null) {
                steps++;
                int compare = bookName.compareTo(current.bookName);
                
                if (compare == 0) {
                    System.out.printf("✅ 找到书籍，遍历了 %d 个节点（红黑树效率高!）%n", steps);
                    return current.location;
                } else if (compare < 0) {
                    current = current.left;
                } else {
                    current = current.right;
                }
            }
            
            System.out.printf("❌ 未找到书籍，遍历了 %d 个节点%n", steps);
            return null;
        }
        
        // 显示图书馆状态
        public void showLibraryStatus() {
            System.out.println("\n=== 图书馆状态报告 ===");
            System.out.printf("总书架数: %d, 总书籍数: %d%n", totalShelves, bookCount);
            
            for (int i = 0; i < totalShelves; i++) {
                if (shelves[i] != null) {
                    int nodeCount = countNodes(shelves[i]);
                    String structureType = (shelves[i] instanceof TreeNode) ? "红黑树" : "链表";
                    System.out.printf("书架[%d]: %s结构, %d个节点%n", i, structureType, nodeCount);
                }
            }
        }
        
        private int countNodes(BookNode node) {
            int count = 0;
            if (node instanceof TreeNode) {
                // 简化的树节点计数
                count += countTreeNodes((TreeNode) node);
            } else {
                // 链表节点计数
                BookNode current = node;
                while (current != null) {
                    count++;
                    current = current.next;
                }
            }
            return count;
        }
        
        private int countTreeNodes(TreeNode node) {
            if (node == null) return 0;
            return 1 + countTreeNodes(node.left) + countTreeNodes(node.right);
        }
    }
    
    // 测试修正后的图书馆系统
    public static void main(String[] args) {
        System.out.println("🏛️ 修正版图书馆管理系统 - 真实哈希冲突演示");
        
        // 创建一个小型图书馆（便于演示）
        Library library = new Library(8);
        
        System.out.println("\n=== 情况1：正常情况（不同hashCode，分布在不同书架）===");
        // 这些书的hashCode不同，会分布在不同书架
        String[] normalBooks = {"Java编程", "Python入门", "算法导论", "数据结构"};
        for (String book : normalBooks) {
            library.addBook(book, "A区");
        }
        
        System.out.println("\n=== 情况2：使用真正会产生哈希冲突的字符串 ===");
        
        // 使用著名的哈希冲突字符串对
        String[] conflictBooks = {
            "Aa", "BB",     // 著名的哈希冲突对：hashCode相同
            "AaAa", "AaBB", // 另一个冲突对
            "AaAaAa", "AaAaBB", // 扩展的冲突对
            "AaAaAaAa", "AaAaAaBB" // 更多冲突
        };
        
        System.out.println("哈希冲突验证:");
        for (String book : conflictBooks) {
            System.out.printf("  '%s'.hashCode() = %d%n", book, book.hashCode());
        }
        
        System.out.println("\n添加冲突书籍到图书馆:");
        for (int i = 0; i < conflictBooks.length; i++) {
            library.addBook(conflictBooks[i], "冲突区" + (i + 1) + "架");
            
            if (i == 7) {
                System.out.println("⭐ 达到树化阈值8，但书架总数不足64，不会真正树化");
            }
        }
        
        // 创建大型图书馆演示实际树化
        System.out.println("\n=== 情况3：大型图书馆演示实际树化 ===");
        Library bigLibrary = new Library(100); // 100个书架，满足树化条件
        
        // 添加冲突书籍到大型图书馆
        for (int i = 0; i < 10; i++) {
            String bookName = conflictBooks[i % conflictBooks.length] + "-版本" + i;
            bigLibrary.addBook(bookName, "B区" + i + "架");
        }
    }
}

// 补充：验证哈希冲突的独立类
class HashCollisionVerifier {
    public static void main(String[] args) {
        System.out.println("=== 哈希冲突验证工具 ===");
        
        // 著名的哈希冲突对
        String[][] collisionPairs = {
            {"Aa", "BB"},
            {"AaAa", "AaBB"}, 
            {"AaAaAa", "AaAaBB"},
            {"BBA", "AaC"},
            {"AaB", "BBa"}
        };
        
        for (String[] pair : collisionPairs) {
            int hash1 = pair[0].hashCode();
            int hash2 = pair[1].hashCode();
            boolean isCollision = (hash1 == hash2);
            
            System.out.printf("'%s' hashCode: %d%n", pair[0], hash1);
            System.out.printf("'%s' hashCode: %d%n", pair[1], hash2);
            System.out.printf("冲突: %s%n%n", isCollision ? "✅ 是" : "❌ 否");
        }
        
        // 验证我们使用的冲突对
        System.out.println("=== 我们将使用的冲突字符串 ===");
        String[] testBooks = {"Aa", "BB", "AaAa", "AaBB"};
        for (String book : testBooks) {
            System.out.printf("'%s'.hashCode() = %d, 书架索引: %d%n", 
                book, book.hashCode(), Math.abs(book.hashCode()) % 8);
        }
    }
}

// 运行这个完整的示例，您将看到：
// 1. linkedListSize 的正确计算方式
// 2. totalShelves 的来源和使用
// 3. 树化阈值的完整判断逻辑
// 4. 红黑树转换的实际过程
```
JDK 1.7 的 HashMap（数组 + 链表）
概念点1：Entry Interface - 基础存储单元
```
// JDK 1.7 的 HashMap 核心结构 - Entry 接口
static class Entry<K,V> implements Map.Entry<K,V> {
    final K key;        // Key - 键（不可变）
    V value;            // Value - 值
    Entry<K,V> next;    // Next pointer - 下一个Entry的指针（链表结构）
    int hash;           // Hash value - 哈希值（缓存，避免重复计算）
    
    Entry(int h, K k, V v, Entry<K,V> n) {
        value = v;
        next = n;       // 链表的下一个节点
        key = k;
        hash = h;
    }
}
```
实际示例：JDK 1.7 的 HashMap 实现
```
// JDK 1.7 风格的 HashMap 演示
public class HashMapJDK7Style<K, V> {
    private Entry<K,V>[] table;  // Array - 存储数组（桶数组）
    private int capacity = 16;    // Capacity - 初始容量
    private float loadFactor = 0.75f; // Load Factor - 负载因子
    private int threshold;        // Threshold - 扩容阈值
    
    public HashMapJDK7Style() {
        table = new Entry[capacity];
        threshold = (int)(capacity * loadFactor);
    }
    
    // PUT 操作：头插法（JDK 1.7 特点）
    public V put(K key, V value) {
        // Hash Calculation - 哈希计算
        int hash = hash(key.hashCode());
        int index = indexFor(hash, table.length);
        
        // Collision Detection - 冲突检测
        for (Entry<K,V> e = table[index]; e != null; e = e.next) {
            if (e.hash == hash && (e.key == key || key.equals(e.key))) {
                V oldValue = e.value;
                e.value = value; // 更新现有值
                return oldValue;
            }
        }
        
        // Head Insertion - 头插法（JDK 1.7 特性）
        addEntry(hash, key, value, index);
        return null;
    }
    
    private void addEntry(int hash, K key, V value, int bucketIndex) {
        Entry<K,V> e = table[bucketIndex];
        // 新Entry插入链表头部（头插法）
        table[bucketIndex] = new Entry<>(hash, key, value, e);
        
        if (size++ >= threshold) {
            resize(2 * table.length); // Resize - 扩容
        }
    }
}
```
JDK 1.7 特点：头插法（可能产生循环链表，线程不安全）​

第二幕：JDK 1.8 的重大改进（数组 + 链表/红黑树）
概念点2：Node 和 TreeNode - 分层数据结构
```
// JDK 1.8 基础节点 - Node（替代Entry）
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;      // Cached hash - 缓存的哈希值
    final K key;         // Key - 键
    V value;             // Value - 值
    Node<K,V> next;      // Next pointer - 链表指针
    
    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}

// 红黑树节点 - TreeNode（JDK 1.8 新增）
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    TreeNode<K,V> parent;  // Red-black tree links - 红黑树父节点
    TreeNode<K,V> left;    // Left child - 左子节点
    TreeNode<K,V> right;   // Right child - 右子节点
    TreeNode<K,V> prev;    // Previous node - 前驱节点（便于退化为链表）
    boolean red;          // Color flag - 颜色标记（红/黑）
    
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }
}
```
实际示例：JDK 1.8 的 HashMap 实现
```
public class HashMapJDK8Style<K, V> {
    private Node<K,V>[] table;    // Array of buckets - 桶数组
    static final int TREEIFY_THRESHOLD = 8;    // 树化阈值
    static final int UNTREEIFY_THRESHOLD = 6;  // 链化阈值
    static final int MIN_TREEIFY_CAPACITY = 64; // 最小树化容量
    
    // PUT 操作：尾插法 + 树化判断
    public V put(K key, V value) {
        int hash = hash(key.hashCode());
        int index = (table.length - 1) & hash; // Index calculation - 索引计算
        
        Node<K,V> first = table[index];
        
        // Bucket is empty - 桶为空
        if (first == null) {
            table[index] = newNode(hash, key, value, null);
            return null;
        }
        
        // Collision handling - 冲突处理
        Node<K,V> e; K k;
        if (first.hash == hash && ((k = first.key) == key || key.equals(k))) {
            e = first; // Exact match on first node - 首节点匹配
        } else if (first instanceof TreeNode) {
            // Red-Black Tree operation - 红黑树操作
            e = ((TreeNode<K,V>)first).putTreeVal(this, table, hash, key, value);
        } else {
            // Linked list traversal - 链表遍历
            int binCount = 0;
            for (e = first; e != null; e = e.next) {
                if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
                    break; // Found existing key - 找到现有键
                }
                binCount++;
            }
            
            if (e == null) {
                // Tail insertion - 尾插法（JDK 1.8 改进）
                e = newNode(hash, key, value, null);
                if (binCount >= TREEIFY_THRESHOLD - 1) {
                    treeifyBin(table, hash); // Treeify check - 树化检查
                }
            }
        }
        
        if (e != null) {
            V oldValue = e.value;
            e.value = value; // Update value - 更新值
            return oldValue;
        }
        return null;
    }
    
    // Treeification process - 树化过程
    final void treeifyBin(Node<K,V>[] tab, int hash) {
        int n, index; Node<K,V> e;
        // 满足两个条件才树化：链表长度≥8 且 数组长度≥64
        if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY) {
            resize(); // Resize instead of treeifying - 先尝试扩容
        } else if ((e = tab[index = (n - 1) & hash]) != null) {
            // Perform treeification - 执行树化
            TreeNode<K,V> hd = null, tl = null;
            do {
                TreeNode<K,V> p = replacementTreeNode(e, null);
                if (tl == null) {
                    hd = p;
                } else {
                    p.prev = tl;
                    tl.next = p;
                }
                tl = p;
            } while ((e = e.next) != null);
            
            if ((tab[index] = hd) != null) {
                hd.treeify(tab); // Convert to Red-Black Tree - 转换为红黑树
            }
        }
    }
}
```
完整技术演示示例
```
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class HashMapEvolutionDemo {
    
    public static void main(String[] args) throws Exception {
        demonstrateHashMapStructure();
        showTreeificationProcess();
        demonstrateJDK8Improvements();
    }
    
    // 演示 HashMap 底层结构
    static void demonstrateHashMapStructure() throws Exception {
        System.out.println("=== HashMap 底层结构演示 ===");
        
        HashMap<String, Integer> map = new HashMap<>();
        
        // 添加几个会产生哈希冲突的元素
        map.put("Aa", 1);  // 特殊设计的key，与"BB"哈希冲突
        map.put("BB", 2);
        map.put("Aa1", 3);
        map.put("BB1", 4);
        
        // 使用反射查看内部table结构
        System.out.println("HashMap 内部结构:");
        printInternalStructure(map);
    }
    
    // 展示树化过程
    static void showTreeificationProcess() throws Exception {
        System.out.println("\n=== 树化阈值演示 ===");
        
        // 创建特定HashMap来观察树化
        HashMap<CollisionKey, Integer> treeifyDemo = new HashMap<>(64, 0.75f);
        
        System.out.println("添加元素观察树化过程:");
        for (int i = 0; i < 12; i++) {
            treeifyDemo.put(new CollisionKey(i), i);
            
            if (i == 7) {
                System.out.println("  添加第8个元素 - 达到 TREEIFY_THRESHOLD");
                printBucketStructure(treeifyDemo, "桶0");
            }
            if (i == 11) {
                System.out.println("  添加第12个元素 - 可能已树化");
                printBucketStructure(treeifyDemo, "桶0");
            }
        }
    }
    
    // 演示 JDK 1.8 改进
    static void demonstrateJDK8Improvements() {
        System.out.println("\n=== JDK 1.8 改进演示 ===");
        
        HashMap<String, String> map = new HashMap<>();
        
        // 演示尾插法（JDK 1.8）vs 头插法（JDK 1.7）
        System.out.println("JDK 1.8 使用尾插法，避免并发环境下的循环链表问题");
        
        // 演示红黑树优化
        System.out.println("当链表长度 ≥ 8 且 数组长度 ≥ 64 时，链表转为红黑树");
        System.out.println("查询性能从 O(n) 优化为 O(log n)");
    }
    
    // 使用反射打印HashMap内部结构
    static void printInternalStructure(HashMap<?, ?> map) throws Exception {
        Field tableField = HashMap.class.getDeclaredField("table");
        tableField.setAccessible(true);
        Object[] table = (Object[]) tableField.get(map);
        
        if (table == null) {
            System.out.println("Table is null - HashMap 尚未初始化");
            return;
        }
        
        for (int i = 0; i < table.length; i++) {
            if (table[i] != null) {
                System.out.printf("桶[%d]: ", i);
                printNodeChain(table[i]);
            }
        }
    }
    
    // 打印节点链（链表或树）
    static void printNodeChain(Object node) throws Exception {
        Class<?> nodeClass = node.getClass();
        
        if (nodeClass.getSimpleName().equals("TreeNode")) {
            System.out.println("红黑树节点");
        } else {
            // 链表节点
            StringBuilder chain = new StringBuilder();
            Object current = node;
            while (current != null) {
                Field keyField = current.getClass().getDeclaredField("key");
                keyField.setAccessible(true);
                Object key = keyField.get(current);
                
                Field nextField = current.getClass().getDeclaredField("next");
                nextField.setAccessible(true);
                Object next = nextField.get(current);
                
                chain.append(key).append(" -> ");
                current = next;
            }
            chain.append("null");
            System.out.println("链表: " + chain.toString());
        }
    }
    
    // 打印特定桶的结构
    static void printBucketStructure(HashMap<?, ?> map, String bucketName) throws Exception {
        Field tableField = HashMap.class.getDeclaredField("table");
        tableField.setAccessible(true);
        Object[] table = (Object[]) tableField.get(map);
        
        if (table != null && table.length > 0 && table[0] != null) {
            System.out.println(bucketName + " 结构: " + 
                (table[0].getClass().getSimpleName().equals("TreeNode") ? "红黑树" : "链表"));
        }
    }
    
    // 制造哈希冲突的Key类
    static class CollisionKey {
        private int id;
        
        public CollisionKey(int id) {
            this.id = id;
        }
        
        @Override
        public int hashCode() {
            // 所有实例返回相同的哈希码，强制产生冲突
            return 1;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            CollisionKey that = (CollisionKey) obj;
            return id == that.id;
        }
        
        @Override
        public String toString() {
            return "Key-" + id;
        }
    }
}

// 正确的 JDK 1.8 风格 HashMap 简化实现
class CorrectHashMapJDK8Style<K, V> {
    static class Node<K, V> {
        final int hash;
        final K key;
        V value;
        Node<K, V> next;
        
        Node(int hash, K key, V value, Node<K, V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }
    
    private Node<K, V>[] table;
    private int size = 0;
    private static final int DEFAULT_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;
    private static final int TREEIFY_THRESHOLD = 8;
    private static final int MIN_TREEIFY_CAPACITY = 64;
    
    @SuppressWarnings("unchecked")
    public CorrectHashMapJDK8Style() {
        table = (Node<K, V>[]) new Node[DEFAULT_CAPACITY];
    }
    
    public V put(K key, V value) {
        // 简化实现，重点展示核心逻辑
        int hash = hash(key);
        int index = (table.length - 1) & hash;
        
        Node<K, V> first = table[index];
        
        // 1. 桶为空的情况
        if (first == null) {
            table[index] = new Node<>(hash, key, value, null);
            size++;
            return null;
        }
        
        // 2. 检查首节点是否匹配
        if (first.hash == hash && 
            (first.key == key || (key != null && key.equals(first.key)))) {
            V oldValue = first.value;
            first.value = value;
            return oldValue;
        }
        
        // 3. 遍历链表（尾插法）
        Node<K, V> e = first;
        int binCount = 1;
        while (e.next != null) {
            e = e.next;
            binCount++;
            
            if (e.hash == hash && 
                (e.key == key || (key != null && key.equals(e.key)))) {
                V oldValue = e.value;
                e.value = value;
                return oldValue;
            }
        }
        
        // 4. 尾插法添加新节点
        e.next = new Node<>(hash, key, value, null);
        size++;
        
        // 5. 树化检查
        if (binCount >= TREEIFY_THRESHOLD - 1 && table.length >= MIN_TREEIFY_CAPACITY) {
            System.out.println("触发树化条件: 链表长度=" + (binCount + 1));
            // 实际HashMap这里会调用treeifyBin方法
        }
        
        return null;
    }
    
    private int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
    
    public int size() {
        return size;
    }
}

// 测试修正后的实现
class TestCorrectedHashMap {
    public static void main(String[] args) {
        CorrectHashMapJDK8Style<String, Integer> map = new CorrectHashMapJDK8Style<>();
        
        // 测试基本功能
        map.put("key1", 1);
        map.put("key2", 2);
        map.put("key1", 100); // 更新已存在的key
        
        System.out.println("修正后的HashMap大小: " + map.size());
    }
}
```
### ​2. 线程池参数设计与拒绝策略（考察多线程与资源管理）​​
​问题​：

如何设计一个高性能的线程池？请说明核心参数（corePoolSize、maximumPoolSize等）的作用，并列举常见的拒绝策略及其适用场景。

​考察点​：

线程池原理（任务队列、线程复用机制）

参数调优经验（根据CPU/IO密集型任务调整）

异常处理与资源控制（拒绝策略的选择）

​参考答案方向​：

核心参数：

corePoolSize：核心线程数，空闲时保留。

maximumPoolSize：最大线程数，应对突发流量。

workQueue：任务队列（无界/有界队列选择）。

拒绝策略：

AbortPolicy（默认抛异常）、CallerRunsPolicy（调用者执行）、DiscardPolicy（丢弃任务）、DiscardOldestPolicy（丢弃队列旧任务）。

单线程执行 - 一个厨师做所有事
```
// 单线程模式：只有一个厨师
class SingleChefKitchen {
    public void makePizza(String order) {
        System.out.println("厨师开始制作: " + order);
        // 模拟制作时间
        try { Thread.sleep(2000); } catch (InterruptedException e) {}
        System.out.println("完成: " + order);
    }
    
    public void processOrders(List<String> orders) {
        for (String order : orders) {
            makePizza(order);  // 顺序执行，一个接一个
        }
    }
}
```
概念点2：无限制创建线程 - 来一个订单雇一个厨师
```
class UnlimitedChefKitchen {
    public void processOrders(List<String> orders) {
        for (String order : orders) {
            new Thread(() -> {
                makePizza(order);
            }).start();  // 每个订单开一个新线程
        }
    }
}

雇100个厨师成本太高（线程创建开销​ - Thread Creation Overhead）

厨房挤不下（内存溢出​ - Memory Overflow）

厨师管理混乱（线程管理困难​ - Thread Management Difficulty）
```
概念点3：线程池（ThreadPool） - 固定团队的专业厨房
```
import java.util.concurrent.*;

class PizzaShopThreadPool {
    // 创建线程池：核心参数配置
    private ThreadPoolExecutor kitchenTeam = new ThreadPoolExecutor(
        3,  // corePoolSize - 核心厨师数
        6,  // maximumPoolSize - 最大厨师数  
        1, TimeUnit.MINUTES,  // keepAliveTime - 临时厨师空闲时间
        new ArrayBlockingQueue<>(10),  // workQueue - 订单队列
        new ThreadFactory() {          // threadFactory - 厨师招聘标准
            @Override
            public Thread newThread(Runnable r) {
                Thread chef = new Thread(r, "Pizza-Chef-" + System.currentTimeMillis());
                chef.setDaemon(false);
                return chef;
            }
        },
        new ThreadPoolExecutor.AbortPolicy()  // rejectedExecutionHandler - 满员处理策略
    );
}

// corePoolSize 核心厨师：即使没事做也留在厨房 对应：corePoolSize = CPU核心数 + 1（CPU密集型）
// maximumPoolSize 应对客流高峰，但成本较高（线程创建销毁开销） 对应：maximumPoolSize = corePoolSize × 2-3（根据业务调整）
// workQueue 不同类型的排队策略：
    BlockingQueue<Runnable> orderQueue;

    // ArrayBlockingQueue - 固定大小排队区（10个订单位）
    orderQueue = new ArrayBlockingQueue<>(10);

    // LinkedBlockingQueue - 弹性排队区（理论无界）
    orderQueue = new LinkedBlockingQueue<>();  // 危险！可能内存溢出

    // SynchronousQueue - 直接交接（无排队区）
    orderQueue = new SynchronousQueue<>();  // 来一个订单必须立即处理

```
RejectedExecutionHandler（拒绝策略）- 客满处理方案 四大拒绝策略实战演示
策略1：AbortPolicy（中止策略）- "客满，请勿入内"
```
class AbortPolicyExample {
    public static void main(String[] args) {
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2, 4, 60, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(2),
            new ThreadPoolExecutor.AbortPolicy()  // 客满时抛异常
        );
        
        try {
            // 模拟客流高峰
            for (int i = 1; i <= 10; i++) {
                final int orderNum = i;
                pool.execute(() -> {
                    System.out.println("处理订单: " + orderNum);
                    try { Thread.sleep(1000); } catch (InterruptedException e) {}
                });
                System.out.println("订单" + orderNum + "已接受");
            }
        } catch (RejectedExecutionException e) {
            System.out.println("🚫 餐厅已满，拒绝新订单！");
            // 可以转向其他分店或让客户稍后再来
        }
    }
}
```
适用场景​：银行系统、交易系统 - 不能接受服务降级的关键业务

策略2：CallerRunsPolicy（调用者执行策略）- "老板亲自下厨"
```
class CallerRunsPolicyExample {
    public static void main(String[] args) {
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2, 4, 60, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(2),
            new ThreadPoolExecutor.CallerRunsPolicy()  // 服务员亲自做披萨
        );
        
        for (int i = 1; i <= 10; i++) {
            final int orderNum = i;
            System.out.println("接收订单: " + orderNum + " - 线程: " + Thread.currentThread().getName());
            
            pool.execute(() -> {
                System.out.println("制作订单: " + orderNum + " - 厨师: " + Thread.currentThread().getName());
                try { Thread.sleep(2000); } catch (InterruptedException e) {}
            });
            
            // 当厨房满员时，点餐线程（调用者）会亲自制作披萨
        }
    }
}
```
适用场景​：Web服务器 - 天然背压(backpressure)，防止系统过载
策略3：DiscardPolicy（丢弃策略）- "默默忽略新订单"
```
class DiscardPolicyExample {
    public static void main(String[] args) {
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2, 4, 60, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(2),
            new ThreadPoolExecutor.DiscardPolicy()  // 静默丢弃
        );
        
        for (int i = 1; i <= 10; i++) {
            final int orderNum = i;
            pool.execute(() -> {
                System.out.println("制作订单: " + orderNum);
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
            });
            System.out.println("提交订单: " + orderNum);
        }
        
        // 订单7、8、9、10会被静默丢弃，不通知客户
        System.out.println("有些订单被默默丢弃了，客户可能不知道...");
    }
}
```
适用场景​：日志记录、监控数据上报 - 可丢失的非关键任务

策略4：DiscardOldestPolicy（丢弃最旧策略）- "取消最早订单，做新订单"
```
class DiscardOldestPolicyExample {
    public static void main(String[] args) {
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2, 4, 60, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(3),  // 队列容量3
            new ThreadPoolExecutor.DiscardOldestPolicy()  // 丢弃队列中最旧任务
        );
        
        for (int i = 1; i <= 10; i++) {
            final int orderNum = i;
            pool.execute(() -> {
                System.out.println("制作订单: " + orderNum + " - 开始时间: " + System.currentTimeMillis());
                try { Thread.sleep(2000); } catch (InterruptedException e) {}
            });
            System.out.println("提交订单: " + orderNum + " - 提交时间: " + System.currentTimeMillis());
        }
        
        // 订单1、2、3可能被丢弃，优先处理新订单7、8、9、10
    }
}
```
适用场景​：实时数据处理、股票行情 - 新数据比旧数据更重要

### 3. JVM内存模型与GC调优（考察内存管理与性能优化）​​
​问题​：

请描述JVM内存分区（Eden、Survivor、Old区等），并解释Minor GC和Full GC的触发条件。若线上应用频繁出现Full GC，如何排查和优化？

​考察点​：

JVM内存结构（堆、方法区、栈等）

GC算法与回收机制（标记-清除、G1、ZGC等）

问题排查工具（jstat、MAT、Arthas）

​参考答案方向​：

内存分区：Eden（新生代）、Survivor（From/To）、Old（老年代）、PermGen/Metaspace（方法区）。

Full GC触发条件：老年代空间不足、永久代扩容、System.gc()显式调用等。

排查步骤：

使用jstat -gcutil监控GC频率。

通过jmap -histo:live分析大对象。

检查内存泄漏（如ThreadLocal未清理、静态集合缓存）。

### ​4. 高并发系统设计（考察架构设计与分布式问题解决）​​
​问题​：

设计一个秒杀系统，如何解决超卖、高并发和数据一致性问题？请描述整体架构及关键技术选型。

​考察点​：

分布式锁（Redis或ZooKeeper）

限流与熔断（Sentinel、令牌桶算法）

异步处理（消息队列如Kafka）

数据库优化（分库分表、乐观锁）

​参考答案方向​：

架构分层：前端CDN+按钮置灰、网关限流、服务层独立秒杀模块、数据库Redis预扣库存。

关键技术：

库存扣减：Redis Lua脚本保证原子性。

订单异步：MQ削峰填谷，失败重试+人工补偿。

一致性：最终一致性（MQ+数据库补偿）。

### ​5. 分布式事务与一致性方案（考察复杂系统问题解决能力）​​
​问题​：

在微服务架构中，如何保证跨服务的数据一致性？请对比Seata的AT模式与TCC模式的优缺点。

​考察点​：

分布式事务方案（2PC、TCC、AT、Saga）

补偿机制设计

实际场景适配能力

​参考答案方向​：

常见方案：

​AT模式​：自动回滚（通过反向SQL），适合无侵入但锁粒度较大。

​TCC模式​：需业务代码实现Try-Confirm-Cancel，灵活性高但侵入性强。

适用场景：

AT：金融扣款等强一致性场景。

TCC：订单支付等需补偿的复杂业务。

​评估标准​
​初级​：能回答基础概念，但缺乏原理深度（如仅描述HashMap结构，未提及扩容机制）。

​中级​：掌握原理并能结合场景优化（如线程池参数调优、GC日志分析）。

​高级​：具备复杂系统设计能力，能权衡技术方案利弊（如秒杀系统CAP取舍、分布式事务选型）。

nio https://lyhistory.com/docs/software/buildingblock/nio_epoll.html#%E5%9F%BA%E4%BA%8Eepoll%E7%9A%84%E6%A1%86%E6%9E%B6%E5%92%8C%E4%BA%A7%E5%93%81-netty-redis-haproxy%E7%AD%89

is i++ thread safe?
https://lyhistory.com/docs/software/highlevel/threadsafe.html#%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B%E4%B8%8E%E7%AB%9E%E4%BA%89%E8%B5%84%E6%BA%90

concurrency并发 VS Parallelism并行
https://lyhistory.com/docs/software/highlevel/concurrent.html#concurrency%E5%B9%B6%E5%8F%91-vs-parallelism%E5%B9%B6%E8%A1%8C


how do you resolve dependency conflicts

can you name the JVM class loader?

spring bean vs java bean?

the default scope of bean in springboot (singleton prototype)
https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html

spring bean lifecycle
https://medium.com/@TheTechDude/spring-bean-lifecycle-full-guide-f865966e89ce

what is dependency injection or invesion of control?
https://www.linkedin.com/pulse/spring-ioc-boot-bandewar-shiva-krishna/

+ Inversion of Control (IoC), in the context of the Spring framework is a central design pattern with a primary focus on dependency injection (DI). IoC not only limited to Dependency Injection(DI), but also involves the complete lifecycle management of dependencies within the Spring framework.
+ At its core, IoC revolves around the concept of the Spring application context. This context encapsulates the IoC container, often referred to as the Bean Factory, which is responsible for managing beans throughout the application's runtime. Spring Boot further enhances this by providing automatic configuration for the Application Context.
+ The IoC container is responsible for managing the dependencies of objects throughout their lifecycle. This includes injecting dependencies into other objects, as well as releasing dependencies when objects are no longer needed. In Spring, dependencies are typically injected during application startup, as they are added to the Bean Factory. However, it is also possible to inject dependencies at runtime. This can be useful for certain types of applications, such as those that need to be able to dynamically load new components.

benefit:
+ One of the key benefits of IoC is that it allows objects to be loosely coupled. This means that objects do not need to know how to create or manage their dependencies. Instead, the IoC container takes care of this for them.
+ This is achieved by having objects declare their dependencies, and then the IoC container injects those dependencies into the objects when they are created. The IoC container can also manage the lifecycle of the dependencies, which helps to prevent memory leaks and other problems.
+ In Spring, the IoC container is typically initialized from the main class of the application. The main class then configures the IoC container by telling it about the beans that need to be created and managed. The IoC container then creates the beans and injects their dependencies. 

can you name the IOC container in spring?
https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html


can you name the annotations in spring or spring boot？
example：@components 
@Conditional @ConditionalOn

https://lyhistory.com/docs/software/programming/java_springboot.html#_1-1-spring-ioc%E5%AE%B9%E5%99%A8

## ⚛️ Frontend / React / Web Development Questions

what's the difference between javascript typescript?
how about nodejs and reactjs, what's differences and things in common

closure

cross origin resource sharing
javascript typescript?

闭包 closure

responsive layout

cross origin resource sharing

virtual dom（

webpage loading speed optimize
https://lyhistory.com/docs/software/programming/interview_frontend.html#%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96

1. React Architecture & State Management

Question:​

“You’ve built responsive web apps with React and Next.js. Can you walk us through how you structure a typical React application, and how you manage state in a medium sized project?”

What to Listen For:​

Component hierarchy, folder structure

State management choices (Context API, Redux, Zustand, etc.)

Separation of concerns (UI vs business logic)

"For a medium-sized React/Next.js project, I usually follow a Feature-Based Folder Structure. Instead of grouping files by type (e.g., putting all components in one folder), I group them by domain or feature (e.g., src/features/documents, src/features/dashboard). This makes it easier to maintain and scale.

    Backend Translation:​ This is exactly like moving away from a Layered Architecture​ (where you put all controllers in one folder, all services in another) to a Modular/Domain-Driven Architecture.

    Old way (Layered):controllers/, services/, models/(Hard to find everything related to a specific feature).

    Candidate's way (Modular):modules/user/, modules/payments/, modules/documents/(All controllers, services, and models for a specific feature live together).

For state management, I follow the rule of thumb: start simple, scale when necessary. I primarily use React Context API​ for global UI state (like theme toggling or user authentication status) because it's lightweight and built-in. However, if the application has complex, deeply nested state (like multi-step forms or real-time data synchronization), I would introduce a library like Zustand​ or Redux Toolkit​ for predictable state updates and better debugging capabilities.

Regarding the separation of concerns, I strictly keep UI components dumb​ (purely presentational) and lift the business logic up to custom hooks or container components. This makes the UI reusable and the logic easily testable."

    Backend Translation:​ This is your Caching Strategy​ and Application State.

    Context APIis like storing temporary session data in a simple HashMapor ConcurrentHashMapin memory. It's fast, built-in, and perfect for simple things (like storing the logged-in user's ID for the current request).

    Redux/Zustandis like implementing a proper Redis​ or Memcached​ layer. You use it when the data is complex, shared by thousands of concurrent users/sessions, and you need powerful tools to inspect, persist, and debug that data reliably.

Follow-up:​

“How do you decide between client side and server side rendering in Next.js?”

"I decide based on the nature of the page. If it's a dynamic dashboard​ requiring real-time user interactions and frequent data updates, I lean towards Client-Side Rendering (CSR)​ to reduce server load and improve interactivity. However, if it's a public-facing page​ with static content or SEO requirements (like a landing page or a blog), I heavily utilize Server-Side Rendering (SSR)​ or Static Site Generation (SSG). SSR ensures the HTML is pre-rendered on the server, making it crawlable by search engines and improving the initial load time for the user."

2. Performance Optimization in Web Apps

Question:​


“Imagine System A’s frontend is loading slowly.You’re assigned to investigate. Walk us through how you’d approach this — from initial triage to identifying the root cause. What are the first 3 things you’d check, and what optimizations would you consider?”

What to Listen For:​

Bundle size, lazy loading, code splitting

Image optimization, caching strategies

Network requests, API response times

"When faced with a slow-loading frontend, my first step is to quantify the problem​ using Chrome DevTools (specifically the Lighthouse audit and Network tab) rather than guessing.

The first 3 things I would check are:

Bundle Size & Dependencies:​ I'd analyze the JavaScript bundle using tools like webpack-bundle-analyzerto see if there are any heavy third-party libraries that could be lazily loaded or replaced.

Network Waterfall:​ I'd check the Network tab to identify if the bottleneck is the frontend itself or the backend APIs. If an API is taking 5 seconds to return data, optimizing the frontend won't solve the core issue.

Render Performance:​ Using the React Profiler, I'd check for unnecessary re-renders. If a state change in the header is causing the entire page to re-render, I'd implement React.memoor useMemoto isolate the updates.

Based on this triage, optimizations could include implementing Lazy Loading​ for images and routes, adding caching headers​ for static assets, or refactoring the code to split the main bundle into smaller, on-demand chunks."

3. Debugging Frontend Issues

Question:​

“A user reports that a form submission isn’t working in production, but it works locally. How would you investigate this?”

What to Listen For:​

Browser DevTools usage (Network, Console, Application tabs)

Environment differences (API endpoints, CORS, auth tokens)

Log analysis, reproduction steps

"The first thing I would do is try to replicate the environment. Since it works locally but fails in production, it's likely an environment-specific variable (like an API base URL, CORS policy, or an authentication token mismatch).

My investigation steps would be:

Check the Browser Console:​ Look for unhandled promise rejections, 404 (Not Found), or 500 (Internal Server Error) network responses when the form is submitted.

Inspect Network Payloads:​ Compare the payload being sent from the local environment versus the production environment. Is the JSON structure correct? Are the headers (like Content-Typeor Authorization) properly attached?

Check Application Logs:​ If the frontend seems fine, I would check the backend logs (or ask the backend team) to see if the request is even reaching the server, or if it's being blocked by an API Gateway or a firewall rule.

Use Feature Toggles/Debug Mode:​ If possible, I would enable a debug mode in the production build to log more verbose error messages to a monitoring tool like Sentry to catch the exact stack trace."

4. Integration Between Frontend & Backend

Question:​

“You’ve worked on both frontend (React) and backend (C#). How do you design a clean contract between frontend and backend teams?”

What to Listen For:​

API design (REST, GraphQL)

Data shaping, error handling conventions

Versioning and backward compatibility

"To ensure a smooth contract between frontend and backend, communication and documentation are key. I prefer using Swagger/OpenAPI​ specifications. It allows both teams to agree on the endpoint structures, request/response schemas, and error formats before actual development starts.

From a technical standpoint:

Consistent Error Handling:​ We should agree on a standard error response object (e.g., { success: false, message: 'Error description', code: 400 }). This allows the frontend to reliably parse errors and display user-friendly notifications.

Data Shaping:​ Backends often return nested ORM objects that the UI doesn't need. I would discuss creating specific DTOs (Data Transfer Objects)​ or using GraphQL. GraphQL is excellent here because it allows the frontend to request exactlythe data it needs, preventing over-fetching.

Versioning:​ We must agree on an API versioning strategy (e.g., /api/v1/users). This ensures that if we need to change a core data structure, we don't break existing frontend deployments."

5. Responsive Design & UX

Question:​

“Describe a time when you improved the user experience of a web application. What was the problem, and what changes did you make?”

What to Listen For:​

Mobile‑first design, CSS media queries

Accessibility considerations

User feedback loops

"In my previous project, we had a legacy admin dashboard that was built purely for desktop users. As the user base started accessing it via tablets, the experience was terrible—buttons were misaligned, and data tables were unreadable.

I took the initiative to refactor the core layout components using CSS Media Queries​ and a Mobile-First approach. Instead of trying to shrink the desktop view, I redesigned the critical user flows (like the approval workflow) to stack elements vertically on smaller screens.

I also implemented a collapsible sidebar​ and replaced traditional HTML tables with card-based layouts for mobile views. To validate the changes, I conducted informal user feedback sessions with the operations team. The result was a 30% reduction in support tickets related to mobile usability."


6. Investigating a Production Incident

Scenario:​

“A high-severity incident is raised: users can’t upload documents to System A. You’re the lead investigator. Describe your step-by-step approach.”

What to Listen For:​

Starts with impact assessment (how many users, business impact)

Checks logs, error messages, and recent changes

Reproduces issue (on test/staging if possible)

Uses SQL to validate data integrity

Provides timely updates to users and management

Proposes preventive measures afterward

"My step-by-step approach to a high-severity incident like this would be:

Immediate Triage & Impact Assessment:​ Determine the scope. Is it affecting all users or a specific tenant/client? Check the error rates and logs in our monitoring tool (e.g., Splunk or Azure Monitor).

Check Recent Changes:​ Look at the deployment history. Was there a recent code deploy, a database migration, or a configuration change that correlates with the start of the incident?

Reproduce & Isolate:​ Try to reproduce the issue in a staging or pre-production environment using the same steps. If it's environment-specific, check configurations (e.g., storage bucket permissions, API keys).

Root Cause Analysis:​ Once identified, apply a fix. If the fix takes time, I explore a rollback to the last known stable version to restore service immediately.

Communication:​ Keep stakeholders updated every 30-60 minutes regarding the status, impact, and ETA for resolution.

Follow-up:​

“How would you handle pressure from business stakeholders while investigating?”

Regarding pressure from stakeholders:I remain calm and empathetic. I set clear expectations—giving regular, honest updates is crucial. I focus on gathering facts rather than speculating, and I prioritize restoring service over finding the root cause initially (mitigation first, investigation second)."

7. how do you store credentials in the frontend

Think of LocalStorage & SessionStorage (The "Insecure Client-Side Cache") as non-HttpOnly browser caches. They are accessible via JavaScript running on the page.

Think of cookies as HTTP headers managed by the browser. This is the industry standard for authentication.

⚛️ Mini‑Task: Search Filter in React
Task Description

“Imagine you’re building a user list page in React. The page displays a list of users fetched from an API. You need to add a search box that filters users by name as the user types. 
Walk us through how you’d implement this — from component design to state handling and performance considerations.”


Component Structure​
“How would you split this into components?”
✅ I would split this into at least three components: a parent UserListContainerto handle data fetching, a SearchBarcomponent for the input field, and a UserListcomponent to render the filtered results. This keeps the code clean and reusable.
❌ I'll just put everything in one big component. It's faster to write, and I can use regular JavaScript functions inside the JSX to filter the list whenever I need it.

State Management​
“Where would you store the search term and filtered list?”
✅ I would use the useStatehook to manage the searchTerm. As the user types, I'll update the searchTerm state. I don't want to duplicate data by storing a separate filteredUsersarray, so I'll calculate the filtered list dynamically on every render.
❌ I would create two state variables: one for searchTerm and another for filteredUsers. When the user types, I'll update the searchTerm and immediately run a .filter()on the original list, then save the result into filteredUsers.

Filtering Logic & Performance:
“How would you filter the list efficiently?” “What would you do to avoid unnecessary renders?”
✅ To filter efficiently, I'll use the useMemohook. This way, the filtering function only recalculates when the searchTermor the original userslist changes, preventing heavy operations on every keystroke. If the dataset is extremely large or comes from an API, I would look into implementing a debouncefunction on the input to limit how often the filtering or API calls actually trigger.
❌ I'll just filter the array directly inside the component's return statement using users.filter(...). It usually runs fast enough on modern computers, so I don't think adding extra hooks like useMemois necessary unless the app starts lagging.

Edge Cases​
“How would you handle empty results or loading states?”
✅ I’ll always return a stable array from useMemo—even if it’s empty—to avoid runtime errors. I’ll also add a conditional check: if the filtered list is empty, I’ll render a simple 'No users found' message instead of rendering nothing.
❌ If there are no users, the page will just be blank. I guess I could add an ifstatement to check the length before mapping, but usually, the list has data so it's fine.



## high level

what does CAP theory actually say ： consistency availability partition tolerance

BASEtheory

https://lyhistory.com/docs/software/highlevel/distrubuted_system.html#_2-1-2-%E4%B8%80%E8%87%B4%E6%80%A7%E7%8A%B6%E6%80%81%E6%9C%BA

## monolithic application to microservice
https://lyhistory.com/docs/software/highlevel/microservice.html#%E4%BB%80%E4%B9%88%E6%98%AF%E5%BE%AE%E6%9C%8D%E5%8A%A1

is it correct if I say microservices is just to slice into smaller services based on business logic for example, or can i say microservices is only comprised of small services, what else is missing?

what problems does microservices arcthitecture bring in and how can we solve them

could you give me some examples of how microservices communicated with each other

single point of failure
transactions consistency



have you ever heard of CRUD, what's it? what's the method in a http request to do CRUD respectively?
GET for Read, POST is for CREATE, PUT is for UPDATE and DELETE is for DELETE

for a typical client-server model, what's 
SQL:


blockchain:

blockchain aka distributed ledger, what do you think is the fundmental differences between distributed ledger and traditional distributed system like spark flink kafka  
byzantine general problem

what's the property of Digital Signature
