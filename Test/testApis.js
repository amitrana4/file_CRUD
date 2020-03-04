let chai = require('chai');
let fs = require('fs');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var path = require("path");
let server = require('../index.js');
let expect = require('expect');
//Our parent block
describe('Podcast', () => {
describe('/GET getFiles', () => {
     it('get all files', (done) => {
    chai.request(server)
         .get('/files')
         .end((err, res) => {
               (res).should.have.status(200);
               (res.body).should.be.a('object');
               done();
            });
         });
     });
    it('File uplod', () => {
        chai.request(server)
        .post('/files')
        .attach('file', fs.readFileSync(path.join(__dirname, '../') + 'testFile.jpg'), 'testFile.jpg')
        .then(function (res) {
            var privateKey = res.body.data.privateKey;
            var publicKey = res.body.data.publicKey;
            (res).should.have.status(200);
            (res.body).should.be.a('object');
            describe('/GET download and delete', () => {
            it('get file by id', () => {
                chai.request(server)
                .get('/files/'+publicKey)
                .then(function (res) {
                    (res).should.have.status(200);
                    (res.body).should.be.instanceof(Buffer);
                  })
            }),
            it('delete file by id', () => {
                chai.request(server)
                .delete('/files/'+privateKey)
                .then(function (res) {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                  })
            })
            it('delete file by id', () => {
              chai.request(server)
              .delete('/files/'+123123)
              .then(function (res) {
                (res.body).should.have.status(400);
                })
          })
            it('get file by id', () => {
              chai.request(server)
              .delete('/files/'+123123)
              .then(function (res) {
                (res.body).should.have.status(400);
                })
          })
          })
          })
    },
    );

});