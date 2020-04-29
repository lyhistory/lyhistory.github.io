module.exports = {
	
  base: '/docs/',
  
  title: '计算机基础教程',
  description: '软件开发教程，白帽黑客入门教程，区块链入门教程，物联网，大数据',
  markdown: {
	  extractHeaders: [ 'h2', 'h3', 'h4', 'h5' ]
  },
  themeConfig: {
	smoothScroll: true,
    nav: [
      { text: '机器指令', link: '/' },
	  { text: '软件基础', link: '/software/' },
      { text: '白帽黑客', link: '/coder2hacker/' },
      { text: '区块链', link: '/blockchain/' }
    ]
	
	,
	sidebar: [
      {
        title: '软件基础',   // required
        path: '/software/',      // optional, which should be a absolute path.
        collapsable: true, // optional, defaults to true
        sidebarDepth: 3    // optional, defaults to 1
      },
      {
        title: '黑客入门',   // required
        path: '/coder2hacker/',      // optional, which should be a absolute path.
        collapsable: true, // optional, defaults to true
        sidebarDepth: 3    // optional, defaults to 1
      },
	  {
        title: '区块链入门',   // required
        path: '/blockchain/',      // optional, which should be a absolute path.
        collapsable: true, // optional, defaults to true
        sidebarDepth: 3,    // optional, defaults to 1
        children: []
      }
	  ]
  }
}