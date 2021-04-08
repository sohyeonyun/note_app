function register() {
    const email_input = document.getElementById('email');
    const password_input = document.getElementById('password');
    const password_check_input = document.getElementById('password-check');

    if (!email_input.value) {
        alert('이메일 입력해');
        return;
    }
    if (!password_input.value) {
        alert('비밀번호 입력해');
        return;
    }
    if (!password_check_input.value) {
        alert('비밀번호 확인 입력해');
        return;
    }

    if (password_input.value !== password_check_input.value) {
        alert('비밀번호 확인');
        return; //여기서 왜 회원가입이 될까..?
    }

    const form = document.getElementById('register');
    form.submit();
}