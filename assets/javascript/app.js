$(document).ready(function(){

var config = {
	apiKey: "AIzaSyCDNmNcd-aKO4ptcAy039KWaN972X4i4sI",
    authDomain: "train-d5c76.firebaseapp.com",
    databaseURL: "https://train-d5c76.firebaseio.com/",
    storageBucket: "train-d5c76.appspot.com",
    messagingSenderId: "120833475327"
  };
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function() {


	var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();


	database.ref().push({
		name: name,
		dest: dest,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	
	$("input").val('');
    return false;
});


database.ref().on("child_added", function(childSnapshot){
	
	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + dest);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);
	


	var freq = parseInt(freq);
	
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment().format('HH:mm'));
	
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("DATE CONVERTED: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("TRAIN TIME : " + trainTime);
	
	 
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	
	var tRemainder = tDifference % freq;
	console.log("TIME REMAINING: " + tRemainder);
	
	var minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
	
$('#currentTime').text(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});



}); 