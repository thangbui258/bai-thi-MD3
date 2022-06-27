const mysql = require('mysql');
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs');

// b1: Ket noi den database
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '25081996',
    database: 'City'
});

function getDBthanhPho() {
    return new Promise((resolve, reject) => {
        let sql = `select * from ThanhPho;`
        conn.query(sql, (err, result) => {
            if (err) {
                reject(err.message)
            }
            resolve(result)
        })
    })
}

function getDBchiTietThanhPho(id) {
    return new Promise((resolve, reject) => {
        let sql = `select * from ThanhPho where ID_ThanhPho = '${id}';`
        conn.query(sql, (err, result) => {
            if (err) {
                reject(err.message)
            }
            resolve(result)
        })
    })
}

function deleteDBthanhPho(id) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM ThanhPho WHERE ID_ThanhPho = '${id}';`
        conn.query(sql, (err, result) => {
            if (err) {
                reject(err.message)
            }
            resolve()
        })
    })
}

function getFormUpdate(id) {
    getDBchiTietThanhPho(id).then(result => {
        fs.readFile('./views/edit.html','utf-8',(err,data)=>{
            res.writeHead(200, {ContentType: 'text/html'})
            data = data.replace('{ten}', result[0].tenThanhPho);
            data = data.replace('{quocgia}', result[0].quocGia);
            data = data.replace('{dientich}', result[0].dienTich);
            data = data.replace('{danso}', result[0].danSo);
            data = data.replace('{gdp}', result[0].GDP);
            data = data.replace('{gioithieu}', result[0].gioiThieu);
            res.write(data)
            res.end();
        })
    })
}

function showDanhSachThanhPho(req, res) {
    getDBthanhPho().then(result => {
        console.log(result)
        fs.readFile('./views/listCity.html', 'utf-8', (err, data) => {
            if (err) {
                throw new Error(err.message);
            } else {
                let table = '';
                for (let i = 0; i < result.length; i++) {
                    table += `<tr>`
                    table += `<td>${result[i].ID_ThanhPho}</td>>`
                    table += `<td>${result[i].tenThanhPho}</td>>`
                    table += `<td>${result[i].quocGia}</td>>`
                    table += `<td>${result[i].quocGia}</td>>`
                    table += `<td><a href="/chitiet?id=${result[i].ID_ThanhPho}">Chi Tiet</a></td>>`
                    table += `<td><a href="/delete?id=${result[i].ID_ThanhPho}">Xoa</a></td>>`
                    table += `<td><a href="/update?id=${result[i].ID_ThanhPho}">Chinh Sua</a></td>>`
                    table += `</tr>`
                }
                res.writeHead(200, {ContentType: 'text/html'})
                data = data.replace('{list-table}', table);
                res.write(data)
                res.end();
            }

        })
    })

}

function showChiTietThanhPho(req, res, id) {
    getDBchiTietThanhPho(id).then(result => {
        fs.readFile('./views/thongtinchitiet.html', 'utf-8', (err, data) => {
            res.writeHead(200, {ContentType: 'text/html'})
            data = data.replace('{ten}', result[0].tenThanhPho);
            data = data.replace('{quoc-gia}', result[0].quocGia);
            data = data.replace('{dien-tich}', result[0].dienTich);
            data = data.replace('{dan-so}', result[0].danSo);
            data = data.replace('{gdp}', result[0].GDP);
            data = data.replace('{gioi-thieu}', result[0].gioiThieu);
            res.write(data)
            res.end();
        })
    })
}

function deleteThanhPho(req, res, id) {
    deleteDBthanhPho(id).then(() => {
        res.writeHead(301, {Location: 'http://localhost:8080/danhsachthanhpho'})
        res.end();
    })
}

function updateThanhPho(req, res,id) {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end',()=>{
        let Data = qs.parse(data);
        let sql = `call update_ThanhPho('${Data.ten}','${Data.quocgia}',${Data.dientich},${Data.danso},${Data.gdp},'${Data.gioithieu}')`;
        /////ko kip thoi gian lam tiep

    })

}

let server = http.createServer((req, res) => {
    let urlPath = url.parse(req.url).pathname;
    switch (urlPath) {
        case '/danhsachthanhpho':
            showDanhSachThanhPho(req, res)
            break;
        case '/chitiet':
            let idchitiet = url.parse(req.url, true).query.id;
            showChiTietThanhPho(req, res, idchitiet);
            break;
        case '/delete':
            let idDelete = url.parse(req.url, true).query.id;
            deleteThanhPho(req, res, idDelete)
            break;
        case '/update':
            let idUpdate = url.parse(req.url, true).query.id;
            if(req.method==='GET'){
                getFormUpdate(idUpdate)
            } else {
                   updateThanhPho()
            }

    }
});
server.listen(8080);

