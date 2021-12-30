const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const ejs = require('ejs');
const util = require('util');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const jquery = require('jquery')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const cal = require('./js/Module.js');
app.use(cookieParser());
app.use(session({
    secret: 'this is a session',
    name: 'username',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    rolling: true
}));
app.set('view engine', 'ejs');
//mongoose.connect('mongodb://172.21.2.236:27017/190110910528');


// const TUser = mongoose.model('TDepartment', schema);
// const user = new TUser({ id: '1', username: 'abc', password: '123456', sex: '男', birth: new Date('2014-03-01T08:00:00Z'), department: '信息管理与人工智能学院', grade: '2019级' }
// );
// user.save().then(() => console.log('usermeow'));
app.use('/', express.static('js'));
app.use('/', express.static('css'));
app.use('/', express.static('images'));
app.use('/', express.static('views'));
app.use('/loge.JPG', express.static('/favicon.ico'));

//数据表的映射
const tuser = require('./model/user.js');
const tcource = require('./model/cource.js');
const tdepartment = require('./model/department.js');
const tclassroom = require('./model/classroom.js');
const tregcource = require('./model/regcource.js');
const tappliclassroom = require('./model/appliclassroom.js');
const cource = require('./model/cource.js');

//插入初始数据
tuser.insertMany([
    { username: 'abc', password: '123456', sex: '男', birth: new Date('2001-03-01T08:00:00Z'), department: 'YX001', grade: '2019级' },
    { username: 'def', password: '123456', sex: '女', birth: new Date('2002-06-01T08:00:00Z'), department: 'YX001', grade: '2020级' },
    { username: 'ABC', password: '123456', sex: '男', birth: new Date('2002-05-01T08:00:00Z'), department: 'YX001', grade: '2021级' },
    { username: 'DEF', password: '123456', sex: '女', birth: new Date('2000-03-01T08:00:00Z'), department: 'YX002', grade: '2019级' },
    { username: 'WQL', password: '123456', sex: '女', birth: new Date('2001-07-01T08:00:00Z'), department: 'YX001', grade: '2019级' },
    { username: 'wql', password: '123456', sex: '男', birth: new Date('2002-03-01T08:00:00Z'), department: 'YX002', grade: '2021级' },
]);
tcource.insertMany([
    { name: '计算机网络', grade: '2019级', teacher: '李老师' },
    { name: '计算机视觉', grade: '2020级', teacher: '王老师' },
    { name: '操作系统', grade: '2021级', teacher: '季老师' },
    { name: '开源软件应用', grade: '2019级', teacher: '张老师' },
    { name: '云计算', grade: '2021级', teacher: '轩辕老师' },
    { name: '人工智能', grade: '2021级', teacher: '皇甫老师' },
    { name: 'web开发与应用', grade: '2019级', teacher: '绝老师' },
    { name: '物网络应用', grade: '2020级', teacher: '柯老师' },
    { name: 'Android开发与应用', grade: '2021级', teacher: '何老师' },
    { name: '机器学习', grade: '2019级', teacher: '久老师' },
]);
tdepartment.insertMany([
    { name: '信息管理与人工智能学院', address: '9号楼' },
    { name: '金融学院', address: '1号楼' },
    { name: '会计学院', address: '4号楼' },
    { name: '经济学院', address: '8号楼' },
    { name: '法学院', address: '10号楼' },
    { name: '外国语学院', address: '11号楼' },
    { name: '艺术学院', address: '7号楼' },
    { name: '人文与传播学院', address: '6号楼' },
    { name: '马克思主义学院', address: '2号楼' },
    { name: '创业学院', address: '3号楼' },
    { name: '国际学院', address: '13号楼' },
]);
tclassroom.insertMany([
    { address: '9101', size: '22' },
    { address: '9102', size: '12' },
    { address: '9103', size: '32' },
    { address: '9201', size: '12' },
    { address: '9202', size: '22' },
    { address: '9203', size: '5' },
    { address: '9301', size: '3' },
    { address: '9302', size: '4' },
    { address: '9303', size: '3' },
]);

