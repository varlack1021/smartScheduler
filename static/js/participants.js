var temp = {}
var currName = "";
var currUnavailableShifts = [];
var name = null;

function addUnavailableShift(event){
	event.preventDefault();
	let id = event.target.id;

	let col = parseInt(id[1]);
	let row = parseInt(id.slice(2));

	let time = shifts[row][col];
	let day = shifts[0][col];

	if (day === "Thursday") {
		day = "R";
	}
	else {
		day = day[0];
	}

	let shift = `${day}-${time}`
	let selectedShiftHtml = `<div class="fit-content w3-col">${shift}<span class="close w3-circle w3-border">x</span> </div>`;
	let unavailableShiftsElement = document.getElementById("unavailable");
	let unavailableShiftsElementChildren = unavailableShiftsElement.children;

	currUnavailableShifts.push(`${shift}`);
	unavailableShiftsElement.innerHTML += selectedShiftHtml;

	addRemoveEventListener(unavailableShiftsElement);
	console.log(name);

}

function addRemoveEventListener(unavailableShiftsElement) {
	let unavailableShiftsElementChildren = unavailableShiftsElement.children;
	
	for (i = 0; i < unavailableShiftsElementChildren.length; i++) {
		unavailableShiftsElementChildren[i].addEventListener("click", function() {
		this.style.display = "none"; 
		let index = currUnavailableShifts.indexOf(this.innerText);
		if (index === -1) {
			currUnavailableShifts.splice(index, 1);
			}
		});
	}
}

function editParticipant(element) {
	let index = element.parentNode.parentNode.id
	let nameElement = document.getElementById("name");
	let unavailableShiftsElement = document.getElementById("unavailable");

	name = element.parentNode.parentNode.children[0].innerHTML;
	nameElement.value = name;
	unavailableShiftsElement.innerHTML = "";
	currUnavailableShifts = temp[name];

	for (i = 0; i < temp[name].length; i++ ) {
		let shift = temp[name][i];
		let selectedShiftHtml = `<div class="fit-content w3-col">${shift}<span class="close w3-circle w3-border">x</span> </div>`;
		unavailableShiftsElement.innerHTML += selectedShiftHtml;	
	}

	addRemoveEventListener(unavailableShiftsElement);
}

function updateParticipantList() {
	if (name !== document.getElementById("name").value && name !== "null") {
	    Object.defineProperty(temp, document.getElementById("name").value,
        Object.getOwnPropertyDescriptor(temp, name));
    	delete temp[name];	
	}

	let unavailable = document.getElementById("unavailable").innerHTML;
	let id = currUnavailableShifts.length - 1;
	let participantListHTML = "";
	
	name = document.getElementById("name").value;
	temp[name] = currUnavailableShifts;

	for (let name in temp) {
		participantListHTML += 
		`
			<div id=${id}>
			<li style="float: left; list-style: outside none none; width: 30%; padding-right: 10vh">${name}</li>
	    	<li style="float: left; list-style: outside none none; width: 50%;">${temp[name].join(",")}</li>
	    	<li style="float: left; list-style: outside none none; width: 10%;">	
	    		<button class="w3-button w3-teal w3-margin-left" onclick="editParticipant(this)">Edit</button>
			</li>
	        <li style="float: left; list-style: outside none none; width: 100%;"> <br></li>
	        </div>
		`
	}

	document.getElementById('participantList').innerHTML = participantListHTML;
	document.getElementById("name").value = "";
	document.getElementById("unavailable").innerHTML = ""
	
	currUnavailableShifts = [];
	name = "null";
}

function makeSchedule() {
	body = {shifts: shifts, names: temp};

	const requestOptions = {
	method: "POST",
  	"Content-Type": "application/json",
  	body: JSON.stringify(body),
	};

	fetch('http://localhost:8000/schedule/makeSchedule/', 
	requestOptions).then(response => {
		var completed;
		var color;

		for (var pair of response.headers.entries()) {
			if (pair[0] == "completed") {
				completed = pair[1];
			}
		}

		if (completed === "True") {
			color = "w3-teal";	
		} else {
			color = "w3-red";
		}

		response.text().then(text => {
			document.getElementById("steps").outerHTML += `<div class='w3-panel w3-margin ${color}'><p>${text}</p></div>`
		});
	});
		
}
