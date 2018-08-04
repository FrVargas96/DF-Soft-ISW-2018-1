const electron = require('electron');
const url = require('url');
const path = require('path');

const rscript = require('js-call-r');
/*
var empresa1 = "FB";
var strike1 = 1;
var time1 = 1;
var riskf1 = 1;
const arg = '{\"abre\":"' + empresa1 + '",\"strike\":' + strike1 + ',\"TTM\":' + time1 + ',\"rf\":' + riskf1 + ',\"path\":"G:/Descargas/ISW/AMD.csv"}';

const result = rscript.callSync('R/csvBlack.R', arg);
console.log(result);
*/


const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Quit app when close
    mainWindow.on('closed', function () {
        app.quit();
    });


    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Catch calculate
ipcMain.on("calculate:black", function (e, empresa, strike,time, riskf) {
    const arg = '{\"abre\":"' + empresa + '",\"strike\":' + strike + ',\"TTM\":' + time + ',\"rf\":' + riskf + '}';
    const result = rscript.callSync('R/black_s.R', arg);
    var valores = [];
    for(i=result.result.length-15;i<=result.result.length;i++){
        valores.push(result.result[i]);
    }
    mainWindow.webContents.send("resultado:valor", {result: result.result[0], datos: valores});
});

ipcMain.on("calculate:CSVblack", function (e, empresa, strike,time, riskf) {
    const arg = '{\"path\":"CSVs/' + empresa + '",\"strike\":' + strike + ',\"TTM\":' + time + ',\"rf\":' + riskf + '}';
    const result = rscript.callSync('R/csvBlack.R', arg);
    var valores = [];
    for(i=result.result.length-15;i<=result.result.length;i++){
        valores.push(result.result[i]);
    }
    mainWindow.webContents.send("resultado:valor", {result: result.result[0], datos: valores});
});

ipcMain.on("calculate:monte", function (e, empresa, strike,time, riskf) {
    const arg = '{\"abre\":"' + empresa + '",\"strike\":' + strike + ',\"TTM\":' + time + ',\"rf\":' + riskf + '}';
    const result = rscript.callSync('R/montecarlo.R', arg);
    var valores = [];
    for(i=result.result.length-15;i<=result.result.length;i++){
        valores.push(result.result[i]);
    }
    mainWindow.webContents.send("resultado:valor", {result: result.result[0], datos: valores});
});

ipcMain.on("calculate:CSVblack", function (e, empresa, strike,time, riskf) {
    const arg = '{\"abre\":"' + empresa + '",\"strike\":' + strike + ',\"TTM\":' + time + ',\"rf\":' + riskf + '}';
    const result = rscript.callSync('R/csvMonte.R', arg);
    var valores = [];
    for(i=result.result.length-15;i<=result.result.length;i++){
        valores.push(result.result[i]);
    }
    mainWindow.webContents.send("resultado:valor", {result: result.result[0], datos: valores});
});




// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Commando+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// Add developer tools items if not in prod
if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'F12' : 'F12',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
};
