/**
 * 1. 로그아웃 기능 - 서버와 연동이 되어야 해서 지금 못함!!
 * 2. 작성하기 기능
 * 3. 과거에 작성한 걸 받아오는 기능
 * 
 * 웹 저장소에 저장
 * 
 * Web Storage API
 * 
 * local Storage - 영구적
 * session Storage - 탭을 끄면 다 날아간다
 */

// 작성하기
function addMemo() {
    const input_text = document.getElementById('input').value;

    // 1. 빈 메모일 경우에는 안된다 말하기
    if (!input_text) {
        alert('메모가 없습니다 멈춰!');
        return;
    }

    // 요청 보내기
    const form = document.getElementById('write');
    form.submit();  // '/' 위치로 POST 요청을 보낸다
    alert('작성되었습니다.');
    
    // const storage = window.localStorage;    // session은 휘발성이라 X
    // const id = storage.length;              // length하면 겹치긴함. DB까지 필요..
    // storage.setItem(id, input_text);

    // // 2. 입력이 성공했을 경우, 인풋 안에 있는 내용 비우기
    // document.getElementById('input').value = '';
    // alert('메모 저장 완료!');

    // // 글 요소를 만들고 자식으로 넣기 
    // const note_container = document.getElementsByClassName('main__note-contents')[0];
    // // TODO: main__note-content div를 만들고 note__container에 추가
    // const note_content = document.createElement('div');
    // note_content.className = 'main__note-content';
    // note_content.innerText = input_text

    // const link_element = document.createElement('a');
    // link_element.href = `./edit?id=${id}`;

    // link_element.appendChild(note_content);

    // note_container.appendChild(note_content);
}

// 저장소에 있는 글 가져오기 - 안하면 화면 글이 새로고침 후 날라감.
function getMemos() {
    const storage = window.localStorage;
    console.log(storage);
    const memos = Object.entries(storage);
    console.log(memos);

    const note_container = document.getElementsByClassName('main__note-contents')[0];
    
    memos.forEach((memo) => {
        const id = memo[0];
        const data = memo[1];
        
        const note_content = document.createElement('div');
        note_content.className = 'main__note-content';
        note_content.innerText = data;

        /**
         * <div class="main__note-content">
         *      메모들이 여기에 들어갑니다
         * </div>
         */

        const link_element = document.createElement('a');
        link_element.href = `./edit?id=${id}`;

        // <a href = "./edit.html"></a>
        link_element.appendChild(note_content);

        // <a href="edit.html">
        //      <div class="main__note-content">
        //            메모들이 여기에 들어갑니다
        //      </div>
        //</a>
        note_container.appendChild(link_element);
    });
}

// getMemos();


function logout() {
    if (!confirm('로그아웃 하십니까?')) {
        return;
    }

    const form = document.getElementById('logout');
    form.submit();
}