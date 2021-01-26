const TemplateValidator = require('./../modules/templateValidator');

class PullRequestTemplateValidator extends TemplateValidator {
	constructor(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody) {
		super(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody);
	}

	async validate() {
		try {
			this._template = await this.getTemplate();

			this._templateHeaders = this.getHeaders(this._template);
			this._contributionHeaders = this.getHeaders(this._body);

			this._headersValidation = this.validateHeaders(this._templateHeaders, this._contributionHeaders);

			this._isIssueRefPresent = this.isIssueRefPresent();

			return {
				isValid: this.isValid(),
				titleValidation: {
					isEmpty: this.isTitleEmpty()
				},
				headersValidation: this._headersValidation,
				isIssueRefPresent: this._isIssueRefPresent
			};
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	isValid() {
		if (this.isTitleEmpty()) {
			return false;
		}

		if (this._headersValidation.remainingHeaders.length > 0 || this._headersValidation.invalidHeaders.length > 0) {
			return false;
		}

		if (!this._isIssueRefPresent) {
			return false;
		}

		return true;
	}

	isIssueRefPresent() {
		const issueRefRegex = new RegExp(/#[0-9]+[\n\r\s]+/gm);

		console.log('body =>', this._body);
		console.log('regex test =>', issueRefRegex.test(this._body));
		console.log('regex test =>', this._body.match(/#[0-9]+[\n\r\s]+/gm));
		console.log('regex test =>', this._body.match(/#[0-9]+/gm));


		return issueRefRegex.test(this._body);
	}
}

module.exports = PullRequestTemplateValidator;