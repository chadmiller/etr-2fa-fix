/* E*trade does 2FA badly. You're supposed to get a code and append it
to the text password field. That is hard to do right and messes with 
password managers.

Instead, clone the password field and tack it below the password, to 
keep styling the same, and then transform the new field into a 2FA-code
field. Separate fields are nice to use.

On submit, concatenate together pw+code as E*trade expects it to be.
*/

console.info("e* 202009-02")

lf = document.getElementById('log-on-form');

twofa_label = lf.querySelector("input[id=twofakey]");
/* Don't double-edit the page. Extensions are funny. */
if (twofa_label == null) {

	/* The anchor of all the changes. */
	password_input = lf.querySelector("input[name=PASSWORD]");
	console.debug(password_input);

	/* This bit will get the password input, seek upward to get the parent to
	reparent the new 2FA input into. */
	/* There are two styles of log-in. labeled-input and placeholder'd input. */
	if (password_input.getAttribute("placeholder") != null) {
		console.info("passwordinput has a placeholder");
		// This is a form with placeholder labels. Clone shallow.
		password_input.setAttribute("placeholder", password_input.getAttribute("placeholder") + " (only, without 2FA)");
		password_block = password_input.parentElement;
		console.debug(password_block);

		twofa_block = password_block.cloneNode(true);

		twofa_input = twofa_block.querySelector("input[name=PASSWORD]");
		twofa_input.setAttribute("placeholder", "2FA key (optional)");
	} else {
		console.info("passwordinput has no placeholder");
		// This is a form with labels and containing div. Clone deeper.
		password_block = password_input.parentElement.parentElement;
		console.debug(password_block);

		password_label = password_block.querySelector("label");
		console.debug(password_label);
		password_label.textContent += " (only, without 2FA)";

		twofa_block = password_block.cloneNode(true);

		twofa_label = twofa_block.querySelector("label");
		twofa_label.setAttribute("for", "");
		twofa_label.textContent = "2FA key (optional)";
		console.debug(password_label);

		twofa_input = twofa_block.querySelector("input");
		twofa_input.setAttribute("placeholder", "123456");
	}

	console.debug(twofa_input);

	twofa_input.setAttribute("id", "twofakey");
	twofa_input.setAttribute("name", "");
	twofa_input.setAttribute("value", "");
	twofa_input.setAttribute("type", "text");
	twofa_input.setAttribute("pattern", "(|[0-9]{6})"); // 6 numbers or nothin'
	twofa_input.setAttribute("title", "6-digit number from two-factor-auth app; if you don't have 2FA enabled, leave this blank");

	password_block.parentElement.insertBefore(twofa_block, password_block.nextSibling)
	console.info("Injected 2fa input");

	twofa_input.form.onsubmit = function(password_input, twofa_input, current_submit_action) {
		return function(ev) {
			password_input.value += twofa_input.value;
			twofa_input.value = '';  // erase
			if (current_submit_action) {
				console.info("submitting after running inherited action,");
				console.info(ev);
				return current_submit_action(ev);
			}
			console.info("submitting");
			return true;
		}
	}(password_input, twofa_input, twofa_input.form.onsubmit);
}
