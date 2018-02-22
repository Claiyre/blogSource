
module.exports = {
  pageSize: 6 ,
  title: 'Claiyre的个人博客',
  blogName: "Claiyre's Blog",           // the text in the header of blog pages
  avatarUrl: 'avatar.png',   // put your avatar image under ~./extra/
  header: {
    posts: {
      text: 'posts',
      show: true
    },
    tags: true,
    about: true
  },
  gitment: {
    owner: 'Claiyre',
    repo: 'Claiyre.github.io',
    oauth: {
      client_id: '11fe4829a6825b045160',
      client_secret: 'adb9b606c07461b2cdea97c3b0808e42cf7afd68'
    }
  }
}