

/* ============  Cancel draggable links and images  ============ */


(function() {

	var links = document.querySelectorAll("a, img");

	Array.prototype.slice.call(links, 0).forEach(function(elem) {
		elem.setAttribute("draggable", "false");
	});

}());


/*============  Append Current Year ============ */


(function() {
	
	document.querySelector(".current-year").innerText = new Date().getFullYear();

}());


/* ============  Scroll to top page ============ */


(function() {
 
	var btnScrollTop = document.querySelector(".btn-scroll-top");
	
	window.addEventListener("scroll", function() {
		if (window.pageYOffset !== 0) {
			btnScrollTop.classList.add("activated");
		} else {
			btnScrollTop.classList.remove("activated");
		}
	});

	btnScrollTop.addEventListener("click", function(e) {
		e.preventDefault();
		$("html, body").animate({scrollTop: 0}, 1000, "swing");
	});

}());


/* ============  Mobile nav  ============ */


(function() {

	function activateMobileNav() {
		btnOpenNav.classList.add("activated");
		mobileNav.classList.add("activated");
	}

	function deactivateMobileNav() {
		btnOpenNav.classList.remove("activated");
		mobileNav.classList.remove("activated");
	}

	var btnOpenNav = document.querySelector(".btn-open-nav"),
		mobileNav = document.querySelector(".mobile-nav"),
		overlay = document.querySelector(".overlay");

	btnOpenNav.addEventListener("click", function() {
		if (!btnOpenNav.classList.contains("activated")) {
			activateMobileNav();
			activateOverlay();
		} else {
			deactivateMobileNav();
			deactivateOverlay();
		}
	});

	overlay.addEventListener("click", function() {
		deactivateMobileNav();
	});

}());


/* ============  Form ============ */


(function() {

	function validate(inputFirstname, inputLastname, inputEmail, textareaMessage) {
		var errors = [],
			data;
		
		inputFirstname.value = inputFirstname.value.trim();

		if (inputFirstname.value.length === 0) {
			errors.push("Поле имени не заполнено.");
		} else {
			if (inputFirstname.value.search(/\s/) !== -1) {
				errors.push("Имя не должно содержать пробельных символов.");
			}
			if (inputFirstname.value.search(/[<>]/) !== -1) {
				errors.push("Имя не должно содержать символов \"<\" или \">\".");
			}
			if ((inputFirstname.value.length < 3) || (inputFirstname.value.length > 32)) {
				errors.push("Длина имени должна быть от 3 символов (включительно) до 32 символов (включительно).");
			}
		}

		inputLastname.value = inputLastname.value.trim();
		if (inputLastname.value.length === 0) {
			errors.push("Поле фамилии не заполнено.");
		} else {
			if (inputLastname.value.search(/\s/) !== -1) {
				errors.push("Фамилия не должна содержать пробельных символов.");
			}
			if (inputLastname.value.search(/[<>]/) !== -1) {
				errors.push("Фамилия не должна содержать символов \"<\" или \">\".");
			}
			if ((inputLastname.value.length < 3) || (inputLastname.value.length > 32)) {
				errors.push("Длина фамилии должна быть от 3 символов (включительно) до 32 символов (включительно).");
			}
		}

		inputEmail.value = inputEmail.value.trim();
		if (inputEmail.value.length === 0) {
			errors.push("Поле e-mail не заполнено.");
		} else {
			if (inputEmail.value.search(/\b[a-z0-9_\-\.]+\@[a-z0-9_\-\.]+\.[a-z]{2,5}\b/i) === -1) {
				errors.push("e-mail заполнен не корректно.");
			}
		}

		textareaMessage.value = textareaMessage.value.trim();
		if (textareaMessage.value.length === 0) {
			errors.push("Поле сообщения не заполнено.");
		} else {
			if (textareaMessage.value.search(/[<>]/) !== -1) {
				errors.push("Сообщение не должно содержать символов \"<\" или \">\".");
			}
			if ((textareaMessage.value.length < 3) || (textareaMessage.value.length > 32)) {
				errors.push("Длина сообщения должна быть от 3 символов (включительно) до 32 символов (включительно).");
			}
		}

		if (errors.length !== 0) {
			activateModal("Error", errors);
			return false;
		}

		data = {
			input_firstname: inputFirstname.value,
			input_lastname: inputLastname.value,
			input_email: inputEmail.value,
			textarea_message: textareaMessage.value,
		};
		
		return data;
	}

	function send(data) {
		$.post("mail.php", {form_contacts: data})
			.done(function(response) {
				if (response.trim() === "Success") {
					activateModal("Success", "Спасибо. Ваше сообщение доставлено. Мы свяжемся с Вами в ближайшее время.");
					
				} else {
					activateModal("Error", "Сервер не обработал сообщение.");
				}
			})
			.fail(function() {
				activateModal("Error", "Нет соединения с сервером. Попробуйте зайти позже.");
			});

		contactsForm.reset();
	}

	var contactsForm = document.querySelector(".contacts-form"),
		inputFirstname = contactsForm.querySelector(".input-firstname"),
		inputLastname = contactsForm.querySelector(".input-lastname"),
		inputEmail = contactsForm.querySelector(".input-email"),
		textareaMessage = contactsForm.querySelector(".textarea-message"),
		btnSend = contactsForm.querySelector(".btn-send");

	btnSend.addEventListener("click", function() {
		var data = validate(inputFirstname, inputLastname, inputEmail, textareaMessage);

		if (data) {
			send(data);
		}
	});

}());


/* ============  Modal ============ */


(function() {

	var modal = document.querySelector(".modal"),
		btnCloseModal = modal.querySelector(".btn-close"),
		btnOkModal = modal.querySelector(".btn-ok"),
		overlay = document.querySelector(".overlay");

	btnCloseModal.addEventListener("click", function(e) {
		deactivateModal();
	});

	btnOkModal.addEventListener("click", function(e) {
		deactivateModal();
	});

	overlay.addEventListener("click", function() {
		deactivateModal();
	});

}());

function activateModal(state, message) {
	var modal = document.querySelector(".modal"),
		modalTitle = document.querySelector(".modal .header .title"),
		modalText = document.querySelector(".modal .content .text");

	modal.classList.add("activated");
	activateOverlay();

	if (state === "Error") {
		modalTitle.innerHTML = "Ошибка";
		modalTitle.style.color = "red";
	}
	if (state === "Success") {
		modalTitle.innerHTML = "Сообщение успешно отправлено";
		modalTitle.style.color = "green";
	}	
	if (!Array.isArray(message)) {
		modalText.innerHTML = message;
	} else {
		modalText.innerHTML = message.join("<br><br>");
	}
}

function deactivateModal() {
	var modal = document.querySelector(".modal");
	modal.classList.remove("activated");
	deactivateOverlay();
}


/* ============  Overlay ============ */


function activateOverlay() {
	var html = document.querySelector("html"),
		body = document.querySelector("body"),
		overlay = document.querySelector(".overlay");
	
	overlay.classList.add("activated");
}

function deactivateOverlay() {
	var html = document.querySelector("html"),
		body = document.querySelector("body"),
		overlay = document.querySelector(".overlay");

	overlay.classList.remove("activated");		
}

(function() {

	var overlay = document.querySelector(".overlay");

	overlay.addEventListener("click", function() {
		deactivateOverlay();
	});

}());





