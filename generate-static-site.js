const fs = require('fs');
const path = require('path');
const marked = require('marked');
const hljs = require('highlight.js');

// 创建输出目录
const outputDir = path.join(__dirname, 'docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 复制静态资源
function copyStaticAssets() {
  const publicDir = path.join(__dirname, 'public');
  const docsAssetsDir = path.join(outputDir, 'css');
  
  if (!fs.existsSync(docsAssetsDir)) {
    fs.mkdirSync(docsAssetsDir, { recursive: true });
  }
  
  // 复制CSS文件
  const cssFiles = [
    'css/style.css',
    'css/highlight.css',
    'css/admin/style.css'
  ];
  
  cssFiles.forEach(cssFile => {
    const srcPath = path.join(publicDir, cssFile);
    const destPath = path.join(outputDir, cssFile);
    
    // 确保目标目录存在
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${cssFile}`);
    }
  });
}

// 获取默认文章数据
function getDefaultPosts() {
  // 这里是直接从models/index.js复制的默认文章数据
  return [
    {
      _id: '1',
      title: '欢迎来到峰叔靠谱博客',
      content: '# 欢迎阅读我的博客\n\n这是我的第一篇文章，很高兴您能访问我的博客。\n\n## 关于这个博客\n\n这个博客是我用来分享技术心得和个人感悟的地方。\n\n### 特色功能\n\n- 简洁美观的设计\n- 响应式布局，适配各种设备\n- 支持Markdown语法\n- 代码高亮显示',
      excerpt: '这是我的第一篇文章，很高兴您能访问我的博客。',
      author: '峰叔',
      date: '2025-01-01',
      tags: ['介绍', '博客']
    },
    {
      _id: '2',
      title: '如何搭建个人博客',
      content: '# 如何搭建个人博客\n\n在这篇文章中，我将分享如何快速搭建一个属于自己的个人博客。\n\n## 选择合适的技术栈\n\n### 静态站点生成器\n\n对于个人博客来说，静态站点生成器是一个非常好的选择：\n\n1. **性能优异** - 静态文件加载速度快\n2. **安全性高** - 没有服务器端漏洞风险\n3. **成本低廉** - 可以免费托管在GitHub Pages等平台\n4. **易于维护** - 不需要复杂的服务器配置\n\n### 推荐工具\n\n- **Jekyll** - GitHub官方支持\n- **Hugo** - 构建速度极快\n- **Hexo** - 基于Node.js\n\n## 部署到GitHub Pages\n\nGitHub Pages是托管个人博客的理想选择：\n\n1. 完全免费\n2. 支持自定义域名\n3. HTTPS自动配置\n4. 与GitHub无缝集成\n\n```javascript\n// 示例代码\nfunction deployToGithubPages() {\n  console.log("部署到GitHub Pages");\n  // 实际部署步骤...\n}\n```\n\n## 总结\n\n搭建个人博客并不复杂，关键是选择合适的工具并坚持创作优质内容。',
      excerpt: '分享如何快速搭建一个属于自己的个人博客，包括技术选型和部署方法。',
      author: '峰叔',
      date: '2025-01-02',
      tags: ['教程', '博客', 'GitHub']
    },
    {
      _id: '3',
      title: 'Node.js开发经验分享',
      content: '# Node.js开发经验分享\n\n作为一位长期使用Node.js的开发者，我想分享一些我在实际项目中积累的经验。\n\n## 性能优化\n\n### 异步编程\n\nNode.js的核心优势在于异步I/O，合理使用可以显著提升性能：\n\n```javascript\n// 使用Promise而不是回调\nasync function fetchData() {\n  try {\n    const result = await db.collection.find({});\n    return result;\n  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n}\n\n// 并行处理多个异步操作\nasync function fetchMultipleData() {\n  const [users, posts, comments] = await Promise.all([\n    fetchUsers(),\n    fetchPosts(),\n    fetchComments()\n  ]);\n  \n  return { users, posts, comments };\n}\n```\n\n### 内存管理\n\n避免内存泄漏是Node.js应用稳定运行的关键：\n\n1. 及时清理事件监听器\n2. 合理使用全局变量\n3. 注意闭包引用\n4. 监控内存使用情况\n\n## 错误处理\n\n良好的错误处理机制能够提高应用的健壮性：\n\n```javascript\n// 统一错误处理中间件\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send(\'服务器内部错误\');\n});\n\n// 处理未捕获的异常\nprocess.on(\'uncaughtException\', (err) => {\n  console.error(\'未捕获的异常:\', err);\n  process.exit(1);\n});\n```\n\n## 最佳实践\n\n1. 使用ESLint保证代码质量\n2. 编写单元测试\n3. 使用环境变量管理配置\n4. 日志记录和监控\n5. 定期更新依赖包',
      excerpt: '分享Node.js开发中的性能优化、错误处理和最佳实践。',
      author: '峰叔',
      date: '2025-01-03',
      tags: ['Node.js', '后端', '开发经验']
    }
  ];
}

// 渲染Markdown内容
function renderMarkdown(content) {
  marked.setOptions({
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });
  
  return marked.parse(content);
}

// 生成首页
function generateIndexPage(posts) {
  const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>峰叔靠谱 - 个人博客</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/highlight.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>峰叔靠谱</h1>
            <p>分享技术心得与生活感悟</p>
            <nav>
                <ul>
                    <li><a href="/">首页</a></li>
                    <li><a href="/about.html">关于</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="posts">
            ${posts.map(post => `
            <article class="post-preview">
                <h2><a href="/post/${post._id}.html">${post.title}</a></h2>
                <div class="post-meta">
                    <span class="author">作者：${post.author}</span>
                    <span class="date">发布日期：${post.date}</span>
                </div>
                <p class="excerpt">${post.excerpt}</p>
                <div class="tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="/post/${post._id}.html" class="read-more">阅读全文</a>
            </article>
            `).join('')}
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 峰叔靠谱博客. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  
  fs.writeFileSync(path.join(outputDir, 'index.html'), template);
  console.log('Generated index.html');
}

// 生成文章详情页
function generatePostPage(post) {
  const contentHtml = renderMarkdown(post.content);
  
  const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - 峰叔靠谱博客</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/highlight.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>峰叔靠谱</h1>
            <p>分享技术心得与生活感悟</p>
            <nav>
                <ul>
                    <li><a href="/">首页</a></li>
                    <li><a href="/about.html">关于</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <article class="post">
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span class="author">作者：${post.author}</span>
                <span class="date">发布日期：${post.date}</span>
            </div>
            <div class="tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="post-content">
                ${contentHtml}
            </div>
        </article>
        
        <div class="post-navigation">
            <a href="/" class="back-to-home">← 返回首页</a>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 峰叔靠谱博客. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  
  const postDir = path.join(outputDir, 'post');
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(postDir, `${post._id}.html`), template);
  console.log(`Generated post/${post._id}.html`);
}

