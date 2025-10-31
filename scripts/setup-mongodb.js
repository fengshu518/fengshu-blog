#!/usr/bin/env node

/**
 * MongoDB连接字符串配置脚本
 * 
 * 此脚本帮助您配置MongoDB Atlas连接字符串到环境配置文件中
 * 运行方式: npm run setup:mongodb
 */

const fs = require('fs');
const path = require('path');

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

console.log(colored(colors.fgCyan, '=== MongoDB连接字符串配置工具 ===\n'));

// 获取用户输入的函数
function getUserInput(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

// 更新环境配置文件
function updateEnvFile(filePath, connectionString) {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(colored(colors.fgYellow, `⚠️  文件不存在: ${filePath}`));
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找DATABASE_URL行并替换
    const regex = /^(DATABASE_URL=).*$/m;
    if (regex.test(content)) {
      const newLine = `DATABASE_URL=${connectionString}`;
      content = content.replace(regex, newLine);
    } else {
      // 如果没有找到DATABASE_URL，则添加它
      content += `\n# 数据库连接URL\nDATABASE_URL=${connectionString}\n`;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(colored(colors.fgGreen, `✓ 已更新 ${filePath}`));
    return true;
  } catch (error) {
    console.error(colored(colors.fgRed, `✗ 更新 ${filePath} 失败:`), error.message);
    return false;
  }
}

// 验证连接字符串格式
function validateConnectionString(url) {
  // 更宽松的验证，支持mongodb://和mongodb+srv://两种格式
  const mongoRegex = /^mongodb(\+srv)?:\/\/.+$/;
  return mongoRegex.test(url);
}

// 显示配置文件当前状态
function showCurrentConfig() {
  console.log(colored(colors.fgCyan, '当前配置状态:'));
  
  const envFiles = [
    { path: path.join(__dirname, '..', '.env'), name: '.env' },
    { path: path.join(__dirname, '..', '.env.production'), name: '.env.production' }
  ];
  
  envFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      const content = fs.readFileSync(file.path, 'utf8');
      const match = content.match(/^DATABASE_URL=(.*)$/m);
      if (match) {
        const url = match[1];
        if (url === '请在这里粘贴您的MongoDB Atlas连接字符串') {
          console.log(`  ${file.name}: ${colored(colors.fgYellow, '未配置 (占位符状态)')}`);
        } else if (url.startsWith('mongodb')) {
          console.log(`  ${file.name}: ${colored(colors.fgGreen, '已配置')}`);
        } else {
          console.log(`  ${file.name}: ${colored(colors.fgYellow, '配置可能不正确')}`);
        }
      } else {
        console.log(`  ${file.name}: ${colored(colors.fgRed, '未找到DATABASE_URL')}`);
      }
    } else {
      console.log(`  ${file.name}: ${colored(colors.fgRed, '文件不存在')}`);
    }
  });
  
  console.log('');
}

async function main() {
  try {
    console.log(colored(colors.bright, '此脚本将帮助您配置MongoDB Atlas连接字符串。\n'));
    
    // 显示当前配置状态
    showCurrentConfig();
    
    console.log('请按照以下步骤操作:');
    console.log('1. 登录MongoDB Atlas: https://cloud.mongodb.com/');
    console.log('2. 创建集群并设置数据库用户');
    console.log('3. 在"Network Access"中添加IP白名单 (建议添加 0.0.0.0/0)');
    console.log('4. 点击"Connect" -> "Connect your application"');
    console.log('5. 复制连接字符串并替换其中的占位符\n');
    
    // 获取MongoDB连接字符串
    const connectionString = await getUserInput(
      colored(colors.fgCyan, '请输入您的MongoDB Atlas连接字符串 (或按Enter跳过):\n> ')
    );
    
    // 如果用户直接按Enter跳过，则退出
    if (!connectionString) {
      console.log(colored(colors.fgYellow, '\n操作已取消。'));
      process.exit(0);
    }
    
    // 验证连接字符串
    if (!validateConnectionString(connectionString)) {
      console.log(colored(colors.fgYellow, '\n⚠️  警告: 连接字符串格式可能不正确。'));
      console.log('正确的格式应类似:');
      console.log('  mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/数据库名?retryWrites=true&w=majority\n');
      
      const confirm = await getUserInput(
        colored(colors.fgCyan, '是否继续使用此连接字符串? (y/N): ')
      );
      
      if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
        console.log(colored(colors.fgYellow, '操作已取消。'));
        process.exit(0);
      }
    }
    
    console.log(colored(colors.fgCyan, '\n正在更新配置文件...\n'));
    
    // 更新.env文件
    const envPath = path.join(__dirname, '..', '.env');
    const envUpdated = updateEnvFile(envPath, connectionString);
    
    // 更新.env.production文件
    const envProdPath = path.join(__dirname, '..', '.env.production');
    const envProdUpdated = updateEnvFile(envProdPath, connectionString);
    
    if (envUpdated && envProdUpdated) {
      console.log(colored(colors.fgGreen, '\n🎉 配置完成!'));
      console.log('MongoDB连接字符串已成功更新到所有环境配置文件中。\n');
      
      console.log('接下来您可以:');
      console.log(colored(colors.fgCyan, '1. 启动开发服务器:'), 'npm run dev');
      console.log(colored(colors.fgCyan, '2. 启动生产服务器:'), 'npm run start:prod');
      console.log(colored(colors.fgCyan, '3. 启动HTTPS服务器:'), 'npm run start:https');
      console.log(colored(colors.fgCyan, '4. 启动自定义域名服务器:'), 'npm run start:domain\n');
    } else {
      console.log(colored(colors.fgRed, '\n❌ 配置过程中出现错误，请检查文件权限或手动更新配置文件。'));
      process.exit(1);
    }
    
  } catch (error) {
    console.error(colored(colors.fgRed, '配置过程中发生错误:'), error.message);
    process.exit(1);
  } finally {
    process.stdin.destroy();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { updateEnvFile, validateConnectionString };