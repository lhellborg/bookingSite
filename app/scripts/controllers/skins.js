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

  	// vm.products = $firebaseObject(myFirebaseRef);
  	vm.products = $firebaseArray(myFirebaseRef);
  	console.log(vm.products)

// used the first time to set some data in firebase

	// myFirebaseRef.set({
	// 	1 : {'productName':'lamb1','nr':'1','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	2 : {'productName':'lamb2','nr':'2','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	3 : {'productName':'lamb3','nr':'3','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	4 : {'productName':'lamb4','nr':'4','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	5 : {'productName':'lamb3','nr':'5','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	6 : {'productName':'lamb6','nr':'6','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	7 : {'productName':'lamb7','nr':'7','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	8 : {'productName':'lamb8','nr':'8','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	9 : {'productName':'lamb9','nr':'9','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	10 : {'productName':'lamb10','nr':'10','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	11 : {'productName':'lamb11','nr':'11','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	12 : {'productName':'lamb12','nr':'12','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	13 : {'productName':'lamb13','nr':'13','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	14 : {'productName':'lamb14','nr':'14','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	15 : {'productName':'lamb15','nr':'15','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// });


	vm.range = function(min, max, step) {
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) {
	        input.push(i);
	    }
	    return input;
	};

	vm.selectedProduct = null; //the selected product info
	vm.reservationForm = {}; //the form that saves the input locally
	vm.messageToBuyer = ""; //message shown when the reserved button is clicked
	vm.showButton = true; //linked to the reserved button in the modal which will disappear when clicked

	vm.focusedElementBeforeModal;

	var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
	vm.focusableElements;
	vm.firstTabStop;
	vm.lastTabStop;


	vm.modalToggle = function(details, $event) {
		$("#reserveItems").attr("aria-hidden", "true"); //unable to interact with the items on the main page
		vm.focusedElementBeforeModal = document.activeElement; //save the current focused element to get back to when closing the modal
		vm.selectedProduct = details;
		vm.messageToBuyer = "";
		vm.showButton = true;
		$("#reserveModal").modal('show');
		$("#reserveModal").attr("aria-hidden", "false"); //enable voiceover interaction with the modal window
		$(".modal").bind('keydown', trapTabKey); //listen for and trap the keyboard
		vm.focusableElements = $(".modal").find(focusableElementsString); //get all focusable elements in modal
		vm.focusableElements = Array.prototype.slice.call(vm.focusableElements);
		vm.firstTabStop = vm.focusableElements[1];
		vm.lastTabStop = vm.focusableElements[vm.focusableElements.length - 1];
		vm.firstTabStop.focus();
	};

	function trapTabKey(e) {
		if(e.keyCode === 9) { //TAB key press
			if(e.shiftKey) { //shift TAB key press
				if(document.activeElement === vm.firstTabStop) {
					e.preventDefault();
					vm.lastTabStop.focus()
				}
			} else { //TAB
				if(document.activeElement === vm.lastTabStop) {
					e.preventDefault();
					vm.firstTabStop.focus();
				}
			}
		}
		if(e.keyCode === 27) { //Esc key
			vm.closeModal();
		}
	};

	vm.closeModal = function() {
		$("#reserveModal").modal('hide');
		$("#reserveModal").attr("aria-hidden", "true"); //unable voiceover interaction with the modal window
		$("#reserveItems").attr("aria-hidden", "false"); //enable voiceover interaction with the items on the main page
		vm.focusedElementBeforeModal.focus();
	}

	vm.submitForm = function(selectedProduct) {

		var valid = validateInput(vm.reservationForm.name, vm.reservationForm.email) //check all the required fields

		if (valid) {
			if (vm.selectedProduct.sold) {
				vm.messageToBuyer = "Sorry, this skin is already booked.";
			} else {
				vm.selectedProduct = selectedProduct;
				vm.selectedProduct.reservedByName = vm.reservationForm.name;
				vm.selectedProduct.reservedByEmail = vm.reservationForm.email;
				vm.selectedProduct.sold = true;
				vm.products.$save(vm.selectedProduct).then(function(ref) {
					ref.key() === vm.selectedProduct.$id;
					vm.messageToBuyer = "Good Choice " + vm.selectedProduct.reservedByName + "! We have reserved this skin for you.";
					vm.showButton = false;
					$(".closeBtn").focus();
					vm.focusedElementBeforeModal = $(".infoBox"); //get focus back to the side after reserved a product
				}, function(error) {
					console.log("The read failed: " + errorObject.code);
					alert("Sorry, could not get the bookings now, try again later :-)")
				});

			}
		} else {
			vm.messageToBuyer = "Please fill in all fields";
		}

	}



	// 	}, function (errorObject) {
	// 	  console.log("The read failed: " + errorObject.code);
	// 	  alert("Sorry could not get the bookings, try again later :-)");
	// 	});
	// };



		// Since a required field that has never been "touched" will not show any error message, each input that is required has a class "accountRequired" that can be checked to see that the value is not empty.
	function validateInput(name, email) {

		return name && email;
	}

  });
