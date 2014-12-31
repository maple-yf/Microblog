var express = require('express');
var router = express.Router();
var mongodb=require('../models/db');
var crypto=require('crypto');//加密算法
var User=require('../models/user');//引入user模型
var Post=require('../models/post');//引入post模型

/* GET home page. */
router.get('/', function(req, res) {
	//console.log(res.locals.user);
	//console.log();
	Post.get(null,function(err,posts){
		if(err){
			posts=[];
		}
		console.log(posts[0].time);
		console.log(posts[0].time.getTime());
		console.log(posts[0].time.getDate());
		console.log(posts[0].time.getFullYear());
		console.log(posts[0].time.getMonth()+1);
		console.log(posts[0].time.getHours());
		console.log(posts[0].time.getMinutes());
		console.log(posts[0].time.getSeconds());

		// console.log(typeof(posts[0].time));

		res.render('index', {
			title: '首页',
			posts:posts
		});
	});  

});

router.get('/hello',function(req,res){
	// res.send('The time is '+ new Date().toString());
	
	//var theHelloOption={};
	//theHelloOption.helloParameter="hello there"
	//theHelloOption.title='hello';

	res.render('hello',{
		title:'hello'
	});
});

//router.post()
router.post('/post',function(req,res){
	var currentUser=req.session.user;
	var post=new Post(currentUser.name,req.body.post);
	post.save(function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}
		req.flash('success','发表成功');
		res.redirect('/u/'+currentUser.name);
	})
});

router.get('/reg',checkNotLogin);//检测登录状态
router.get('/reg',function(req,res){//注册
	//res.locals.error='ok';
	
	res.render('reg',{
		title:'用户注册'
	});
});

router.post('/reg',checkNotLogin);//检测登录状态
router.post('/reg',function(req,res){//注册的post请求
	//检测用户两次输入的密码是否一直
	if(req.body['password-repeat']!=req.body['password']){
		console.log('密码不一致');
		//res.locals.error='密码不一致';
		req.flash('error','密码不一致');

		return res.redirect('/reg');
	}

	//生成密码hash值
	var md5=crypto.createHash('md5');
	var password=md5.update(req.body.password).digest('base64');

	var newUser=new User({
		name:req.body.username,
		password:password
	});

	//检查用户名是否已经存在
	User.get(newUser.name,function(err,user){
		if(user){
			err='用户名已经存在';
			res.locals.error='用户名已经存在';		
			req.flash('error',err);
			return res.redirect('/reg');
		}else{
		
			//如果用户名不存在则新增用户
			newUser.save(function(err){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user=newUser;
				req.flash('success','注册成功');
				res.locals.success='注册成功';
				res.redirect('/');
			});	
		}
		
	});
});

router.get('/login',checkNotLogin);//检测登录状态
router.get('/login',function(req,res){//用户登录
	//console.log(res.locals);
	//console.log(res.locals.error);//undefined
	res.render('login',	
		{title:'用户登入'});	
});

router.post('/login',checkNotLogin);//检测登录状态
router.post('/login',function(req,res){
	//生成密码散列值
	var md5=crypto.createHash('md5');
	var password=md5.update(req.body.password).digest('base64');

	User.get(req.body.username,function(err,user){
		if(!user){
			req.flash('error','用户名不存在');
			return res.redirect('/login');
		}
		if(user.password!=password){
			req.flash('error','密码错误');
			//res.locals.error='密码错误';
			return res.redirect('/login');
		}
		req.session.user=user;
		req.flash('success','登录成功');
		res.redirect('/');
	})
});

router.get('/logout',checkLogin);//检测登录状态
router.get('/logout',function(req,res){//退出
	req.session.user=null;
	req.flash('success','退出成功');
	res.redirect('/');
});

router.get('/u/:user',checkLogin);
router.get('/u/:user',function(req,res){
	User.get(req.params.user,function(err,user){
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name,function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			res.render('user',{
				title:user.name,
				posts:posts
			});
		});	
	});
	
	//res.send('user: '+req.params.username);
});

//片段视图 partial
router.get('/list',function(req,res){
    var userList={};

    //获取user列表
    mongodb.open(function(err,db){
		if(err){
			console.log('user get error');
			//return callback(err);
		}
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				console.log('users collection get error');
				mongodb.close();
				//return callback(err);
			}
			//查找name属性为username的文档
			collection.find().toArray(function(err,doc){
				mongodb.close();
				if(doc){
					var userList=new Array();
					doc.forEach(function(element, index){
						userList[index]=element.name;
					});

					res.render('list',{
				        title:'List',
				        items:userList
				    });
					//callback(err,user);
				}else{
					console.log('error');
					//callback(err,null);
				}
			});
		});
	});

    
});

// 连接db	测试
mongodb.open(function(err,db){
	if(err){
		console.log('user get error');
		//return callback(err);
	}
	//读取users集合
	db.collection('users',function(err,collection){
		if(err){
			console.log('users collection get error');
			mongodb.close();
			//return callback(err);
		}
		//查找name属性为username的文档
		//console.log(collection);
		//var theArray=new Array();
		collection.find().toArray(function(err,doc){
			//mongodb.close();
			if(doc){
				//theArray.push(doc);				
				//console.log(doc.length);
				var userList=new Array();
				doc.forEach(function(element, index){
					userList[index]=element.name;
					//console.log(element.name);
					//console.log(userList);
				});
				//console.log(theArray);
			}			
		});
		//console.log(theArray);
		collection.findOne({name:'manage'},function(err,doc){
			mongodb.close();
			if(doc){
				//封装为User对象
				var user=new User(doc);
				//console.log(doc.toArray());
				//console.log(doc);				
				//console.log(doc.name);
				//console.log(doc.net9);
			}else{
				console.log('error');
				//callback(err,null);
			}
		});
	});
});

//检测函数
function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','未登录');
		return res.redirect('/login'); 
	}
	next();
}
function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登录');
		return res.redirect('/');
	}
	next()
}
module.exports = router;