module.exports = {
	
  base: '/docs/',
  
  title: '计算机基础教程',
  description: '软件开发教程，渗透测试入门教程，区块链入门教程，物联网，大数据',
  
  themeConfig: {
	smoothScroll: true,
    nav: [
      { text: '机器指令', link: '/' },
      { text: '渗透测试', link: '/coder2hacker/' },
      { text: '区块链', link: '/blockchain/' }
    ]
	/*
	,
	sidebar: [
      {
        title: '黑客入门',   // required
        path: '/coder2hacker/',      // optional, which should be a absolute path.
        collapsable: true, // optional, defaults to true
        sidebarDepth: 2    // optional, defaults to 1
      },
	  {
        title: '区块链入门',   // required
        path: '/blockchain/',      // optional, which should be a absolute path.
        collapsable: true, // optional, defaults to true
        sidebarDepth: 2,    // optional, defaults to 1
        children: []
      }
	  ]
	  */
  }
}