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
		let content = vscode.window.activeTextEditor.document.getText();
		let pagename = await vscode.window.showInputBox({
			value: '',
			ignoreFocusOut: true,
			password: false,
			prompt: '要编辑的页面'
		});
		submitEdit(pagename,content);
	}
	function submitEdit(pageName,content){
		let apiUrl = vscode.workspace.getConfiguration().get('ewiv.apiUrl');
		let userName = vscode.workspace.getConfiguration().get('ewiv.userName');
		let password = vscode.workspace.getConfiguration().get('ewiv.password');
		let summary = vscode.workspace.getConfiguration().get('ewiv.summary') || '';
		let bot = new MWBot();
		bot.loginGetEditToken({
			apiUrl: 'https://' + apiUrl,
			username: userName,
			password: password
		}).then(() => {
			return bot.edit(pageName, content, summary);
		}).then((response) => {
			console.log(response);
			vscode.window.showInformationMessage(response.edit.result);
		}).catch((err) => {
			vscode.window.showInformationMessage(err);
			console.log(err);
		});
	}
	let CommandEwivSubmit = vscode.commands.registerCommand('extension.ewivsubmit', function () {
		if (vscode.window.activeTextEditor) {
			let content = vscode.window.activeTextEditor.document.getText();
			let pagename = vscode.workspace.getConfiguration().get('ewiv.pageName') || '';
			if(pagename==''){
				pagename = vscode.window.activeTextEditor.document.getText(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(1, 0))).match('<!--ewiv info DO NOT edit (.*)-->');
				if (pagename==null){
					GetPagenameAndPushEdit();
					return;
				}else{
					pagename = pagename[1];
					content = vscode.window.activeTextEditor.document.getText(new vscode.Range(new vscode.Position(1, 0), new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0)));
				}
			}
			submitEdit(pagename,content);
		} else {
			console.error("undefined vscode.window.activeTextEditor");
		}
	});

	let CommandEwivInit = vscode.commands.registerCommand('extension.ewivinit',function () {
		init();
	});
	context.subscriptions.push(CommandEwivInit);
	context.subscriptions.push(CommandEwivSubmit);
}

 
exports.activate = activate;
			
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
