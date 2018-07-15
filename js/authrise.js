
    var CLIENT_ID = '805129602356-a4a1rbd3q1kvuon5vkstjkakf3mjteq7.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyBbnPy7OIGsuPoUzb-1w_2JvZp641H2Yg8';
    var SPREADSHEET_ID = '1H4iuXgm4WfqJTK7nP49Z-zazENBqxAgyEJ4O1UM7DOM';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    var authorizeButton = document.getElementById('authorize-button');
    var signoutButton = document.getElementById('signout-button');
    var tablelab = document.getElementById('tablelab');
    var label = document.getElementById('label');
    var googleurl = document.getElementById('googleurl');
    var headerid = document.getElementById('headerid');

    var trdata;
    var editor;
    var table;
    var setoptval;
    var stog = 0;
    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function createApiCall(data) {

        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: SPREADSHEET_ID,  // TODO: Update placeholder value.

            // The A1 notation of a range to search for a logical table of data.
            // Values will be appended after the last row of the table.
            range: 'Sheet1!A1:Z964',  // TODO: Update placeholder value.

            // How the input data should be interpreted.
            valueInputOption: 'RAW',  // TODO: Update placeholder value.

            // How the input data should be inserted.
            insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
        };

        var valueRangeBody = {
            "range": "Sheet1!A1:Z964",
            "majorDimension": "ROWS",
            "values": [data] };

        var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        request.then(function(response) {
            // TODO: Change code below to process the `response` object:
            listMajors();
            console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }

    function updateApiCall(data) {

        var id = 0 ; var values = [];

        for (let dt of Object.keys(data)) {
            id = parseInt(dt) + 1;
        }

        for (let value of Object.values(data)) {
            values = Object.values(value);
        }

        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: SPREADSHEET_ID,  // TODO: Update placeholder value.

            // The A1 notation of the values to update.

            range: 'Sheet1!A' + id + ':Z' + id,

            // How the input data should be interpreted.
            valueInputOption: 'USER_ENTERED',  // TODO: Update placeholder value.

        };

        var valueRangeBody = {
            // TODO: Add desired properties to the request body. All existing properties
            // will be replaced.
            "range": "Sheet1!A" + id + ":Z" + id,
            "majorDimension": "ROWS",
            "values": [values]
        };

        var request = gapi.client.sheets.spreadsheets.values.update(params,valueRangeBody);
        request.then(function(response) {
            // TODO: Change code below to process the `response` object:
            listMajors();
            console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }

    function deleteApiCall(data) {

        var id = 0 ;

        for (let dt of Object.keys(data)) {
            id = parseInt(dt) + 1;
        }
        var params = {
            // The spreadsheet to apply the updates to.
            spreadsheetId: SPREADSHEET_ID,  // TODO: Update placeholder value.
        };

        var batchUpdateSpreadsheetRequestBody = {
            // A list of updates to apply to the spreadsheet.
            // Requests will be applied in the order they are specified.
            // If any request is not valid, no requests will be applied.
            requests: [
                {
                    "deleteDimension": {
                        "range": {
                            "sheetId": 0,
                            "dimension": "ROWS",
                            "startIndex": id-1,
                            "endIndex": id
                        }
                    },
                }
            ],
            // TODO: Add desired properties to the request body.
        };

        var request = gapi.client.sheets.spreadsheets.batchUpdate(params, batchUpdateSpreadsheetRequestBody);
        request.then(function(response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }
    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';
            tablelab.style.display = 'block';
            label.style.display = 'none';
            googleurl.style.display = 'block';

            setInterval(function() {
                listMajors();
            }, 5000 );

            setInterval(function() {
                listSelects();
            }, 5000 );

        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
            tablelab.style.display = 'none';
            label.style.display = 'block';
            googleurl.style.display = 'none';
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
    }

    /**
     * Print the names and majors of students in a sample spreadsheet:
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    function listMajors() {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A1:Z964',
        }).then(function(response) {
            var range = response.result;

            if (range.values.length > 0) {

                var header = [];
                var dataSet = [];
                var row = range.values[0];

                for (j = 1; j <= row.length; j++){
                    header[0] = "id";
                    header[j] = row[j-1];
                }

                for (i = 1; i < range.values.length; i++) {
                    var row = range.values[i];

                    var item = {};
                    for (j = 1; j <= row.length; j++) {

                        item[header[0]] = i;
                        item[header[j]] = row[j-1];
                    }

                    dataSet[i - 1] = item;
                }

                var my_columns = [];

                $.each( dataSet[0], function( key, value ) {
                    var my_item = {};
                    my_item.data = key;
                    my_item.title = key;
                    my_columns.push(my_item);
                });

                $.fn.dataTable.ext.errMode = 'none';

                table = $('#example').DataTable({
                    data: dataSet,
                    "columns": my_columns,
                    retrieve: true,
                    searching: false,
                    pageLength: 10,
                    select:true,
                    "columnDefs": [
                        { "visible": false, "targets": 0 }
                    ]
                });

                $('#example').dataTable().fnClearTable();
                $('#example').dataTable().fnAddData(dataSet);

                ///////////datatable editor////////////

                var fields = [];

                for (k = 0; k < header.length; k++){
                    var fielditem = {};
                    fielditem['label'] = header[k];
                    fielditem['name'] = header[k];
                    if (k !=0 ) {
                        fields[k-1] = fielditem;
                    }
                }

                editor = new $.fn.dataTable.Editor( {
                    table: "#example",
                    fields: fields,
                    idSrc:  'id',
                    ajax: function ( method, url, data, successCallback, errorCallback ) {
                        var id = null;
                        var store = JSON.parse( localStorage.getItem('datatable_todo') );

                        if ( data.action === 'create' ) {

                            var rtn=0; var createdata=[];
                            for (k = 0; k < header.length; k++){
                                if(data.data[0][header[k]] == ''){
                                    rtn += 1;
                                }else {
                                    if( k != 0) {
                                        createdata[k-1] = data.data[0][header[k]];
                                    }
                                }
                            }

                            if ( rtn ==0 ){
                                createApiCall(createdata);
                            }
                        }
                        else if ( data.action === 'edit' ) {

                            updateApiCall(data.data);

                        }
                        else if ( data.action === 'remove' ) {

                            deleteApiCall(data.data);

                        }

                        localStorage.setItem('datatable_todo', JSON.stringify(store));
                        successCallback( {"id": id} );
                    }
                } );

                    table.buttons().container().empty();
                    new $.fn.dataTable.Buttons( table, [
                        { extend: "create", editor: editor },
                        { extend: "edit",   editor: editor },
                        { extend: "remove", editor: editor }
                    ] );

                    table.buttons().container()
                        .appendTo( $('.col-md-6:eq(0)', table.table().container() ) );

                    $('#example').on( 'click', 'tr', function () {
                        trdata = table.row( this ).data();
                    } );

                    if(trdata){
                        var num = trdata.id - 1;
                        table.row(num).select();
                    }
            } else {
                appendPre('No data found.');
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });
    }

    function listSelects() {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'BootstrapSelect!A1:Z964',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                var row = range.values;

                var ms = '';
                ms = '<select class="selectpicker" id="selectid">';

                for (i = 1; i < row.length; i++) {

                    ms += '<option value="'+ row[i][1] +'">'+ row[i][0] +'</option>';

                }

                ms += '</select>';

                $('#selectpk').html(ms);

                $('.selectpicker').selectpicker({
                    style: 'btn-info',
                    size: row.length
                });

                $('.selectpicker').change(function (e) {

                    setoptval = e.target.value;

                });

                if(setoptval){

                    $('.selectpicker').selectpicker('val', [setoptval]);

                }

                if (stog == 1){

                    $('div.bootstrap-select').removeClass('show');
                    $('div.dropdown-menu.open').removeClass('show');

                    $('.selectpicker').selectpicker('toggle');


                }else {

                    $('div.bootstrap-select').removeClass('show');
                    $('div.dropdown-menu.open').removeClass('show');

                }
                setInterval(function() {
                    if ( !$('div.bootstrap-select').hasClass('show') ) {
                        stog = 0; //select cancel
                    }else {
                        stog = 1;
                    }
                }, 100 );

            } else {
                appendPre('No data found.');
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });
    }