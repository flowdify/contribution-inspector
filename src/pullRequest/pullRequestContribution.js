const Contribution = require('./../modules/contribution');
const PullRequestTemplateValidator = require('./pullRequestTemplateValidator');
const PullRequestComment = require('./pullRequestComment');
const LabelsManager = require('../modules/labelsManager');

class PullRequest extends Contribution {
	constructor(core, payload, octokit, owner, repo) {
		super(core, payload, octokit, owner, repo);
	}

	get LABELS() {
		return [
			{
				name: 'Small Change :shield:',
				description: 'PR with small change',
				color: '008000'
			},
			{
				name: 'Medium Change :shield:',
				description: 'PR with medium change',
				color: 'ffff00'
			},
			{
				name: 'Large Change :shield:',
				description: 'PR with large change',
				color: 'ff0000'
			}
		];
	}

	get TEMPLATE_PATH() {
		return '.github/PULL_REQUEST_TEMPLATE.md';
	}

	get INPUTS() {
		return {
			greetingMessage: this._core.getInput('pull-request--greeting-message'),
			pullRequestSmallSize: this._core.getInput('pull-request--size-small'),
			pullRequestMediumSize: this._core.getInput('pull-request--size-medium'),
			pullRequestLargeSize: this._core.getInput('pull-request--size-large'),
			isOneCommitPerPREnanbledForSmallPRs: this._core.getInput('pull-request--one-commit-per-pr-for-small-pull-requests')
		};
	}

	get linesChanged() {
		return this._payload.additions + this._payload.deletions;
	}

	get isMergable() {
		return this._payload.mergable;
	}

	get numberOfCommits() {
		return this._payload.commits;
	}

	async addRelevantSizeLabel() {
		try {
			if (this.linesChanged <= this.INPUTS.pullRequestSmallSize) {
				await this.addLabels([this.LABELS[0].name]);
			} else if (this.linesChanged <= this.INPUTS.pullRequestMediumSize) {
				await this.addLabels([this.LABELS[1].name]);
			} else {
				await this.addLabels([this.LABELS[2].name]);
			}
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	async close() {
		try {
			if (this._payload.state == 'open') {
				await this._octokit.pulls.update({
					owner: this._owner,
					repo: this._repo,
					issue_number: this._payload.number,
					state: 'closed'
				});
			}
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	async respond() {
		try {
			const labelsManager = new LabelsManager(this._core, this._payload, this._octokit, this._owner, this._repo, this.LABELS);
			await labelsManager.createOrUpdateLabels();

			await this.addRelevantSizeLabel();

			console.log('payload =>', this._payload);

			const pullRequestTemplateValidator = new PullRequestTemplateValidator(
				this._owner,
				this._repo,
				this._octokit,
				this._core,
				this.TEMPLATE_PATH,
				this._payload.title,
				this._payload.body
			);

			const { isValid, titleValidation, headersValidation } = await pullRequestTemplateValidator.validate();

			let responseCommentBody = PullRequestComment.createBody(
				isValid,
				this.INPUTS.greetingMessage,
				this._payload.user.login,
				titleValidation,
				headersValidation
			);

			await this.createContributionComment(responseCommentBody);

			if (!isValid) {
				this._core.setFailed(responseCommentBody);
			}
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}
}

module.exports = PullRequest;