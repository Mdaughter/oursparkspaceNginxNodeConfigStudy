global.config = {
    mongoURL: "mongodb://127.0.0.1:27017/cloudtest"
}
var main = require('../main')
var supertest = require('supertest');
// 看下面这句，这是关键一句。得到的 request 对象可以直接按照
// superagent 的 API 进行调用
var request = supertest(main);
var assert = require('assert');
// var should = require('should');

describe('test/main.test.js', function () {
    // 我们的第一个测试用例，好好理解一下
    it('should can inset a msg', function (done) {
        let mongoose = require('mongoose');
        // mongoose.connect(global.config.mongoURL)
        mongoose.connection.dropDatabase()
            .then(()=>{
                request.post('/addMsg')
                    .send({ msg: "2333" })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) throw err;
                        assert(res.body.msg == "添加成功")
                        done();
                    })
            })
    });
    it('should get the msg back', function (done) {
        request.get('/theLastOne')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert(res.body.msg == "2333");
                done()
            })
    });
    it('should get the more msg sort', function (done) {
        new Promise((rec, rej) => {
            request.post('/addMsg')
                .send({ msg: "114514" })
                .expect(200)
                .end(function (err, res) {
                    if (err) rej(err);
                    assert(res.body.msg == "添加成功");
                    rec();
                })
        }).then(() => {
            request.get('/sortByMsg')
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    assert(res.body.msg[0].msg == "114514");
                    assert(res.body.msg[1].msg == "2333");
                    done()
                })
        })
    });
});