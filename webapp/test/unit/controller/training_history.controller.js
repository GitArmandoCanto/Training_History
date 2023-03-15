/*global QUnit*/

sap.ui.define([
	"nmspTrainHis/dwr_training_history/controller/training_history.controller"
], function (Controller) {
	"use strict";

	QUnit.module("training_history Controller");

	QUnit.test("I should test the training_history controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
