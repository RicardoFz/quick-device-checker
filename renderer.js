const { exec } = require('child_process');
const path = require('path');
const { checkDeviceConnection } = require('./adb');

// Defina o caminho completo para o adb
const adbPath = path.normalize('C:/Program Files/platform-tools/adb.exe');

function updateStatusIndicator(isConnected, errorMessage) {
  const statusText = document.getElementById('status-text');
  
  const iconHtml = isConnected 
    ? '<i class="fas fa-check-circle pulse" style="color: green; margin-right: 10px;"></i>Connected' 
    : '<i class="fas fa-times-circle pulse" style="color: red; margin-right: 10px;"></i>Not Connected';
    
  statusText.innerHTML = isConnected ? iconHtml : `${iconHtml}: ${errorMessage}`;
  console.log(`updateStatusIndicator: isConnected = ${isConnected}`);
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.getElementById('refreshButton');
  const flashButton = document.getElementById('flashButton');
  const applyFlagsButton = document.getElementById('applyFlagsButton');

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      console.log('Refresh button clicked');
      checkDeviceConnection((isConnected, errorMessage) => {
        console.log(`checkDeviceConnection callback: isConnected = ${isConnected}`);
        updateStatusIndicator(isConnected, errorMessage);
        if (isConnected) {
          getAndroidProperties((properties, success, errorMessage) => {
            if (success) {
              document.getElementById('deviceInfo').innerHTML = properties;
              console.log('Device properties updated successfully');
            } else {
              console.log('Failed to fetch device properties');
              document.getElementById('deviceInfo').innerHTML = `Failed to fetch device properties: ${errorMessage}`;
            }
          });
        } else {
          console.log('Device not connected');
          document.getElementById('deviceInfo').innerHTML = `Device not connected: ${errorMessage}`;
        }
      });
    });
  }

  if (flashButton) {
    flashButton.addEventListener('click', () => {
      const buildFile = document.getElementById('buildFile').files[0];
      if (buildFile) {
        const filePath = buildFile.path;
        const command = `"${adbPath}" sideload "${filePath}"`;
        console.log(`Executing command: ${command}`);
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command '${command}': ${error.message}`);
            alert(`Failed to flash build: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr from command '${command}': ${stderr}`);
            alert(`Failed to flash build: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          alert('Build flashed successfully');
        });
      } else {
        alert('No build file selected');
      }
    });
  }

  if (applyFlagsButton) {
    applyFlagsButton.addEventListener('click', () => {
      const flag1 = document.getElementById('flag1').checked;
      const flag2 = document.getElementById('flag2').checked;
      const commands = [];

      if (flag1) {
        commands.push('setprop persist.sys.flag1 1');
      } else {
        commands.push('setprop persist.sys.flag1 0');
      }

      if (flag2) {
        commands.push('setprop persist.sys.flag2 1');
      } else {
        commands.push('setprop persist.sys.flag2 0');
      }

      commands.forEach(command => {
        exec(`"${adbPath}" shell ${command}`, (error, stdout, stderr) => {
          if (error || stderr) {
            console.error(`Failed to set flag '${command}': ${error ? error.message : stderr}`);
            alert(`Failed to apply flags: ${error ? error.message : stderr}`);
            return;
          }
          console.log(`Successfully executed: ${command}`);
        });
      });

      alert('Flags applied successfully');
    });
  }

  setInterval(() => {
    checkDeviceConnection((isConnected, errorMessage) => {
      updateStatusIndicator(isConnected, errorMessage);
    });
  }, 5000);

  const navLinks = document.querySelectorAll('.sidebar nav a');
  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        document.querySelectorAll('.section').forEach(section => {
          section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');
      });
    });
  }

  const defaultSection = document.getElementById('device-info');
  if (defaultSection) {
    defaultSection.classList.add('active');
  }
});

const propertyMap = {
  'ro.serialno': { name: 'Serial Number', icon: 'fas fa-barcode' },
  'ro.build.fingerprint': { name: 'Fingerprint', icon: 'fas fa-fingerprint' },
  'ro.build.id': { name: 'Build Version', icon: 'fas fa-info-circle' },
  'ro.build.product': { name: 'Product', icon: 'fas fa-mobile-alt' },
  'ro.build.type': { name: 'Build Type', icon: 'fas fa-cogs' },
  'ro.build.version.release': { name: 'Android Version', icon: 'fab fa-android' },
  'ro.build.version.sdk': { name: 'SDK Version', icon: 'fas fa-code' },
  'ro.carrier': { name: 'Channel', icon: 'fas fa-signal' },
  'ro.boot.hardware.sku': { name: 'SKU', icon: 'fas fa-tag' },
  'ro.vendor.product.name': { name: 'Build Target', icon: 'fas fa-bullseye' },
  'ro.kernel.qemu': { name: 'Kernel Version', icon: 'fas fa-memory' },
  'ro.bootloader': { name: 'MBM', icon: 'fas fa-hdd' }
};

function getAndroidProperties(callback) {
  const command = `"${adbPath}" shell getprop`;
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

    const properties = stdout.split('\n')
      .map(prop => {
        const match = prop.match(/^\[([^\]]+)\]: \[([^\]]+)\]/);
        if (match && match.length > 2) {
          const propertyName = match[1];
          const propertyValue = match[2];
          const displayName = propertyMap[propertyName]?.name;
          const iconClass = propertyMap[propertyName]?.icon;
          if (displayName) {
            return `<div class="property">
                      <i class="property-icon ${iconClass}"></i>
                      <span class="property-name">${displayName}:</span>
                      <span class="property-value">${propertyValue}</span>
                    </div>`;
          }
        }
        return null;
      })
      .filter(item => item !== null);

    callback(properties.join('<br>'), true);
  });
}
