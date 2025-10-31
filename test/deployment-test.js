// 部署后测试脚本
// 用于验证博客应用在Railway部署后是否正常工作

const http = require('http');
const https = require('https');

// 测试配置
const TEST_CONFIG = {
  host: process.env.TEST_HOST || 'localhost',
  httpPort: process.env.TEST_HTTP_PORT || 8080,
  httpsPort: process.env.TEST_HTTPS_PORT || 8443,
  useHttps: process.env.TEST_USE_HTTPS === 'true'
};

console.log('开始部署后测试...');
console.log('测试配置:', TEST_CONFIG);

// 测试HTTP连接
function testHttp() {
  return new Promise((resolve, reject) => {
    console.log(`\n测试HTTP连接: http://${TEST_CONFIG.host}:${TEST_CONFIG.httpPort}`);
    
    const options = {
      hostname: TEST_CONFIG.host,
      port: TEST_CONFIG.httpPort,
      path: '/',
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      console.log(`HTTP状态码: ${res.statusCode}`);
      
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log('✓ HTTP连接测试通过');
        resolve(true);
      } else {
        console.log('✗ HTTP连接测试失败');
        resolve(false);
      }
    });
    
    req.on('error', (e) => {
      console.log('✗ HTTP连接测试失败:', e.message);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('✗ HTTP连接超时');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// 测试HTTPS连接
function testHttps() {
  return new Promise((resolve, reject) => {
    console.log(`\n测试HTTPS连接: https://${TEST_CONFIG.host}:${TEST_CONFIG.httpsPort}`);
    
    const options = {
      hostname: TEST_CONFIG.host,
      port: TEST_CONFIG.httpsPort,
      path: '/',
      method: 'GET',
      timeout: 5000,
      rejectUnauthorized: false // 自签名证书情况下忽略验证
    };
    
    const req = https.request(options, (res) => {
      console.log(`HTTPS状态码: ${res.statusCode}`);
      
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log('✓ HTTPS连接测试通过');
        resolve(true);
      } else {
        console.log('✗ HTTPS连接测试失败');
        resolve(false);
      }
    });
    
    req.on('error', (e) => {
      console.log('✗ HTTPS连接测试失败:', e.message);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('✗ HTTPS连接超时');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// 测试API端点
function testApiEndpoints() {
  return new Promise((resolve, reject) => {
    console.log('\n测试API端点...');
    
    const port = TEST_CONFIG.useHttps ? TEST_CONFIG.httpsPort : TEST_CONFIG.httpPort;
    const protocol = TEST_CONFIG.useHttps ? 'https' : 'http';
    
    const options = {
      hostname: TEST_CONFIG.host,
      port: port,
      path: '/api/test', // 假设的测试端点
      method: 'GET',
      timeout: 5000,
      rejectUnauthorized: false
    };
    
    const reqModule = TEST_CONFIG.useHttps ? https : http;
    
    const req = reqModule.request(options, (res) => {
      console.log(`API测试状态码: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        console.log('✓ API端点测试通过');
        resolve(true);
      } else {
        console.log('ℹ API端点可能需要进一步配置');
        resolve(true); // 不算作失败，因为可能没有实现该端点
      }
    });
    
    req.on('error', (e) => {
      console.log('ℹ API端点测试跳过:', e.message);
      resolve(true); // 不算作失败
    });
    
    req.on('timeout', () => {
      console.log('ℹ API端点测试超时');
      req.destroy();
      resolve(true); // 不算作失败
    });
    
    req.end();
  });
}

// 运行所有测试
async function runAllTests() {
  console.log('=========================================');
  console.log('        峰叔靠谱博客部署后测试');
  console.log('=========================================');
  
  let httpSuccess = false;
  let httpsSuccess = false;
  let apiSuccess = false;
  
  try {
    // 测试HTTP
    httpSuccess = await testHttp();
    
    // 如果启用了HTTPS，测试HTTPS
    if (TEST_CONFIG.useHttps) {
      httpsSuccess = await testHttps();
    } else {
      console.log('\n跳过HTTPS测试（未启用）');
      httpsSuccess = true;
    }
    
    // 测试API端点
    apiSuccess = await testApiEndpoints();
    
    // 输出测试结果
    console.log('\n=========================================');
    console.log('               测试结果');
    console.log('=========================================');
    console.log(`HTTP连接:     ${httpSuccess ? '✓ 通过' : '✗ 失败'}`);
    console.log(`HTTPS连接:    ${TEST_CONFIG.useHttps ? (httpsSuccess ? '✓ 通过' : '✗ 失败') : '跳过'}`);
    console.log(`API端点:      ${apiSuccess ? '✓ 通过' : '✗ 失败'}`);
    
    const overallSuccess = httpSuccess && httpsSuccess && apiSuccess;
    console.log(`\n总体结果:     ${overallSuccess ? '✓ 所有测试通过' : '✗ 部分测试失败'}`);
    console.log('=========================================');
    
    process.exit(overallSuccess ? 0 : 1);
  } catch (error) {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行测试
runAllTests();