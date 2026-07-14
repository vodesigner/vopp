/* ==========================================================
   My Private AI Prompt Studio
   app.js
   Personal Project Save Version
========================================================== */

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    init
);



function init(){

    bindEvents();

    autoPreview();

    loadProjectList();

    generatePrompt();

}





/* ================= EVENT ================= */


function bindEvents(){


document
.getElementById("generatePrompt")
.addEventListener(
"click",
generatePrompt
);



document
.getElementById("copyPrompt")
.addEventListener(
"click",
copyPrompt
);



document
.getElementById("saveProject")
.addEventListener(
"click",
saveProject
);



document
.getElementById("loadProject")
.addEventListener(
"click",
openProject
);



document
.getElementById("jsonFile")
.addEventListener(
"change",
loadProject
);



document
.getElementById("clearForm")
.addEventListener(
"click",
clearForm
);


   document
.getElementById("saveLocalProject")
.addEventListener(
"click",
saveLocalProject
);

}







/* ================= AUTO ================= */


function autoPreview(){

document
.querySelectorAll(
"input,textarea,select"
)
.forEach(el=>{


el.addEventListener(
"input",
generatePrompt
);


el.addEventListener(
"change",
generatePrompt
);


});


}







/* ================= VALUE ================= */


function val(id){

const el=
document.getElementById(id);

return el ?
el.value.trim()
:
"";

}






function checked(className){

return [

...document.querySelectorAll(
"." + className + ":checked"
)

]
.map(
e=>e.value
);

}








/* ================= DATA ================= */


function collectData(){


return{


project:{


name:val("projectName"),

ai:val("aiType"),

aspect:val("aspectRatio"),

fps:val("fps"),

resolution:val("resolution"),

duration:val("videoDuration")


},



scene:{


number:val("sceneNumber"),

duration:val("sceneDuration"),

location:val("location"),

description:val("locationDescription"),

time:val("time"),

weather:val("weather")


},




subject:{


appearance:val("appearance"),

outfit:val("outfit"),

action:val("action"),

expression:val("expression")


},




camera:{


shot:val("cameraShot"),

angle:val("cameraAngle"),

movement:val("cameraMovement")


},




lighting:{


type:val("lightingType"),

description:val("lightingDescription")


},



style:
checked("styleCheck"),



mainPrompt:
val("mainPrompt"),



negativePrompt:
val("negativePrompt")



};


}







/* ================= PROMPT ================= */


function generatePrompt(){


const d=
collectData();



const prompt=`

PRIVATE AI VIDEO PROMPT


PROJECT

Name:
${d.project.name}

AI Engine:
${d.project.ai}

Format:
${d.project.aspect}
${d.project.fps}fps
${d.project.resolution}
${d.project.duration}s



SCENE

Scene:
${d.scene.number}

Location:
${d.scene.location}

Description:
${d.scene.description}

Time:
${d.scene.time}

Weather:
${d.scene.weather}



SUBJECT

Appearance:
${d.subject.appearance}

Outfit:
${d.subject.outfit}

Action:
${d.subject.action}

Expression:
${d.subject.expression}



CAMERA

Shot:
${d.camera.shot}

Angle:
${d.camera.angle}

Movement:
${d.camera.movement}



LIGHTING

${d.lighting.type}

${d.lighting.description}



STYLE

${d.style.join(", ")}



CREATIVE IDEA

${d.mainPrompt}



NEGATIVE

${d.negativePrompt}


`;



document
.getElementById("promptOutput")
.value =
prompt.trim();


}








/* ================= COPY ================= */


function copyPrompt(){


navigator.clipboard.writeText(

document
.getElementById("promptOutput")
.value

);


alert(
"Prompt copied"
);


}









/* ================= SAVE JSON ================= */


function saveProject(){



const data=
collectData();



data.savedDate =
new Date()
.toISOString();



const fileName =

(data.project.name || "Private_Project")
.replace(
/\s+/g,
"_"
)
+
".json";



const blob =
new Blob(

[
JSON.stringify(
data,
null,
2
)
],

{
type:"application/json"
}

);



const url =
URL.createObjectURL(blob);



const a =
document.createElement("a");


a.href=url;

a.download=fileName;


a.click();



URL.revokeObjectURL(url);


}








/* ================= LOAD ================= */


function openProject(){


document
.getElementById("jsonFile")
.click();


}







function loadProject(e){


const file =
e.target.files[0];


if(!file)
return;



const reader =
new FileReader();



reader.onload=function(){


const data =
JSON.parse(
reader.result
);



restore(data);



generatePrompt();



};



reader.readAsText(file);


}









function restore(data){


if(data.project){

setValue(
"projectName",
data.project.name
);


setValue(
"aiType",
data.project.ai
);


setValue(
"aspectRatio",
data.project.aspect
);


setValue(
"fps",
data.project.fps
);


setValue(
"resolution",
data.project.resolution
);


setValue(
"videoDuration",
data.project.duration
);


}



if(data.scene){


setValue(
"sceneNumber",
data.scene.number
);


setValue(
"location",
data.scene.location
);


setValue(
"locationDescription",
data.scene.description
);


}



if(data.subject){


setValue(
"appearance",
data.subject.appearance
);


setValue(
"outfit",
data.subject.outfit
);


setValue(
"action",
data.subject.action
);


setValue(
"expression",
data.subject.expression
);


}



setValue(
"mainPrompt",
data.mainPrompt
);



setValue(
"negativePrompt",
data.negativePrompt
);



}







function setValue(id,value){


const el =
document.getElementById(id);


if(el && value)
el.value=value;


}








/* ================= CLEAR ================= */


function clearForm(){


document
.querySelectorAll(
"input,textarea"
)
.forEach(el=>{


if(
el.type==="checkbox"
)

el.checked=false;


else

el.value="";


});


generatePrompt();


}


/* ==================================================
   LOCAL STORAGE PROJECT LIBRARY
================================================== */


function saveLocalProject(){


const data = collectData();


data.savedDate =
new Date()
.toLocaleString();



let projects =
JSON.parse(
localStorage.getItem("privateProjects")
)
|| [];



projects.push(data);



localStorage.setItem(

"privateProjects",

JSON.stringify(projects)

);



loadProjectList();


alert(
"Project Saved"
);


}







function loadProjectList(){


const list =
document.getElementById(
"projectList"
);



if(!list)
return;



let projects =
JSON.parse(
localStorage.getItem(
"privateProjects"
)
)
|| [];



if(projects.length===0){

list.innerHTML=
"No saved projects.";

return;

}



list.innerHTML="";



projects.forEach(
(project,index)=>{


const div =
document.createElement(
"div"
);



div.className=
"projectItem";



div.innerHTML=`

<div class="projectName">

${project.project.name || "Untitled Project"}

</div>


<div class="projectDate">

${project.savedDate || ""}

</div>


<div class="projectActions">

<button onclick="loadLocalProject(${index})">

Load

</button>


<button onclick="deleteLocalProject(${index})">

Delete

</button>


</div>

`;



list.appendChild(div);



});


}







function loadLocalProject(index){


let projects =
JSON.parse(
localStorage.getItem(
"privateProjects"
)
);



restore(
projects[index]
);



generatePrompt();


}





function deleteLocalProject(index){


let projects =
JSON.parse(
localStorage.getItem(
"privateProjects"
)
);



projects.splice(
index,
1
);



localStorage.setItem(

"privateProjects",

JSON.stringify(projects)

);



loadProjectList();


}