// 生成关于页面
function generateAboutPage() {
  const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>关于 - 峰叔靠谱博客</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>峰叔靠谱</h1>
            <p>分享技术心得与生活感悟</p>
            <nav>
                <ul>
                    <li><a href="/">首页</a></li>
                    <li><a href="/about.html">关于</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="about">
            <h1>关于峰叔</h1>
            <div class="about-content">
                <p>欢迎来到我的个人博客！我是峰叔，一名热爱技术和分享的开发者。</p>
                
                <p>在这个博客中，我会分享：</p>
                <ul>
                    <li>前端开发经验与技巧</li>
                    <li>后端技术实践</li>
                    <li>项目架构设计思考</li>
                    <li>个人成长感悟</li>
                    <li>生活中的点点滴滴</li>
                </ul>
                
                <p>我相信技术能让世界变得更美好，也希望通过我的分享能帮助到更多的人。</p>
                
                <h2>联系我</h2>
                <p>如果您有任何问题或建议，欢迎通过以下方式联系我：</p>
                <ul>
                    <li>邮箱: fengshu@example.com</li>
                    <li>GitHub: <a href="https://github.com/fengshu" target="_blank">@fengshu</a></li>
                </ul>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 峰叔靠谱博客. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  
  fs.writeFileSync(path.join(outputDir, 'about.html'), template);
  console.log('Generated about.html');
}

// 生成404页面
function generate404Page() {
  const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面未找到 - 峰叔靠谱博客</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>峰叔靠谱</h1>
            <p>分享技术心得与生活感悟</p>
            <nav>
                <ul>
                    <li><a href="/">首页</a></li>
                    <li><a href="/about.html">关于</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="error-404">
            <h1>404 - 页面未找到</h1>
            <p>抱歉，您访问的页面不存在。</p>
            <a href="/" class="back-to-home">返回首页</a>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 峰叔靠谱博客. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  
  fs.writeFileSync(path.join(outputDir, '404.html'), template);
  console.log('Generated 404.html');
}

// 主函数
function main() {
  console.log('Generating static site...');
  
  // 复制静态资源
  copyStaticAssets();
  
  // 获取文章数据
  const posts = getDefaultPosts();
  
  // 生成各个页面
  generateIndexPage(posts);
  
  posts.forEach(post => {
    generatePostPage(post);
  });
  
  generateAboutPage();
  generate404Page();
  
  console.log('Static site generation complete!');
  console.log(`Site generated in: ${outputDir}`);
}

main();