app.get('/', (req, res) => {
    // console.log(req.session);
    req.session.username = '未登录';
    res.redirect('/index');
});
function isLogin(req, res, next) {
    const username = req.session.username;
    if (username != '未登录') next();
    else res.redirect('/loginorreg');
}
app.get('/index', isLogin, (req, res) => {
    // console.log(req.cookies);
    // console.log(username);
    // console.log(req.session);
    const username = req.session.username;
    res.render('index', { username });
});
app.get('/loginorreg', (req, res) => {
    // console.log(req.session);
    const username = req.session.username;
    const uid = req.session.uid;
    tdepartment.find((err, data, count) => {
        if (err) {
            console.log(err);
        }
        const departments = data;
        res.render('loginorreg', { uid, username, departments });
    });
});
//注册
app.post('/reg', function (req, res) {
    const r = req.body;
    tuser.insertMany({ username: r.name, password: r.password, sex: r.sex, birth: r.birth, department: r.department, grade: r.grade });
    var t = tuser.find((err, data) => {
        if (err) {
            console.log(err);
        }
        // console.log(data);

    });
    res.redirect('/loginorreg');
});
//登录
app.post('/login', (req, res) => {
    const r = req.body;
    const name = r.name;
    const password = r.password;
    tuser.find({ username: name, password: password }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data.length > 0) {
            // console.log(data);
            req.session.username = name;
            req.session.uid = data[0]._doc._id;
            res.redirect('/index');
            res.end();
        }
    })
})
//登出
app.get('/logout', (req, res) => {
    req.session.username = '未登录';
    req.session.uid = '';
    res.redirect('/loginorreg');
})
function isRegCource(req) {

};
app.get('/isregcource', (req, res) => {
    console.log(req.body)
    const uid = req.body.flag;
    const cid = req.body.cid;


})
app.get('/cource', (req, res) => {
    // tregcource.remove((err,data)=>{
    //     console.log('success');
    // })
    const username = req.session.username;
    const uid = req.session.uid;
    tcource.find((err, data, count) => {
        if (err) {
            console.log(err);
        }
        
        const cources = data;
        tregcource.aggregate(
            [{
                $match: {
                    uid: uid
                }
            }],
            (err, data) => {
                var flag = [];
                for (var i = 0; i < cources.length; i++) {
                    const cid = cources[i]._doc._id;
                    var f=0;
                    for (var j = 0; j < data.length; j++) {
                        if (cid == data[j].cid)
                            {
                                f=1;
                                console.log(f);
                            }
                    }
                    if(f==1) flag.push(1);
                    else flag.push(0);
                }
                // console.log(flag[0]);
                res.render('courcelist', { uid, username, cources, flag });
            }
        );
        
    });
})

app.get('/regcource', (req, res) => {
    const r = req.url;
    const flag = r.split('=')[1].split('&')[0];
    const cid = r.split('=')[2];
    const uid = req.session.uid;
    // console.log(flag);
    // console.log(cid);
    // console.log(uid);

    if (flag == "0") {
        tregcource.insertMany({ uid: uid, cid: cid }, (err, data) => {
            if (err) console.log(err);
        });
    }
    else {
    }
    res.redirect('/cource');
})
app.get('/application', (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    var cources;
    var classrooms;
    tcource.find((err, data, count) => {
        if (err) {
            console.log(err);
        }
        cources = data;
        tclassroom.find((err, data, count) => {
            if (err) {
                console.log(err);
            }
            classrooms = data;
            res.render('classroomappli', { uid, username, cources, classrooms })
        });
    });
});
app.post('/appliclassroom', (req, res) => {
    const r = req.body;
    const cid = r.cource;
    const jid = r.classroom;
    const time = r.time1 + ':' + r.time2;
    tappliclassroom.insertMany({ cid: cid, jid: jid, usetime: time }, (err, data) => {
        if (err) console.log(err);
        // console.log(data);
    });
    res.redirect('/applicationlist');
})
app.get('/applicationlist', (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    // tappliclassroom.remove((err,data)=>{
    //     console.log('success');
    // })
    tappliclassroom.aggregate(
        [{
            $lookup: {
                from: 'tcource',
                localField: 'cid',
                foreignField: '_id',
                as: 'cource'
            }
        },
        {
            $lookup: {
                from: 'tclassroom',
                localField: 'jid',
                foreignField: '_id',
                as: 'classroom'
            }
        }]
        , (err, data) => {
            const applications = data;
            console.log(applications);
            res.render('applicationlist', { uid, username, applications });
        })

})

app.listen(3004);