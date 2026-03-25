//保存数据封存到localStorage
const Storageinist={
key:{
thmem:"login_thmem",
habit:"login_habit",
},

getthmem(){
    return localStorage.getItem(this.key.thmem)||"Light";
},//保存主题
setthmem(thmem)
{
localStorage.setItem(this.key.thmem,thmem);
},
//获取习惯
gethabit(){
    const data=localStorage.getItem(this.key.habit);
    return data?JSON.parse(data)/*json字符串转化为javascrpit对象*/ :[];
},//保存习惯
sethabit(habit)
{
    localStorage.setItem(this.key.habit,JSON.stringify(habit));
},
addhabit(habit)//添加习惯
{
    const habits=Storageinist.gethabit();//获取当前的习惯
    habit.id=Date.now().toString();//生成唯一id//相当于新添加id属性
    habit.creattime=new Date().toLocaleString();//获取当前时间//相当于新添加create时间属性
   
    habit.compions=[];//初始化完成记录数组
   habits.push(habit);//添加到数组 
   this.sethabit(habits);//保存到localStorage
   return habit;
},
//删除习惯
dealtehabit(id){
const habits=Storageinist.gethabit();
const index=habits.findIndex(h=>h.id===id);//查找要删除的习惯//找到返回要删除的习惯的索引，否则返回-1
if(index!==-1){
    habits.splice(index,1);//删除索引为index的1个元素
}
this.sethabit(habits);//保存到localStorage
},
// 标记习惯完成
comletedhabit(id,date=this.gotostring()){
    const habits=Storageinist.gethabit();
    const habit=habits.find(h=>h.id===id);//查找要完成的习惯//找到返回要完成的习惯，否则返回undefined
    if(habit){
        if(!habit.compions.include(date))
        {
            habit.compions.push(date);//添加到完成记录数组
        }
        return false;
    }
    return false;
},
//取消习惯完成记录（删除今日的日期）
cancelcompletedhabit(id,date=this.gotostring()){
const habits=Storageinist.gethabit();
const habit=habits.find(h=>h.id===id);//查找要完成的习惯//找到返回要完成的习惯，否则返回undefined
    if(habit){
     if(habit.compions.include(date))  
    {
        const index=habits.findIndex(h=>h.id===id);//查找要删除的习惯//找到返回要删除的习惯的索引，否则返回-1
        if(index!==-1){
            habits[index].compions.splice(habits[index].compions.indexOf(date),1);//删除索引为index的1个元素
            this.sethabit(habits);//保存到localStorage
        }
        return false;
    }
     return false;

    }
    return false;

},
//获取今日日期
gotostring(){
    return new Date().toISOString().split('T')[0];//split('T')//以t为分割点 [0] 用于获取日期部分，忽略时间部分
},
//记录最近几天的日期数组
getlasttime(days){
    const result=[];
    const today=new Date();
    for(let i=0;i<days;i++){
        const date=new date(today);
        date.setDate(date.getDate() - i);
        result.push(date.toISOString().split('T')[0]);
    }
    return result;
},
//计算完成习惯的天数(日期要连续)
countcompleteddays(compions){
     const sorted = [...compions].sort().reverse();//sort()//对数组元素进行排序，默认按字符串 Unicode 码点排序//reverse()//将数组元素反转//
    if(compions.length===0||!compions){
        return 0;
    }
    const today=new Date();
    const yearsterday=new Date(today);
    yearsterday.setDate(yearsterday.getDate()-1);
    if(sorted[0]===yearsterday.toISOString().split('T')[0]||sorted[0]===today.toISOString().split('T')[0]){
        return 0;
    }
    let count=1;
    for(let i=0;i<sorted.length-1;i++){
        const current=new Date(sorted[i]);
        const next=new Date(sorted[i+1]);
        if(current.getDate()-next.getDate()===1){
            count++;
        }
        else{
            break;
        }

      }
      return count;
 },
//清空
clearcompleted(){
    localStorage.setItem(this.key.habit);
    localStorage.setItem(this.key.thmem);
}



}
window.Storageinist=Storageinist;//把Storageinist对象挂载到window对象上，方便在其他模块中调用//变成全局对象




const complete={

//绑定事件
bindevent(){
//按下添加习惯时
const form=document.getElementById("addHabitForm");
form.addEventListener("submit",(e)=>{
this.makehabit(e);
   })

},//获取表单的习惯信息//并添加到习惯数组
makehabit(e){
    e.preventDefault();//阻止表单默认提交行
    const habitname=document.getElementById("iterm1").value.trim();
    const category=document.getElementById("iterm2").value;
    const frequency=document.getElementById("iterm3").value;
    if(!habitname)
    {
        alert("请输入名称");
        return;
    }
    else 
    {
        Storageinist.addhabit({
            habitname,
            category,
            frequency,
            compelete:false,//默认未完成//打卡后属性被去除
        
        });
    }

    document.getElementById("addHabitForm").reset();//清空表单
    this.shownotication("✔️YES,习惯添加成功");
    

},



//添加成功时的弹窗
shownotication(message){
    const s=document.createElement("div");
  s.style.cssText=`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--border-color);
    color:white;
    padding: 16px 24px;
    border-radius: 5px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-color);
    z-index: 1000;
    font-weight: 500;
  `;
  s.textContent=message;
  document.body.appendChild(s);
  setTimeout(() => {
    s.style.opacity="1";
    s.style.transform="translateY(0px)";
    setTimeout(() => s.remove(), 300);
  }, 3000);
    
},



//添加习惯卡片
kard()
{


    
}









init()
{
this.bindevent();
}


}









//启动各个模块
document.addEventListener("DOMContentLoaded",function(){
    thmemlogin.init();
    complete.init();
})







//主题切换模块
const thmemlogin={
changetext()
{
    const seachtheme=Storageinist.getthmem();
    document.documentElement.setAttribute('data-theme', seachtheme);
    document.getElementById("icon").innerHTML=seachtheme==="Dark"?"☀️":"🌙";
},
change(){
    const currentthmem=Storageinist.getthmem();
   
    if(currentthmem=="Light"){
        Storageinist.setthmem("Dark");
    }
    else{
        Storageinist.setthmem("Light");
    }
     this.changetext();
   },
   init ()
{
     this.changetext();
    document.getElementById("themeToggle").addEventListener("click",function(){
    thmemlogin.change();
   })
   
}
 
}