"use strict";
import * as vscode from "vscode";

export class PanguFormatter {
  public updateDocument() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    let doc = editor.document;
    // Only update status if an Markdown file
    if (doc.languageId === "markdown") {
      // 按照每行进行搞定
      editor.edit((editorBuilder: vscode.TextEditorEdit) => {
        let content = doc.getText(this.current_document_range(doc));
        // 全局替换
        content = this.condenseContent(content);
        content = this.replaceFullNums(content);
        content = this.replaceFullChars(content);
        // 标记是否位于代码区域内
        let isInCodeArea = 0;
        // 每行操作
        content = content
          .split("\n")
          .map((line: string) => {
            if (line.trim().startsWith("```")) {
              isInCodeArea = isInCodeArea == 0 ? 1 : 0;
            }

            line = this.replacePunctuations(line);
            line = line.replace(
              /([\u4e00-\u9fa5\u3040-\u30FF])([a-zA-Z0-9@&=\[\$\%\^\-\+(\/\\])/g,
              "$1 $2"
            );
            line = line.replace(
              /([a-zA-Z0-9!&;=\]\,\.\:\?\$\%\^\-\+\)\/\\])([\u4e00-\u9fa5\u3040-\u30FF])/g,
              "$1 $2"
            );

            // 不在代码区域内才执行此项替换
            if (
              !/`+[^`]*[『\[]([^』\]]+)[』\]][『\[]([^』\]]+)[』\]][^`]*`+/g.test(
                line
              ) &&
              !isInCodeArea
            ) {
              line = line.replace(
                /[『\[]([^』\]]+)[』\]][『\[]([^』\]]+)[』\]]/g,
                "[$1]($2)"
              );
            }

            line = line.replace(
              /[『\[]([^』\]]+)[』\]][（(]([^』)]+)[）)]/g,
              "[$1]($2)"
            );
            return line;
          })
          .join("\n");

        editorBuilder.replace(this.current_document_range(doc), content);
        // editorBuilder.insert(doc.positionAt(0), 'hello World');
      });
    } else {
    }
  }
  protected current_document_range(doc: vscode.TextDocument) {
    let start = new vscode.Position(0, 0);
    let end = new vscode.Position(
      doc.lineCount - 1,
      doc.lineAt(doc.lineCount - 1).text.length
    );
    let range = new vscode.Range(start, end);
    return range;
  }
  protected condenseContent(content: string) {
    content = content.replace(/^(.*)(\r?\n\1)+$/gm, "$1");
    return content;
  }
  protected replacePunctuations(content: string) {
    content = content.replace(
      /([\u4e00-\u9fa5\u3040-\u30FF])\.($|\s*)/g,
      "$1。"
    );
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF]),\s*/g, "$1，");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF]);\s*/g, "$1；");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])!\s*/g, "$1！");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF]):\s*/g, "$1：");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\?\s*/g, "$1？");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\\\s*/g, "$1、");
    content = content.replace(/\(([\u4e00-\u9fa5\u3040-\u30FF])/g, "（$1");
    content = content.replace(/\[([\u4e00-\u9fa5\u3040-\u30FF])/g, "『$1");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF。！])\]/g, "$1』");
    content = content.replace(/<([\u4e00-\u9fa5\u3040-\u30FF])/g, "《$1");
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF。！])>/g, "$1》");
    content = content.replace(/。{3,}/g, "\u2026\u2026");
    content = content.replace(/([！？])$1{3,}/g, "$1$1$1");
    content = content.replace(/([。，；：、“”『』〖〗《》])\1{1,}/g, "$1");
    return content;
  }

  protected replaceFullNums(content: string) {
    " 全角数字。";
    content = content.replace("０", "0");
    content = content.replace("１", "1");
    content = content.replace("２", "2");
    content = content.replace("３", "3");
    content = content.replace("４", "4");
    content = content.replace("５", "5");
    content = content.replace("６", "6");
    content = content.replace("７", "7");
    content = content.replace("８", "8");
    content = content.replace("９", "9");
    return content;
  }
  protected replaceFullChars(content: string) {
    " 全角英文和标点。";
    content = content.replace("Ａ", "A");
    content = content.replace("Ｂ", "B");
    content = content.replace("Ｃ", "C");
    content = content.replace("Ｄ", "D");
    content = content.replace("Ｅ", "E");
    content = content.replace("Ｆ", "F");
    content = content.replace("Ｇ", "G");
    content = content.replace("Ｈ", "H");
    content = content.replace("Ｉ", "I");
    content = content.replace("Ｊ", "J");
    content = content.replace("Ｋ", "K");
    content = content.replace("Ｌ", "L");
    content = content.replace("Ｍ", "M");
    content = content.replace("Ｎ", "N");
    content = content.replace("Ｏ", "O");
    content = content.replace("Ｐ", "P");
    content = content.replace("Ｑ", "Q");
    content = content.replace("Ｒ", "R");
    content = content.replace("Ｓ", "S");
    content = content.replace("Ｔ", "T");
    content = content.replace("Ｕ", "U");
    content = content.replace("Ｖ", "V");
    content = content.replace("Ｗ", "W");
    content = content.replace("Ｘ", "X");
    content = content.replace("Ｙ", "Y");
    content = content.replace("Ｚ", "Z");
    content = content.replace("ａ", "a");
    content = content.replace("ｂ", "b");
    content = content.replace("ｃ", "c");
    content = content.replace("ｄ", "d");
    content = content.replace("ｅ", "e");
    content = content.replace("ｆ", "f");
    content = content.replace("ｇ", "g");
    content = content.replace("ｈ", "h");
    content = content.replace("ｉ", "i");
    content = content.replace("ｊ", "j");
    content = content.replace("ｋ", "k");
    content = content.replace("ｌ", "l");
    content = content.replace("ｍ", "m");
    content = content.replace("ｎ", "n");
    content = content.replace("ｏ", "o");
    content = content.replace("ｐ", "p");
    content = content.replace("ｑ", "q");
    content = content.replace("ｒ", "r");
    content = content.replace("ｓ", "s");
    content = content.replace("ｔ", "t");
    content = content.replace("ｕ", "u");
    content = content.replace("ｖ", "v");
    content = content.replace("ｗ", "w");
    content = content.replace("ｘ", "x");
    content = content.replace("ｙ", "y");
    content = content.replace("ｚ", "z");

    content = content.replace("＠", "@");
    return content;
  }
}
