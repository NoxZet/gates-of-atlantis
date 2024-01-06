import fs from "fs";
import http from "http";

function errorResponse(res: http.ServerResponse, code: number = 400) {
    res.writeHead(code, {'Content-Type': 'text/html'});
    let message = 'Bad request';
    switch (code) {
        case 404: message = 'Not found'; break;
    }
    res.end(message);
}

export default function createHTTPServer() {
    return http.createServer((req, res) => {
        if (!req.url) {
            return errorResponse(res);
        }
        let questPos = req.url.indexOf('?');
        let path = req.url.substring(1, questPos === -1 ? undefined : questPos);
        let match;
        if (path === '') {
            path = 'public/index.html';
        } else if (path === 'favicon.ico') {
            path = 'public/data/favicon.ico';
        } else if (path === 'index.html' || path === 'main_client.js' || path === 'main_client.js.map') {
            path = 'public/' + path;
        }
        // Start with data and doesn't include more than one '.'
        else if (path.search(/data\//) === 0 && !((match = path.match(/\./g)) && match.length > 1)) {
            path = 'public/' + path;
        } else {
            return errorResponse(res);
        }
        if (!fs.existsSync(path)) {
            return errorResponse(res, 404);
        }
        res.writeHead(200, {'Content-Type': getMime(path)});
        let stream = fs.createReadStream(path);
        stream.on('finish', function(){
            res.end();
        });
        stream.pipe(res);
    }).listen(3000);
}

function getMime(filePath: string) {
    if (filePath.lastIndexOf('.') === -1) {
        return 'text/plain';
    }
    let ext = filePath.substring(filePath.lastIndexOf('.'));
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg': case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.ico':
            return 'image/x-icon';
        case '.svg':
            return 'image/svg+xml';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
		case '.html': case '.htm':
			return 'text/html';
        default:
            return 'text/plain';
    }
}