const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 创建certs目录
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// 尝试使用OpenSSL生成证书
try {
  execSync('openssl version', { stdio: 'ignore' });
  console.log('OpenSSL已安装，正在生成证书...');
  
  // 生成私钥
  execSync(
    `openssl genrsa -out ${path.join(certsDir, 'server.key')} 2048`,
    { stdio: 'inherit' }
  );
  
  // 生成证书签名请求
  execSync(
    `openssl req -new -key ${path.join(certsDir, 'server.key')} -out ${path.join(certsDir, 'server.csr')} -subj "/CN=localhost"`,
    { stdio: 'inherit' }
  );
  
  // 生成自签名证书
  execSync(
    `openssl x509 -req -in ${path.join(certsDir, 'server.csr')} -signkey ${path.join(certsDir, 'server.key')} -out ${path.join(certsDir, 'server.crt')} -days 365`,
    { stdio: 'inherit' }
  );
  
  // 删除证书签名请求文件
  fs.unlinkSync(path.join(certsDir, 'server.csr'));
  
  console.log('SSL证书生成成功！');
  console.log('证书位置:', path.join(certsDir, 'server.crt'));
  console.log('私钥位置:', path.join(certsDir, 'server.key'));
} catch (error) {
  console.log('未找到OpenSSL或生成证书失败，将使用Node.js生成自签名证书');
  generateSelfSignedCert();
}

function generateSelfSignedCert() {
  // 使用Node.js的crypto模块生成自签名证书
  try {
    const crypto = require('crypto');
    const forge = require('node-forge');
    
    // 生成密钥对
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    
    // 设置证书属性
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    
    // 设置主题
    const attrs = [{
      name: 'commonName',
      value: 'localhost'
    }, {
      name: 'countryName',
      value: 'CN'
    }, {
      shortName: 'ST',
      value: 'Beijing'
    }, {
      name: 'localityName',
      value: 'Beijing'
    }, {
      name: 'organizationName',
      value: 'FengShu Blog'
    }, {
      shortName: 'OU',
      value: 'Blog'
    }];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    
    // 设置扩展
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true
    }, {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    }]);
    
    // 自签名
    cert.sign(keys.privateKey);
    
    // 保存证书和私钥
    const certPem = forge.pki.certificateToPem(cert);
    const keyPem = forge.pki.privateKeyToPem(keys.privateKey);
    
    fs.writeFileSync(path.join(certsDir, 'server.crt'), certPem);
    fs.writeFileSync(path.join(certsDir, 'server.key'), keyPem);
    
    console.log('使用Node.js生成的自签名证书完成！');
    console.log('证书位置:', path.join(certsDir, 'server.crt'));
    console.log('私钥位置:', path.join(certsDir, 'server.key'));
  } catch (err) {
    console.error('生成证书失败:', err.message);
    console.log('请手动安装OpenSSL并重新运行此脚本');
  }
}