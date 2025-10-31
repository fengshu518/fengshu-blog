const express = require('express');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');
const fs = require('fs');
const https = require('https');
// 加载环境变量
require('dotenv').config();

// 数据库连接
const { Post, useDatabase } = require('./models');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// 引入会话中间件
const session = require('express-session');

// 配置marked使用highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

// 设置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 配置会话
app.use(session({
  secret: process.env.SESSION_SECRET || 'fengshu-blog-secret-key', // 在生产环境中应该使用环境变量
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // 在生产环境中使用 HTTPS 时应设置为 true
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 中间件
app.use(express.urlencoded({ extended: true }));

// 引入管理员路由
const adminRoutes = require('./routes/admin');

// 路由
app.get('/', async (req, res) => {
  try {
    // 检查Post是否支持sort方法
    if (typeof Post.find === 'function') {
      const posts = await Post.find({ date: -1 });
      // 为MongoDB文档添加id属性以保持与内存存储的一致性
      const formattedPosts = posts.map(post => {
        const postData = typeof post.toObject === 'function' ? post.toObject() : { ...post };
        return {
          ...postData,
          id: post._id.toString()
        };
      });
      res.render('index', { posts: formattedPosts });
    } else {
      // 如果是内存存储方案，直接获取所有文章
      const posts = await Post.find();
      res.render('index', { posts });
    }
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.render('index', { posts: [] });
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    // 首先尝试直接使用提供的ID查找（适用于MongoDB ObjectId）
    let post = await Post.findById(req.params.id);
    
    // 如果没找到，可能是因为使用了旧的数字ID，在内存存储方案中使用
    if (!post && !useDatabase) {
      post = await Post.findById(parseInt(req.params.id));
    }
    
    if (!post) {
      return res.status(404).render('404');
    }
    
    // 渲染Markdown内容
    const htmlContent = marked(post.content);
    
    // 兼容内存存储和数据库存储方案
    const postData = typeof post.toObject === 'function' ? post.toObject() : { ...post };
    
    res.render('post', { post: { ...postData, content: htmlContent } });
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return res.status(404).render('404');
  }
});

app.get('/about', (req, res) => {
  res.render('about');
});

// 管理员路由
app.use('/admin', adminRoutes);

// 404页面
app.use((req, res) => {
  res.status(404).render('404');
});

// 检查是否启用了HTTPS
const enableHTTPS = process.env.ENABLE_HTTPS === 'true';
const httpsPort = process.env.HTTPS_PORT || 8443;

if (enableHTTPS) {
  // 检查证书文件是否存在
  const privateKeyPath = path.join(__dirname, 'certs', 'server.key');
  const certificatePath = path.join(__dirname, 'certs', 'server.crt');
  
  if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath)) {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');
    
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(httpsPort, host, () => {
      console.log(`峰叔靠谱博客HTTPS服务器启动成功，访问地址: https://${host}:${httpsPort}`);
      if (useDatabase) {
        console.log('数据库已启用');
      } else {
        console.log('数据库未启用，使用内存存储方案');
      }
    });
  } else {
    console.log('SSL证书文件不存在，启动HTTP服务器');
    app.listen(port, host, () => {
      console.log(`峰叔靠谱博客启动成功，访问地址: http://${host}:${port}`);
      if (useDatabase) {
        console.log('数据库已启用');
      } else {
        console.log('数据库未启用，使用内存存储方案');
      }
    });
  }
} else {
  app.listen(port, host, () => {
    console.log(`峰叔靠谱博客启动成功，访问地址: http://${host}:${port}`);
    if (useDatabase) {
      console.log('数据库已启用');
    } else {
      console.log('数据库未启用，使用内存存储方案');
    }
  });
}