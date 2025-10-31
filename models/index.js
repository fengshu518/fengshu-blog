const mongoose = require('mongoose');

// 尝试连接MongoDB数据库
let Post;
let useDatabase = true;

try {
  // 只有在提供了DATABASE_URL环境变量时才连接数据库
  if (process.env.DATABASE_URL) {
    // 导出Post模型
    Post = require('./Post');
    
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 数据库连接成功回调
    mongoose.connection.on('connected', async () => {
      console.log('MongoDB数据库连接成功');

      // 检查数据库中是否有文章
      try {
        const count = await Post.countDocuments();
        if (count === 0) {
          // 如果没有文章，则插入三篇默认文章
          const defaultPosts = [
            {
              title: '欢迎来到峰叔靠谱博客',
              content: '# 欢迎阅读我的博客\n\n这是我的第一篇文章，感谢您的访问！\n\n在这里我会分享一些关于技术、生活和思考的内容。',
              excerpt: '欢迎阅读我的博客，这是我第一篇文章',
              author: '峰叔',
              date: new Date('2025-10-31'),
              tags: ['生活', '感悟']
            },
            {
              title: '如何搭建个人博客网站',
              content: '# 使用Node.js搭建个人博客\n\n在这篇文章中，我将介绍如何使用Node.js、Express和MongoDB搭建一个简单的个人博客网站。\n\n## 技术选型\n\n- Node.js\n- Express框架\n- MongoDB数据库\n- EJS模板引擎\n\n## 步骤\n\n1. 初始化项目\n2. 安装依赖\n3. 创建服务器\n4. 设计数据库模型\n5. 实现路由\n6. 创建视图模板\n7. 部署上线',
              excerpt: '介绍如何使用Node.js搭建个人博客网站',
              author: '峰叔',
              date: new Date('2025-10-30'),
              tags: ['技术', '教程', 'Node.js']
            },
            {
              title: '前端开发最佳实践',
              content: '# 前端开发最佳实践\n\n在现代Web开发中，遵循最佳实践可以提高代码质量和开发效率。\n\n## HTML规范\n\n- 使用语义化标签\n- 合理使用ARIA属性\n- 保持良好的结构\n\n## CSS规范\n\n- 使用BEM命名规范\n- 合理组织文件结构\n- 使用CSS预处理器\n\n## JavaScript规范\n\n- 使用ES6+语法\n- 遵循函数式编程思想\n- 合理使用模块化',
              excerpt: '分享前端开发中的最佳实践',
              author: '峰叔',
              date: new Date('2025-10-29'),
              tags: ['前端', 'CSS', 'HTML']
            }
          ];

          try {
            await Post.insertMany(defaultPosts);
            console.log('默认文章已插入数据库');
          } catch (error) {
            console.error('插入默认文章时出错:', error);
          }
        }
      } catch (error) {
        console.error('检查数据库文章时出错:', error);
      }
    });

    // 数据库连接错误回调
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB数据库连接错误:', err);
      console.log('将使用内存存储方案');
      useDatabase = false;
    });
  } else {
    console.log('未提供DATABASE_URL，将使用内存存储方案');
    useDatabase = false;
  }
} catch (error) {
  console.error('数据库连接初始化失败:', error);
  console.log('将使用内存存储方案');
  useDatabase = false;
}

// 如果无法使用数据库，则使用内存存储方案
if (!useDatabase) {
  const MemoryStore = require('./memoryStore');
  Post = new MemoryStore();
}

module.exports = {
  Post,
  useDatabase
};