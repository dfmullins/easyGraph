/**
*  easyGraphs by Damion Mullins
*/
(function() {
    /**
    * Global settings object
    */
    var globalObj = {};
    
    /**
    * Graph types
    */
     var graphTypesObj = {
        "pie": function() {
            pieChart.pie();
        },
        "line": function() {
            lineGraphs.line();
        },
        "scatterPlot": function() {
            scatterPlot.init();
        },
        "bar": function() {
            bar.init();
        },
        "infoGraphic": function() {
            infoGraphic.init();
        }
    };
    
    /*
    * Initialize
    */
    this.EasyGraphs = function(settingsObject) {
        globalObj = settingsObject;
        validate.addAxisIncrements();
        validate.elementExists();        
        validate.checkPropAndValueObj("dataPointsXandY[0]");
        validate.autoPopulateInfoConfig("xTickMarkSpacing", 10);
        validate.autoPopulateInfoConfig("yTickMarkSpacing", 10);
        validate.autoPopulateInfoConfig("tickLength", 10);
        validate.autoPopulateInfoConfig("graphSizeWidth", "50%");
        validate.autoPopulateInfoConfig("graphSizeHeight", "50%");
        validate.autoPopulateInfoConfig("tickValueFontSize", 14);
        validate.autoPopulateInfoConfig("labelFontSize", 30);
        validate.autoPopulateInfoConfig("graphNameFontSize", 40);
        validate.autoPopulateInfoConfig("infoGraphicPointFontSize", 14);
        validate.autoPopulateInfoConfigBool("yOnlyShowNthValues", "false");
        validate.autoPopulateInfoConfigBool("xOnlyShowNthValues", "false");
        validate.axisValues("xAxisValues");
        validate.axisValues("yAxisValues");
        utilities.processAxisValues();
        validate.getSpaceBetweenValueAndTick();
        validate.processColors();
        validate.checkGraphType();
        setupCanvas.createMemory();
    };
    
    var validate = {
        processColors: function () {
            // Default color settings
            globalObj["colors"] = {
                "xAxis": "black",
                "yAxis": "black",
                "xAxisValues": "black",
                "yAxisValues": "black",
                "graphName": "#cccccc",
                "xAxisLabel": "black",
                "yAxisLabel": "black",
                "dataPoints": {0:"blue"},
                "graphLine": {0:"blue"},
                "bars": {},
                "xTicks": "black",
                "yTicks": "black",
                "trendLine": {0:"#cccccc"}
            }
            
            if (globalObj.colorConfig) {
                for (var key in globalObj.colors) {
		            if (globalObj.colors.hasOwnProperty(key)) {
		                globalObj.colors[key] = globalObj.colorConfig[key] || globalObj.colors[key];
                    }
                }
            }
        },
        
        addAxisIncrements: function () {
            globalObj["xIncrements"] = 1;
            globalObj["yIncrements"] = 1;
        },
        
        getSpaceBetweenValueAndTick: function () {
            var maxXlength = validate.getLongestValue(globalObj.xAxisValues);
            var maxYlength = validate.getLongestValue(globalObj.yAxisValues);
            globalObj["tickValueSpacingY"] = maxYlength * globalObj.tickValueFontSize;
            globalObj["tickValueSpacingX"] = maxXlength * globalObj.tickValueFontSize;
        },
        
        getLongestValue: function (array) {
            var maxlen = 0;
            for (var i = 0; i <= array.length; i++) {
                if (typeof array[i] !== "undefined") {
                    if (array[i].toString().length > maxlen) {
                        maxlen = array[i].toString().length;
                    }
                }
            }
            
            return maxlen;
        },
        
        /**
        * Assure that element is canvas and exists
        */
        elementExists: function() {
            try {
                document.querySelector("#" + globalObj.elementId).length;
                if ("canvas" !== document.querySelector("#" + globalObj.elementId).tagName.toLowerCase()) {
                    throw new Error("Element must be canvas");
                }
            } catch (e) {
                errorHandler.processError("Element: ", e);
            }
        },
        
        /**
        * Assure that grpah type is valid
        */
        checkGraphType: function() {
            try {
                graphTypesObj[globalObj.graphType]();
            } catch (e) {
                errorHandler.processError("Graph failure: ", e);
            }
        },
        
        checkPropAndValue: function (type) {
            try {
                if (!globalObj.hasOwnProperty(type) || isNaN(globalObj[type])) {
                    throw new Error(type);
                }
            } catch (e) {
                errorHandler.processError("Missing configuration: ", e);
            }
        },
        
        checkPropAndValueObj: function (type) {
            try {
                if (!globalObj.hasOwnProperty(type) && typeof globalObj[type] === "object") {
                    throw new Error(type);
                }
            } catch (e) {
                errorHandler.processError("Missing configuration: ", e);
            }
        },
        
        autoPopulateInfoConfig: function (prop, value) {
            if (!globalObj.hasOwnProperty(prop) || isNaN(globalObj[prop])) {
                globalObj[prop] = value;
            }
        },
        
        autoPopulateInfoConfigBool: function (prop, value) {
            if (!globalObj.hasOwnProperty(prop) || ("true" !== globalObj.prop && "false" === globalObj.prop)) {
                globalObj[prop] = value;
            }
        },
        
        axisValues: function (type) {
            try {
                if (!globalObj.hasOwnProperty(type) || 0 === globalObj[type].length) {
                    throw new Error(type);
                }
            } catch (e) {
                errorHandler.processError("Missing configuration: ", e);
            }
        },
        
        checkForNaN: function (obj) {
            try {
                if (isNaN(obj.slope) || isNaN(obj.intercept) || isNaN(obj.r2)) {                
                    throw new Error("Scatter plot graph can only use integers for x and y values");
                }
            } catch (e) {
                errorHandler.processError("Configuration error: ", e);
            }
        },
        
        validateLabelWidth: function (value) {       
            var retVal = 0;
            if (typeof value !== undefined) {
                retVal = value.length * 6;
            }

            return Number(retVal);
        }
    };
    
    modalWindow = {
        paddingBottom: 100,
        
        createContainer: function () {
            var outerDiv                   = document.createElement("div");
            outerDiv.id                    = "easyGraphModalWindowContainer";
            outerDiv.style.display         = "block";
            outerDiv.style.position        = "fixed";
            outerDiv.style.zIndex          = 999998;
            outerDiv.style.paddingTop      = "100px";
            outerDiv.style.left            = 0;
            outerDiv.style.top             = 0;
            outerDiv.style.width           = "100%";
            outerDiv.style.height          = "100%";
            outerDiv.style.overflow        = "auto";
            outerDiv.style.backgroundColor = "rgb(0,0,0)";
            outerDiv.style.backgroundColor = "rgba(0,0,0,0.4)"; 
            
            return outerDiv;
        }, 
        
        createWindow: function () {
            var innnerDiv                   = document.createElement("div");   
            innnerDiv.id                    = "easyGraphModalWindow";   
            innnerDiv.style.borderRadius    = "5px";
            innnerDiv.style.border          = "1px solid #888";
            innnerDiv.style.width           = "90%";
            innnerDiv.style.height          = "100%";
            innnerDiv.style.padding         = "5px 20px 100px 20px";
            innnerDiv.style.margin          = "auto auto 200px auto";
            innnerDiv.style.backgroundColor = "#fefefe";
            
            return innnerDiv;
        },
        
        createCloseBtn: function () {
            var closeBtnSpan              = document.createElement("span"); 
            closeBtnSpan.id               = "easyGraphModalWindowCloseBtn";  
            closeBtnSpan.style.display    = "block";
            closeBtnSpan.style.float      = "right";
            closeBtnSpan.style.fontWeight = "bold";
            closeBtnSpan.style.zIndex     = 100000;
            closeBtnSpan.innerHTML        = "&times;";
            closeBtnSpan.style.cursor     = "Pointer";
            closeBtnSpan.style.fontSize   = "45px";
            closeBtnSpan.style.top        = "-10px";
            closeBtnSpan.style.position   = "relative";
            closeBtnSpan.setAttribute("onclick", "modalWindow.removeEasyGraphModalWindow('" +  globalObj.elementId + "')");
            closeBtnSpan.setAttribute("title", "Close this window");
            
            return closeBtnSpan;
        },
        
        createChangeGraphBtn: function (id) {
            var changeGraphBtnSpan        = document.createElement("span"); 
            changeGraphBtnSpan.id               = "changeGraphBtn";  
            changeGraphBtnSpan.style.display    = "block";
            changeGraphBtnSpan.style.float      = "right";
            changeGraphBtnSpan.style.fontWeight = "bold";
            changeGraphBtnSpan.style.zIndex     = 100000;
            changeGraphBtnSpan.innerHTML        = modalWindow.createDropDown(id);
            changeGraphBtnSpan.style.cursor     = "Pointer";
            changeGraphBtnSpan.style.fontSize   = "45px";
            changeGraphBtnSpan.style.top        = "-14px";
            changeGraphBtnSpan.style.marginRight = "10px";
            changeGraphBtnSpan.style.position   = "relative";            
            changeGraphBtnSpan.setAttribute("title", "Close this window");
            
            return changeGraphBtnSpan;
        },
        
        createDropDown: function (id) {
            var styling = 'style="' +
                          'padding: .375rem .75rem;' +
                          'font-size: 1rem;' +
                          'line-height: 1.5;' +
                          'border-radius: .25rem;' +
                          'background-color: #6c757d;' +
                          'border-color: #6c757d;' +
                          'color: #fff;' +
                          '"';
                          
            var obj = {
                "bar":'<option value="bar">Bar</option>',
                "line":'<option value="line">Line</option>',
                "pie":'<option value="pie">Pie</option>',
                "scatterPlot":'<option value="scatterPlot">Scatter Plot</option>',
                "infoGraphic":'<option value="infoGraphic">Info Graphic</option>'
            };
            
            var string = "";
            var sel    = '<select id="changeGraphDl" ' + styling + ' onchange="modalWindow.initNewGraph(\'' + id + '\')">' +
                   '<option value="0">Other graph types...</option>';
            var selClose = '</select>';
            var retVal = "";
            
            string = modalWindow.addSelectedGraphs(string, obj, id);
            string = modalWindow.addAllGraphs(string, obj, id);
           
            return retVal = sel + string + selClose;
        },
        
        addSelectedGraphs: function (string, obj, id) {
            var newObj = modalWindow.getMemory(id);
            if (newObj.hasOwnProperty("modalGraphChoices")) {                
                for (key in newObj.modalGraphChoices) {
                    string = string + obj[newObj.modalGraphChoices[key]];
                }
            }
            
            return string;
        },
        
        addAllGraphs: function (string, obj) {
            if ("" === string) {
                for (key in obj) {
                    string = string + obj[key];
                }
            }
            
            return string;
        },
        
        createTextDiv: function () {
            var textDiv                   = document.createElement("div");
            textDiv.id                    = "easyGraphModalWindowTextCont";  
            textDiv.style.width           = "100%";
            textDiv.style.height          = "100%";
            textDiv.style.overflow        = "auto";
            
            return textDiv;
        },
        
        createModalCanvas: function (id) {
            var canvas = document.querySelector("#" + id); 
            var newCanvas = document.createElement("canvas");
            newCanvas.id  = "newCanvas_" + id;  
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height + modalWindow.paddingBottom;
            
            return newCanvas;
        },
        
        initModalWindow: function (id) {
            document.body.appendChild(modalWindow.createContainer());
            document.querySelector("#easyGraphModalWindowContainer").appendChild(modalWindow.createWindow());
            document.querySelector("#easyGraphModalWindow").appendChild(modalWindow.createCloseBtn());
            document.querySelector("#easyGraphModalWindow").appendChild(modalWindow.createChangeGraphBtn(id));
            document.querySelector("#easyGraphModalWindow").appendChild(modalWindow.createTextDiv());
            modalWindow.populateWindow(id);
        },
        
        getMemory: function (id) {
            var mem = document.querySelector("#data_" + id).value;
    
            return JSON.parse(mem);
        },
        
        initNewGraph: function (id) {
            var obj = modalWindow.getMemory(id);
            obj.graphType = document.querySelector("#changeGraphDl").value;
            obj.elementId = "newCanvas_" + id;
            obj.graphSizeWidth = globalObj.canvas.width;
            obj.graphSizeHeight = globalObj.canvas.height + modalWindow.paddingBottom;
            obj.addModalWindowOption = "no";
            
            new EasyGraphs(obj); 
        },
        
        populateWindow: function (id) {        
            document.querySelector("#easyGraphModalWindowTextCont").appendChild(modalWindow.createModalCanvas(id));           
            var destinationCanvas = document.querySelector("#" + "newCanvas_" + id).getContext('2d'); 
            var canvas = document.querySelector("#" + id); 
            destinationCanvas.drawImage(
                canvas, 
                0, 
                0
            );           
        },
        
        removeEasyGraphModalWindow: function() {
            if (document.querySelector("#easyGraphModalWindowContainer")) {
                //document.querySelector("#easyGraphModalWindowContainer").remove();
                var element = document.querySelector("#easyGraphModalWindowContainer");
                element.parentNode.removeChild(element);
            }
        }
    };
    
    /**
    * Setup the canvas
    */
    var setupCanvas = {
        createMemory: function () {
            var ref = document.querySelector("#" + globalObj.elementId);
            var mem = document.createElement("input");
            mem.id = "data_" + globalObj.elementId; 
            mem.setAttribute("type", "hidden"); 
            mem.setAttribute("value", JSON.stringify(globalObj));
            ref.parentNode.insertBefore(mem, ref.nextSibling);
        },
        
        /**
        * Get canvas and context
        */
        initializeCanvas: function () {
            var canvas = document.querySelector("#" + globalObj.elementId);
            globalObj["canvas"] = canvas;
            globalObj["context"] = canvas.getContext("2d");
            globalObj.context.clearRect(0, 0, globalObj.canvas.width, globalObj.canvas.height);
        },
        
        setHeightAndWidth: function () {       
            if (globalObj.hasOwnProperty("graphSizeWidth")
               && globalObj.hasOwnProperty("graphSizeHeight")) {
                var elem = document.querySelector("#" + globalObj.elementId);
                if (globalObj.graphType !== "pie") {
                    elem.style.width = globalObj.graphSizeWidth; 
                }
                elem.style.height = globalObj.graphSizeHeight;    
                setupCanvas.addBackGround();        
            }
        },
        
        addModalWindowOption: function () {
            if (globalObj.hasOwnProperty("addModalWindowOption") && "yes" === globalObj.addModalWindowOption) {
                document.querySelector("#" + globalObj.elementId).style.cursor = "pointer";
                document.querySelector("#" + globalObj.elementId).setAttribute("title", "Click the graph to view more");
                document.querySelector("#" + globalObj.elementId).setAttribute("onclick", "modalWindow.initModalWindow('" +  globalObj.elementId + "')");
            }
        },
        
        addBackGround: function () {
            if (globalObj.hasOwnProperty("bgImageAndColor") 
                && (typeof globalObj.bgImageAndColor[0] !== "undefined" || typeof globalObj.bgImageAndColor[1] !== "undefined")) {                      
                setupCanvas.backGroundIsColor();
                setupCanvas.backGroundIsImage();
            }
        },
        
        backGroundIsImage: function () {
            if (true === utilities.isDir() && "infoGraphic" === globalObj.graphType) {
                  var img = new Image();
                  img.src = globalObj.bgImageAndColor[0];
                  img.onload = function(){
                    globalObj.context.globalCompositeOperation = "destination-over";
                    var arr = setupCanvas.getImageCanvasSize(img);                     
                    globalObj.canvas.width = arr[0];
                    globalObj.canvas.height = arr[1];         
                    globalObj.context.drawImage(
                        img, 
                        0, 
                        globalObj.graphNameFontSize, 
                        globalObj.canvas.width, 
                        globalObj.canvas.height - Number(globalObj.graphNameFontSize)
                    );
                    graphic.continueInit();
                  }
            }
        },
        
        getImageCanvasSize: function (img) {
            var w = img.naturalWidth;
            var h = img.naturalHeight;
            if (globalObj.hasOwnProperty("infoGraphicWidthAndHeight")) {
                w = globalObj.infoGraphicWidthAndHeight[0];
                h = globalObj.infoGraphicWidthAndHeight[1];
            }
            
            return [w, h];
        },
        
        backGroundIsColor: function () {
            if (false === utilities.isDir()) {
                globalObj.context.globalCompositeOperation = "destination-over";
                globalObj.context.fillStyle = globalObj.bgImageAndColor[1];
                globalObj.context.fillRect(0, 0, globalObj.canvas.width, globalObj.canvas.height);
            }
        }
    };
    
    var pieChart = {
        eachPieSize: 500,
        standardWidth: 500,
         
        pie: function () {
            var canvasPadding = 20;
            setupCanvas.initializeCanvas();
            globalObj.canvas.setAttribute("width", pieChart.getCanvasWidth());
            globalObj.canvas.setAttribute("height", pieChart.getCanvasHeight());
            utilities.createGraphName();
            pieChart.getDataPointSet();
            setupCanvas.setHeightAndWidth();           
            setupCanvas.addModalWindowOption();
        },
        
        getCanvasWidth: function () {
            return utilities.getWidthOfGraphName();
        },
        
        getCanvasHeight: function () { 
            var count = 0;
            var additional = 0;
            for (var set in globalObj.dataPointsXandY) {
                if (globalObj.dataPointsXandY.hasOwnProperty(set)) {
                    additional = pieChart.processAdditionalHeight(set, additional);
                    count = count + pieChart.eachPieSize;
                }   
            }
   
            return count + additional;
        },
        
        processAdditionalHeight: function (set, additional) {
            var count = 0;
            for (var key in globalObj.dataPointsXandY[set]) {
                if (globalObj.dataPointsXandY[set].hasOwnProperty(key)) {
                    if (typeof globalObj.dataPointsXandY[set][key] === "object") {
                        count++;
                    }
                }   
            }
            
            return (count + additional) * globalObj.tickValueFontSize;
        },
        
        getDataPointSet: function () {
            for (var set in globalObj.dataPointsXandY) {
                if (globalObj.dataPointsXandY.hasOwnProperty(set)) {
                    pieChart.createPieChartResources(set);
                }   
            }
        },
        
        processPoints: function (set) {
            obj = {
                "angles": [],
                "percent": [],
                "colors": [],
                "labels": {},
                "labelWidth":"",
                "labelHeight":0
            };
            var total = utilities.createTotalValue(set);
            count = 0;      
            for (var key in globalObj.dataPointsXandY[set]) {
                if (globalObj.dataPointsXandY[set].hasOwnProperty(key)) {
                    var yPoint = utilities.getValueFromValLabelObj(globalObj.dataPointsXandY[set][key]);
                    var label = utilities.getLabelFromValLabelObj(globalObj.dataPointsXandY[set][key]);
                    obj.labelWidth = utilities.getLongestLabel(label, obj.labelWidth);
                    obj.labelHeight = utilities.getLabelHeight(label, obj.labelHeight);
                    var point = (yPoint/total)/.01;
                    obj.percent.push(point.toFixed(2));
                    var angle = Math.PI * .01 * (2 * point);
                    obj.angles.push(angle);
                    obj.labels[angle + "_" + count ] = label;
                    count++;
                }
            }
             
            return utilities.getColors(obj, count);
        },
        
        drawPieChart: function (obj, set) {
          var beginAngle = 0;
          var endAngle = 0;
          var count = 0;
          var location = 200 * (Number(set) + 1);
         
          location = utilities.applyAdditionalSpaceHeight(
            utilities.pieChartSpacer(location, set, obj.labelHeight),
            obj.labelHeight,
            set
          );

          var labelWidth = validate.validateLabelWidth(obj.labelWidth);
          for(var i = 0; i < obj.angles.length; i = i + 1) {
            beginAngle = endAngle;
            endAngle = endAngle + obj.angles[i];
            var color = utilities.getUserConfigColor(obj, set, i);
            globalObj.context.beginPath();
            globalObj.context.fillStyle = color;
            globalObj.context.moveTo(200 + labelWidth, location);
            globalObj.context.arc(200 + labelWidth, location, 120, beginAngle, endAngle);
            globalObj.context.lineTo(200 + labelWidth, location);
            globalObj.context.fill(); 
            var labelPosition = (count + location) - 100;         
            utilities.drawPointLabel(
                "pie",
                obj.labels[obj.angles[i] + "_" + i], 
                0, 
                labelPosition, 
                {"color": color, "percent": obj.percent[i]},
                set
            );
            count = count + 20;
          }
        },
        
        createPieChartResources: function (set) {
            obj = pieChart.processPoints(set);
            pieChart.drawPieChart(obj, set);
        }
    };
    
    var scatterPlot = {
        init: function () {
            utilities.checkForColors("trendLine");
            lineGraphs.line();
        }
    };
    
    var bar = {
        init: function () {
            utilities.checkForColors("bars");
            lineGraphs.line();
        }
    };
    
    var infoGraphic = {
        init: function () {
            graphic.drawInfoGraphic();
        }
    };
    
    var graphic = {
        drawInfoGraphic: function () {
            setupCanvas.initializeCanvas();
            setupCanvas.backGroundIsImage();
        },
        
        continueInit: function () {
            utilities.createGraphName();
            graphic.placeValuesOnGraphic();
            setupCanvas.addModalWindowOption();
        },
        
        placeValuesOnGraphic: function () {
            if (globalObj.hasOwnProperty("infoGraphicPointLocations") 
                && typeof globalObj.infoGraphicPointLocations === "object") {
                for (var i = 0; i <= globalObj.infoGraphicPointLocations.length; i++) {
                    graphic.processValues(globalObj.infoGraphicPointLocations[i], i);
                }
            }
        },
        
        processValues: function (obj, set) { 
            var count = 0;
            var objCount = utilities.countObjects(obj);        
            for (var key in obj) {
                var x = obj[key][0];
                var y = obj[key][1];
                var attrObj = {
                    "colors": [],
                    "percent": [],
                    "color": ""
                };
                var total = utilities.createTotalValue(set);
                attrObj = utilities.getColors(attrObj, objCount); 
                var retArray = graphic.processEachPoint(count, set, key, total, attrObj, x, y);
                count = retArray[0];
                attrObj = retArray[1];               
            }
        },
        
        processEachPoint: function (count, set, key, total, attrObj, x, y) {
            for (var point in globalObj.dataPointsXandY[set][key]) {
                var val = (point/total)/.01;
                attrObj.percent.push(val.toFixed(2));
                attrObj.color = utilities.getUserConfigColor(attrObj, set, count);
                globalObj.context.beginPath();                     
                utilities.drawPointLabel(
                    "infoGraphic", 
                    globalObj.dataPointsXandY[set][key][point],
                    x, 
                    y, 
                    attrObj,
                    set
                );
                count++;
                
                return [
                    count,
                    attrObj
                ];
            }
        }
    };
    
    var lineGraphs = {
        lineWidth: 1,
        lineWidthBold: 3,
        
        line: function () {
            var canvasPadding = 20;
            utilities.checkForColors("graphLine");
            globalObj.paddingTop = canvasPadding + globalObj.tickValueSpacingY;
            globalObj.paddingBottom = canvasPadding + globalObj.tickValueSpacingX;
            globalObj.paddingLeft = canvasPadding + globalObj.tickValueSpacingY;
            globalObj.paddingRight = canvasPadding;
            globalObj.lineWidthOffset = 0;
            setupCanvas.initializeCanvas();
            lineGraphs.increasePaddingTopForName();
            lineGraphs.increasePaddingBottomForLabel();
            lineGraphs.increasePaddingLeftForLabel();
            lineGraphs.getAxisTicksAndCanvasLength(
                globalObj.yAxisValues,
                globalObj.yIncrements, 
                globalObj.yTickMarkSpacing, 
                "yTick", 
                globalObj.paddingLeft, 
                "configHeight", 
                globalObj.lineWidthOffset
            );
            lineGraphs.getAxisTicksAndCanvasLength(
                globalObj.xAxisValues,
                globalObj.xIncrements, 
                globalObj.xTickMarkSpacing, 
                "xTick", 
                globalObj.paddingLeft, 
                "configWidth", 
                globalObj.lineWidthOffset
            );          
            globalObj.canvas.setAttribute("width", lineGraphs.processWidth()); 
            globalObj.canvas.setAttribute("height", globalObj.configHeight + (globalObj.paddingBottom * 2));
            lineGraphs.drawXticks();
            lineGraphs.drawYticks();
            lineGraphs.drawXaxis();
            lineGraphs.drawYaxis();
            utilities.createGraphName();
            lineGraphs.createXaxisLabel();
            lineGraphs.createYaxisLabel();
            lineGraphs.applyDataPoints();
            setupCanvas.setHeightAndWidth();
            setupCanvas.addModalWindowOption();
            globalObj.yAxisValues.reverse();
        },
        
        processWidth: function () {
            var width = utilities.getWidthOfGraphName();
            if ((globalObj.configWidth + globalObj.paddingRight) > utilities.getWidthOfGraphName()) {
                width = globalObj.configWidth + globalObj.paddingRight;
            }
            
            return width;
        },
        
        applyDataPoints: function () {
            if (globalObj.hasOwnProperty("dataPointsXandY")) {                
                for (var set in globalObj.dataPointsXandY) {
                    if (globalObj.dataPointsXandY.hasOwnProperty(set)) {                        
                        var retArray = lineGraphs.processEachDataPoint(set, xArray, yArray);
                        var xArray = retArray[0];
                        var yArray = retArray[1];                        
			            lineGraphs.checkForLineGraphType(set);
			            lineGraphs.checkForScatterGraphType(xArray, yArray, set);
			        }
			    }
            }
        },
        
        processEachDataPoint: function (set, xArray, yArray) {
            globalObj["connectPoints"] = {};
            xArray = [];
            yArray = [];
            var count = 0;
            for (var key in globalObj.dataPointsXandY[set]) {
              if (globalObj.dataPointsXandY[set].hasOwnProperty(key)) {
                var value = utilities.getValueFromValLabelObj(globalObj.dataPointsXandY[set][key]);
                var label = utilities.getLabelFromValLabelObj(globalObj.dataPointsXandY[set][key]);
                lineGraphs.drawPoints(key, value, set, label, count);
                xArray.push(Number(key));
                yArray.push(Number(value));
                count++;
              }
            }
            
            return [
                xArray,
                yArray
            ];
        },
        
        checkForScatterGraphType: function (x, y, set) {
            if ("scatterPlot" === globalObj.graphType) {
                var retVal = equations.linearRegression(y, x);               
                var trendObj = lineGraphs.calculateTrendPoints(retVal);                       
                globalObj.connectPoints = {};
                if (Object.keys(trendObj).length > 0) {
                    var flag = false;
                    var attObj = {
                        "strokeStyle": globalObj.colors["trendLine"][set],
                        "dash": true,
                        "lineWidth": "2",
                        "globalCompositeOperation": "destination-over"
                    }
                    for (var key in trendObj) {
		                if (trendObj.hasOwnProperty(key)) {
		                    var getXpoints = lineGraphs.getPoints(globalObj.xTickLocations, key);
                            var getYpoints = lineGraphs.getPoints(globalObj.yTickLocations, trendObj[key]);
                            lineGraphs.plotPointsOnGraphLine(getXpoints, getYpoints, true, set, "");                          
                            lineGraphs.connectPoints(attObj);  
		                }
		            }
                }
            }
        },
        
        calculateTrendPoints: function (retVal) {
            globalObj.yAxisValues = globalObj.yAxisValues.reverse();
            var xValueCount = globalObj.xAxisValues.length;
            var yValueCount = globalObj.yAxisValues.length;
            var lastValue   = globalObj.yAxisValues[globalObj.yAxisValues.length - 1];                    
            var coordinatesObj = {};
            for (var i = 0; i <= xValueCount; i++) {
                if (typeof globalObj.xAxisValues[i] !== "undefined") {
                    var y = retVal.slope * globalObj.xAxisValues[i] + retVal.intercept;                                      
                    y = Math.round(y);
                    if (y > 0 && y <= lastValue) {
                        coordinatesObj[globalObj.xAxisValues[i]] 
                            = y;
                    }
                }
            }
            globalObj.yAxisValues = globalObj.yAxisValues.reverse();
            
            return coordinatesObj;
        },
        
        checkForLineGraphType: function (set) {
            if ("line" === globalObj.graphType) {
                var attObj = {
                    "strokeStyle": globalObj.colors["graphLine"][set],
                    "lineWidth": "5"
                }
                lineGraphs.connectPoints(attObj);
            }
        },
        
        connectPoints: function (attObj) {
            if (globalObj.hasOwnProperty("connectPoints")) {
                globalObj.context.beginPath();
                globalObj.context.strokeStyle = attObj.strokeStyle; 
                utilities.addDashLine(attObj); 
                globalObj.context.lineWidth = attObj.lineWidth; 
                globalObj.context.globalCompositeOperation = attObj.globalCompositeOperation || "source-over";
                var flag = false;
                for (var key in globalObj.connectPoints) {
		          if (globalObj.connectPoints.hasOwnProperty(key)) {  
	                if (false === flag) {
	                    globalObj.context.moveTo(
                            globalObj.connectPoints[key].x,
                            globalObj.connectPoints[key].y
                        );
                        flag = true;
	                } else {           
                        globalObj.context.lineTo(
                            globalObj.connectPoints[key].x,
                            globalObj.connectPoints[key].y
                        );
                    }
		          }
			    }
			    globalObj.context.stroke();
            }
        },
        
        drawPoints: function (x, y, set, label, count) {
            var getXpoints = lineGraphs.getPoints(globalObj.xTickLocations, x);
            var getYpoints = lineGraphs.getPoints(globalObj.yTickLocations, y);
            lineGraphs.plotPointsOnGraphLine(getXpoints, getYpoints, false, set, label);
            lineGraphs.plotPointsOnGraphBar(getXpoints, getYpoints, set, label, count);
        },
        
        plotPointsOnGraphBar: function (xArray, yArray, set, label, count) {
            if ("bar" === globalObj.graphType) { 
                globalObj.context.globalCompositeOperation = "destination-over";
                globalObj.context.beginPath();  
                globalObj.context.moveTo(xArray[0], yArray[1]); 
                globalObj.context.lineTo(xArray[0], globalObj.configHeight - 2);
                globalObj.context.strokeStyle = globalObj.colors.dataPoints[count]; 
                globalObj.context.lineWidth = 20;        
                globalObj.context.stroke();
                utilities.drawPointLabel("bar", label, xArray, yArray, "", count);
            }
        },
        
        plotPointsOnGraphLine: function (xArray, yArray, bypassDraw, set, label) {
            if ("bar" !== globalObj.graphType) {
                if (false === bypassDraw) {
                    globalObj.context.beginPath();   
                    globalObj.context.arc(xArray[0], yArray[1], 3, 0, 2 * Math.PI); 
                    globalObj.context.fillStyle = globalObj.colors["dataPoints"][set];         
                    globalObj.context.fill();
                    utilities.drawPointLabel("line", label, xArray, yArray, "", set);
                }
                globalObj["connectPoints"][xArray[0]] = {
                    "x":xArray[0],
                    "y":yArray[1]
                };
            }
        },
        
        getPoints: function (obj, point) { 
            if (typeof point === "string" && true === utilities.isFloat(point)) {             
                point = Math.round(point);
            }
            
            if (obj.hasOwnProperty(point)) {
                plotPoints = [
                    obj[point]["x"],
                    obj[point]["y"]
                ];
            }

            return plotPoints;
        },
        
        increasePaddingLeftForLabel: function () {
            if (globalObj.hasOwnProperty("yAxisLabel")) {
                var offset = globalObj.yAxisLabel.toString().length;
                globalObj.paddingLeft = globalObj.paddingLeft + globalObj.labelFontSize + offset;
            }
        },
        
        increasePaddingTopForName: function () {
            if (globalObj.hasOwnProperty("graphName")) {
                globalObj.paddingTop = globalObj.paddingTop + globalObj.graphNameFontSize;
            }
        },
        
        increasePaddingBottomForLabel: function () {
            if (globalObj.hasOwnProperty("xAxisLabel")) {
                globalObj.paddingBottom = globalObj.paddingBottom + globalObj.labelFontSize;
            }
        },
        
        createXaxisLabel: function () {
            if (globalObj.hasOwnProperty("xAxisLabel")) {                           
                globalObj.context.font = "bold " + globalObj.labelFontSize + "px Arial";
                globalObj.context.fillStyle = globalObj.colors["xAxisLabel"];
                globalObj.context.fillText(
                    globalObj.xAxisLabel, 
                    globalObj.configWidth / 2, 
                    globalObj.configHeight + globalObj.paddingBottom
                );
            }
        },
        
        createYaxisLabel: function () {
            if (globalObj.hasOwnProperty("yAxisLabel")) {                          
                globalObj.context.font = "bold " + globalObj.labelFontSize + "px Arial";
                globalObj.context.fillStyle = globalObj.colors["yAxisLabel"];
                globalObj.context.fillText(
                    globalObj.yAxisLabel, 
                    10,
                    globalObj.paddingTop - globalObj.lineWidthOffset - 20
                );
            }
        },
        
        /**
        * Draw the x axis
        */
        drawXaxis: function () {     
            globalObj.context.beginPath();             
            globalObj.context.moveTo(globalObj.paddingLeft, globalObj.configHeight); 
            globalObj.context.lineTo(globalObj.configWidth, globalObj.configHeight);
            globalObj.context.strokeStyle = globalObj.colors["xAxis"];
            globalObj.context.stroke();
        },
        
        /**
        * Draw the y axis
        */
        drawYaxis: function () {     
            globalObj.context.beginPath(); 
            globalObj.context.moveTo(globalObj.paddingLeft, globalObj.paddingLeft + globalObj.lineWidthOffset); 
            globalObj.context.lineTo(globalObj.paddingLeft, globalObj.configHeight);
            globalObj.context.strokeStyle = globalObj.colors["yAxis"];
            globalObj.context.stroke();
        },
        
        getAxisTicksAndCanvasLength: function (
            axisArrayValues, 
            axisIncrement, 
            spacing, 
            axisArrayName, 
            padding, 
            configDimension, 
            extra
        ) {
            var array = [];
            var increment = 0;
            for (var i = 0; i <= axisArrayValues.length; i++) {
                if (0 !== i && i !== axisArrayValues.length) {
                    increment = increment + spacing;
                }
                array.push(increment);
            }
            globalObj[configDimension] = increment + padding + extra;
            globalObj[axisArrayName] = array;           
        },
        
        /**
        * Draw ticks
        */
        drawXticks: function () {
            globalObj.xTickLocations = {};
            var count = 0;
            for (var i = 0; i <= globalObj.xTick.length; i++) {
                var tickX = globalObj.paddingLeft + globalObj.xTick[i];     
                if (typeof globalObj.xAxisValues[i] !== "undefined") {      
                    globalObj.context.beginPath();
                    globalObj.context.lineWidth = lineGraphs.lineWidth;
                    var bold = lineGraphs.addNthValueHighlight(count, globalObj.xAxisValuesEveryNth); 
                    lineGraphs.addBoldLineWidth(bold, "xOnlyShowNthValues");                    
                    globalObj.context.moveTo(tickX, globalObj.tickLength + globalObj.configHeight); 
                    globalObj.context.lineTo(tickX, globalObj.configHeight);
                    globalObj.context.strokeStyle = globalObj.colors["xTicks"];
                    globalObj.context.stroke(); 
                    lineGraphs.addFont(bold);                    
                    lineGraphs.drawDiagonalTickValues(i, tickX, bold); 
                    globalObj.xTickLocations[globalObj.xAxisValues[i].toString()] 
                        = {"x": tickX, "y": globalObj.tickLength + globalObj.configHeight};  
                    count++;                                                         
                }
            }
        },
        
        addFont: function (bold) {
            if (("true" === globalObj.xOnlyShowNthValues && "bold " === bold) || "false" === globalObj.xOnlyShowNthValues) {
                globalObj.context.font
                    = bold + "" + globalObj.tickValueFontSize + "px Arial";
            }
        },
        
        addBoldLineWidth: function (bold, type) {
            if (("true" === globalObj[type] && "bold " === bold) || "false" === globalObj[type]) {
                globalObj.context.lineWidth = lineGraphs.lineWidthBold;
            }
        },
        
        drawDiagonalTickValues: function (i, tickX, bold) {
            var charArray = utilities.checkForAlias("xAxisValues", "xAxisValueAliases", i);
            charArray = charArray.reverse();
            var dir = 0;  
            for (var c = 0; c <= charArray.length; c++) {
                globalObj.context.fillStyle = globalObj.colors["xAxisValues"];
                if (typeof charArray[c] !== "undefined") {
                    var char = charArray[c];
                    var x = tickX + (c * globalObj.tickLength);
                    if (0 !== dir) {
                        var x = dir - globalObj.tickLength;
                    }
                    
                    if (("true" === globalObj.xOnlyShowNthValues && "bold " === bold) || "false" === globalObj.xOnlyShowNthValues) {
                        globalObj.context.fillText(
                            char, x - (globalObj.tickValueFontSize / 2), 
                            (c * globalObj.tickLength) + globalObj.configHeight + (globalObj.tickLength * 3)
                        );
                    }
                    globalObj.context.stroke();
                    dir = x;
                }
            }
        },
        
        /**
        * Draw ticks
        */
        drawYticks: function () {
            globalObj.yTickLocations = {};
            var count = 0;
            var yValuesReversed = globalObj.yAxisValues.reverse();
            for (var i = globalObj.yTick.length; i >= 0; i--) {
                globalObj.context.fillStyle = globalObj.colors["yAxisValues"];
                var tickY = globalObj.yTick[i];     
                if (typeof yValuesReversed[i] !== "undefined") {               
                    var values = yValuesReversed[i];                       
                    globalObj.context.beginPath(); 
                    globalObj.context.moveTo(globalObj.paddingLeft - globalObj.tickLength, tickY + globalObj.paddingLeft); 
                    globalObj.context.lineTo(globalObj.paddingLeft, tickY + globalObj.paddingLeft);
                    globalObj.context.lineWidth = lineGraphs.lineWidth;
                    var bold = lineGraphs.addNthValueHighlight(count, globalObj.yAxisValuesEveryNth);
                    lineGraphs.addBoldLineWidth(bold, "yOnlyShowNthValues");                    
                    globalObj.context.strokeStyle = globalObj.colors["yTicks"];
                    if (("true" === globalObj.yOnlyShowNthValues && "bold " === bold) || "false" === globalObj.yOnlyShowNthValues) {                  
                        globalObj.context.font
                            = bold + "" + globalObj.tickValueFontSize + "px Arial";
                        globalObj.context.fillText(
                            values, globalObj.paddingLeft - (globalObj.tickLength + globalObj.tickValueSpacingY), 
                            tickY + globalObj.paddingTop
                        );
                        globalObj.context.fillStyle = globalObj.colors["yAxisValues"];
                    }
                    globalObj.context.stroke();  
                    globalObj.yTickLocations[values] 
                        = {"x": globalObj.paddingLeft - globalObj.tickLength, "y": tickY + globalObj.paddingTop}; 
                    count++;                      
                }
            }
        },
        
        addNthValueHighlight: function (count, val) {
            var bold = "";
            if (val) {
                if (0 === count % val || 0 === count) {
                    bold = "bold ";
                }
            }
            
            return bold;
        }
    };
    
    var utilities = {
        checkForAlias: function (type, alias, i) {
            var retVal = globalObj[type][i];   
            if (globalObj.hasOwnProperty(alias) && globalObj[alias][i]) {
                retVal = globalObj[alias][i];
            }
            
            return retVal.toString().split('');
        },
        
        addDashLine: function (obj) {
            if (obj.hasOwnProperty("dash") && true === obj.dash) {
                globalObj.context.setLineDash([5, 5]);
            }
        },
        
        getWidthOfGraphName: function () {        
            var w = 400;
            if (globalObj.hasOwnProperty("graphName") && globalObj.hasOwnProperty("graphNameFontSize")) { 
                var size = globalObj.graphName.length * globalObj.graphNameFontSize;
                if (size > w) {
                    w = size;
                }
            }
       
            return w;
        },
        
        isFloat: function (val) {
            return (2 === val.split(".").length) ? true : false;
        },
        
        processAxisValues: function () {
            utilities.updateAxisValuesArray("xAxisValues");
            utilities.updateAxisValuesArray("yAxisValues");
        }, 
        
        updateAxisValuesArray: function (axis) {
            var arrayLength = globalObj[axis].length;
            if (2 === arrayLength) {
                var count = globalObj[axis][1];
                var adjusted = [];
                for (var i = 0; i <= count; i++) {                    
                    adjusted.push(i);
                }  
                globalObj[axis] = adjusted;  
            }
        },
        
        createTotalValue: function (set) {
            var total = 0;
            for (var key in globalObj.dataPointsXandY[set]) {
                if (globalObj.dataPointsXandY[set].hasOwnProperty(key)) {
                    var value = utilities.getValueFromValLabelObj(globalObj.dataPointsXandY[set][key]);
                    total = total + Number(value);
                }
            }
            
            return total;
        },
        
        countObjects: function (obj) {
            var count = 0;
            for (var key in obj) {
                count++;
            }
            
            return count;
        },
        
        getUserConfigColor: function (obj, set, i) {
            var color = obj.colors[i];
            if (globalObj.colorConfig.hasOwnProperty("pie") && globalObj.colorConfig.pie[set][i]) {
                color = globalObj.colorConfig.pie[set][i];
            }
          
            return color;
        },
        
        isDir: function () {
            var retVal = false;          
            var array = [
                ".png",
                ".jpg"
            ];
            
            for (var i = 0; i <= array.length; i++) {
                if (-1 !== globalObj.bgImageAndColor[0].indexOf(array[i])) {
                    retVal = true;
                }
            }
            
            return retVal;
        },
        
        checkForColors: function (type) { 
            globalObj.colors.dataPoints = globalObj.colors.bars;       
            if (0 === Object.keys(globalObj.colors[type]).length) {
                for (var set in globalObj.dataPointsXandY) {
		          if (globalObj.dataPointsXandY.hasOwnProperty(set)) {  
		            utilities.addColorsToObject(globalObj.dataPointsXandY[set], set, type);
		          }
		        }
            }
        },
        
        addColorsToObject: function (obj, set, type) {
            if (!globalObj.colors[type].hasOwnProperty(set)) {
                 globalObj.colors[type][set] = {};
            }
            
            for (var key in obj) {
	          if (obj.hasOwnProperty(key)) {  
	            globalObj.colors[type][set][key] 
	                = utilities.colorGen();
	            globalObj.colors.dataPoints[key] 
	                = utilities.colorGen();
	          }
	        }
        },
        
        getColors: function (obj, count) {
            var i = 0;
            while (i <= count) {
                var color = utilities.colorGen();
                if (obj.colors.indexOf(color) === -1) {
                    obj.colors.push(color);
                    i++;
                }
            }
            
            return obj;
        },
        
        colorGen: function () {
            var hex = Math.random().toString(16).slice(2, 8).toUpperCase();
            if (-1 !== utilities.excludedColors().indexOf(hex)) {
                utilities.colorGen();
            }
            
            return '#' + hex;
        },
        
        excludedColors: function () {
            return [
                "FFFFFF",
            ];
        },
        
        createGraphName: function () {
            if (globalObj.hasOwnProperty("graphName")) {                         
                globalObj.context.font = "bold " + globalObj.graphNameFontSize + "px Arial";
                globalObj.context.fillStyle = globalObj.colors["graphName"];
                globalObj.context.fillText(
                    globalObj.graphName, 
                    10, 
                    globalObj.graphNameFontSize
                );               
            }
        },
        
        getLabelHeight: function (currentLabel, savedLabel) {
            retVal = savedLabel;
            if (typeof currentLabel !== "undefined") {
                retVal = savedLabel + 1;
            }
         
            return retVal;
        },
        
        getLongestLabel: function (currentLabel, savedLabel) {
            retVal = savedLabel;
            if (typeof currentLabel !== "undefined") {
                retVal = savedLabel;
                if (currentLabel.length > savedLabel.length) {
                    retVal = currentLabel;
                }
            }
         
            return retVal;
        },
        
        applyAdditionalSpaceHeight: function (location, height, set) {
            if (height >= 10) {
                globalObj["applyHeightToNextPie"] = height;
              }
              
              if (set > 0 && !isNaN(globalObj["applyHeightToNextPie"])) {
                location = location + (globalObj["applyHeightToNextPie"] * 10) * set;
              }
              
              return location;
        },
        
        pieChartSpacer: function (location, set) {  
            if (set > 0) {
                location = location + (100 * set);
            }
            
            return location;;
        },
        
        getValueFromValLabelObj: function (data) {
            var value = data;
            if (typeof data === "object") {
                value = Object.keys(data)[0];
            } 
            
            return value;
        },
        
        getLabelFromValLabelObj: function (data) {
            var value = "";
            if (typeof data === "object") {
                value = Object.keys(data)[0];
            } 
            
            return data[value];
        },
                    
        drawPointLabel: function (type, label, xArray, yArray, extra, set) {
            var obj = {
                "line": function (label, xArray, yArray, extra, set) {
                    utilities.drawPointLabelForLine(label, xArray, yArray, set);
                },
                "bar": function (label, xArray, yArray, extra, set) {
                    utilities.drawPointLabelForLine(label, xArray, yArray, extra, set);
                },
                "pie": function (label, xArray, yArray, extra, set) {
                    utilities.drawPointLabelForPie(label, xArray, yArray, extra, set);
                },
                "infoGraphic": function (label, xArray, yArray, extra, set) {
                    utilities.drawPointLabelForInfoGraphic(label, xArray, yArray, extra, set);
                }
            };
            
            if (typeof obj[type] === "function") {
                obj[type](label, xArray, yArray, extra, set);
            }
        },
        
        drawPointLabelForInfoGraphic: function (label, x, y, obj, set) {
            if (typeof label !== "undefined" && "" !== label) {
                label = label + " " + obj.percent + "%";
                globalObj.context.globalCompositeOperation = "source-over";
                globalObj.context.font = globalObj.infoGraphicPointFontSize + "px Arial";
                globalObj.context.fillStyle = obj.color;
                globalObj.context.fillText(
                    label, 
                    x, 
                    y
                );
                globalObj.context.beginPath();   
                globalObj.context.arc(x - 15, y - 7, 5, 0, 2 * Math.PI); 
                globalObj.context.fillStyle = obj.color;         
                globalObj.context.fill();
            }
        },
       
        drawPointLabelForLine: function (label, xArray, yArray, obj, set) {
            if (typeof label !== "undefined" && "" !== label) {
                globalObj.context.globalCompositeOperation = "destination-over";
                globalObj.context.font = "14px Arial";
                globalObj.context.fillStyle = globalObj.colors.dataPoints[set];
                globalObj.context.fillText(
                    label, 
                    xArray[0], 
                    yArray[1] - 4
                );
            }
        },
        
        drawPointLabelForPie: function (label, x, y, obj, set) {
            if (typeof label !== "undefined" && "" !== label) {
                label = label + " " + obj.percent + "%";
                globalObj.context.globalCompositeOperation = "destination-over";
                globalObj.context.font = "14px Arial";
                globalObj.context.fillStyle = globalObj.colors.dataPoints[set];
                globalObj.context.fillText(
                    label, 
                    x + 20,
                    y - 4
                );
                globalObj.context.beginPath();   
                globalObj.context.arc(10, y - 10, 5, 0, 2 * Math.PI); 
                globalObj.context.fillStyle = obj.color;         
                globalObj.context.fill();
            }
        }
    };
    
    var equations = {
        linearRegression: function (y, x) {
            var lr = {};
            var n = y.length;
            var sum_x = 0;
            var sum_y = 0;
            var sum_xy = 0;
            var sum_xx = 0;
            var sum_yy = 0;

            for (var i = 0; i < y.length; i++) {
                sum_x += x[i];
                sum_y += y[i];
                sum_xy += (x[i]*y[i]);
                sum_xx += (x[i]*x[i]);
                sum_yy += (y[i]*y[i]);
            } 

            lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
            lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
            lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)), 2);           
            validate.checkForNaN(lr);
            
            return lr;
        }
    };
    
    /**
    * Render error in console log
    */
    var errorHandler = {
        processError: function (message, error) {
            console.log(message + error.stack);
        }
    };
}());
 
