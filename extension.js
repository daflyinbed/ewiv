// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const MWBot = require('mwbot');
const request = require('request');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let bot = new MWBot();
	async function init(){
		let page = await vscode.window.showInputBox({
			value: '',
			ignoreFocusOut: true,
			password: false,
			prompt: '要编辑的页面'
		});
		let indexurl = vscode.workspace.getConfiguration().get('ewiv.indexUrl');
		console.log('https://' + indexurl + '?title=' + page + '&action=raw');
		request('https://' + indexurl + '?title=' + encodeURI(page)+'&action=raw',function(error,response,body){
			if(!error&&response.statusCode==200){
				vscode.window.activeTextEditor.edit(editBuilder => {
					const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
					vscode.languages.setTextDocumentLanguage(vscode.window.activeTextEditor.document, 'wikitext');
					const text ='<!--ewiv info DO NOT edit '+page+'-->\n'+ body;
					editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text);
				});
			}
		});	
	}
	async function GetPagenameAndPushEdit() {
		let apiurl = vscode.workspace.getConfiguration().get('ewiv.apiUrl');
		let username = vscode.workspace.getConfiguration().get('ewiv.userName');
		let password = vscode.workspace.getConfiguration().get('ewiv.password');
		let summary = vscode.workspace.getConfiguration().get('ewiv.summary');
		let content = vscode.window.activeTextEditor.document.getText();
		let pagename = await vscode.window.showInputBox({
			value: '',
			ignoreFocusOut: true,
			password: false,
			prompt: '要编辑的页面'
		});
		bot.loginGetEditToken({
			apiUrl: 'https://' + apiurl,
			username: username,
			password: password
		}).then(() => {
			return bot.edit(pagename, content, summary);
		}).then((response) => {
			//console.log(response);
			vscode.window.showInformationMessage('Success');
			// Success
		}).catch((err) => {
			vscode.window.showInformationMessage(err);
			console.log(err);
			// Error
		});
	}
	let CommandEwivPush = vscode.commands.registerCommand('extension.ewivpush', function () {
		
		if (vscode.window.activeTextEditor) {
			let content = vscode.window.activeTextEditor.document.getText();
			console.log(content);
			let apiurl = vscode.workspace.getConfiguration().get('ewiv.apiUrl');
			let username = vscode.workspace.getConfiguration().get('ewiv.userName');
			let password = vscode.workspace.getConfiguration().get('ewiv.password');
			let pagename = vscode.workspace.getConfiguration().get('ewiv.pageName');
			let summary = vscode.workspace.getConfiguration().get('ewiv.summary');
			if(!pagename){
				pagename = vscode.window.activeTextEditor.document.getText(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(1, 0)));
				if (!(pagename.match('<!--ewiv info DO NOT edit (.*)-->'))){
					GetPagenameAndPushEdit();
				}
				return;
			}
			bot.loginGetEditToken({
				apiUrl: 'https://' + apiurl,
				username: username,
				password: password
			}).then(() => {
				if(pagename){
					return bot.edit(pagename, content, summary);
				}else{
					//console.log(pagename);
					pagename = pagename.match('<!--ewiv info DO NOT edit (.*)-->')[1];
					content = vscode.window.activeTextEditor.document.getText(new vscode.Range(new vscode.Position(1, 0), new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0)));
					return bot.edit(pagename, content, summary);
				}
			}).then((response) => {
				//console.log(response);
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

	let CommandEwivInit = vscode.commands.registerCommand('extension.ewivinit',function () {
		init();
	});
	context.subscriptions.push(CommandEwivInit);
	context.subscriptions.push(CommandEwivPush);
}

 
exports.activate = activate;
			
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
