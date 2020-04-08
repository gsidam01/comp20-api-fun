function check_data_ranges(day, month, year)
{
    // alert("Day: " + day + ", Month: " + month + ", Year: " + year); Important for debugging
    if (year < 1955 || year > 2020) {
        return false;
    }
    if (month < 0 || month > 12) {
        return false;
    }
    if (day < 0 || day > 31) {
        return false;
    }
    if (month == 4 || month == 6 || month == 9 || month == 11) {
        if (day > 30) {
            return false;
        }
    }
    if (month == 2) {
        if (year % 4 == 0 && day > 29) {
                return false;
        } else if (day > 28) {
            return false;
        }
    }
    return true;
}


function request_data(day, month, year, failure_msg)
{
    var day1 = parseInt(day);
    var day2 = parseInt(day) + 1;

    if (day1 < 10) {
        day1 = "0" + day1;
    }
    if (day2 < 10) {
        day2 = "0" + day2;
    }
    if (month < 10) {
        month = "0" + month;
    }

    request = new XMLHttpRequest();
    var request_url = "https://launchlibrary.net/1.3/launch/" + year + "-" + month + "-" + day1 + "/" + year + "-" + month + "-" + day2;
    // alert(request_url); Hugely important for debugging

    request.open("GET", request_url, true);

    if (! request ) {
        alert("Error ! request");
    }
    request.onreadystatechange = function() {


    if (request.readyState == 4 && request.status == 200) {

        var data = this.response;
        if (data == "{}") {
            alert("Error, the data is empty!");
        }
        else {
            var data_parse = JSON.parse(data);
            var num_launches = data_parse.count;
            if (num_launches == 0) {
                alert("No launches on this day, but ERROR because this should have not passed request.status == 200");
            }
            else {
                var display_data = "";
                for (var i = 0; i < num_launches; i++) {
                    display_data += "<div id='launch'" + i + ">"
                        + "<strong>Rocket Model:</strong> " + data_parse.launches[i].rocket.name + "<br />"
                        + "<strong>Launch Location:</strong> " + data_parse.launches[i].location.name + "<br />"
                        + "<strong>Primary Agency:</strong> " + data_parse.launches[i].lsp.name + " ("
                        + data_parse.launches[i].lsp.abbrev + ")"
                        +  "<br />";

                    display_data += "</div>"
                }
                document.getElementById("data_here").innerHTML = display_data;
            }
        }
    }
    else if (request.readyState == 4 && request.status != 200) 
    {
        document.getElementById("data_here").innerHTML = "<div>" + failure_msg + "</div>";
    }

    }
    request.send();
    
}


function check_date()
{
    var day = document.getElementById("day").value;
    var month = document.getElementById("month").value;
    var year = document.getElementById("year").value;

    if (check_data_ranges(day, month, year) == false) {
        return false;
    }
    request_data(day, month, year, "There were no launches.");
}



function check_today()
{
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    if (check_data_ranges(day, month, year) == false) {
        return false;
    }
    request_data(day, month, year, "There have been no recorded launches today.");
}




