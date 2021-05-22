shifts = {"0": ["Monday", "Tuesday", "Wednesday", "Thursday",  "Friday", "Saturday", "Sunday"]}

function clearStorage() {
	localStorage.clear();
}

function loadShifts(newPage) {	
	if (localStorage.getItem("shifts") !== null) {
		shifts = JSON.parse(localStorage.getItem("shifts"));
	};

	rows = Object.keys(shifts);
	rowHtml = "";
	for (const row of rows) {
		rowHtml += "<tr>";

		x = 0;
		for (const col of shifts[row]) {

			if (row === "0" || col === " ") {
				rowHtml += `<td id=$${x}${row}">${col}</td>`;		
			}
			else if (window.location.pathname === "/schedule/"){
				rowHtml += `<td class="pointer" id=$${x}${row} onclick="removeShift(event)">${col}</td>`;		
			}
			else if (window.location.pathname === "/schedule/participants/"){
				rowHtml += `<td id=$${x}${row} class="pointer"onclick="addUnavailableShift(event)">${col}</td>`
			}
		
			x += 1;
		}

		x = 0;
		rowHtml += "</tr>";
	}

	if (newPage) {
		return rowHtml
	}
	else {
 		document.getElementById('tableBody').innerHTML =  rowHtml;
 		x = document.getElementById('tableBody');
 	}
}

function removeShift(event) {
	event.preventDefault();
	id = event.target.id;

	col = parseInt(id[1]);
	row = parseInt(id.slice(2));

	shifts[row][col] = " ";
	loadShifts();
}

function addShift(event) {
	event.preventDefault();
	
	day = document.getElementById('day').value;
	time = document.getElementById('time').value;
	time = moment(time, "HH:mm").format('h:mm A');

	rows = Object.keys(shifts);
	placed = false

	for (const row of rows) {
		if (shifts[row][day] === " " && !placed) {
			shifts[row][day] = time;
			placed = true;
		}
	}

	if (!placed) {
		row = [" ", " ", " ", " ", " ", " ", " ",];
		row[day] = time;
		new_row = rows.length;
		shifts[`${new_row}`] = row;
	}


	loadShifts();	
}

function loadParticipants() {
	shifts = JSON.stringify(shifts);
	localStorage.setItem("shifts", shifts);
	location.href='participants/';
}