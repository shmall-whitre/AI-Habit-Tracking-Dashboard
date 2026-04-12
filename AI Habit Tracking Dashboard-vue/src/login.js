

// 防重复点击标志
let isSwitching = false;

// 切换到登录模式
function switchToLogin() {
    if (isSwitching) return;
    
    isSwitching = true;
    const formSection = document.querySelector('.form-section');
    const welcomeSection = document.querySelector('.welcome-section');
    
    // 添加动画类
    formSection.classList.add('slide-right');
    welcomeSection.classList.add('slide-left');
    
    // 动画结束后更新内容
    setTimeout(() => {
        const formTitle = formSection.querySelector('h2');
        const emailField = formSection.querySelector('#email').parentElement;
        const submitBtn = formSection.querySelector('button[type="submit"]');
        const socialLogin = formSection.querySelector('.social-login');
        const formToggle = formSection.querySelector('.form-toggle p');
        
        // 更新左侧表单
        formTitle.textContent = '登录';
        emailField.classList.add('hidden');
        submitBtn.textContent = '登录';
        submitBtn.classList.remove('signup-btn');
        submitBtn.classList.add('login-btn-form');
        socialLogin.style.display = 'block';
        formToggle.innerHTML = '还没有账号？ <a href="javascript:void(0)" onclick="switchToSignup()">注册</a>';
        
        // 更新右侧欢迎区域
        const welcomeTitle = welcomeSection.querySelector('h2');
        const welcomeText = welcomeSection.querySelector('p');
        const welcomeBtn = welcomeSection.querySelector('.login-btn');
        
        welcomeTitle.textContent = '创建账号';
        welcomeText.textContent = '填写以下信息创建新账号';
        welcomeBtn.textContent = '创建账号';
        welcomeBtn.onclick = switchToSignup;
        
        // 移除动画类
        formSection.classList.remove('slide-right');
        welcomeSection.classList.remove('slide-left');
        
        // 交换位置
        formSection.style.order = '2';
        welcomeSection.style.order = '1';
        welcomeSection.style.borderRadius = '20px 0 0 20px';
        
        // 重置防重复点击标志
        isSwitching = false;
    }, 300);
}

// 切换到注册模式
function switchToSignup() {
    if (isSwitching) return;
    
    isSwitching = true;
    const formSection = document.querySelector('.form-section');
    const welcomeSection = document.querySelector('.welcome-section');
    
    // 添加动画类
    formSection.classList.add('slide-left');
    welcomeSection.classList.add('slide-right');
    
    // 动画结束后更新内容
    setTimeout(() => {
        const formTitle = formSection.querySelector('h2');
        const emailField = formSection.querySelector('#email').parentElement;
        const submitBtn = formSection.querySelector('button[type="submit"]');
        const socialLogin = formSection.querySelector('.social-login');
        const formToggle = formSection.querySelector('.form-toggle p');
        
        // 更新左侧表单
        formTitle.textContent = '创建账号';
        emailField.classList.remove('hidden');
        submitBtn.textContent = '创建账号';
        submitBtn.classList.remove('login-btn-form');
        submitBtn.classList.add('signup-btn');
        socialLogin.style.display = 'none';
        formToggle.innerHTML = '已有账号？ <a href="javascript:void(0)" onclick="switchToLogin()">登录</a>';
        
        // 更新右侧欢迎区域
        const welcomeTitle = welcomeSection.querySelector('h2');
        const welcomeText = welcomeSection.querySelector('p');
        const welcomeBtn = welcomeSection.querySelector('.login-btn');
        
        welcomeTitle.textContent = '欢迎回来！';
        welcomeText.textContent = '输入您的个人信息以登录或创建一个新账户';
        welcomeBtn.textContent = '登录';
        welcomeBtn.onclick = switchToLogin;
        
        // 移除动画类
        formSection.classList.remove('slide-left');
        welcomeSection.classList.remove('slide-right');
        
        // 交换位置
        formSection.style.order = '1';
        welcomeSection.style.order = '2';
        welcomeSection.style.borderRadius = '0 20px 20px 0';
        
        // 重置防重复点击标志
        isSwitching = false;
    }, 300);
}

// 清空表单字段
function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('email').value = '';
}

// 登录表单处理
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formTitle = document.querySelector('.form-section h2').textContent;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        
        if (formTitle === '登录') {
            // 登录逻辑
            if (!username || !password) {
                alert("请填写用户名和密码");
                return;
            }
           const text=await Post.post();
           const result=JSON.stringify(text); 
            
           
        } else {
            // 注册逻辑
            if (!username || !email || !password) {
                alert("请填写所有必填字段");
                return;
            }
            
            // 增强的邮箱验证
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert("请输入有效的邮箱地址");
                return;
            }
            
            // 增强的密码强度验证
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
            if (!passwordRegex.test(password)) {
                alert("密码至少需要6个字符，包含大写字母、小写字母、数字和特殊字符");
                return;
            }
            
            // 模拟注册成功
            alert(`注册成功！用户名：${username}，邮箱：${email}`);
            // 注册成功后清空表单
            clearForm();
            // 注册成功后自动切换到登录模式
            switchToLogin();
        }
    });
});

// Post对象用于处理表单提交
const Post={
    async post(url){
        const form=document.querySelector('form');
       try{
         let response=await fetch(url,{
            method:'POST',
            body:new FormData(form),
         })
         if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
         }
         const result=await response.json();
         return result;
        }catch(err){
            alert("提交错误"+err.message);
        }
  }
};
window.Post=Post;