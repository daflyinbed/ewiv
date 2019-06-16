// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const MWBot = require('mwbot');
	let CommandEwivPush = vscode.commands.registerCommand('extension.ewivpush', function () {
		if (vscode.window.activeTextEditor) {
			let content = vscode.window.activeTextEditor.document.getText();
			console.log(content);
			let bot = new MWBot();
			let apiurl = vscode.workspace.getConfiguration().get('ewiv.apiUrl');
			let username = vscode.workspace.getConfiguration().get('ewiv.userName');
			let password = vscode.workspace.getConfiguration().get('ewiv.password');
			let pagename = vscode.workspace.getConfiguration().get('ewiv.pageName');
			let summary = vscode.workspace.getConfiguration().get('ewiv.summary');
			bot.loginGetEditToken({
				apiUrl: 'https://' + apiurl,
				username: username,
				password: password
			}).then(() => {
				return bot.edit(pagename, content, summary);
			}).then((response) => {
				console.log(response);
				vscode.window.showInformationMessage('Success');
				// Success
			}).catch((err) => {
				console.log(err);
				// Error
			});
		} else {
			console.error("undefined vscode.window.activeTextEditor");
		}
	});
	context.subscriptions.push(CommandEwivPush);
}
exports.activate = activate;
			
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
