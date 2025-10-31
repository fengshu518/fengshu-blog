// 内存存储方案（用于开发环境或无法使用数据库的情况）

class MemoryStore {
  constructor() {
    this.posts = [
      {
        _id: '1',
        title: '欢迎来到峰叔靠谱博客',
        content: '# 欢迎阅读我的博客\n\n这是我的第一篇文章，感谢您的访问！\n\n在这里我会分享一些关于技术、生活和思考的内容。',
        excerpt: '欢迎阅读我的博客，这是我第一篇文章',
        author: '峰叔',
        date: new Date('2025-10-31'),
        tags: ['生活', '感悟'],
        createdAt: new Date('2025-10-31'),
        updatedAt: new Date('2025-10-31')
      },
      {
        _id: '2',
        title: '如何搭建个人博客网站',
        content: '# 使用Node.js搭建个人博客\n\n在这篇文章中，我将介绍如何使用Node.js、Express和MongoDB搭建一个简单的个人博客网站。\n\n## 技术选型\n\n- Node.js\n- Express框架\n- MongoDB数据库\n- EJS模板引擎\n\n## 步骤\n\n1. 初始化项目\n2. 安装依赖\n3. 创建服务器\n4. 设计数据库模型\n5. 实现路由\n6. 创建视图模板\n7. 部署上线',
        excerpt: '介绍如何使用Node.js搭建个人博客网站',
        author: '峰叔',
        date: new Date('2025-10-30'),
        tags: ['技术', '教程', 'Node.js'],
        createdAt: new Date('2025-10-30'),
        updatedAt: new Date('2025-10-30')
      },
      {
        _id: '3',
        title: '前端开发最佳实践',
        content: '# 前端开发最佳实践\n\n在现代Web开发中，遵循最佳实践可以提高代码质量和开发效率。\n\n## HTML规范\n\n- 使用语义化标签\n- 合理使用ARIA属性\n- 保持良好的结构\n\n## CSS规范\n\n- 使用BEM命名规范\n- 合理组织文件结构\n- 使用CSS预处理器\n\n## JavaScript规范\n\n- 使用ES6+语法\n- 遵循函数式编程思想\n- 合理使用模块化',
        excerpt: '分享前端开发中的最佳实践',
        author: '峰叔',
        date: new Date('2025-10-29'),
        tags: ['前端', 'CSS', 'HTML'],
        createdAt: new Date('2025-10-29'),
        updatedAt: new Date('2025-10-29')
      }
    ];
    this.nextId = 4;
  }

  async find(sort = {}) {
    // 如果有排序参数，则按参数排序，否则按日期降序排列
    if (Object.keys(sort).length > 0) {
      const sortField = Object.keys(sort)[0];
      const sortOrder = sort[sortField];
      
      if (sortField === 'date' && sortOrder === -1) {
        return this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        return this.posts.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    } else {
      return this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  async findById(id) {
    return this.posts.find(post => post._id === id);
  }

  async create(postData) {
    const newPost = {
      _id: String(this.nextId++),
      ...postData,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.push(newPost);
    return newPost;
  }

  async findByIdAndUpdate(id, updateData) {
    const index = this.posts.findIndex(post => post._id === id);
    if (index === -1) return null;
    
    this.posts[index] = {
      ...this.posts[index],
      ...updateData,
      updatedAt: new Date()
    };
    
    return this.posts[index];
  }

  async findByIdAndDelete(id) {
    const index = this.posts.findIndex(post => post._id === id);
    if (index === -1) return null;
    
    const deletedPost = this.posts[index];
    this.posts.splice(index, 1);
    return deletedPost;
  }

  async countDocuments() {
    return this.posts.length;
  }

  async insertMany(posts) {
    posts.forEach(post => {
      const newPost = {
        _id: String(this.nextId++),
        ...post,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.posts.push(newPost);
    });
    return posts;
  }
}

module.exports = MemoryStore;