sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("nmspTrainHis.dwrtraininghistory.controller.training_history", {
            onInit: async function () {
                var oView = this.getView("training_history");    //Instance of view
                var oModel = new sap.ui.model.json.JSONModel(); //This model  will contain the data for the view
                var dataModel = this.getOwnerComponent().getModel("dataTrainHist");//Will contain data mapped from the ODATA services
                sap.ui.core.BusyIndicator.show();
                try {
                    var serviceUrl = "/sap/opu/odata/sap/ZODATA_TRAIN_HISTORY_SRV/";
                    //Instance of ODATA service ZODATA_TRAIN_HISTORY_SRV
                    var OdataServiceTrainHist = new sap.ui.model.odata.ODataModel(serviceUrl, true);

                    //var TrainHistData = "";
                    var TrainHisSrv = await this.getTrainHist(OdataServiceTrainHist);
                    if (TrainHisSrv[0].result === "ERROR") {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error((TrainHisSrv[0].data));
                    }
                    else {
                        if (TrainHisSrv[0].data.results.length === 0) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageBox.warning("No data found.");
                        }
                        else {
                            dataModel = this.SetData(oView, dataModel, TrainHisSrv[0].data.results)
                            oModel = dataModel;
                            oView.setModel(oModel);
                            sap.ui.core.BusyIndicator.hide();
                            this.onAfterRendering();
                        }
                    }

                }
                catch (Ex) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error(Ex.stack);
                }

            },
            getTrainHist: async function (UsrModel, data, dataModelMain) {
                const oPromise = await new Promise(function (resolve, reject) {
                    UsrModel.read("/train_historySet", {
                        //urlParameters: {
                        //    "Date": dataModelMain.oData.valParamDate,
                        //    "Division": "'WRSJ'",
                        //    "Plant": "''"
                        //},
                        success: (oData) => {
                            resolve({ result: "SUCCESS", data: oData });
                        },

                        error: (oData) => {
                            var usrError = ("Conection Error\n\r" + "URL: " + oData.response.requestUri.valueOf(Text) + "\n\rStatus: " + oData.response.statusCode.valueOf(Text) + "\n\rBody:" + oData.response.body.valueOf(Text));
                            resolve({ result: "ERROR", data: usrError });
                            reject(oData);
                        },
                    });
                });
                return [oPromise];
            },
            SetData: function (P_oview, P_dataModel, P_data) {
                P_dataModel.setProperty("/val_Name", P_data[0].Name)
                P_dataModel.setProperty("/val_Pernr", P_data[0].Pernr)
                P_dataModel.setProperty("/val_Org", P_data[0].Organization)
                P_dataModel.setProperty("/val_TblTrainHist", P_data)
                return P_dataModel;
            },
            onAfterRendering: function () {

                jQuery.sap.delayedCall(500, this, function () { this.byId("lbl_Title").focus(); });

                var oTable = this.getView().byId("tblTrainHist");
                var aItems = oTable.getItems();
                var columns = oTable.getColumns();
                var flag = "X"
                
                for (let index = 0; index < columns.length; index++) {
                    columns[index].setStyleClass("TH_Colfont");
                }

                if (aItems && aItems.length > 0) {

                    for (let i = 0; i < aItems.length; i++) {
                        var aCells = aItems[i].getCells();
                        if (flag === "X") {
                            aItems[i].addStyleClass("cyan");
                            flag = ""
                        }
                        else {
                            aItems[i].addStyleClass("blue");
                            flag = "X"
                        }


                    }
                }
                oTable._headerHidden = true;
            },
            onPrint: function(evt) {
               
                var i;
              ;

var examp = "<div style=' text-align:left;width=35px'>" +
"<Label for=lbl_HdrFullName width=80px" +
"style='font-size: 0.975rem;" +
"margin-left: 20px;" + 
"font-weight: bolder;"+ 
"font-family: calibri;'"+
">Full Name:</Label>"+

"<label style='font-family: calibri; text-align: center;"+
"font-weight: bolder;'>"+                             
this.getView().byId("lbl_HdrFullNameVal").mProperties.text +
"</label></div>";
                
                //Header
                var header =   '<html>' +
                '<div style="margin-top: 25px;"><center><Label for="lbl_Title" width="1140px" ' +
                'style="font-size: 1.8rem; font-weight: bolder; font-family: calibri;' +
                '">Training History Report</Label></center></div>' +       
                '<br> <br>'+
              
                '<Label for="lbl_HdrFullName" width="80px" ' +
                'style="font-size: 0.975rem;' +
                'margin-right: 5px;' +
                'font-weight: bolder;' +
                'font-family: calibri;' +
                '">Full Name:</Label>' +
                '&nbsp' +
                '<label style="font-family: calibri; text-align: center;' +
                'font-weight: bolder;">' +                               
                this.getView().byId("lbl_HdrFullNameVal").mProperties.text +
                '</label>' +

                '<span style="padding-left: 180px"></span>' +

                '<Label for="lbl_HdrOrg" width="80px" ' +
                'style="font-size: 0.975rem;' +
                'margin-right: 5px;' +
                'font-weight: bolder;' +
                'font-family: calibri;' +
                '">Organization:</Label>' +
                '&nbsp' +
                '<label style="font-family: calibri;' +
                'font-weight: bolder;">' +                               
                this.getView().byId("lbl_HdrOrgVal").mProperties.text +
                '</label>' +
                '<br>'+

                '<div style="margin-top: 15px;">' +
                '<Label for="lblHdrPernr" width="80px" ' +
                'style="font-size: 0.975rem;' +
                'margin-right: 5px;' +
                'font-weight: bolder;' +
                'font-family: calibri;' +
                '">Pers. No.:</Label>' +
                '&nbsp &nbsp' +
                '<label style="font-family: calibri;' +
                'font-weight: bolder;">' +                               
                this.getView().byId("lblHdrPernrVal").mProperties.text +
                '</label></div>' +
                '<hr>';

//Total Overview Table
var TotOvrvw = '<br>'

//TotOvrvw += "<table class='table' style='border-collapse: collapse; width: 1140px;' backgroundDesign='Solid'>"
TotOvrvw += "<center>" +
    "<Label for='LblTotOvrvwTxt' width='1500px' style='font-size: 1.5rem; font-weight: bolder; text-decoration-line: underline;'></Label>" +
    "</center> <br>" +

    "<table class='table' style='border-collapse: collapse; width: 1140px;' backgroundDesign='Solid'>" +
    "<tr>" +
    "<th style='text-align: left; width:0%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "<th style='text-align: left; width:10%; font-size: 18px; font-family: calibri;  text-align: left; '>ID</th>" +
    "<th style='text-align: left; width:35%; font-size: 18px; font-family: calibri;  text-align: left; '>Course</th>" +
   // "<th style='text-align: left; width:5%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "<th style='text-align: left; width:10%; font-size: 18px; font-family: calibri;  text-align: left; '>Category</th>" +
    //"<th style='text-align: left; width:5%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "<th style='text-align: left; width:10%; font-size: 18px; font-family: calibri;  text-align: left; '>Begin Dt.</th>" +
    //"<th style='text-align: left; width:5%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "<th style='text-align: left; width:10%; font-size: 18px; font-family: calibri;  text-align: left; '>End Dt.</th>" +
    //"<th style='text-align: left; width:5%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "<th style='text-align: left; width:10%; font-size: 18px; font-family: calibri;  text-align: left; '>Days</th>" +
    //"<th style='text-align: left; width:5%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "<th style='text-align: left; width:10%; font-size: 18px; font-family: calibri;  text-align: left; '>Hrs.</th>" +
    "<th style='text-align: left; width:5%; font-size: 18px; font-family: calibri;  text-align: left; '></th>" +
    "</tr>"
var oTableTot = this.getView().byId("tblTrainHist");
var aItemsTot = oTableTot.getItems();

for (let index = 0; index < aItemsTot.length; index++) {
    const element = aItemsTot[index];
    var aCells = element.getCells();
    var aValue = aCells[0].mProperties.text;
    TotOvrvw +="<tr>" +
    "<th style='text-align: rigth; font-size: 14px; font-family: calibri; font-weight: normal;'></th>" +
    "<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>"  
    aValue = aCells[1].mProperties.text;
    TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>" 
   // TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri;'>" + "</th>" 
    aValue = aCells[2].mProperties.text;
    TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>" 
    //TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri;'>" + "</th>" 
    aValue = aCells[3].mProperties.text;
    TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>" 
   // TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri;'>" + "</th>" 
    aValue = aCells[4].mProperties.text;
    TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>" 
    //TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri;'>" + "</th>" 
    aValue = aCells[5].mProperties.text;
    TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>" 
    //TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri;'>" + "</th>" 
    aValue = aCells[6].mProperties.text;
    TotOvrvw +="<th style='text-align: left; font-size: 14px; font-family: calibri; font-weight: normal;'>" + aValue + "</th>" +
    
    "</tr>" 

    aValue = "";

}
TotOvrvw +="</table>"

                //Time Transfers Table
                var TimeTransf = '<br>' + 
                    '<center><Label for="LblTimeTransfTxt" width="1140px" style="font-size: 1.5rem; font-weight: bolder; '+
                    'text-decoration-line: underline;">Time Transfers</Label></center>';   

                //Absence Quotas Table              
                var AbsQts = '<br>' + 
                    '<center><Label for="LblAbsQtsTxt" width="1140px" style="font-size: 1.5rem; font-weight: bolder; '+
                    'text-decoration-line: underline;">Absence Quotas</Label></center>';                   
                                
                
                
                var closeContent = '</html>';

                var win = window.open("", "PrintWindow");
                win.document.write(header+TotOvrvw+closeContent );
                
                //win.document.write(selection + header + IndRes +TotOvrvw + TimeTransf + AbsQts + closeContent);
                win.print();
                win.stop();
                win.close();


            


            }
        });
    });
