const fs = require('fs');
const rimraf = require('rimraf');

let _appFolder = null;

function getFolderPath() {
    if (_appFolder == null) {
        _appFolder = "./Databases/";

        if (!doesFolderExist(_appFolder)) {
            fs.mkdirSync(_appFolder);
            fs.chmodSync(_appFolder, '777');
            // fs.writeFile(path, data, { enconding: 'utf-8', flag: 'a' }, function(err) {})
        }
    }
    return _appFolder;
};

function deleteFolder(path) {
    rimraf(path, function() {});
};

function doesFolderExist(path) {
    return fs.existsSync(path);
};

function createFile(path) {
    if (!doesFolderExist(path)) {
        fs.writeFile(path, '{}', { enconding: 'utf-8', flag: 'w' }, function(err) {});
    }
};

function getAllFiles(callback) {
    let folder = getFolderPath();
    fs.readdir(folder, (err, files) => {
        callback(err != null ? null : files);
    });
};

function SaveFile(fileName, data) {
    let folder = getFolderPath();
    let path = folder + fileName;
    console.log("SaveFile(): Salvando arquivo " + path);
    createFile(path);
    fs.writeFile(path, data, function(err) {})
}

function ReadFile(fileName, callback) {
    let folder = getFolderPath();
    let path = folder + fileName;
    createFile(path);
    console.log("ReadFile(): Lendo arquivo " + path);
    fs.readFile(path, 'utf8', function(err, data) {
        callback(err != null ? null : data);
    });
}

function saveWindowPosition(mainWindow, callback) {
    let FileOptions = "options.json";
    ReadFile(FileOptions, data => {
        console.log("saveWindowPosition(): Lendo arquivo " + FileOptions);
        let options = JSON.parse(data);
        console.log("saveWindowPosition(): Pegando as posicoes...");
        let position = mainWindow.getPosition();
        let size = mainWindow.getSize();

        console.log("saveWindowPosition(): Add as posicoes...");
        options.lastSessionInfo = {
            position: { x: position[0], y: position[1] },
            size: { width: size[0], height: size[1] }
        };

        SaveFile(FileOptions, JSON.stringify(options));
        setTimeout(function() {
            callback();
        }, 300);
    });
};

function deleteFile(fileName) {
    let folder = getFolderPath();
    let path = folder + fileName;

    fs.unlink(path, err => {
        if (err != null) console.log(err);
        console.log(`deleteFile(): Deleted file: ${fileName} (Cloud: ${ cloudDeleted })`);
    });
};

function dataDefine(FileOptions, param, val) {
    try {
        ReadFile(FileOptions, data => {
            console.log("dataDefine(): Lendo arquivo " + FileOptions);
            let options = JSON.parse(data);
            if (param.includes('.')) {
                param = param.split('.');
                options[param[0]][param[1]] = val;
            } else {
                options[param] = val;
            }
            SaveFile(FileOptions, JSON.stringify(options));
        });
    } catch (err) {
        console.log('ERROR JSON');
        console.log(err.stack);
    }
}

function dataIncrement(FileOptions, param, val) {
    try {
        ReadFile(FileOptions, data => {
            console.log("dataIncrement(): Lendo arquivo " + FileOptions);
            let options = JSON.parse(data);
            if (param.includes('.')) {
                param = param.split('.');
                if (!options[param[0]][param[1]]) {
                    options[param[0]][param[1]] = 0;
                }
                options[param[0]][param[1]] += val;
            } else {
                if (!options[param]) {
                    options[param] = 0;
                }
                options[param] += val;
            }
            SaveFile(FileOptions, JSON.stringify(options));
        });
    } catch (err) {
        console.log('ERROR JSON');
        console.log(err.stack);
    }
}

function dataRemove(FileOptions, param, val) {
    try {
        ReadFile(FileOptions, data => {
            console.log("dataRemove(): Lendo arquivo " + FileOptions);
            let options = JSON.parse(data);
            if (param.includes('.')) {
                param = param.split('.')
                options[param[0]][param[1]].removeire(val)
            } else {
                options[param].removeire(val)
            }
            SaveFile(FileOptions, JSON.stringify(options));
        });
    } catch (err) {
        console.log('ERROR JSON');
        console.log(err.stack);
    }
}

function dataAdd(FileOptions, param, val) {
    try {
        ReadFile(FileOptions, data => {
            console.log("dataAdd(): Lendo arquivo " + FileOptions);
            let options = JSON.parse(data);
            if (param.includes('.')) {
                param = param.split('.');
                if (!options[param[0]][param[1]]) {
                    options[param[0]][param[1]] = [];
                }
                options[param[0]][param[1]].push(val);
            } else {
                if (!options[param]) {
                    options[param] = [];
                }
                options[param].push(val);
            }
            SaveFile(FileOptions, JSON.stringify(options));
        });
    } catch (err) {
        console.log('ERROR JSON');
        console.log(err.stack);
    }
}

module.exports = {
    SaveFile: SaveFile,
    ReadFile: ReadFile,
    deleteFile: deleteFile,
    saveWindowPosition: saveWindowPosition,
    getAllFiles: getAllFiles,
    doesFolderExist: doesFolderExist,
    deleteFolder: deleteFolder,
    getFolderPath: getFolderPath,
    dataDefine: dataDefine,
    dataIncrement: dataIncrement,
    dataRemove: dataRemove,
    dataAdd: dataAdd
}