// 保存数据到 localStorage
const Storageinist = {
    key: {
        thmem: "login_thmem",
        habit: "login_habit",
    },

    getthmem() {
        return localStorage.getItem(this.key.thmem) || "Light";
    }, // 保存主题
    setthmem(thmem) {
        localStorage.setItem(this.key.thmem, thmem);
    },

    // 获取习惯
    gethabit() {
        const data = localStorage.getItem(this.key.habit);
        return data ? JSON.parse(data) /* json字符串转化为javascrpit对象 */ : [];
    }, // 保存习惯
    sethabit(habit) {
        localStorage.setItem(this.key.habit, JSON.stringify(habit));
    },
    // 添加习惯
    addhabit(habit) {
        const habits = Storageinist.gethabit(); // 获取当前的习惯
        habit.id = Date.now().toString(); // 生成唯一id
        habit.creattime = new Date().toLocaleString(); // 获取当前时间
        habit.compions = []; // 初始化完成记录数组
        habits.push(habit); // 添加到数组
        this.sethabit(habits); // 保存到localStorage
        return habit;
    },
    // 删除习惯
    dealtehabit(id) {
        const habits = Storageinist.gethabit();
        const index = habits.findIndex(h => h.id === id); // 查找要删除的习惯
        if (index !== -1) {
            habits.splice(index, 1); // 删除索引为index的1个元素
        }
        this.sethabit(habits); // 保存到localStorage
    },
    // 标记习惯完成
    comletedhabit(id, date = Storageinist.gotostring()) {
        const habits = Storageinist.gethabit();
        const habit = habits.find(h => h.id === id); // 查找要完成的习惯
        if (habit) {
            if (!habit.compions.includes(date)) {
                habit.compions.push(date); // 添加到完成记录数组
                this.sethabit(habits);
            }
            return true;
        }
        return false;
    },
    // 取消习惯完成记录（删除今日的日期）
    cancelcompletedhabit(id, date = Storageinist.gotostring()) {
        const habits = Storageinist.gethabit();
        const habit = habits.find(h => h.id === id); // 查找要完成的习惯
        if (habit) {
            if (habit.compions.includes(date)) {
                const index = habits.findIndex(h => h.id === id); // 查找要删除的习惯
                if (index !== -1) {
                    habits[index].compions.splice(habits[index].compions.indexOf(date), 1); // 删除索引为index的1个元素
                    this.sethabit(habits); // 保存到localStorage
                }
                return true;
            }
            return false;
        }
        return false;
    },
    // 获取今日日期
    gotostring() {
        return new Date().toISOString().split('T')[0]; // split('T') 以t为分割点 [0] 用于获取日期部分，忽略时间部分
    },
    // 记录最近几天的日期数组
    getlasttime(days) {
        const result = [];
        const today = new Date();
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            result.push(date.toISOString().split('T')[0]);
        }
        return result;
    },
    // 计算完成习惯的天数(日期要连续)
    countcompleteddays(compions) {
        if (!compions || compions.length === 0) {
            return 0;
        }
        const sorted = [...compions].sort().reverse(); // sort() 对数组元素进行排序，默认按字符串 Unicode 码点排序
        let count = 1;
        for (let i = 0; i < sorted.length - 1; i++) {
            const current = new Date(sorted[i]);
            const next = new Date(sorted[i + 1]);
            if (current.getDate() - next.getDate() === 1) {
                count++;
            } else {
                break;
            }
        }
        return count;
    },
    // 清空
    clearcompleted() {
        localStorage.removeItem(this.key.habit);
        localStorage.removeItem(this.key.thmem);
    }
};
window.Storageinist = Storageinist; // 把Storageinist对象挂载到window对象上，方便在其他模块中调用
const complete = {
    // 绑定事件
    bindevent() {
        // 按下添加习惯时
        const form = document.getElementById("addHabitForm");
        form.addEventListener("submit", (e) => {
            this.makehabit(e);
        });
        // 按下筛选按钮时
        const filter = document.querySelectorAll('.filter-btn');
        filter.forEach(btn => (btn.addEventListener("click", (e) => {
            this.addfilter(e); // queryselectorall返回的是一个类数组，需要遍历每个按钮
        })));
        const a = document.querySelector('.my-habit-list');
        a.addEventListener('click', e => {
            this.handlethings(e);
        });
    },

    // 获取表单的习惯信息并添加到习惯数组
    makehabit(e) {
        e.preventDefault(); // 阻止表单默认提交行
        const habitname = document.getElementById("iterm1").value.trim();
        const category = document.getElementById("iterm2").value;
        const frequency = document.getElementById("iterm3").value;
        if (!habitname) {
            alert("请输入名称");
            return;
        } else {
            Storageinist.addhabit({
                habitname,
                category,
                frequency,
                compelete: false, // 默认未完成
            });
        }

        this.randerhabit();
        document.getElementById("addHabitForm").reset(); // 清空表单
        this.shownotication("✔️YES,习惯添加成功");
        this.updateProgressRing();
    },

    // 弹窗功能
    shownotication(message) {
        const s = document.createElement("div");
        s.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--border-color);
            color: white;
            padding: 16px 24px;
            border-radius: 5px;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            z-index: 1000;
            font-weight: 500;
        `;
        s.textContent = message;
        document.body.appendChild(s);
        setTimeout(() => {
            s.style.opacity = "1";
            s.style.transform = "translateY(0px)";
            setTimeout(() => s.remove(), 300);
        }, 3000);
    },

    // 用户点击按钮时，添加active类名
    addfilter(e) {
        const filter = e.target.dataset.filter;
        // 更新激活状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.randerhabit(filter);
       
    },

    // 删除习惯
    dealteyouhabit(id) {
        if (confirm("是否确定要删除该习惯")) {
            Storageinist.dealtehabit(id);
            this.shownotication("已删除习惯");
            this.randerhabit();
            this.updateProgressRing();
            this.SETcomplete() 
        }
    },

    // 渲染，添加卡片
    randerhabit(filter = 'all') {
        const container = document.querySelector('.my-habit-list');
        const emptyState = document.querySelector('.my-habit-content2');
        const habit = Storageinist.gethabit();
        const time = Storageinist.gotostring();
        const filterhabits = filter === 'all' ? habit : habit.filter(h => h.category === filter);
        if (filterhabits.length === 0) {
            emptyState.classList.remove('hidden');
            container.innerHTML = "";
            return;
        }

        emptyState.classList.add('hidden');
        container.innerHTML = filterhabits.map(habit => {
            const isCompleted = habit.compions.includes(time); // 获取今天日期
            const daycomtuin = Storageinist.countcompleteddays(habit.compions);
            return `
                <div class="habit-card ${isCompleted ? 'completed' : ''}" 
                     data-id="${habit.id}" data-category="${habit.category}">
                    <div class="habit-card-header">
                        <h3 class="habit-card-title">${habit.habitname}</h3>
                        <span class="habit-card-category ${habit.category}">
                            ${habit.category === 'health' ? '健康' : habit.category === 'study' ? '学习' : '社交'}
                        </span>
                    </div>
                    <div class="habit-card-stats">
                        <div class="habit-card-streak">
                            <span>🔥</span>
                            <span>连胜 ${daycomtuin} 天</span>
                        </div>
                        <div class="habit-card-streak">
                            <span>📅</span>
                            <span>累计 ${habit.compions.length} 次</span>
                        </div>
                    </div>
                    <div class="habit-card-actions">
                        <button class="btn btn-complete ${isCompleted ? 'completed' : ''}">
                            ${isCompleted ? '✓ 已完成' : '✓ 完成'}
                        </button>
                        <button class="btn btn-secondary btn-delete">
                            🗑️ 删除
                        </button>
                    </div>
                </div>
            `;
        }).join('');
       
    },

    // 让其处于完成状态
    completehabit(id) {
        const datadays = Storageinist.gotostring();
        const card = document.querySelector(`.habit-card[data-id="${id}"]`);
        const btn = card.querySelector('.btn-complete');
        const habit = Storageinist.gethabit().find(h => h.id === id);
        if (!habit) {
            return;
        }
        if (habit.compions.includes(datadays)) {
            Storageinist.cancelcompletedhabit(id, datadays);
            card.classList.remove('completed');
            btn.classList.remove('completed');
            btn.textContent = "✓ 完成";
        } else {
            Storageinist.comletedhabit(id, datadays);
            card.classList.add('completed');
            btn.classList.add('completed');
            btn.textContent = "✓ 已完成";
        }
        this.randerhabit();
        this.updateProgressRing();
        this.SETcomplete();
    },

    handlethings(e) {
        const c = e.target.closest('.btn-secondary');
        const card = e.target.closest('.habit-card');
        if (!card) return;
        const id = card.dataset.id;
        if (c) {
            this.dealteyouhabit(id);
            return;
        }
        if (e.target.closest('.btn-complete')) {
            this.completehabit(id);
        }
        this.SETcomplete();
    },
   
    // 更新进度环
    updateProgressRing() {
        const habits = Storageinist.gethabit();
        const container = document.querySelector('.progress-ring-container');
        
        if (habits.length === 0) {
            // 显示暂无数据
            if (container) {
                container.classList.add('no-data');
            }
            return;
        }
        
        // 显示进度环
        if (container) {
            container.classList.remove('no-data');
        }
        
        const today = Storageinist.gotostring();
        const completedHabits = habits.filter(habit => habit.compions.includes(today)).length;
        const progress = Math.round((completedHabits / habits.length) * 100);
        this.setProgress(progress);
    },
   
    // 设置进度环的值
    setProgress(percent) {
        const circle = document.querySelector('.progress-ring-progress');
        const text = document.querySelector('.progress-ring-text');
        if (!circle || !text) return;
        
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - percent / 100 * circumference;
        circle.style.strokeDashoffset = offset;
        text.textContent = `${percent}%`;
    },
    getday(datadays) {
        let day = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        return day[datadays.getDay()];
    },
    /*渲染七天完成热力图<*/
    SETcomplete() {
        const habit = Storageinist.gethabit();
        const button = document.querySelectorAll('.button');
        button.forEach(bu => bu.classList.remove('active'));
        let setmap = new Set();
        
        habit.forEach(DATA => {
            DATA.compions.forEach(time => {
                const datatime = new Date(time);
                const map = this.getday(datatime);
                setmap.add(map);
            });
        });
        
        button.forEach(button => {
            if (setmap.has(button.value)) {
                button.classList.add('active');
            }
            else{
                button.classList.remove('active');
            }
        });
    },
//初始化
    init() {
        this.randerhabit();
        this.bindevent();
        this.SETcomplete();
        this.updateProgressRing();

    },
};
window.complete=complete;
//传递数据，后端以流返回
const Post={
 async post(url){
    const data=Storageinist.gethabit();
    const controller=new AbortController();
    const dialogtext=document.querySelector('.ai-text');
    if(!data){
        console.log("数据为空");
        return;
    }
    console.log("正在提交");
    dialogtext.textContent="豆包："+"[思考中]......."
    dialogtext.classList.add('typing');
    try{ 
        const timeout=setTimeout(()=>{
            controller.abort();
            console.log("提交超时");  
             dialogtext.classList.remove('typing');
            dialogtext.textContent="豆包："+"提交超时......";
         
            
        },5000)
        const response= await fetch(url,{
            method:'POST',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data[0]),
            signal:controller.signal
        })
        clearTimeout(timeout);
        if(!response.ok||!response.body){
            const s=response.status;
            dialogtext.textContent=s;
            throw new Error(`状态码：${response.status}`);
        }
       
        const reader=response.body.getReader();
        const decoder=new TextDecoder('UTF-8');
        let text="豆包：";
        dialogtext.textContent="";
        while(true){
            const {done,value}= await reader.read();
            if(done){
                dialogtext.classList.remove('typing');
                text+=decoder.decode();
                break;
            }
            const chuck=decoder.decode(value,{stream:true});
            text+=chuck;
            dialogtext.textContent=text;
        }
        return text;
     }catch(err){
        console.log("提交失败"+err.message);
     }
    }
};
window.Post = Post;
//做一个弹窗，用于显示ai的消息
const but = {
    add() {
        const btn = document.querySelector('.ai');
        if (!btn) return;
      const elm=document.createElement('dialog');
      elm.className='aitext';
     elm.innerHTML=`
     <button class="ai-btn" >❌</button>
     <div class="ai-text"></div>`
     document.body.appendChild(elm);
    onclose();
    btn.addEventListener("click", () => {
            const dialog=document.querySelector('.aitext');
           dialog.showModal(); 
           Post.post('http://10.141.238.128:8000/AI');
            
        });
       

    }
};
function onclose(){
  const dialog=document.querySelector('.aitext');
  const btn=document.querySelector('.ai-btn');
  if(dialog && btn){
  btn.addEventListener('click',()=>{
     dialog.close();
  })
}
}
// 启动各个模块
document.addEventListener("DOMContentLoaded", function() {
    thmemlogin.init();
    complete.init();
    but.add();
});
// 主题切换模块
const thmemlogin = {
    changetext() {
        const seachtheme = Storageinist.getthmem();
        document.documentElement.setAttribute('data-theme', seachtheme);
        document.getElementById("icon").innerHTML = seachtheme === "Dark" ? "☀️" : "🌙";
    },
    change() {
        const currentthmem = Storageinist.getthmem();
        if (currentthmem === "Light") {
            Storageinist.setthmem("Dark");
        } else {
            Storageinist.setthmem("Light");
        }
        this.changetext();
    },
    init() {
        this.changetext();
        document.getElementById("themeToggle").addEventListener("click", function() {
            thmemlogin.change();
        });
    }
};

