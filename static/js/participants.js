var temp = {}
var currName = "";

function addUnavailableShift(event){
	event.preventDefault();
	let id = event.target.id;

	let col = parseInt(id[1]);
	let row = parseInt(id.slice(2));

	let shift = shifts[row][col];
	let day = shifts[0][col];
	if (day === "Thursday") {
		day = "R";
	}
	else {
		day = day[0];
	}
	document.getElementById("unavailable").innerHTML += `${day}-${shift}, `
}

function updateParticipantList(){
	let name = document.getElementById("name").value;
	let unavailable = document.getElementById("unavailable").innerHTML;

	temp[name] = unavailable;
	listHTML = `<li style="float: left; list-style: outside none none; width: 20%; padding-right: 10vh">${name}</li>
    	<li style="float: left; list-style: outside none none; width: 80%;">${unavailable}</li>
        <li style="float: left; list-style: outside none none; width: 100%;"> <br></li>
	`

	document.getElementById('participantList').innerHTML += listHTML;
	document.getElementById("name").value = "";
	document.getElementById("unavailable").innerHTML = ""
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
			color = "w3-gray";	
		} else {
			color = "w3-red";
		}

		response.text().then(text => {
			document.getElementById("steps").outerHTML += `<div class='w3-panel w3-margin ${color}'><p>${text}</p></div>`
		});
	});
		
}
