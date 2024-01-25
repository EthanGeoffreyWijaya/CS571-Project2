let sinfo = [];
/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
	return studs.map(stud => buildStudentHtml(stud)).join("\n");
}

/**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
function buildStudentHtml(stud) {
	let html = `<div class="col-xs-12" style = "margin:10px;">`;
	html += `<h2>${stud.name.first} ${stud.name.last}</h2>`;
	html += 
	`<p style ="margin : 25px; color : gray;"><span style="color:black">From Wisconsin:</span>     ${(stud.fromWisconsin)? 'Yes' : 'No'}
	<br><span style="color:black">Major:</span>               ${stud.major}
	<br><span style="color:black">Credits taken:</span>       ${stud.numCredits}
	<br><span style="color:black">Number of interests:</span> ${stud.interests.length}
	<br><span style="color:black">Interests:</span><ul style="margin : 25px; color : gray;">`;
	stud.interests.forEach(obj => {html+= `<li>${obj}</li>`});
	html += `</ul>`;
	html += `</p>`;
	html += `</div>`;
	return html;
}

function handleSearch(e) {
	e.preventDefault();
	let sname = document.getElementById('search-name').value.toLowerCase().trim();
	let smajor = document.getElementById('search-major').value.toLowerCase().trim();
	let sinterest = document.getElementById('search-interest').value.toLowerCase().trim();

	console.log("sname: " + sname + "\nsmajor: " + smajor + "\nsinterest: " + sinterest);

	let results = sinfo.filter(obj => {
		if ((sname === "" || (obj.name.first + " " + obj.name.last).toLowerCase().includes(sname))
		&& (smajor === "" || obj.major.toLowerCase().includes(smajor))
		&& (sinterest === "" || obj.interests.some(i => i.toLowerCase().includes(sinterest))))
		{
			return true;
		} else {
			return false;
		}
	});
	
	document.getElementById('students').innerHTML = buildStudentsHtml(results);
	document.getElementById('num-results').innerText = results.length;
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
document.getElementById("students").className = 'row';

fetch(`https://cs571.org/api/f23/hw2/students`, {
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})
.then(response => response.json())
.then(data => {
	console.log(data);
	document.getElementById('num-results').innerText = data.length;
	document.getElementById('students').innerHTML = buildStudentsHtml(data);
	sinfo = [...data];
})