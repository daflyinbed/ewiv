# ewiv README

由于自家wiki经常需要顶着高负载编辑，所以写了这个插件通过api完成页面更改

## Features

* 需要在设置中填写 api.php的url，用户名，密码，编辑的页面(可选)，编辑摘要
* 使用ewiv:load page从服务端加载wikitext
* 使用ewiv:submit把当前文件提交到服务器

是否填写了‘编辑的页面’ | 是 | 否 
-|-|-
文本加载自loadpage | 提交到‘编辑的页面’ | 提交到loadpage的页面
文本不是加载自loadpage | 提交到‘编辑的页面’ | 弹窗要求填写提交目标页面

## Extension Settings

* api.php的url:可以在特殊页面-接入点url-api.php找到
* 用户名:wiki的用户名
* 密码:wiki的密码
* 编辑的页面:名称空间:页面名
* 编辑摘要

## 以后打算写的功能

* wikitext的语法高亮
* 浏览器直接唤醒vscode

## 已知问题
* 向'用户:夕舞八弦/1/2'submit失败
