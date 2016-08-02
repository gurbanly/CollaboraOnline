// Include our main css file
require('./main.css');

var $ = require('jquery');
global.$ = global.jQuery = $;

require('smartmenus');
require('jquery-ui');
require('jquery-contextmenu');
// FIXME: would be good to remove w2ui script tags and require
// like other modules. problem is that w2ui doesn't export
// its global variables for a module, so following doesn't work
// This also leads to toolbar.js being included
//global.w2ui = require('./3rdparty/w2ui/w2ui');

global._ = function (string) {
	return string.toLocaleString();
};
require('json-js/json2');
require('l10n-for-node');
require('select2');
require('evol-colorpicker');
require('malihu-custom-scrollbar-plugin')($);

var vex = require('vex-js');
vex.dialog = require('vex-js/js/vex.dialog.js');
vex.defaultOptions.className = 'vex-theme-plain';
global.vex = vex;

global.devtools = require('devtools-detect');
var errorMessages = require('./dist/errormessages');
var L = require('loleaflet');
require('./dist/plugins/draw-0.2.4/dist/leaflet.draw.js');

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : results[1].replace(/\+/g, " ");
}
var lang = getParameterByName('lang');
if (lang) {
    String.locale = lang;
}

var wopiSrc = getParameterByName('WOPISrc');

if (wopiSrc !== '' && access_token !== '') {
    var wopiParams = { 'access_token': access_token };
}

var filePath = getParameterByName('file_path');
var title = getParameterByName('title');
if (title === '') {
    title = decodeURIComponent(filePath.substring(filePath.lastIndexOf('/')+1));
}

var permission = getParameterByName('permission');
var timestamp = getParameterByName('timestamp');
// Shows close button if non-zero value provided
var closebutton = getParameterByName('closebutton');
// Shows revision history file menu option
var revHistoryEnabled = getParameterByName('revisionhistory');
if (wopiSrc === '' && filePath === '') {
    vex.dialog.alert(errorMessages.wrongwopisrc);
}
if (host === '') {
    vex.dialog.alert(errorMessages.emptyhosturl);
}

// loleaflet.js accesses these globals
// TODO: Get rid of these globals
global.closebutton = closebutton;
global.revHistoryEnabled = revHistoryEnabled;
var docURL, docParams;
if (wopiSrc != '') {
    docURL = wopiSrc;
    docParams = wopiParams;
} else {
    docURL = filePath;
    docParams = {};
}

document.title = title;
var map = L.map('map', {
    server: host,
    doc: docURL,
    docParams: docParams,
    permission: permission,
    timestamp: timestamp,
    documentContainer: 'document-container'
});
// toolbar.js (loaded in <script> tag accesses map as global variable,
// so expose it
global.map = map;

////// Controls /////
map.addControl(L.control.scroll());
map.addControl(L.control.dialog());
map.addControl(L.control.partsPreview());
map.addControl(L.control.tabs());
map.addControl(L.control.columnHeader());
map.addControl(L.control.rowHeader());
map.addControl(L.control.contextMenu());
map.addControl(L.control.menubar());

//require('./dist/toolbar/toolbar');
