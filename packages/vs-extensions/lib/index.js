var b=Object.create;var n=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var w=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty;var h=e=>n(e,"__esModule",{value:!0});var j=(e,t)=>{h(e);for(var o in t)n(e,o,{get:t[o],enumerable:!0})},y=(e,t,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of S(t))!N.call(e,i)&&i!=="default"&&n(e,i,{get:()=>t[i],enumerable:!(o=k(t,i))||o.enumerable});return e},c=e=>y(h(n(e!=null?b(w(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);j(exports,{activate:()=>z});var s=c(require("vscode")),v=c(require("fs")),a=c(require("path"));function z(e){var l,p,g;let t=((g=(p=(l=s.workspace.workspaceFolders)==null?void 0:l[0])==null?void 0:p.uri)==null?void 0:g.fsPath)??"",o=s.workspace.getConfiguration().get("i18n.conf.localePath")??"src/i18n/zh-CN.json",i=a.default.resolve(t,o),u=JSON.parse((0,v.readFileSync)(i,"utf8")),m=s.languages.registerHoverProvider([{scheme:"file",language:"javascript"},{scheme:"file",language:"vue"}],{provideHover(r,P,F){let d=r.getWordRangeAtPosition(P),x=r.getText(d);if(t){let C=a.default.relative(t,r.fileName).split(a.default.sep).join("."),f=u[C][x];if(f)return{contents:[f,"sweet-i18n \u63D0\u4F9B\u7FFB\u8BD1\u63D0\u793A"]}}}});e.subscriptions.push(m)}0&&(module.exports={activate});
//# sourceMappingURL=index.js.map
