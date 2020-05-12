# easyGraph
easyGraph is a JavaScript plugin that allows you to create simple line, bar, pie, scatter plot graphs, and info graphics. Simply, add your data points and configurations to the easyGraphs API

Project & examples located here: http://www.damionmullins.com/projects/easyGraph

Instructions:
1. Include easyGraph.js to your application or website
2. Add canvas elements anywhere you would like a graph
3. Give each canvas element a unique id
4. Setup your configurations in the API (i.e. {...}} as shown below
5. initialize each graph by running: new EasyGraphs({...})

API Configuration Example:
```
{
    "elementId": "mySecondGraph",                                 /*id of canvas element*/
    "graphType": "bar",                             /*Graph types: pie, line, bar, scatterPlot, infoGraphic*/
    "bgImageAndColor": ["/img/fruit.jpg"],         /*Back ground color and image for your graph (not required - default is white)*/
    "graphName": "Basic Graph Example", /*Graph Name (not required)*/
    "graphNameFontSize": 40,                                /*Font size of graph name (not required)*/
    "graphSizeWidth": "100%",                               /*CSS width and unit (i.e %, px, etc...)*/
    "graphSizeHeight": "100%",                              /*CSS height and unit (i.e %, px, etc...)*/
    "addModalWindowOption": "yes",                          /*Allow users to click on graph to get more options (i.e. yes/no)*/
    "modalGraphChoices": ["pie", "line", "bar", "scatterPlot", "infoGraphic"], /*If enabling addModalWindowOption, add the graphs that you would like to show (empty equals all)*/
    "colorConfig": {                                        /*Colors (i.e. hex or color name). None of these colors are required, but they are recommended*/
        "xAxis": "#6699cc",                                 /*x axis color*/
        "yAxis": "#6699cc",                                 /*y axis color*/
        "xAxisValues": "#333333",                           /*x axis values colors*/
        "yAxisValues": "#333333",                           /*y axis values colors*/
        "graphName": "#666666",                             /*Graph name color*/
        "xAxisLabel": "#6699cc",                            /*x axis label color*/
        "yAxisLabel": "#6699cc",                            /*y axis label color*/
        "dataPoints": ["#333333"],                          /*Color of each set of data points (i.e. [color1, color2, etc...])*/
        "graphLine": ["#BCC6CC", "#98AFC7", "#6D7B8D"],     /*Color of each graph line (i.e. [color1, color2, etc...]*/
        "bars": [],                                         /*Color of each bar in bar graph (i.e. [color1, color2, etc...])*/
        "xTicks": "#6699cc",                                /*x axis tick mark color*/
        "yTicks": "#6699cc",                                /*y axis tick mark color*/
        "trendLine": ["#BCC6CC", "#98AFC7", "#6D7B8D"],     /*Each line of best fit color (i.e. [color1, color2, etc...])*/
        "pie": [                                            /*Color of each slice in each pie graph (not required)*/
            []
        ]
    },
    /*Each set of data points.  Making the y point an object where the point is the index and the label is the value will allow you to have a label at that point.*/
    "dataPointsXandY": [                                    
        {
            "1":{"5":"Apples"},
            "2":{"3":"Oranges"},
            "3":{"15":"Bananas"},
            "4":{"10":"Grapes"},
            "5":{"2":"Rasberries"},
            "6":{"25":"Blue Berries"},
            "7":{"11":"Strawberries"},
            "8":{"8":"Grapefruit"},
            "9":{"9":"Kiwi"},
            "10":{"28":"Pineapple"}
        }
    ],	
    /*Location of each datapoint in each set for infoGraphic*/
    "infoGraphicPointLocations": [
        {
            "1": [50, 75], 
            "2": [50, 100], 
            "3": [50, 125], 
            "4": [50, 150], 
            "5": [50, 175], 
            "6": [50, 200], 
            "7": [50, 225], 
            "8": [50, 250], 
            "9": [50, 275],
            "10": [50, 300]
        }
    ], 
    "infoGraphicWidthAndHeight": [1000, 500],               /*Width and height of the graphic (not required, but highly recommended  )*/        
    "infoGraphicPointFontSize": "20",                       /*Font size of each info graphic point (not required)*/
    "tickValueFontSize": 14,                                /*Font size of all tick values (not required)*/
    "labelFontSize": 30,                                    /*Font size of both axis labels (not required)*/
    "tickLength": 10,                                       /*Length of all tick markss (not required)*/
    "xAxisLabel": "My X Axis",                              /*x axis label name (not required)*/
    "xTickMarkSpacing": 50,                                 /*Space between each x axis tick mark (not required)*/
    "xAxisValues": [0, 10],                                 /*Range of values from 0 to nth number (required)*/
    /*Change text of x axis values i.e. {x:"Text..."} (not required)*/
    "xAxisValueAliases": {},      
    "xAxisValuesEveryNth": 1,                               /*Bold each x axis value on every nth number (e.g. every 7th value) (not required)*/
    "xOnlyShowNthValues": "false",                           /*Only show each x axis value based on xAxisValuesEveryNth (not required)*/
    "yTickMarkSpacing": 20,                                 /*Space between each y axis tick mark (not required)*/
    "yAxisValues": [0, 30],                                /*Range of values from 0 to nth number (required)*/
    "yAxisValueAliases": {},
    "yAxisLabel": "My Y Axis",                              /*y axis label name (not required)*/
    "yAxisValuesEveryNth": 1,                               /*Bold each y axis value on every nth number (e.g. every 7th value) (not required)*/
    "yOnlyShowNthValues": "true"                            /*Only show each y axis value based on yAxisValuesEveryNth (not required)*/
}
```
