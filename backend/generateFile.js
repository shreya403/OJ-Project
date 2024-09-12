const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const direCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(direCodes)) {
    fs.mkdirSync(direCodes, { recursive: true });
}

const generateFile = (language, code, packageName = '') => {
    const jobId = uuid();
    let extension;
    if (language === 'cpp') {
        extension = 'cpp';
    } else if (language === 'py') {
        extension = 'py';
    } else if (language === 'java') {
        extension = 'java';
    } else if (language === 'c') {
        extension = 'c';
    } else {
        throw new Error("Unsupported language");
    }
    const filename = `${jobId}.${extension}`;
    const filePath = path.join(direCodes, filename);

    let content = code;
    if (language === 'java' && packageName) {
        content = `package ${packageName};\n` + code;
    }

    fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateFile
};
