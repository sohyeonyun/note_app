// 서버
// 패키지 연결
// const { response } = require('express');

// 패키지 연결
const express = require('express');
const session = require('express-session');
const {Firestore} = require('@google-cloud/firestore');
const {FirestoreStore} = require('@google-cloud/connect-firestore');

// Express 사용
const app = express();

// Express 사용 기본 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// 패키지를 렌더링 하기 위한 설정
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 세션 설정
app.use(session({
    store: new FirestoreStore({
        dataset: new Firestore({
            projectId: 'expanded-bonbon-309410',
            keyFilename: './servicekey.json',
        }),
        kind: 'express-sessions',
    }),
    secret: 'secret-key',   // 아무거나 적으면 됨.
    resave: false,
    saveUninitialized: true,
}));

// 데이터베이스 초기화
const db = new Firestore({
    projectId: 'expanded-bonbon-309410',
    keyFilename: './servicekey.json',
}).collection('users');

// 엔드포인트 (주소 + 경로)
// 메인페이지 접속
app.get('/', async (request, response) => {
    if (!request.session.account) { //로그인 안돼있을때
        response.redirect('./login');
        return;
    }

    const {uid} = request.session.account;

    const memo_list = await db.doc(uid).collection('memos').get();
    
    const memos = [];

    memo_list.forEach((memo) => {
        const memo_data = memo.data();  // { content: '메모2' }
        memo_data.id = memo.id;
        /**
         * { content: '메모2', id: '~~~~' }
         */
        memos.push(memo_data);
    })

    response.render('main.html', {memos});
});

// 작성 요청을 위한 엔드 포인트
app.post('/', async (req, res) => {
    if (!req.session.account) {
        res.redirect('login');
        return;
    }

    const {uid} = req.session.account;

    const memo_data = req.body.content;

    await db.doc(uid).collection('memos').add({
        content: memo_data,
    });

    res.redirect('/');
});

// 수정페이지 접속
app.get('/edit', async (req, res) => {
    if (!req.session.account) {
        res.redirect('login');
        return;
    }

    const id = req.query.id;  // {id: '~~~'}

    // id 가 없을 경우  /edit
    if (!id) {
        res.send('아이디를 적어야 한다.');
        return;
    }

    const {uid} = req.session.account;

    const doc = await db.doc(uid).collection('memos').doc(id).get();

    // 이 문서가 없을 경우
    if (!doc.exists) {
        res.send('메모가 없다.');
        return;
    }

    // const content = doc.data().content; // { content: '~~~' }
    const {content} = doc.data();

    res.render('edit.html', {content});
});

// 메모 수정하기
app.post('/edit', async (req, res) => {
    if (!req.session.account) {
        res.redirect('login');
        return;
    }

    // 1. content
    const {content} = req.body; // const content = req.body.content;
    // 2. 주소
    const {id} = req.query;

    const {uid} = req.session.account;
    await db.doc(uid).collection('memos').doc(id).update({
        content: content,
    });

    res.redirect('/');
});

// 메모 삭제하기
app.post('/delete', async (req, res) => {
    if (!req.session.account) {
        res.redirect('login');
        return;
    }

    const id = req.query.id;
   
    const {uid} = req.session.account;
    await db.doc(uid).collection('memos').doc(id).delete();

    res.redirect('/');
});

// 로그인 페이지 접속
app.get('/login', (req, res) => {
    if (req.session.account) {
        // 이미 로그인된 상태
        res.redirect('/');
        return;
    }

    res.render('login.html');
});

// 로그인 요청
app.post('/login', async (req, res) => {
    if (req.session.account) {
        // 이미 로그인된 상태
        res.redirect('/');
        return;
    }

    const {email, password} = req.body;

    const user_doc = await db.where('id', '==', email).get();

    if (user_doc.empty) {
        res.send('없는 아이디(이메일)이다');
        return;
    }
    
    const user_data = user_doc.docs[0].data();
    const user_id = user_doc.docs[0].id;

    if (password !== user_data.password) {
        res.send('비밀번호 다르다');
        return;
    }

    req.session.account = {
        email,
        uid: user_id,
    }
    
    res.redirect('/');
});

// 로그아웃
app.post('/logout', (req, res) => {
   if (!req.session.account) {  //로그인 안되어있을 때
       res.redirect('/login');
       return;
   } 

   delete req.session.account;

   res.redirect('/login');

});


// 회원가입 페이지 접속
app.get('/register', (req, res) => {
    if (req.session.account) {
        // 이미 로그인된 상태
        res.redirect('/');
        return;
    }

    res.render('register.html');
});

// 회원가입
app.post('/register', async (req, res) => {
    if (req.session.account) {
        // 이미 로그인된 상태
        res.redirect('/');
        return;
    }

    // const email = req.body.email;
    // const password = req.body.password;
    const {email, password} = req.body;

    const user = await db.where('id', '==', email).get();    // db.where('email', '==', email)
    // id가 같은 문서들 다 가져옴.
    if (!user.empty) {
        res.send('이미 가입된 이메일(아이디)이다.');
        return;
    }

    const {id} = await db.add({
        id: email,
        password: password,
    });

    // 세션을 등록
    req.session.account = {
        email,
        uid: id,
    } // { account: {email: '~~~', uid: '~~~'}}

    res.redirect('/');
});

app.all('*', (req, res) => {
    res.status(404).send('없는 페이지다');
});

// 서버 열기
app.listen(8080);