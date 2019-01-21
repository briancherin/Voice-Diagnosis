request  = require("request")

const gender = "male";
const birth_year = "1998";

symptomList = [11];

let url = "https://healthservice.priaid.ch/diagnosis?language=en-gb&gender=" + gender + "&year_of_birth=" + birth_year + "&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impja29ibEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjE4MTMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIxMDgiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiMTAwIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiQmFzaWMiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xhbmd1YWdlIjoiZW4tZ2IiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDk5LTEyLTMxIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwc3RhcnQiOiIyMDE5LTAxLTE5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNTQ4MTA5MTcwLCJuYmYiOjE1NDgxMDE5NzB9.2-FvCmTV_Ze8r8lNwf05NA-4WoSSuQekuFDlr5VdyV4";
url += "&symptoms=[" + symptomList + "]";

return new Promise ((resolve) => {
	
request(url, {json: true}, (err, res, body) => {
	let speakOutput = "";
	if (err) {
		speakOutput = "Something went wrong.";
		console.log(err);
	} else {
		const diagnosis = body[0]["Issue"]["Name"];
		speakOutput = "Here is your diagnosis: " + diagnosis + "..";
	}
	
	 
		//Speak the diagnosis to the user
		
		resolve(console.log(speakOutput))
	
	});
});

