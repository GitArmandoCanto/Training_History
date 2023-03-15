/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"nmspTrainHis/dwr_training_history/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
