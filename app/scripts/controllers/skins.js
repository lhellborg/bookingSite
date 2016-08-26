

/**
 * @ngdoc function
 * @name lambSkinsApp.controller:SkinsCtrl
 * @description
 * # SkinsCtrl
 * Controller of the lambSkinsApp
 */
angular.module('lambSkinsApp')
  .controller('SkinsCtrl', function ($firebaseObject, $firebaseArray, $localStorage, $window, $timeout) {

	'use strict';

  	var vm = this;

  	vm.online = navigator.onLine;
  	vm.products = [];


  	var myFirebaseRef = new Firebase("https://lambskins.firebaseio.com/");

  	// vm.products = $firebaseObject(myFirebaseRef);
  	vm.productsFirebase = $firebaseArray(myFirebaseRef);



  	// if offline use the localstored vm.currentProducts otherwise update the same with data from firebase
  	$window.addEventListener("offline", function() {
    	$timeout(function() {
    		vm.online = false;
    		checkInternetStatus();
    	}, 1);
      });

	$window.addEventListener("online", function() {
		$timeout(function() {
			vm.online = true;
			checkInternetStatus();
		}, 1);
	});

	var checkInternetStatus = function() {
		if (vm.online) {
			$localStorage.productsLocalStorage = vm.productsFirebase; //store the firebase data in localstorage
			vm.products = vm.productsFirebase; // use the dat from firebase

		} else if (!vm.online) {
			vm.products = $localStorage.productsLocalStorage; //use the data stored in localstorage
			//highlight offline message
			//disable the booking function
		}
	};

	checkInternetStatus();
	console.log(vm.products);


// used the first time to set some data in firebase

	// myFirebaseRef.set({
	// 	1 : {'productName':'lamb1','nr':'1','color':'dark','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	2 : {'productName':'lamb2','nr':'2','color':'dark','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	3 : {'productName':'lamb3','nr':'3','color':'dark','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	4 : {'productName':'lamb4','nr':'4','color':'dark','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	5 : {'productName':'lamb3','nr':'5','color':'dark','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	6 : {'productName':'lamb6','nr':'6','color':'medium','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	7 : {'productName':'lamb7','nr':'7','color':'medium','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	8 : {'productName':'lamb8','nr':'8','color':'medium','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	9 : {'productName':'lamb9','nr':'9','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	10 : {'productName':'lamb10','nr':'10','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	11 : {'productName':'lamb11','nr':'11','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	12 : {'productName':'lamb12','nr':'12','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	13 : {'productName':'lamb13','nr':'13','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	14 : {'productName':'lamb14','nr':'14','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
	// 	15 : {'productName':'lamb15','nr':'15','color':'white','reservedByName':"","reservedByTel":"","reservedByEmail":"","sold":false},
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

	vm.focusedElementBeforeModal = "";

	var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
	vm.focusableElements = "";
	vm.firstTabStop = "";
	vm.lastTabStop = "";

	vm.filterItem = function() { //focus first elememt among the selected items
	     // deferred this because the dom element might not be there yet
	    setTimeout(function() {
	        $(".bokBtn:first").focus();
	    }, 1);
	};



	vm.modalToggle = function(details) {
		$("#reserveItems").attr("aria-hidden", "true"); //unable to interact with the items on the main page
		vm.focusedElementBeforeModal = document.activeElement; //save the current focused element to get back to when closing the modal
		vm.selectedProduct = details;
		$(".modalMessage").css("color", "black");
		vm.messageToBuyer = "I want to reserve this product";
		vm.showButton = true;
		$("#reserveModal").modal('show');
		$("#reserveModal").attr("aria-hidden", "false"); //enable voiceover interaction with the modal window
		$("#reserveModal").bind('keydown', trapTabKey); //listen for and trap the keyboard
		vm.focusableElements = $("#reserveModal").find(focusableElementsString); //get all focusable elements in modal
		vm.focusableElements = Array.prototype.slice.call(vm.focusableElements);
		vm.firstTabStop = vm.focusableElements[1];
		vm.lastTabStop = vm.focusableElements[vm.focusableElements.length - 1];
		vm.firstTabStop.focus();
	};

	vm.modalToggleOffline = function(details) {
		$("#reserveItemsOffline").attr("aria-hidden", "true"); //unable to interact with the items on the main page
		vm.focusedElementBeforeModal = document.activeElement; //save the current focused element to get back to when closing the modal
		vm.selectedProduct = details;
		$("#reserveModalOffline").modal('show');
		$("#reserveModalOffline").attr("aria-hidden", "false"); //enable voiceover interaction with the modal window
		$("#reserveModalOffline").bind('keydown', trapTabKey); //listen for and trap the keyboard
		vm.focusableElements = $("#reserveModalOffline").find(focusableElementsString); //get all focusable elements in modal
		vm.focusableElements = Array.prototype.slice.call(vm.focusableElements);
		vm.firstTabStop = vm.focusableElements[0];
		vm.lastTabStop = vm.focusableElements[0];
		vm.firstTabStop.focus();
	};

	function trapTabKey(e) {
		if(e.keyCode === 9) { //TAB key press
			if(e.shiftKey) { //shift TAB key press
				if(document.activeElement === vm.firstTabStop) {
					e.preventDefault();
					vm.lastTabStop.focus();
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
	}

	vm.closeModal = function() {
		$("#reserveModal").modal('hide');
		$("#reserveModal").attr("aria-hidden", "true"); //unable voiceover interaction with the modal window
		$("#reserveItems").attr("aria-hidden", "false"); //enable voiceover interaction with the items on the main page
		vm.focusedElementBeforeModal.focus();
	};

	vm.submitForm = function(selectedProduct) {

		var valid = validateInput(vm.reservationForm.name, vm.reservationForm.email); //check all the required fields

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
					$(".modalMessage").css({"color": "blue", "font-size": "small"});
					vm.messageToBuyer = "Good Choice " + vm.selectedProduct.reservedByName +
						"! We will contact you on " + vm.selectedProduct.reservedByEmail +".";
					vm.showButton = false;
					$(".closeBtn").focus();
					vm.focusedElementBeforeModal = $(".title"); //get focus back to the side after reserved a product
				}, function(error) {
					console.log("The read failed: " + error.code);
					alert("Sorry, could not get the bookings now, try again later :-)");
				});

			}
		} else {
			$(".modalMessage").css("color", "red");
			vm.messageToBuyer = "Please fill in all fields";
		}

	};


		// Since a required field that has never been "touched" will not show any error message, each input that is required has a class "accountRequired" that can be checked to see that the value is not empty.
	function validateInput(name, email) {
		return name && email;
	}

  });
