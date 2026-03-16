//主题切换
const mythmem={

key:{
thmem:"login_thmem",
},

getthmem(){
    return localStorage.getItem(this.key.thmem)||"Light";
},
setthmem(thmem)
{
localStorage.setItem(this.key.thmem,thmem);
},

changetext()
{
    const seachtheme=mythmem.getthmem();
    document.documentElement.setAttribute('data-theme', seachtheme);
    document.getElementById("icon").innerHTML=seachtheme==="Dark"?"☀️":"🌙";
},
change(){
    const currentthmem=mythmem.getthmem();
   
    if(currentthmem=="Light"){
        mythmem.setthmem("Dark");
    }
    else{
        mythmem.setthmem("Light");
    }
     mythmem.changetext();
   },
   start()
   {
     mythmem.changetext();

    document.getElementById("themeToggle").addEventListener("click",function(){
    mythmem.change();
   })
   }
}
 mythmem.start();
