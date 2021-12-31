const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const moment = require('moment');
const session = require('express-session');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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

//插入初始数据
tuser.find((err, data) => {
    if (data.length == 0) {
        tuser.insertMany([
            { username: 'abc', password: '123456', sex: '男', birth: moment().format('2001-03-01'), department: '信息管理与人工智能学院', grade: '2019级' ,admin:'0'},
            { username: 'def', password: '123456', sex: '女', birth: moment().format('2002-06-01'), department: '信息管理与人工智能学院', grade: '2020级' ,admin:'0'},
            { username: 'ABC', password: '123456', sex: '男', birth: moment().format('2002-05-01'), department: '信息管理与人工智能学院', grade: '2021级' ,admin:'0'},
            { username: 'DEF', password: '123456', sex: '女', birth: moment().format('2000-03-01'), department: '信息管理与人工智能学院', grade: '2019级' ,admin:'0'},
            { username: 'WQL', password: '123456', sex: '女', birth: moment().format('2001-07-01'), department: '信息管理与人工智能学院', grade: '2019级' ,admin:'0'},
            { username: 'admin', password: '123456', sex: '男', birth: moment().format('2001-03-03'), department: '信息管理与人工智能学院', grade: '2021级' ,admin:'1'},
        ]);
    }
})
tcource.find((err, data) => {
    if (data.length == 0) {
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
    }
})
tdepartment.find((err, data) => {
    if (data.length == 0) {
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
    }
})
tclassroom.find((err, data) => {
    if (data.length == 0) {
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
    }
})

