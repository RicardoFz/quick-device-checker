const { exec } = require('child_process');

function updateStatusIndicator(isConnected) {
    const statusElement = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    statusElement.style.backgroundColor = isConnected ? 'green' : 'red';
    statusText.textContent = isConnected ? 'Connected' : 'Not Connected';
}

function checkDeviceConnection() {
    exec('adb devices', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            updateStatusIndicator(false);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            updateStatusIndicator(false);
            return;
        }

        const isConnected = stdout.split('\n').some(line => line.trim().endsWith('device'));
        updateStatusIndicator(isConnected);
    });
}

function getAndroidProperties() {
    exec('adb shell getprop', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            updateStatusIndicator(false);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            updateStatusIndicator(false);
            return;
        }

        const propertyMap = {
            'ro.build.fingerprint': 'Fingerprint',
            'ro.build.id': 'Build Version',
            'ro.build.product': 'Product',
            'ro.build.type': 'Build Type',
            'ro.build.version.release': 'Android Version',
            'ro.build.version.sdk': 'SDK Version',
            'ro.carrier': 'Channel',
            'ro.boot.hardware.sku': 'SKU',
            'ro.vendor.product.name': 'Build Target'
        };

        const properties = stdout.split('\n')
          .filter(line => line.match(/^\[ro\.(build\.(fingerprint|id|product|type|version\.release|version\.sdk)|carrier|boot\.hardware\.sku|vendor\.product.name)\]: \[(.*)\]/))
          .map(prop => {
            const match = prop.match(/^\[([^\]]+)\]: \[([^\]]+)\]/);
            const propertyName = match[1];
            const propertyValue = match[2];
            const displayName = propertyMap[propertyName] || propertyName;
            return `<span class="property-name">${displayName}:</span> ${propertyValue}`;
        });

        // Exibir as propriedades na página
        document.getElementById('deviceInfo').innerHTML = properties.join('<br>');
        updateStatusIndicator(true);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', () => {
        checkDeviceConnection();
        getAndroidProperties();
    });

    setInterval(checkDeviceConnection, 5000); // Verifica a conexão a cada 5 segundos
});
