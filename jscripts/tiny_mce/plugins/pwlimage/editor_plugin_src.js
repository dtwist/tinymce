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
	tinymce.create('tinymce.plugins.PwlImagePlugin', {
		init : function(ed, url) {
			var t = this;
			this.editor = ed;

			// Register commands
			ed.addCommand('mcePwlImage', function() {
				el = ed.selection.getNode();

				// Internal image object like a flash placeholder
				if (ed.dom.getAttrib(el, 'class', '').indexOf('mceItem') != -1) {
					return;
				}

				if (el && el.nodeName == 'IMG') {
					current_values = {
						src     : el.src,
						alt     : el.alt,
						padding : ed.dom.getStyle(el, 'padding')
					};
					App.toolbar._actionImageEdit(t, current_values);
				} else {
					App.toolbar._actionImageSelect(t, null);
				}

			});

			// Register buttons
			ed.addButton('image', {
				title : 'pwlimage.image_desc',
				cmd : 'mcePwlImage'
			});
		},

		insertAction : function(attributes) {
		},

		getInfo : function() {
			return {
				longname :  'PWL CMS image',
				author :    'Prescientware, LLC',
				authorurl : 'http://prescientware.com',
				infourl :   'http://prescientware.com/',
				version :   '1.0'
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('pwlimage', tinymce.plugins.PwlImagePlugin);
})();