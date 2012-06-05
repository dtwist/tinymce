/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	tinymce.create('tinymce.plugins.PwlLinkPlugin', {
		init : function(ed, url) {
			var t = this;
			this.editor = ed;

			// Register commands
			ed.addCommand('mcePwlLink', function() {
				var se = ed.selection;

				// No selection and not in link
				if (se.isCollapsed() && !ed.dom.getParent(se.getNode(), 'A'))
					return;

				App.toolbar._actionLinkEdit(t);
				
			});

			// Register buttons
			ed.addButton('link', {
				title : 'pwllink.link_desc',
				cmd : 'mcePwlLink'
			});

			ed.addShortcut('ctrl+k', 'advlink.advlink_desc', 'mcePwlLink');

			ed.onNodeChange.add(function(ed, cm, n, co) {
				cm.setDisabled('link', co && n.nodeName != 'A');
				cm.setActive('link', n.nodeName == 'A' && !n.name);
			});
		},

		insertAction : function(attributes) {
			attribs = tinymce.extend({
				href : null,
				title : null,
				target : null
			},attributes);
			var editor = this.editor;
			var elm, elementArray, i;
			
			elm = editor.selection.getNode();
			
			elm = editor.dom.getParent(elm, "A");
			
			// Remove element if there is no href
			if (!attribs.href) {
				i = editor.selection.getBookmark();
				editor.dom.remove(elm, 1);
				editor.selection.moveToBookmark(i);
				this.execCommandWithSugarOnTop("mceEndUndoLevel");
				return;
			}
			
			// Create new anchor elements
			if (elm === null) {
				editor.getDoc().execCommand("unlink", false, null);
				this.execCommandWithSugarOnTop("mceInsertLink", false, "#mce_temp_url#", {skip_undo : 1}); // ################# THIS IS FEEZING FIREFOX ##################
				
				elementArray = tinymce.grep(editor.dom.select("a"), function(n) {return editor.dom.getAttrib(n, 'href') == '#mce_temp_url#';});
				for (i=0; i<elementArray.length; i++) {
					this.setAllAttribs(elm = elementArray[i], attribs);
				}
			} else {
				this.setAllAttribs(elm, attribs);
			}
			
			// Don't move caret if selection was image
			if (elm.childNodes.length != 1 || elm.firstChild.nodeName != 'IMG') {
				editor.focus();
				editor.selection.select(elm);
				editor.selection.collapse(0);
				this.storeSelection();
			}
			
			this.execCommandWithSugarOnTop("mceEndUndoLevel");
		},
		
		setAllAttribs : function(elm, attr){
			if (attr.href) {
				this.editor.dom.setAttrib(elm, 'href', attr.href);
			}
			if (attr.title) {
				this.editor.dom.setAttrib(elm, 'title', attr.title);
			}
			if (attr.target) {
				this.editor.dom.setAttrib(elm, 'target', attr.target);
			}
		},

		// cribbed from popup.js and renamed to prevent infinite loop in main execCommand function
		execCommandWithSugarOnTop : function(cmd, ui, val, a) {
			a = a || {};
			a.skip_focus = 1;
	
			this.restoreSelection();
			return this.editor.execCommand(cmd, ui, val, a);
		},
		// cribbed from popup.js
		storeSelection : function() {
			this.editor.windowManager.bookmark = this.editor.selection.getBookmark(1);
		},
		// cribbed from popup.js
		restoreSelection : function() {
			if (tinymce.isIE) {
				this.editor.selection.moveToBookmark(this.editor.windowManager.bookmark);
			}
		},


		getInfo : function() {
			return {
				longname :  'PWL CMS link',
				author :    'Prescientware, LLC',
				authorurl : 'http://prescientware.com',
				infourl :   'http://prescientware.com/',
				version :   '1.0'
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('pwllink', tinymce.plugins.PwlLinkPlugin);
})();