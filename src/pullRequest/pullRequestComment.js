const Comment = require('./../modules/comment');

class PullRequestComment extends Comment {
	static createBody(isValid, greetingMessage, authorSlug, titleValidation, headersValidation, isIssueRefPresent) {
		let commentBody = '';

		commentBody += this.createGreetingMessage(greetingMessage, authorSlug);

		if (!isValid) {
			commentBody += this.HEADER_ERROR_MESSAGE;
			commentBody += this.isTitleEmpty(titleValidation);
			commentBody += this.createHeadersValidationMessage(headersValidation);
			commentBody += this.validateIssueRef(isIssueRefPresent);
		}

		return commentBody;
	}

	static validateIssueRef(isIssueRefPresent) {
		if (!isIssueRefPresent) {
			return '\n:x: Atleast one Issue Reference must be present.';
		}

		return '';
	}
}

module.exports = PullRequestComment;