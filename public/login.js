function login() {
    const email_input = document.getElementById('email');
    const password_input = document.getElementById('password');

    if (!email_input.value) {
        alert('이메일 입력해');
        return;
    }
    if (!password_input.value) {
        alert('비밀번호 입력해');
        return;
    }

    const form = document.getElementById('login');
    form.submit();
}