app.get('/', (req, res) => {
    req.session.username = '未登录';
    var mycource = [{ cource: [{ name: '未登录' }] }];
    req.session.mycource = mycource;
    req.session.modalid = '';
    req.session.modalcontent = '';
    req.session.errmsg='';
    res.redirect('/index');
});
//判断是否登录
function isLogin(req, res, next) {
    const username = req.session.username;
    req.session.errmsg='';
    if (username != '未登录') next();
    else {
        req.session.modalid = "data-target=\#myModal\ data-toggle=\modal";
        req.session.modalcontent = '未登录，请先进行登录！！！';
        res.redirect('/loginorreg');
    }
}
//首页
app.get('/index', isLogin, (req, res) => {
    const username = req.session.username;
    const mycource = req.session.mycource;
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
    res.render('index', { username, mycource, modalid, modalcontent });
});
//登录注册页面
app.get('/loginorreg', (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    const mycource = req.session.mycource;
    const modalid = req.session.modalid;
    const modalidlogin = req.session.modalidlogin;
    const modalcontent = req.session.modalcontent;
    const errmsg= req.session.errmsg;
    tdepartment.find((err, data, count) => {
        if (err) {
            console.log(err);
        }
        const departments = data;
        res.render('loginorreg', { username, departments, mycource, modalid, modalcontent,modalidlogin,errmsg});
    });
});
//注册
app.post('/reg', function (req, res) {
    const r = req.body;
    tuser.insertMany({ username: r.name, password: r.password, sex: r.sex, birth: moment().format(r.birth), department: r.department, grade: r.grade });
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
    tuser.find({ username: name }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data.length>0) {
            // console.log(data);
            if (data[0]._doc.password == password) {
                req.session.username = name;
                req.session.uid = data[0]._doc._id;
                req.session.admin=data[0]._doc.admin;
                req.session.modalid = '';
                req.session.modalcontent = '';
                res.redirect('/right');
                res.end();
            }
            else{
                console.log("123");
                req.session.errmsg='密码错误！！！';
                res.redirect('/loginorreg');
            }
        }
        else {
            req.session.errmsg='用户不存在，请注册！！！';
            res.redirect('/loginorreg');
        }
    })
})
//右边栏目
app.get('/right', (req, res) => {
    const username = req.session.username;
    const uid = mongoose.Types.ObjectId(req.session.uid);
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
    tregcource.aggregate(
        [{
            $match: {
                uid: uid
            }
        },
        {
            $lookup: {
                from: 'tcource',
                localField: 'cid',
                foreignField: '_id',
                as: 'cource'
            }
        }],
        (err, data) => {
            const mycource = data;
            req.session.mycource = mycource;
            res.render('index', { username, mycource, modalid, modalcontent });
        }
    );
})
//登出
app.get('/logout', isLogin, (req, res) => {
    req.session.username = '未登录';
    req.session.uid = '';
    var mycource = [{ cource: [{ name: '未登录' }] }];
    req.session.mycource = mycource;
    res.redirect('/loginorreg');
})
//课程列表页面
app.get('/cource', isLogin, (req, res) => {
    const username = req.session.username;
    const uid = mongoose.Types.ObjectId(req.session.uid);
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
    tcource.find((err, data, count) => {
        if (err) console.log(err);
        const cources = data;
        tregcource.aggregate(
            [{
                $match: {
                    uid: uid
                }
            },
            {
                $lookup: {
                    from: 'tcource',
                    localField: 'cid',
                    foreignField: '_id',
                    as: 'cource'
                }
            }],
            (err, data) => {
                var flag = [];
                const mycource = data;
                req.session.mycource = mycource;
                for (var i = 0; i < cources.length; i++) {
                    const cid = cources[i]._doc._id;
                    var f = 0;
                    for (var j = 0; j < mycource.length; j++) {
                        if (cid.toString() == mycource[j].cid.toString()) {
                            f = 1;
                        }
                    }
                    if (f == 1) flag.push(1);
                    else flag.push(0);
                }
                res.render('courcelist', { username, cources, flag, mycource, modalid, modalcontent });
            }
        );

    });
})
//我的课表页面
app.get('/mycource', isLogin, (req, res) => {
    const username = req.session.username;
    const uid = mongoose.Types.ObjectId(req.session.uid);
    const mycource = req.session.mycource;
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
    tregcource.aggregate(
        [{
            $match: {
                uid: uid
            }
        },
        {
            $lookup: {
                from: 'tcource',
                localField: 'cid',
                foreignField: '_id',
                as: 'cource'
            }
        }],
        (err, data) => {
            console.log(data);
            const cources = data;
            res.render('mycource', { username, cources, mycource, modalid, modalcontent });
        }
    );
})
//报名课程
app.get('/regcource', (req, res) => {
    const r = req.url;
    const flag = r.split('=')[1].split('&')[0];
    const cid = r.split('=')[2];
    const uid = req.session.uid;
    // console.log(flag);
    if (flag == "0") {
        tregcource.insertMany({ uid: uid, cid: cid }, (err, data) => {
            if (err) console.log(err);
        });
    }
    else {
        tregcource.deleteMany({ uid: uid, cid: cid }, (err, data) => {
            if (err) console.log(err);
        })
    }
    res.redirect('/cource');
})
function isAdmin(req, res, next) {
    const admin = req.session.admin;
    if (admin=='1') next();
    else {
        req.session.errmsg= '没有权限进行此操作，请登录管理员账户！！！';
        res.redirect('/loginorreg');
    }
}
//课程教室申请页面
app.get('/application',isAdmin, (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    const mycource = req.session.mycource;
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
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
            res.render('classroomappli', { username, cources, classrooms, mycource, modalid, modalcontent })
        });
    });
});
//课程申请教室
app.post('/appliclassroom', (req, res) => {
    const r = req.body;
    const cid = r.cource;
    const jid = r.classroom;
    const time = r.time1 + ':' + r.time2;
    tappliclassroom.insertMany({ cid: cid, jid: jid, usetime: time }, (err, data) => {
        if (err) console.log(err);
    });
    res.redirect('/applicationlist');
})
//课程教室申请列表页面
app.get('/applicationlist', isLogin, (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    const mycource = req.session.mycource;
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
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
            res.render('applicationlist', { username, applications, mycource, modalid, modalcontent });
        })

})
//课程报名的所有成员列表页面
app.get('/courceuser', isLogin, (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    const mycource = req.session.mycource;
    const cid = mongoose.Types.ObjectId(req.url.split('=')[1]);
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
    tregcource.aggregate([
        {
            $match: {
                cid: cid
            }
        },
        {
            $lookup: {
                from: 'tuser',
                localField: 'uid',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'tcource',
                localField: 'cid',
                foreignField: '_id',
                as: 'cource'
            }
        }
    ],
        (err, data) => {
            const courceusers = data;
            res.render('courceuserlist', { username, courceusers, mycource, modalid, modalcontent });
        })

})
//所有用户列表页面
app.get('/user', isLogin, (req, res) => {
    const username = req.session.username;
    const uid = req.session.uid;
    const mycource = req.session.mycource;
    const modalid = req.session.modalid;
    const modalcontent = req.session.modalcontent;
    tuser.find((err, data) => {
        const users = data;
        res.render('userlist', { username, users, mycource, modalid, modalcontent });
    })

})
app.listen(10528);