const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, `./dist/光之羁绊.exe`);
const originPath = path.resolve(__dirname, `./dist/server.exe`);

// 删除旧文件
try {
  fs.accessSync(filePath, fs.constants.F_OK);
  fs.unlinkSync(filePath);
} catch (e) {
  console.log('no-delete');
}

// 重命名新文件
try {
  fs.accessSync(originPath, fs.constants.F_OK);
  fs.renameSync(originPath, filePath);
} catch (e) {
  console.log('no-rename');
}

console.log('✌✌✌');
