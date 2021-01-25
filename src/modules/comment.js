class Comment {
	static get HEADER_ERROR_MESSAGE() {
		return '\n:shield: The contribution will remain closed until all the errors mentioned below are resolved:';
	}

	static createGreetingMessage(greetingMessage, authorSlug) {
		return `${greetingMessage} @${authorSlug}\n\n`;
	}

	static isTitleEmpty(titleValidation) {
		if (titleValidation.isEmpty) {
			return '\n:x: Title cannot be empty.';
		}

		return '';
	}

	static createHeadersValidationMessage(headersValidation) {
		let headersValidationMessage = '';

		if (headersValidation.invalidHeaders.length > 0) {
			headersValidationMessage += '\n:x: The issue contains following invalid headers: \n';
			headersValidation.invalidHeaders.forEach(header => headersValidationMessage += ` - ${header.slice(4)}\n`);
		}

		if (headersValidation.remainingHeaders.length > 0) {
			headersValidationMessage += '\n:x: The issue does not contain following headers: \n';
			headersValidation.remainingHeaders.forEach(header => headersValidationMessage += ` - ${header.slice(4)}\n`);
		}

		return headersValidationMessage;
	}
}

module.exports = Comment;