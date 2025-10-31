#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== 峰叔靠谱博客启动助手 ===\n');

// 检查环境配置
function checkEnvConfig() {
  const envPath = path.join(__dirname, '.env');
  const envProdPath = path.join(__dirname, '.env.production');
  
  if (!fs.existsSync(envPath) && !fs.existsSync(envProdPath)) {
    console.log('❌ 未找到环境配置文件');
    return false;
  }
  
  // 检查是否已配置MongoDB连接字符串
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('请在这里粘贴您的MongoDB Atlas连接字符串')) {
    console.log('⚠️  MongoDB连接字符串尚未配置');
    console.log('请运行以下命令配置MongoDB:');
    console.log('  npm run setup:mongodb\n');
    return false;
  }
  
  return true;
}

// 显示启动选项
function showStartOptions() {
  console.log('请选择启动模式:');
  console.log('1. 开发模式 (npm run dev)');
  console.log('2. 生产模式 (npm run start:prod)');
  console.log('3. HTTPS模式 (npm run start:https)');
  console.log('4. 自定义域名模式 (npm run start:domain)');
  console.log('5. 配置MongoDB (npm run setup:mongodb)');
  console.log('6. 测试MongoDB连接 (npm run test:mongodb)');
  console.log('0. 退出\n');
}

// 执行命令
function executeCommand(command) {
  console.log(`正在执行: ${command}\n`);
  
  const child = exec(command, { cwd: __dirname });
  
  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  
  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  
  child.on('close', (code) => {
    console.log(`\n命令执行完成，退出码: ${code}`);
  });
}

// 主程序
function main() {
  // 检查Node.js版本
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
  
  if (majorVersion < 14) {
    console.log('⚠️  建议使用Node.js 14或更高版本');
    console.log(`当前版本: ${nodeVersion}\n`);
  }
  
  // 检查环境配置
  if (!checkEnvConfig()) {
    console.log('请先配置MongoDB连接字符串再启动应用。\n');
    return;
  }
  
  // 显示启动选项
  showStartOptions();
  
  // 简单的交互式选择（实际应用中可以使用readline模块实现完整交互）
  console.log('提示: 使用以下命令启动应用:');
  console.log('- npm run dev (开发模式)');
  console.log('- npm run start:prod (生产模式)');
  console.log('- npm run start:https (HTTPS模式)');
  console.log('- npm run start:domain (自定义域名模式)\n');
}

main();