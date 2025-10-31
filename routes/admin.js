const express = require('express');
const router = express.Router();
// 数据库模型
const { Post } = require('../models');

// 模拟管理员中间件（实际应用中需要实现真正的认证）
const isAdmin = (req, res, next) => {
  // 简单检查session或token
  if (req.session && req.session.isAdmin) {
    return next();
  }
  // 重定向到登录页面
  res.redirect('/admin/login');
};

// 管理员面板
router.get('/', isAdmin, (req, res) => {
  res.render('admin/dashboard');
});

// 文章管理
router.get('/posts', isAdmin, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.render('admin/posts', { posts });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.render('admin/posts', { posts: [] });
  }
});

// 创建新文章
router.get('/posts/new', isAdmin, (req, res) => {
  res.render('admin/new-post');
});

// 处理创建新文章
router.post('/posts/new', isAdmin, async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    const post = new Post({
      title,
      excerpt,
      content
    });
    
    await post.save();
    res.redirect('/admin/posts');
  } catch (error) {
    console.error('创建文章失败:', error);
    res.render('admin/new-post', { 
      error: '创建文章失败',
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content
    });
  }
});

// 编辑文章
router.get('/posts/edit/:id', isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).render('404');
    }
    res.render('admin/edit-post', { post });
  } catch (error) {
    console.error('获取文章失败:', error);
    res.status(404).render('404');
  }
});

// 处理编辑文章
router.post('/posts/edit/:id', isAdmin, async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, excerpt, content },
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).render('404');
    }
    
    res.redirect('/admin/posts');
  } catch (error) {
    console.error('更新文章失败:', error);
    res.render('admin/edit-post', { 
      error: '更新文章失败',
      post: { ...req.body, _id: req.params.id }
    });
  }
});

// 删除文章
router.post('/posts/delete/:id', isAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).render('404');
    }
    res.redirect('/admin/posts');
  } catch (error) {
    console.error('删除文章失败:', error);
    res.redirect('/admin/posts');
  }
});

// 登录页面
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// 处理登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('登录尝试:', username, password); // 添加调试日志
  
  // 简单验证（实际应用中需要更安全的验证方式）
  if (username === 'admin' && password === 'password') {
    req.session = req.session || {};
    req.session.isAdmin = true;
    console.log('登录成功'); // 添加调试日志
    console.log('会话ID:', req.sessionID); // 添加会话ID日志
    console.log('会话内容:', req.session); // 添加会话内容日志
    res.redirect('/admin');
  } else {
    console.log('登录失败: 用户名或密码错误'); // 添加调试日志
    res.render('admin/login', { error: '用户名或密码错误' });
  }
});

// 登出
router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/admin/login');
});

module.exports = router;