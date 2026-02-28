// ===== THEME =====
let theme = localStorage.getItem("theme") || "blue";
document.body.className = theme;

document.getElementById("themeBtn").onclick = () => {
  theme = theme === "blue" ? "pink" : "blue";
  document.body.className = theme;
  localStorage.setItem("theme", theme);
};

// ===== STREAK =====
(function(){
  let today = new Date().toDateString();
  let last = localStorage.getItem("lastDay");
  let streak = +localStorage.getItem("streak") || 0;

  if(last !== today){
    streak++;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastDay", today);
  }

  document.getElementById("streak").innerText = "🔥 " + streak + " ngày";
})();

// ===== DATA =====
let subjects = ["Toán","Ngữ Văn","Tiếng Anh","Vật Lý","Hoá học","Sinh học"]
.map(name=>({
  name,
  lessons:[
    {title:"Bài 1",summary:["Kiến thức cơ bản"],formula:["Công thức"],example:"Ví dụ"}
  ],
  done:[false],
  correct:0,
  total:0
}));

// ===== QUIZ =====
let quizzes = {
  "Toán":[{q:"2+2=?",a:["3","4"],c:1,e:"=4"}],
  "Tiếng Anh":[{q:"I ___ a student",a:["am","is"],c:0,e:"I + am"}],
  "Ngữ Văn":[{q:"Tác giả Kiều?",a:["Nguyễn Du","Nam Cao"],c:0,e:"Nguyễn Du"}],
  "Vật Lý":[{q:"v=?",a:["s/t","m.a"],c:0,e:"v=s/t"}],
  "Hoá học":[{q:"H2O?",a:["Nước","Oxy"],c:0,e:"Nước"}],
  "Sinh học":[{q:"Đơn vị sống?",a:["Tế bào","Nguyên tử"],c:0,e:"Tế bào"}]
};

// ===== LOAD SUBJECT =====
function load(){
  let box = document.getElementById("subjects");
  box.innerHTML="";

  subjects.forEach(s=>{
    let percent = Math.round(s.done.filter(x=>x).length / s.done.length *100);

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${s.name}</h3>
      <p>${percent}%</p>
      <div class="progress"><div class="bar" style="width:${percent}%"></div></div>
    `;

    div.onclick=()=>openLesson(s);
    box.appendChild(div);
  });

  drawChart();
}

// ===== LESSON =====
function openLesson(s){
  document.getElementById("lessonModal").classList.remove("hidden");
  document.getElementById("modalTitle").innerText=s.name;

  let list=document.getElementById("lessonList");
  list.innerHTML="";

  s.lessons.forEach((l,i)=>{
    let d=document.createElement("div");

    d.innerHTML=`
      <h3>${l.title}</h3>
      <ul>${l.summary.map(x=>`<li>${x}</li>`).join("")}</ul>
      <p>${l.example}</p>
    `;

    let btn=document.createElement("button");
    btn.innerText="📝 Làm bài";
    btn.onclick=()=>startQuiz(s);

    let cb=document.createElement("input");
    cb.type="checkbox";
    cb.checked=s.done[i];
    cb.onchange=()=>{ s.done[i]=cb.checked; load(); };

    d.appendChild(btn);
    d.appendChild(cb);
    list.appendChild(d);
  });
}

document.getElementById("closeLesson").onclick=()=>{
  document.getElementById("lessonModal").classList.add("hidden");
};

// ===== QUIZ =====
let current, currentSub, selected=-1;

function startQuiz(s){
  currentSub=s;
  let list=quizzes[s.name];
  current=list[Math.floor(Math.random()*list.length)];

  selected=-1;
  document.getElementById("quizModal").classList.remove("hidden");
  document.getElementById("quizQ").innerText=current.q;

  let box=document.getElementById("quizOps");
  box.innerHTML="";

  current.a.forEach((o,i)=>{
    let div=document.createElement("div");
    div.className="option";
    div.innerText=o;
    div.onclick=()=>{
      selected=i;
      document.querySelectorAll(".option").forEach(x=>x.classList.remove("active"));
      div.classList.add("active");
    };
    box.appendChild(div);
  });
}

document.getElementById("submitQuiz").onclick=()=>{
  if(selected===-1){ alert("Chọn đáp án"); return; }

  currentSub.total++;
  if(selected===current.c){
    currentSub.correct++;
    alert("✅ Đúng\n"+current.e);
  }else{
    alert("❌ Sai\n"+current.e);
  }

  // AI gợi ý
  let acc = Math.round(currentSub.correct/currentSub.total*100);
  if(acc < 50){
    alert("🤖 AI: Bạn yếu phần này, nên học lại bài!");
  } else {
    alert("🤖 AI: Bạn đang làm tốt, tiếp tục nhé!");
  }

  document.getElementById("quizModal").classList.add("hidden");
};

// ===== CHART =====
let chart;
function drawChart(){
  let ctx=document.getElementById("chart");

  let data=subjects.map(s=>{
    return Math.round(s.done.filter(x=>x).length / s.done.length *100);
  });

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:"bar",
    data:{
      labels:subjects.map(s=>s.name),
      datasets:[{label:"Tiến độ %",data}]
    }
  });
}

// ===== START =====
load();