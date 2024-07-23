const { exec } = require('child_process');
const path = require('path');

// Defina o caminho completo para o adb
const adbPath = path.normalize('"C:/Program Files/platform-tools/adb.exe"');

function checkDeviceConnection(callback) {
  const command = `${adbPath} devices`;
  console.log(`Executing command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command '${command}': ${error.message}`);
      callback(false, `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr from command '${command}': ${stderr}`);
      callback(false, `stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    const isConnected = stdout.split('\n').some(line => line.trim().endsWith('device'));
    console.log(`checkDeviceConnection: isConnected = ${isConnected}`);
    callback(isConnected, null);
  });
}

function getAndroidProperties(callback) {
  const command = `${adbPath} shell getprop`;
  console.log(`Executing command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command '${command}': ${error.message}`);
      callback(null, false, `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr from command '${command}': ${stderr}`);
      callback(null, false, `stderr: ${stderr}`);
      return;
    }

    const propertyMap = {
      'ro.serialno': 'Serial Number',
      'ro.build.fingerprint': 'Fingerprint',
      'ro.build.id': 'Build Version',
      'ro.build.product': 'Product',
      'ro.build.type': 'Build Type',
      'ro.build.version.release': 'Android Version',
      'ro.build.version.sdk': 'SDK Version',
      'ro.carrier': 'Channel',
      'ro.boot.hardware.sku': 'SKU',
      'ro.vendor.product.name': 'Build Target',
      'ro.kernel.qemu': 'Kernel Version',  // Adicionando Kernel Version (exemplo)
      'ro.bootloader': 'MBM'  // Adicionando MBM (exemplo)
    };

    const properties = stdout.split('\n')
      .map(prop => {
        const match = prop.match(/^\[([^\]]+)\]: \[([^\]]+)\]/);
        if (match && match.length > 2) {
          const propertyName = match[1];
          const propertyValue = match[2];
          const displayName = propertyMap[propertyName];
          if (displayName) {
            return `<span class="property-name">${displayName}:</span> ${propertyValue}`;
          }
        }
        return null;
      })
      .filter(item => item !== null); // Remove qualquer item que seja null

    console.log('getAndroidProperties: properties fetched successfully');
    callback(properties.join('<br>'), true, null);
  });
}

module.exports = {
  checkDeviceConnection,
  getAndroidProperties
};
