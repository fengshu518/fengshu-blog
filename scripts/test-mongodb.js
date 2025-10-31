#!/usr/bin/env node

/**
 * MongoDB连接测试脚本
 * 
 * 此脚本用于测试MongoDB连接配置是否正确
 * 运行方式: node scripts/test-mongodb.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// 颜色代码用于美化输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgRed: '\x1b[31m',
  fgCyan: '\x1b[36m'
};

// 彩色输出函数
function colored(color, text) {
  return `${color}${text}${colors.reset}`;
}

async function testMongoDBConnection() {
  console.log(colored(colors.fgCyan, '=== MongoDB连接测试 ===\n'));
  
  // 检查环境变量
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log(colored(colors.fgRed, '✗ 未找到DATABASE_URL环境变量'));
    console.log(colored(colors.fgYellow, '请确保已配置.env文件中的DATABASE_URL'));
    process.exit(1);
  }
  
  console.log(colored(colors.fgCyan, '数据库连接URL:'), databaseUrl);
  console.log('');
  
  try {
    // 尝试连接到MongoDB
    console.log(colored(colors.fgCyan, '正在连接到MongoDB...'));
    
    await mongoose.connect(databaseUrl, {
      // 注意：以下选项在新版本中已弃用，但为了兼容性保留
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    
    console.log(colored(colors.fgGreen, '✓ MongoDB连接成功!\n'));
    
    // 获取连接信息
    const db = mongoose.connection;
    console.log(colored(colors.fgCyan, '连接详情:'));
    console.log(`  主机: ${db.host}`);
    console.log(`  数据库: ${db.name}`);
    console.log(`  端口: ${db.port}`);
    console.log(`  状态: ${db.readyState === 1 ? '已连接' : '未连接'}`);
    
    // 测试基本操作
    console.log(colored(colors.fgCyan, '\n正在测试基本操作...'));
    
    // 创建一个测试模型
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    // 插入测试数据
    const testDoc = new TestModel({ name: 'MongoDB连接测试' });
    await testDoc.save();
    console.log(colored(colors.fgGreen, '✓ 数据插入成功'));
    
    // 查询测试数据
    const foundDoc = await TestModel.findOne({ name: 'MongoDB连接测试' });
    if (foundDoc) {
      console.log(colored(colors.fgGreen, '✓ 数据查询成功'));
    } else {
      console.log(colored(colors.fgYellow, '⚠ 数据查询返回空结果'));
    }
    
    // 删除测试数据
    await TestModel.deleteOne({ name: 'MongoDB连接测试' });
    console.log(colored(colors.fgGreen, '✓ 数据清理成功'));
    
    // 断开连接
    await mongoose.disconnect();
    console.log(colored(colors.fgGreen, '\n✓ MongoDB连接已断开'));
    
    console.log(colored(colors.fgGreen, '\n🎉 所有测试通过! MongoDB配置正确。'));
    
  } catch (error) {
    console.error(colored(colors.fgRed, '✗ MongoDB连接失败:'), error.message);
    
    // 提供故障排除建议
    console.log(colored(colors.fgYellow, '\n故障排除建议:'));
    console.log('1. 检查DATABASE_URL是否正确配置');
    console.log('2. 确保MongoDB Atlas中的用户权限设置正确');
    console.log('3. 检查网络连接和防火墙设置');
    console.log('4. 确认MongoDB Atlas中的IP白名单设置');
    
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  testMongoDBConnection();
}

module.exports = { testMongoDBConnection };