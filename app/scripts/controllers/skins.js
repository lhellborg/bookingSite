'use strict';

/**
 * @ngdoc function
 * @name lambSkinsApp.controller:SkinsCtrl
 * @description
 * # SkinsCtrl
 * Controller of the lambSkinsApp
 */
angular.module('lambSkinsApp')
  .controller('SkinsCtrl', function ($firebaseObject, $firebaseArray) {

  	var vm = this;

  	var myFirebaseRef = new Firebase("https://lambskins.firebaseio.com/");

  	vm.products = $firebaseObject(myFirebaseRef);
  	vm.productsArray = $firebaseArray(myFirebaseRef)
  	console.log(vm.productsArray)


// used the first time to set some data in firebase
				//  	myFirebaseRef.set({
				// 	lamb17: {
				// 		nr: 17,
				// 		name: "Linda",
				//  		tel: "",
				// 		email: ""
				// }
				// });

// myFirebaseRef.set({
// 		1 : {
// 			'productName':'lamb1',
// 			'nr':'1',
// 			'reservedByName':"",
// 			"reservedByTel":"",
// 			"reservedByEmail":"",
// 			"sold":false
// 		},
// 		2 : {
// 			'productName':'lamb2',
// 			'nr':'2',
// 			'reservedByName':"",
// 			"reservedByTel":"",
// 			"reservedByEmail":"",
// 			"sold":false
// 		},
// 		3 : {
// 			'productName':'lamb3',
// 			'nr':'3',
// 			'reservedByName':"",
// 			"reservedByTel":"",
// 			"reservedByEmail":"",
// 			"sold":true
// 		}
// 	});

	// vm.products = {
	// 	1 : {
	// 		'productName':'lamb1',
	// 		'nr':'1',
	// 		'name':"",
	// 		"tel":"",
	// 		"email":"",
	// 		"sold":false
	// 	},
	// 	2 : {
	// 		'productName':'lamb2',
	// 		'nr':'2',
	// 		'name':"",
	// 		"tel":"",
	// 		"email":"",
	// 		"sold":false
	// 	},
	// 	3 : {
	// 		'productName':'lamb3',
	// 		'nr':'3',
	// 		'name':"",
	// 		"tel":"",
	// 		"email":"",
	// 		"sold":true
	// 	}
	// };


	myFirebaseRef.orderByChild("nr").on("value", function(snapshot) {
		$('#mainPict').empty();
		vm.products = (snapshot.val());
		console.log(vm.products)

		// for (var i = 1; i < 16; i++) {
		// 	if (obj["lamb" + i]) {
		// 		console.log("lamb " + i + " sold");
		// 		appendLambImgSold(i);
		// 	} else {
		// 		appendLambImg(i);
		// 	}
		// }

	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
		alert("Sorry could not get the database, try again later :-)");
	});


	// function appendLambImg(nr) {
	// 	var lambImg = ('<div class="col-xs-6 col-sm-4 col-md-3 threePic clickable">' +
	// 						'<img class="img-responsive lambImgs clickable" src="images/lamm'+nr+'-small.jpg"  alt="lambskin'+nr+'" onclick="skinsInfo.alertBox('+nr+')">' +
	// 						'<paper-button class="bokBtn clickable" raised ng-click="skinsInfo.alertBox('+nr+')">To booking</paper-button>' +
	// 						'<hr>' +
	// 					'</div>');
	// 	$(".section").append(lambImg);
	// }

	// function appendLambImgSold(nr) {
	// 	var lambImgSold = ('<div class="col-xs-6 col-sm-4 col-md-3 threePicSold">' +
	// 						'<img class="img-responsive" src="images/lamm'+nr+'-small.jpg"  alt="lambskin'+nr+'">' +
	// 						'<paper-button class="bokBtn" raised id="soldBtn">Booked</paper-button>' +
	// 						'<hr>' +
	// 					'</div>');
	// 	$(".section").append(lambImgSold);
	// }


	vm.range = function(min, max, step) {
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) {
	        input.push(i);
	    }
	    return input;
	};

	vm.alertBox = function(nr) {
		$("#lamm" + nr).modal("show");
	};


	vm.submitForm = function(nr) {

		myFirebaseRef.on("value", function(snapshot) {
		 	console.log(snapshot.val());

			var storVal = "storageValue" + nr;
			document.getElementById(storVal).innerHTML = "";

			var resName = "reserveratNamn" + nr;
			var resMail = "reserveratMail" + nr;
			var name = document.getElementById(resName).value;
			var mail = document.getElementById(resMail).value;

			var reservedSkin = skinReservedTest(nr);

			var valid = validateInput(name, mail); //check all the required fields

		    if (valid) {
		    	if (reservedSkin) {
		    		document.getElementById(storVal).innerHTML = "Sorry, this skin is already booked";
		    	} else {
				var firebaseRefChild = "lamb" + nr;
				var objectToInsert = {};
				objectToInsert[firebaseRefChild] = {
					nr: nr,
					reservedByName: name,
					reservedByEmail: mail
				};
				myFirebaseRef.update(objectToInsert);
				document.getElementById(storVal).innerHTML = "Good Choice! We have reserved this skin for you.";
				var resBtn = "reserveBtn" + nr;
				var reserveBtn = document.getElementById(resBtn);
				reserveBtn.remove();
				}
			}
			else {
				document.getElementById(storVal).innerHTML= "Please fill in all fields"; //when some required fields are missing
			}

		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		  alert("Sorry could not get the bookings, try again later :-)");
		});
	};

	function skinReservedTest(nr) {
		var skinNr = nr+ "/name";
		var reservedSkin = false;
		myFirebaseRef.child(skinNr).on("value", function(snapshot) {
	  		reservedSkin = snapshot.val();
		});
		return reservedSkin;
	}

		// Since a required field that has never been "touched" will not show any error message, each input that is required has a class "accountRequired" that can be checked to see that the value is not empty.
	function validateInput(name, mail) {
		var isValid = true;

		if (name === "" ) {
			return isValid = false;
		} else if (mail === "") {
			return isValid = false;
		}
		return isValid;
	}

  });
