const fetch = require('node-fetch');

class TemplateValidator {
	constructor(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody) {
		this._owner = owner;
		this._repo = repo;
		this._octokit = octokit;
		this._core = core;
		this._templatePath = templatePath;

		this._title = contributionTitle;
		this._body = contributionBody;
	}

	async getTemplate() {
		try {
			const response = await this._octokit.repos.getContent({
				owner: this._owner,
				repo: this._repo,
				path: this._templatePath
			});

			const fileUrl = await response.data.download_url;

			const res = await fetch(fileUrl);
			const result = await res.text();

			return result.toString();
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	isTitleEmpty() {
		return (this._title.length == 0);
	}

	isBodyEmpty() {
		return (this._body.length == 0);
	}

	getHeaders(text) {
		try {
			const lines = text.split(/\r?\n/);
			let headers = [];

			lines.forEach(line => {
				if (line.startsWith('###')) {
					headers.push(line);
				}
			});

			if (headers.length == 0) {
				throw new Error('Atleast one header is required.');
			}

			return headers;
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	validateHeaders(templateHeaders, contributionHeaders) {
		let invalidHeaders = [];
		let remainingHeaders = [...templateHeaders];

		contributionHeaders.forEach((header) => {
			if (remainingHeaders.includes(header)) {
				const index = remainingHeaders.indexOf(header);
				remainingHeaders.splice(index, 1);
			} else {
				invalidHeaders.push(header);
			}
		});

		return {
			invalidHeaders,
			remainingHeaders
		};
	}
}

module.exports = TemplateValidator;