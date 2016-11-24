console.log("I'm loaded!!");

(function() {
    function saveResultsToCaspio(results) {
        // Caspio REST endpoints
        var tokenUrl = "https://c0ezh785.caspio.com/oauth/token";
        var resourceUrl = "https://c0ezh785.caspio.com/rest/v1";

        // auth parameters
        // these are set through the Caspio website:
        // Account (menubar) -> Access Permissions -> Web Services Profiles (tab)
        // don't worry that we've embedded our ID and secret here -- permissions are set such that the only thing people can do is submit to a specific table
        var clientId = "bcc8f2f4c8e844053b20432538458e82e3e184279a73d0d558";
        var clientSecret = "3aea53af866c46c39f5d0f6ba32c8a79a920c4cc283989b573";

        // authorize with the caspio service
        var authBody = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
        console.log("authBody:", authBody);
        var authReq = new XMLHttpRequest();
        authReq.onload = function() {
            console.log(this.responseText);
            var data;
            try {
                data = JSON.parse(this.responseText);
            } catch (err) {
                console.log("Got error");
                console.log(err);
                throw (err);
            }

            // URL for the table that we want to upload to
            var table = "DataDump"; // XXX change
            var tableRequestUrl = `${resourceUrl}/tables/${table}/rows`;
            console.log(tableRequestUrl);

            // set the data body, this corresponds to the fields in the Caspio table
            var dataBody = {
                tool_version: results.tool_version,
                protocol_family: results.protocol_family,
                protocol_version: results.protocol_version,
                guid: results.guid,
                product: results.product,
                passed: results.stats.passes,
                failed: results.stats.failures,
                run_start_timestamp: results.stats.start,
                run_end_timestamp: results.stats.end,
            };
            // console.log(JSON.stringify(dataBody, null, 2));

            // new request to submit the data
            var dataReq = new XMLHttpRequest();
            dataReq.open("POST", tableRequestUrl);
            console.log("Access token:", data.access_token);
            dataReq.setRequestHeader("Authorization", "Bearer " + data.access_token);
            dataReq.setRequestHeader("Content-Type", "application/json");
            dataReq.setRequestHeader("Accept", "applicatison/json");
            // dataReq.setRequestHeader("Content-Type", "applicatison/json");
            dataReq.onload = function() {
                console.log("Got data");
                console.log("responseText:", this.responseText);
                console.log("status:", this.status); // 201
                console.log("status Text:", this.statusText); // "Created"
                var div = document.getElementById("mocha-results");
                console.log (this.status == 201);
                console.log (div);
                if (div && this.status == 201) {
                    console.log ("All done!");
                    div.innerHTML = //"Done!";
`Done!
<h2> Your results have been successfully submitted</h2>
`;
                }
            };
            dataReq.send(JSON.stringify(dataBody));
        };
        authReq.open("POST", tokenUrl);
        authReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        authReq.send(authBody);
    }

    // when the form gets a submit click, it should call this
    submitResults = function() {
        // get form values
        var tool_version = document.getElementById("tool-version") || {};
        var protocol_family = document.getElementById("protocol-family") || {};
        var protocol_version = document.getElementById("protocol-version") || {};
        var guid = document.getElementById("guid") || {};
        var product = document.getElementById("product") || {};
        var aaid = document.getElementById("aaid") || {};

        // make sure we have all the mandatory values
        if (typeof tool_version.value !== "string" ||
            typeof protocol_family.value !== "string" ||
            typeof protocol_version.value !== "string" ||
            typeof guid.value !== "string" ||
            typeof product.value !== "string") {
            throw new TypeError("Expected version, guid, and product input elements");
        }

        // on submitting results panel form, save results to Caspio
        results.tool_version = tool_version.value;
        results.guid = guid.value;
        results.product = product.value;
        results.aaid = aaid.value;
        results.protocol_family = protocol_family.value;
        results.protocol_version = protocol_version.value;

        // send the results to Caspio
        saveResultsToCaspio(results);
    };

    var results;
    // our custom Mocha reporter fires a "json-results" event with the results object in event.detail
    document.addEventListener("json-results", function(event) {
        results = event.detail || {};
        // console.log(JSON.stringify(results, null, 2));

        var query = Mocha.utils.parseQuery(window.location.search || '');
        var filtered = (query.grep || query.egrep || query.invert) !== undefined;

        // display results panel and wait for submit
        if (!filtered && results.stats && results.stats.failures === 0) {
            var div = document.getElementById("mocha-results");
            if (div && div.style) div.style.display = "block";
        }
    });
})();

// exported from the IIFE above
var submitResults;

/* JSHINT */
/* globals Mocha */