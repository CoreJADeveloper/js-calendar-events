(function () {
    window.calendar_default_value = {
        current_year: 0,
        current_month: 0,
        current_day: 0,
        current_date: null,
        days_in_month: 0,
        week_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month_names: ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
    };

    var define_property = function(obj, key, value){
        var config = {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
        };

        Object.defineProperty(obj, key, config);
    };

    window.calendar_api_options = Object.create(Object.prototype);

    define_property(window.calendar_api_options, 'DISCOVERY_DOCS', ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']);
    define_property(window.calendar_api_options, 'SCOPES', 'https://www.googleapis.com/auth/calendar');

    var calendar_element = document.getElementsByTagName(window.calendar_options.tag);

    let date_obj = new Date();

    let month, year;

    if (typeof month == 'undefined' || month == null || month == '') {
        let current_month = date_obj.getMonth();
        month = current_month;
    }

    if (typeof year == 'undefined' || year == null || year == '') {
        let current_year = date_obj.getFullYear();
        year = current_year;
    }

    let calendar_html = generate_calendar_skeleton(month, year);

    calendar_element[0].appendChild(calendar_html);

    document.getElementById('previous-month').addEventListener('click', function (e) {
        e.preventDefault();
        let prev_month = get_previous_month();
        let prev_year = get_previous_year();

        var element =  document.getElementById('js-popup-modal');
        if (typeof(element) != 'undefined' && element != null)
        {
            document.getElementById('js-popup-modal').remove();
        }

        //document.getElementById('js-popup-modal').remove();

//            reload_calendar_body(prev_year, prev_month);

        let date_obj = new Date(prev_year, prev_month, 1);

        let month, month_name, year;

        if (typeof month == 'undefined' || month == null || month == '') {
            let current_month = date_obj.getMonth();
            month = current_month;
            month_name = window.calendar_default_value.month_names[date_obj.getMonth()];
        }

        if (typeof year == 'undefined' || year == null || year == '') {
            let current_year = date_obj.getFullYear();
            year = current_year;
        }

        let calendar_days_tbody = document.querySelector('#calendar-table tbody');
        calendar_days_tbody.parentNode.removeChild(calendar_days_tbody);

        document.getElementById('month-information').innerText = month_name + ' ' + year;

        let calendar_days_table = document.querySelector('#calendar-table');
        let prev_calendar_html = generate_calendar_body_content(month, year);
        calendar_days_table.appendChild(prev_calendar_html);
    });

    document.getElementById('next-month').addEventListener('click', function (e) {
        e.preventDefault();
        let next_month = get_next_month();
        let next_year = get_next_year();

        var element =  document.getElementById('js-popup-modal');
        if (typeof(element) != 'undefined' && element != null)
        {
            document.getElementById('js-popup-modal').remove();
        }

//            reload_calendar_body(next_year, next_month);

        let date_obj = new Date(next_year, next_month, 1);

        let month, month_name, year;

        if (typeof month == 'undefined' || month == null || month == '') {
            let current_month = date_obj.getMonth();
            month = current_month;
            month_name = window.calendar_default_value.month_names[date_obj.getMonth()];
        }

        if (typeof year == 'undefined' || year == null || year == '') {
            let current_year = date_obj.getFullYear();
            year = current_year;
        }

        let calendar_days_tbody = document.querySelector('#calendar-table tbody');
        calendar_days_tbody.parentNode.removeChild(calendar_days_tbody);

        document.getElementById('month-information').innerText = month_name + ' ' + year;

        let calendar_days_table = document.querySelector('#calendar-table');
        let next_calendar_html = generate_calendar_body_content(month, year);
        calendar_days_table.appendChild(next_calendar_html);
    });

    timeout_for_refreshing_calendar();

})();

function timeout_for_refreshing_calendar() {
    setInterval(function () {
        let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        let internet_connected = check_internet_connected();

        if (isSignedIn && internet_connected) {
            insert_offline_event_to_google();
            listUpcomingEvents();
        }
    }, 4000);
}

//    function reload_calendar_body(year, month){
//        let date_obj = new Date(year, month, 1);
//
//        let month_name;
//
//        if (typeof month == 'undefined' || month == null || month == '') {
//            let current_month = date_obj.getMonth();
//            month = current_month;
//            month_name = window.calendar_default_value.month_names[date_obj.getMonth()];
//        }
//
//        if (typeof year == 'undefined' || year == null || year == '') {
//            let current_year = date_obj.getFullYear();
//            year = current_year;
//        }
//
//        let calendar_days_tbody = document.querySelector('#calendar-table tbody');
//        calendar_days_tbody.parentNode.removeChild(calendar_days_tbody);
//
//        document.getElementById('month-information').innerText = month_name + ' ' + year;
//
//        let calendar_days_table = document.querySelector('#calendar-table');
//        let next_calendar_html = generate_calendar_body_content(month, year);
////            console.log(prev_calendar_html);
//        calendar_days_table.appendChild(next_calendar_html);
//    }

function refresh_calendar() {
//        document.getElementsByTagName(window.calendar_options.tag)[0].innerHTML = '';
//
//        let calendar_html = generate_calendar_skeleton(window.calendar_default_value.current_month, window.calendar_default_value.current_year);
//
//        document.getElementsByTagName(window.calendar_options.tag)[0].appendChild(calendar_html);

    let date_obj = new Date(window.calendar_default_value.current_year, window.calendar_default_value.current_month, 1);

    //console.log(window.calendar_default_value.current_month);

    let month, month_name, year;

    if (typeof month == 'undefined' || month == null || month == '') {
        let current_month = date_obj.getMonth();
        month = current_month;
        month_name = window.calendar_default_value.month_names[date_obj.getMonth()];
    }

    if (typeof year == 'undefined' || year == null || year == '') {
        let current_year = date_obj.getFullYear();
        year = current_year;
    }

    let calendar_days_tbody = document.querySelector('#calendar-table tbody');
    calendar_days_tbody.parentNode.removeChild(calendar_days_tbody);

    document.getElementById('month-information').innerText = month_name + ' ' + year;

    let calendar_days_table = document.querySelector('#calendar-table');
    let next_calendar_html = generate_calendar_body_content(month, year);
    calendar_days_table.appendChild(next_calendar_html);

    //console.log('refreshed');
}

function generate_calendar_skeleton(month, year) {
    window.calendar_default_value.current_month = month;
    window.calendar_default_value.current_year = year;
    window.calendar_default_value.current_day = 0;
    window.calendar_default_value.days_in_month = 0;
    window.calendar_default_value.current_date = null;

    let calendar_parent_div = document.createElement('div');

    calendar_parent_div.style.width = window.calendar_options.width;
    calendar_parent_div.style.minHeight = window.calendar_options.height;
    calendar_parent_div.id = 'calendar-parent-div';

    let google_calendar_integrator = generate_google_calendar_integrator();
    calendar_parent_div.appendChild(google_calendar_integrator);

    let calendar_month_navigator = generate_calendar_month_navigator(month, year);
    calendar_parent_div.appendChild(calendar_month_navigator);

    let calendar_body = generate_calendar_body(month, year);
    calendar_parent_div.appendChild(calendar_body);

    return calendar_parent_div;
}

function generate_google_calendar_integrator() {
    let google_calendar_tray = document.createElement('div');
    google_calendar_tray.style.textAlign = 'center';

    let google_calendar_authorize = document.createElement('a');
    google_calendar_authorize.href = '#';
    google_calendar_authorize.id = 'authorize-google-calendar';
    google_calendar_authorize.style.display = 'inline';
    google_calendar_authorize.appendChild(document.createTextNode('Integrate Google Calendar Events'));

    let google_calendar_signout = document.createElement('a');
    google_calendar_signout.href = '#';
    google_calendar_signout.id = 'signout-google-calendar';
    google_calendar_signout.style.display = 'none';
    google_calendar_signout.style.marginLeft = '10px';
    google_calendar_signout.appendChild(document.createTextNode('Sign Out'));

    google_calendar_tray.appendChild(google_calendar_authorize);
    google_calendar_tray.appendChild(google_calendar_signout);

    return google_calendar_tray;
}

function generate_calendar_month_navigator(month, year) {
    let calendar_month_navigator_div = document.createElement('div');
    calendar_month_navigator_div.style.clear = 'both';

    let left_navigator_element = document.createElement('div');
    left_navigator_element.style.float = 'left';
    left_navigator_element.style.display = 'inline';

    let left_navigator_icon_element = document.createElement('img');
    left_navigator_icon_element.src = 'back.png';
    left_navigator_icon_element.alt = 'previous';
    left_navigator_icon_element.id = 'previous-month';
    left_navigator_icon_element.width = '20';
    left_navigator_icon_element.height = '20';
//        left_navigator_icon_element.style.float = 'left';
    left_navigator_icon_element.style.cursor = 'pointer';

//        let google_calendar_integrator = generate_google_calendar_integrator();

//        left_navigator_icon_element.dataset.prevMonth = get_previous_month();
//        left_navigator_icon_element.dataset.prevYear = get_previous_year();

    left_navigator_element.appendChild(left_navigator_icon_element);
//        left_navigator_element.appendChild(google_calendar_integrator);

    let month_of_year_element = document.createElement('div');
    month_of_year_element.style.display = 'inline';

    let date_obj = new Date(year, month, 1);

    let month_name;

    if (typeof month == 'undefined' || month == null || month == '') {
        month_name = window.calendar_default_value.month_names[date_obj.getMonth()];
    }

    let month_of_year_header_element = document.createElement('h3');
    month_of_year_header_element.appendChild(document.createTextNode(month_name + ' ' + date_obj.getFullYear()));
    month_of_year_header_element.style.textAlign = 'center';
    month_of_year_header_element.id = 'month-information';
    month_of_year_element.appendChild(month_of_year_header_element);

    let right_navigator_element = document.createElement('div');
    right_navigator_element.style.float = 'right';
    right_navigator_element.style.display = 'inline';

    let right_navigator_icon_element = document.createElement('img');
    right_navigator_icon_element.src = 'next.png';
    right_navigator_icon_element.alt = 'next';
    right_navigator_icon_element.id = 'next-month';
    right_navigator_icon_element.width = '20';
    right_navigator_icon_element.height = '20';
//        right_navigator_icon_element.style.float = 'right';
    right_navigator_icon_element.style.cursor = 'pointer';

//        right_navigator_icon_element.dataset.nextMonth = get_next_month();
//        right_navigator_icon_element.dataset.nextYear = get_next_year();

    right_navigator_element.appendChild(right_navigator_icon_element);

    calendar_month_navigator_div.appendChild(right_navigator_element);
    calendar_month_navigator_div.appendChild(left_navigator_element);
    calendar_month_navigator_div.appendChild(month_of_year_element);

    return calendar_month_navigator_div;
}

function get_previous_month() {
    let current_month = parseInt(window.calendar_default_value.current_month);
    return window.calendar_default_value.current_month == 0 ? 11 : current_month - 1;
}

function get_previous_year() {
    let current_year = parseInt(window.calendar_default_value.current_year);
    return window.calendar_default_value.current_month == 0 ? current_year - 1 : window.calendar_default_value.current_year;
}

function get_next_month() {
    let current_month = parseInt(window.calendar_default_value.current_month);
    return window.calendar_default_value.current_month == 11 ? 0 : current_month + 1;
}

function get_next_year() {
    let current_year = parseInt(window.calendar_default_value.current_year);
    return window.calendar_default_value.current_month == 11 ? current_year + 1 : window.calendar_default_value.current_year;
}

function generate_calendar_body(month, year) {
    let calendar_body_div = document.createElement('div');
    calendar_body_div.id = 'calendar-table-content';
    calendar_body_div.style.position = 'relative';

    let calendar_body_table = document.createElement('table');
    calendar_body_table.id = 'calendar-table';
//        calendar_body_table.style.textAlign = 'center';

    let calendar_body_day_name_bar = generate_day_name_bar();

    let calendar_body_content = generate_calendar_body_content(month, year);

    calendar_body_table.appendChild(calendar_body_day_name_bar);
    calendar_body_table.appendChild(calendar_body_content);

    calendar_body_div.appendChild(calendar_body_table);

    return calendar_body_div;
}

function get_number_from_string(str) {
    let number = str.match(/\d/g);
    number = number.join("");

    return number;
}

function get_each_day_column_width() {
    let total_width = window.calendar_options.width;
    total_width = get_number_from_string(total_width);

    let single_column_width = total_width / 7;

    return single_column_width;
}

function generate_day_name_bar() {
    let week_day_name_tray_thead = document.createElement('thead');
    let week_day_name_tray_tr = document.createElement('tr');

    let week_days = window.calendar_default_value.week_days;

    for (let i = 0; i < week_days.length; i++) {
        let week_day_name_tray_th = document.createElement('th');

        week_day_name_tray_th.appendChild(document.createTextNode(week_days[i]));
        week_day_name_tray_th.style.width = get_each_day_column_width() + 'px';
        week_day_name_tray_th.style.padding = '10px 5px';
        week_day_name_tray_th.style.backgroundColor = '#29785D';
        week_day_name_tray_th.style.color = '#FFFFFF';

        week_day_name_tray_tr.appendChild(week_day_name_tray_th);
    }

    week_day_name_tray_thead.appendChild(week_day_name_tray_tr);

    return week_day_name_tray_thead;
}

function generate_calendar_body_content(month, year) {
    window.calendar_default_value.current_month = month;
    window.calendar_default_value.current_year = year;
    window.calendar_default_value.current_day = 0;
    window.calendar_default_value.current_date = null;
    window.calendar_default_value.days_in_month = days_in_month(window.calendar_default_value.current_month, window.calendar_default_value.current_year);

    let total_weeks_in_month = weeks_in_month(window.calendar_default_value.current_month, window.calendar_default_value.current_year);

//        console.log('Total weeks in this month: ' + total_weeks_in_month);

    let calendar_content_tbody = document.createElement('tbody');
    calendar_content_tbody.style.textAlign = 'center';

    for (let i = 0; i < (total_weeks_in_month); i++) {
        let calendar_content_tr = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            let day_content = show_day(i * 7 + j);

            let calendar_content_td = document.createElement('td');

            if (day_content != '') {
                calendar_content_td.style.position = 'relative';

                let calendar_content_td_div = document.createElement('div');

                let calendar_content_td_notes_edit_div = document.createElement('div');
                calendar_content_td_notes_edit_div.style.position = 'absolute';
                calendar_content_td_notes_edit_div.style.top = 0;
                calendar_content_td_notes_edit_div.style.right = 0;

                let calendar_content_td_day_div = document.createElement('div');
                let calendar_content_td_notes_div = document.createElement('div');

                let calendar_content_td_notes_edit_img = document.createElement('img');
                calendar_content_td_notes_edit_img.src = 'edit.png';
                calendar_content_td_notes_edit_img.width = '16';
                calendar_content_td_notes_edit_img.height = '16';
                calendar_content_td_notes_edit_img.style.display = 'none';
                calendar_content_td_notes_edit_img.style.cursor = 'pointer';
                calendar_content_td_notes_edit_img.dataset.year = window.calendar_default_value.current_year;
                calendar_content_td_notes_edit_img.dataset.month = window.calendar_default_value.current_month;
                calendar_content_td_notes_edit_img.dataset.day = day_content;

                calendar_content_td.onmouseover = function () {
                    calendar_content_td_notes_edit_img.style.display = 'block';
                };

                calendar_content_td.onmouseout = function () {
                    calendar_content_td_notes_edit_img.style.display = 'none';
                };

                let cell_year = window.calendar_default_value.current_year;
                let cell_month = window.calendar_default_value.current_month + 1;
                let cell_day = day_content;

                let id = cell_year + '/' + cell_month + '/' + cell_day;

                calendar_content_td_notes_edit_img.addEventListener('click', function (e) {
                    e.preventDefault();
                    let calendar_table_content_element = document.getElementById('calendar-table-content');

//                        let calendar_table_element = document.getElementById('calendar-table');
//                        calendar_table_element.style.opacity = '.5';

                    let unique_margin = 30;

                    let calendar_table_width = calendar_table_content_element.offsetWidth;
                    let calendar_table_height = calendar_table_content_element.offsetHeight;

                    let popup_width = parseInt(calendar_table_width) - (unique_margin * 2);
                    let popup_height = parseInt(calendar_table_height) - unique_margin;

                    let popup_modal = document.createElement('div');

                    popup_modal.id = 'js-popup-modal';
                    popup_modal.style.width = popup_width + 'px';
                    popup_modal.style.minHeight = popup_height + 'px';
                    popup_modal.style.position = 'absolute';
                    popup_modal.style.zIndex = 1000;
                    popup_modal.style.backgroundColor = '#FFFFFF';
                    popup_modal.style.top = 0;
                    popup_modal.style.left = 0;
                    popup_modal.style.margin = parseInt(unique_margin - 25) + 'px ' + parseInt(unique_margin) + 'px ' + parseInt(unique_margin) + 'px';

                    let popup_modal_div = document.createElement('div');
                    popup_modal_div.style.margin = '15px 30px';
                    popup_modal_div.style.clear = 'both';

                    popup_modal_div.appendChild(generate_modal_close_tray());
                    popup_modal_div.appendChild(generate_modal_body_title());
//                        console.log(id);
                    popup_modal_div.appendChild(generate_modal_event_list(id));
                    popup_modal_div.appendChild(generate_add_event_tray(day_content));

                    popup_modal.appendChild(popup_modal_div);

                    calendar_table_content_element.appendChild(popup_modal);
                });

                calendar_content_td_notes_edit_div.appendChild(calendar_content_td_notes_edit_img);

                let calendar_content_td_day_span = document.createElement('span');
                calendar_content_td_day_span.appendChild(document.createTextNode(day_content));

                calendar_content_td_day_div.appendChild(calendar_content_td_day_span);

                let calendar_content_td_notes_a = document.createElement('a');

                let online_events_count = get_local_storage_events_count_of_a_day(id);
                let offline_events_count = get_local_storage_offline_events_count_of_a_day(id);

                //console.log(online_events_count);
                let total_events = parseInt(online_events_count + offline_events_count);

                let link_notes;

                if (total_events == 0) {
                    link_notes = '';
                } else if (total_events > 1) {
                    link_notes = total_events + ' events';
                } else {
                    link_notes = total_events + ' event';
                }

                calendar_content_td_notes_a.href = '#';
                calendar_content_td_notes_a.style.textDecoration = 'none';
                calendar_content_td_notes_a.style.color = '#E8E8E8';
                calendar_content_td_notes_a.style.fontSize = '14px';

                calendar_content_td_notes_a.appendChild(document.createTextNode(link_notes));
                calendar_content_td_notes_a.dataset.year = window.calendar_default_value.current_year;
                calendar_content_td_notes_a.dataset.month = window.calendar_default_value.current_month;
                calendar_content_td_notes_a.dataset.day = day_content;

                calendar_content_td_notes_a.addEventListener('click', function (e) {
                    e.preventDefault();

                    let calendar_table_content_element = document.getElementById('calendar-table-content');

//                        let calendar_table_element = document.getElementById('calendar-table');
//                        calendar_table_element.style.opacity = '.5';

                    let unique_margin = 30;

                    let calendar_table_width = calendar_table_content_element.offsetWidth;
                    let calendar_table_height = calendar_table_content_element.offsetHeight;

                    let popup_width = parseInt(calendar_table_width) - (unique_margin * 2);
                    let popup_height = parseInt(calendar_table_height) - (unique_margin * 2);

                    let popup_modal = document.createElement('div');

                    popup_modal.id = 'js-popup-modal';
                    popup_modal.style.width = popup_width + 'px';
                    popup_modal.style.height = popup_height + 'px';
                    popup_modal.style.position = 'absolute';
                    popup_modal.style.zIndex = 1000;
                    popup_modal.style.backgroundColor = '#FFFFFF';
                    popup_modal.style.top = 0;
                    popup_modal.style.left = 0;
                    popup_modal.style.margin = parseInt(unique_margin) + 'px ' + parseInt(unique_margin) + 'px ' + parseInt(unique_margin) + 'px';

                    let popup_modal_div = document.createElement('div');
                    popup_modal_div.style.margin = '15px 30px';
                    popup_modal_div.style.clear = 'both';

                    popup_modal_div.appendChild(generate_modal_close_tray());
                    popup_modal_div.appendChild(generate_modal_body_title());
                    popup_modal_div.appendChild(generate_modal_event_list(id, popup_height));
                    popup_modal_div.appendChild(generate_add_event_tray(day_content));

                    popup_modal.appendChild(popup_modal_div);

                    calendar_table_content_element.appendChild(popup_modal);
                });

                calendar_content_td_notes_div.style.marginTop = '10px';

                calendar_content_td_notes_div.appendChild(calendar_content_td_notes_a);

                calendar_content_td_div.appendChild(calendar_content_td_day_div);
                calendar_content_td_div.appendChild(calendar_content_td_notes_div);

                calendar_content_td.appendChild(calendar_content_td_notes_edit_div);
                calendar_content_td.appendChild(calendar_content_td_div);
            }

            let current_date_obj = new Date();

            let current_month = current_date_obj.getMonth();
            let current_year = current_date_obj.getFullYear();
            let current_day = current_date_obj.getDate();

            calendar_content_td.style.width = get_each_day_column_width() + 'px';
            calendar_content_td.style.padding = '22px 10px 8px 10px';
            calendar_content_td.style.color = '#FFFFFF';

            if ((current_year == window.calendar_default_value.current_year) && (window.calendar_default_value.current_month == current_month) && (parseInt(current_day) == parseInt(day_content))) {
                calendar_content_td.style.backgroundColor = '#E8A90C';
            } else {
                calendar_content_td.style.backgroundColor = '#2EB01B';
            }

            calendar_content_tr.appendChild(calendar_content_td);
        }
        calendar_content_tbody.appendChild(calendar_content_tr);

        if (window.calendar_default_value.current_day != 0 && ((window.calendar_default_value.current_day - 1) == window.calendar_default_value.days_in_month)) {
            break;
        }
    }

    return calendar_content_tbody;
}

function generate_event_add_elements(table_width, current_day) {
    table_width = parseInt(table_width - 50);
    let add_event_fields_parent_element = document.createElement('div');
    add_event_fields_parent_element.id = 'add-event-fields';
    add_event_fields_parent_element.style.padding = '15px 0';
    add_event_fields_parent_element.style.clear = 'both';
    //add_event_fields_parent_element.style.overflowY = 'auto';
    //add_event_fields_parent_element.style.maxHeight = '200px';

//        let add_event_left_fields_parent_element = document.createElement('div');
//        add_event_left_fields_parent_element.style.float = 'left';
//        add_event_left_fields_parent_element.style.width = '150px';
//        let add_event_right_fields_parent_element = document.createElement('div');
//        add_event_right_fields_parent_element.style.float = 'right';
//        add_event_right_fields_parent_element.style.width = '150px';

    let add_event_form_element = document.createElement('form');
    add_event_form_element.action = '#';
    add_event_form_element.method = 'post';

    let add_event_fields_table_element = document.createElement('table');
    add_event_fields_table_element.style.width = table_width + 'px';

    let add_event_fields_table_tr_1_element = document.createElement('tr');

    let add_event_summary_td_label = document.createElement('td');
    let add_event_summary_label = document.createElement('label');
    add_event_summary_label.style.marginRight = '25px';
    add_event_summary_label.appendChild(document.createTextNode('Summary'));
    add_event_summary_td_label.appendChild(add_event_summary_label);

    let add_event_summary_td_input = document.createElement('td');
    let add_event_summary_input = document.createElement('input');
    add_event_summary_input.style.width = '100%';
    add_event_summary_input.type = 'text';
    add_event_summary_input.name = 'summary';
    add_event_summary_td_input.appendChild(add_event_summary_input);

    add_event_fields_table_tr_1_element.appendChild(add_event_summary_td_label);
    add_event_fields_table_tr_1_element.appendChild(add_event_summary_td_input);

    let add_event_fields_table_tr_2_element = document.createElement('tr');

    let add_event_location_td_label = document.createElement('td');
    let add_event_location_label = document.createElement('label');
    add_event_location_label.style.marginRight = '25px';
    add_event_location_label.appendChild(document.createTextNode('Location'));
    add_event_location_td_label.appendChild(add_event_location_label);

    let add_event_location_td_input = document.createElement('td');
    let add_event_location_input = document.createElement('input');
    add_event_location_input.style.width = '100%';
    add_event_location_input.type = 'text';
    add_event_location_input.name = 'location';
    add_event_location_td_input.appendChild(add_event_location_input);

    let autocomplete = new google.maps.places.Autocomplete(add_event_location_input);

    add_event_fields_table_tr_2_element.appendChild(add_event_location_td_label);
    add_event_fields_table_tr_2_element.appendChild(add_event_location_td_input);

    let add_event_fields_table_tr_3_element = document.createElement('tr');

    let add_event_description_td_label = document.createElement('td');
    let add_event_description_label = document.createElement('label');
    add_event_description_label.style.marginRight = '25px';
    add_event_description_label.appendChild(document.createTextNode('Description'));
    add_event_description_td_label.appendChild(add_event_description_label);

    let add_event_description_textarea_td = document.createElement('td');
    let add_event_description_textarea = document.createElement('textarea');
    add_event_description_textarea.style.width = '100%';
    add_event_description_textarea.name = 'description';
    add_event_description_textarea_td.appendChild(add_event_description_textarea);

    add_event_fields_table_tr_3_element.appendChild(add_event_description_td_label);
    add_event_fields_table_tr_3_element.appendChild(add_event_description_textarea_td);

    let add_event_start_time_hidden_input = document.createElement('input');
    add_event_start_time_hidden_input.type = 'hidden';
    add_event_start_time_hidden_input.name = 'start-time';

    let formatted_month = ("0" + (parseInt(window.calendar_default_value.current_month) + 1)).slice(-2);

    let start_time = window.calendar_default_value.current_year + '-' + formatted_month + '-' + current_day;

//        console.log(start_time);
    add_event_start_time_hidden_input.value = start_time;

    let add_event_fields_table_tr_4_element = document.createElement('tr');

    let add_event_start_time_td_label = document.createElement('td');
    let add_event_start_time_label = document.createElement('label');
    add_event_start_time_label.style.marginRight = '25px';
    add_event_start_time_label.appendChild(document.createTextNode('Start Time'));
    add_event_start_time_td_label.appendChild(add_event_start_time_label);

    let add_event_start_time_td_input = document.createElement('td');
    let add_event_start_time_input = document.createElement('label');

//        let start_time_picker = new Pikaday({
//            field: add_event_start_time_input,
//            format: 'D/M/YYYY',
//            firstDay: 1,
//            minDate: new Date(),
//            toString: function (date, format) {
//                const day = date.getDate();
//                const month = date.getMonth() + 1;
//                const year = date.getFullYear();
//                return day + '/' + month + '/' + year;
//            },
//            parse: function (dateString, format) {
//                const parts = dateString.split('/');
//                const day = parseInt(parts[0], 10);
//                const month = parseInt(parts[1] - 1, 10);
//                const year = parseInt(parts[1], 10);
//                return new Date(year, month, day);
//            },
//        });

    add_event_start_time_input.style.width = '100%';
    add_event_start_time_input.appendChild(document.createTextNode(start_time));
//        add_event_start_time_input.type = 'span';
//        add_event_start_time_input.name = 'start-time';
    add_event_start_time_td_input.appendChild(add_event_start_time_input);

    add_event_fields_table_tr_4_element.appendChild(add_event_start_time_td_label);
    add_event_fields_table_tr_4_element.appendChild(add_event_start_time_td_input);

    let add_event_fields_table_tr_5_element = document.createElement('tr');

    let add_event_end_time_td_label = document.createElement('td');
    let add_event_end_time_label = document.createElement('label');
    add_event_end_time_label.style.marginRight = '25px';
    add_event_end_time_label.appendChild(document.createTextNode('End Time'));
    add_event_end_time_td_label.appendChild(add_event_end_time_label);

    let add_event_end_time_td_input = document.createElement('td');
    let add_event_end_time_input = document.createElement('input');
    add_event_end_time_input.style.width = '100%';
    add_event_end_time_input.type = 'text';
    add_event_end_time_input.name = 'end-time';
    add_event_end_time_input.value = start_time;
    add_event_end_time_td_input.appendChild(add_event_end_time_input);

    let end_time_picker = new Pikaday({
        field: add_event_end_time_input,
        firstDay: 1,
        minDate: new Date(window.calendar_default_value.current_year, window.calendar_default_value.current_month, current_day),
        toString: function (date, format) {
            const day = date.getDate();
            let month = date.getMonth() + 1;
            month = ("0" + month).slice(-2);
            const year = date.getFullYear();
            return year + '-' + month + '-' + day;
        },
        //parse: function (dateString, format) {
        //    const parts = dateString.split('/');
        //    const day = parseInt(parts[0], 10);
        //    const month = parseInt(parts[1] - 1, 10);
        //    const year = parseInt(parts[1], 10);
        //    return new Date(year, month, day);
        //}
    });

    add_event_fields_table_tr_5_element.appendChild(add_event_end_time_td_label);
    add_event_fields_table_tr_5_element.appendChild(add_event_end_time_td_input);

    let add_event_fields_table_tr_6_element = document.createElement('tr');

    let add_event_attendees_email_td_label = document.createElement('td');
    let add_event_attendees_email_label = document.createElement('label');
    add_event_attendees_email_label.style.marginRight = '15px';
    add_event_attendees_email_label.appendChild(document.createTextNode('Attendees Email'));
    add_event_attendees_email_td_label.appendChild(add_event_attendees_email_label);

    let add_event_attendees_email_textarea_td = document.createElement('td');
    let add_event_attendees_email_textarea = document.createElement('textarea');
    add_event_attendees_email_textarea.style.width = '100%';
    add_event_attendees_email_textarea.name = 'attendees-email';
    add_event_attendees_email_textarea.placeholder = 'Enter email separated by comma';
    add_event_attendees_email_textarea_td.appendChild(add_event_attendees_email_textarea);

    add_event_fields_table_tr_6_element.appendChild(add_event_attendees_email_td_label);
    add_event_fields_table_tr_6_element.appendChild(add_event_attendees_email_textarea_td);

    let add_event_fields_table_tr_7_element = document.createElement('tr');

    let save_event_empty_td = document.createElement('td');
    let save_event_td = document.createElement('td');
    let save_event = document.createElement('button');
    save_event.type = 'submit';
    save_event.appendChild(document.createTextNode('Add Event'));
    save_event_td.appendChild(save_event);

    add_event_fields_table_tr_7_element.appendChild(save_event_empty_td);
    add_event_fields_table_tr_7_element.appendChild(save_event_td);

    add_event_fields_table_element.appendChild(add_event_fields_table_tr_1_element);
    add_event_fields_table_element.appendChild(add_event_fields_table_tr_2_element);
    add_event_fields_table_element.appendChild(add_event_fields_table_tr_3_element);
    add_event_fields_table_element.appendChild(add_event_fields_table_tr_4_element);
    add_event_fields_table_element.appendChild(add_event_fields_table_tr_5_element);
    add_event_fields_table_element.appendChild(add_event_fields_table_tr_6_element);
    add_event_fields_table_element.appendChild(add_event_fields_table_tr_7_element);

    add_event_form_element.appendChild(add_event_fields_table_element);
    add_event_form_element.appendChild(add_event_start_time_hidden_input);

    add_event_form_element.onkeypress = check_enter_key_pressed;
    add_event_form_element.addEventListener('submit', function (e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        let summary = form_data.get('summary');
        let location = form_data.get('location');
        let description = form_data.get('description');
        let start_time = form_data.get('start-time');
//            console.log(start_time);
//        start_time = start_time.split('/');
//        let start_time_object = new Date(start_time[2], parseInt(start_time[1] - 1), start_time[0]);
//        start_time = start_time_object;
//            console.log(start_time);
        let end_time = form_data.get('end-time');
        //end_time = end_time.split('/');
        //
        //let end_time_object = new Date(end_time[2], parseInt(end_time[1] - 1), end_time[0]);
        //end_time = end_time_object;

        let attendees_email = form_data.get('attendees-email');

        if (typeof attendees_email == 'undefined' || attendees_email == null || attendees_email == '') {
            attendees_email = [];
        } else {
            attendees_email = attendees_email.split(',');
        }

        let attendees_array = [];

        if (attendees_email.length > 0) {
            for (let count = 0; count < attendees_email.length; count++) {
                let attendees_object = {};

                attendees_object.email = attendees_email[count];

                attendees_array.push(attendees_object);
            }
        }

        let year = window.calendar_default_value.current_year;
        let month = window.calendar_default_value.current_month;
        month = parseInt(month) + 1;
        let day = current_day;

        let id = year + '/' + month + '/' + day;

        let unique_id = uuidv4();

        let event = {
            id: unique_id,
            summary: summary,
            location: location,
            description: description,
            start_time: start_time,
            end_time: end_time,
            time_zone: 'America/Los_Angeles',
            attendees_email: attendees_array,
        };

        document.getElementById('add-event-fields').parentNode.removeChild(document.getElementById('add-event-fields'));
        document.getElementById('add-event-tray').style.height = '';
        document.getElementById('add-close-event').src = 'up.png';

        insert_an_event(id, event);
    });

    add_event_fields_parent_element.appendChild(add_event_form_element);

    return add_event_fields_parent_element;
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function generate_add_event_tray(current_day) {
    let popup_modal_div_element = document.getElementById('calendar-table-content');
    let popup_modal_div_width = popup_modal_div_element.offsetWidth;

    let event_add_element = document.createElement('div');
    event_add_element.style.position = 'absolute';
    event_add_element.style.bottom = '0';
    event_add_element.id = 'add-event-tray';
    event_add_element.style.backgroundColor = '#D6D6D6';
    event_add_element.style.width = parseInt(popup_modal_div_width - 120) + 'px';

    let event_add_link_container_element = document.createElement('div');
    event_add_link_container_element.style.padding = '10px 15px';
    event_add_link_container_element.style.clear = 'both';

    let up_down_navigator_image = document.createElement('img');
    up_down_navigator_image.src = 'up.png';
    up_down_navigator_image.id = 'add-close-event';
    up_down_navigator_image.style.cursor = 'pointer';
    up_down_navigator_image.style.float = 'right';

    up_down_navigator_image.addEventListener('click', function (e) {
        e.preventDefault();

        let modal_element = document.getElementById('js-popup-modal');
        let modal_height = modal_element.offsetHeight;

        let event_fields_element = generate_event_add_elements(popup_modal_div_width - 120, current_day);
        event_fields_element.style.padding = '10px 15px';

        if (typeof event_add_element.style.height == 'undefined' || event_add_element.style.height == null || event_add_element.style.height == '') {
            //event_add_element.style.height = parseInt(modal_height - parseInt(modal_height / 5)) + 'px';
            event_add_element.style.height = 'auto';
            event_add_element.appendChild(event_fields_element);
            e.target.src = 'down.png';
        } else {
            document.getElementById('add-event-fields').parentNode.removeChild(document.getElementById('add-event-fields'));
            event_add_element.style.height = '';
            e.target.src = 'up.png';
        }
    });

    let event_add_link_element = document.createElement('a');
    event_add_link_element.appendChild(document.createTextNode('Add Event'));
    event_add_link_element.href = '#';
    event_add_link_element.style.textDecoration = 'none';
    event_add_link_element.style.color = '#3D1F13';

    event_add_link_element.addEventListener('click', function (e) {
        e.preventDefault();

        let modal_element = document.getElementById('js-popup-modal');
        let modal_height = modal_element.offsetHeight;

        let event_fields_element = generate_event_add_elements(popup_modal_div_width - 120, current_day);
        event_fields_element.style.padding = '10px 15px';

        if (typeof event_add_element.style.height == 'undefined' || event_add_element.style.height == null || event_add_element.style.height == '') {
            //event_add_element.style.height = parseInt(modal_height - parseInt(modal_height / 5)) + 'px';
            event_add_element.style.height = 'auto';
            event_add_element.appendChild(event_fields_element);
            up_down_navigator_image.src = 'down.png';
        } else {
            document.getElementById('add-event-fields').parentNode.removeChild(document.getElementById('add-event-fields'));
            event_add_element.style.height = '';
            up_down_navigator_image.src = 'up.png';
        }
    });

    event_add_link_container_element.appendChild(event_add_link_element);
    event_add_link_container_element.appendChild(up_down_navigator_image);

    event_add_element.appendChild(event_add_link_container_element);

    return event_add_element;
}

function generate_modal_event_list(id, popup_height) {
    let events_list_element = document.createElement('div');
    events_list_element.style.overflowY = 'auto';
    events_list_element.style.maxHeight = parseInt((popup_height / 2) + 60) + 'px';

    let popup_modal_div_element = document.getElementById('calendar-table-content');
    let popup_modal_div_width = popup_modal_div_element.offsetWidth;

    let events_list_table_element = document.createElement('table');
    events_list_table_element.id = 'js-calendar-events-list';
    events_list_table_element.style.minWidth = parseInt(popup_modal_div_width - 140) + 'px';
    events_list_table_element.style.maxWidth = parseInt(popup_modal_div_width - 120) + 'px';

    let calendar_event_list = get_local_storage_events_of_a_day(id);
    //console.log(calendar_event_list);
    let calendar_event_offline_list = get_local_storage_offline_events_of_a_day(id);

    if (!calendar_event_list) {
        calendar_event_list = [];
    }

    if (!calendar_event_offline_list) {
        calendar_event_offline_list = [];
    }

    let calendar_events = calendar_event_list.concat(calendar_event_offline_list);

    if (calendar_events.length > 0) {
        for (let i = 0; i < calendar_events.length; i++) {
            let event_tr = generate_modal_event_table_row(calendar_events[i]);

            events_list_table_element.appendChild(event_tr);
        }
    }

    events_list_element.appendChild(events_list_table_element);

    return events_list_element;
}

function generate_modal_event_table_row(event) {
    //console.log(event);
    let event_tr = document.createElement('tr');

    let event_td = document.createElement('td');
    event_td.style.color = '#FFFFFF';
    event_td.style.padding = '10px';
    event_td.style.backgroundColor = '#7A6A60';
    event_td.style.borderRadius = '2px';
    //event_td.style.display = 'relative';

    let container_div = document.createElement('div');

    let close_image = document.createElement('img');
    close_image.src = 'close-red.png';
    //close_image.style.position = 'absolute';
    close_image.style.cursor = 'pointer';
    close_image.style.float = 'right';
    close_image.width = 16;
    close_image.height = 16;
    //close_image.style.top = 0;
    //close_image.style.right = 0;

    let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    let internet_connected = check_internet_connected();

    if (isSignedIn && internet_connected && (event.google_event_id != null)) {
        //console.log(event);
        close_image.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm("Are you sure to delete?")) {
                delete_google_event(event);
                event_tr.parentNode.removeChild(event_tr);
            }
        });

        container_div.appendChild(close_image);
    }

    let summary_div = document.createElement('div');
    let summary_div_header = document.createElement('h3');
    let description_div = document.createElement('div');
    let date_div = document.createElement('div');
    let date_div_span = document.createElement('span');
    date_div_span.style.color = '#D9D8ED';

    if (typeof event.summary != 'undefined' && event.summary != null && event.summary != '') {
        let event_summary = event.summary;
        summary_div_header.appendChild(document.createTextNode(event_summary));
        summary_div_header.style.margin = '5px 0';
        summary_div.appendChild(summary_div_header);
        container_div.appendChild(summary_div);
    }

    if (typeof event.description != 'undefined' && event.description != null && event.description != '') {
        let event_description = event.description;
        description_div.appendChild(document.createTextNode(event_description));
        container_div.appendChild(description_div);
    }

    if (typeof event.start_time != 'undefined' && event.start_time != null && event.start_time != '') {
        let event_date = event.start_time;
        date_div_span.appendChild(document.createTextNode(format_date(new Date(event_date))));
        date_div_span.style.fontSize = '12px';
        date_div.appendChild(date_div_span);
        date_div.style.marginTop = '8px';
        container_div.appendChild(date_div);
    }

    event_td.appendChild(container_div);
    event_tr.appendChild(event_td);

    return event_tr;
}

function format_date(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function generate_modal_close_tray() {
    let close_tray_element = document.createElement('div');
    close_tray_element.style.width = '100%';

    let close_image = document.createElement('img');
    close_image.src = 'close.png';
    close_image.width = '22';
    close_image.height = '22';
    close_image.style.float = 'right';
    close_image.style.cursor = 'pointer';

    close_image.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('js-popup-modal').parentNode.removeChild(document.getElementById('js-popup-modal'));

//            let calendar_table_element = document.getElementById('calendar-table');
//            calendar_table_element.style.opacity = '1';
    })
    close_tray_element.appendChild(close_image);

    return close_tray_element;
}

function generate_modal_body_title() {
    let title_element = document.createElement('div');
    //let underline_element = document.createElement('hr');
//        title_element.style.float = 'left';
    title_element.style.marginTop = '5px';
    title_element.style.marginBottom = '5px';
    let title_header_element = document.createElement('h3');

    title_header_element.appendChild(document.createTextNode('Events'));

    title_element.appendChild(title_header_element);
    //title_element.appendChild(underline_element);

    return title_element;
}

function show_day(cell_number) {

    if (window.calendar_default_value.current_day == 0) {
        let day_object = new Date(window.calendar_default_value.current_year, window.calendar_default_value.current_month, 1);

        let week_day_name = day_object.toString().split(' ')[0];
        let week_day_name_index = window.calendar_default_value.week_days.indexOf(week_day_name);

        if (parseInt(cell_number) == parseInt(week_day_name_index)) {
            window.calendar_default_value.current_day = 1;
        }
    }

    let cell_content = '';

    if ((window.calendar_default_value.current_day != 0) && (window.calendar_default_value.current_day <= window.calendar_default_value.days_in_month)) {

        let current_day_object = new Date(window.calendar_default_value.current_year + '-' + window.calendar_default_value.current_month + '-' + window.calendar_default_value.current_day);

        window.calendar_default_value.current_date = current_day_object.getDate();

        cell_content = window.calendar_default_value.current_day;

        window.calendar_default_value.current_day++;

    }
    else {
        window.calendar_default_value.current_date = null;

        cell_content = '';
    }

    return cell_content;
}

/**
 * calculate number of weeks in a particular month
 */
function weeks_in_month(month, year) {
    var first_day_of_month = new Date(year, month, 1);
    var last_day_of_month = new Date(year, month + 1, 0);

//        console.log(first_day_of_month + ':' + last_day_of_month);

    var used = first_day_of_month.getDay() + 6 + last_day_of_month.getDate();

    return Math.ceil(used / 7);
}

function days_in_month(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function check_internet_connected() {
    return navigator.onLine;
}

//    Google Calendar Integrations

// Client ID and API key from the Developer Console
var CLIENT_ID = window.calendar_options.CLIENT_ID;
var API_KEY = window.calendar_options.API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = window.calendar_api_options.DISCOVERY_DOCS;

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = window.calendar_api_options.SCOPES;

var authorizeButton = document.getElementById('authorize-google-calendar');
var signoutButton = document.getElementById('signout-google-calendar');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
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
//            authorizeButton.style.display = 'none';
        signoutButton.style.display = 'inline';
        listUpcomingEvents();
    } else {
//            authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
//            location.reload();
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
//        location.reload();
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
//        var pre = document.getElementById('content');
//        var textContent = document.createTextNode(message + '\n');
//        pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;

        if (events.length > 0) {
            remove_local_storage_data();
            for (let i = 0; i < events.length; i++) {
                var event = events[i];
//                    console.log(event);
                let when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                let end_time = event.end.dateTime;
                if (!end_time) {
                    end_time = event.end.date;
                }

                let date_object = new Date(when);

                let year = date_object.getFullYear();
                let month = date_object.getMonth() + 1;
                let day = date_object.getDate();

                let id = year + '/' + month + '/' + day;

                let local_storage_event = {
                    google_event_id: event.id,
                    summary: event.summary,
                    location: event.location,
                    description: event.description,
                    start_time: when,
                    end_time: end_time,
                    time_zone: event.end.timeZone,
                    attendees_email: event.attendees,
                };

                save_events_after_google_inserted(id, local_storage_event);
            }
//                reload_calendar_body(window.calendar_default_value.current_year, window.calendar_default_value.current_month);
        } else {

        }

        refresh_calendar();
    });
}

function create_google_event(id, event_object) {
//        console.log(event_object);
    var default_event = {
        'summary': event_object.summary,
        'location': event_object.location,
        'description': event_object.description,
        'start': {
            'date': event_object.start_time,
            'timeZone': event_object.time_zone
        },
        'end': {
            'date': event_object.end_time,
            'timeZone': event_object.time_zone
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=1'
        ],
        'attendees': event_object.attendees_email,
        'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10}
            ]
        }
    };

//        execute_google_event_insert(custom_event, event_object, id);

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': default_event
    });

    request.execute(function (event) {
        //console.log(default_event);
        default_event.google_event_id = event.id;
        save_events_after_google_inserted(id, default_event);
        return event.id;
    });
}

function delete_google_event(event) {
    if (typeof event.google_event_id != 'undefined' || event.google_event_id != null || event.google_event_id != '') {
        //console.log(event);

        var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            eventId: event.google_event_id,
        });

        request.execute(function (event) {
            //console.log(event);
            //default_event.google_event_id = event.id;
            //save_events_after_google_inserted(id, default_event);
            return event.id;
        });
    }
}

function delete_local_storage_offline_data(id, event) {
    let local_storage_data = get_local_storage_offline_data();

    let event_id = event.id;

    if (typeof local_storage_data[id] != 'undefined' || local_storage_data[id] != null || local_storage_data[id] != '') {
        let events_array = Object.values(local_storage_data[id]);


    }
}

//    function execute_google_event_insert(custom_event, event_object, id){
//        var request = gapi.client.calendar.events.insert({
//            'calendarId': 'primary',
//            'resource': custom_event
//        });
//
//        request.execute(function (event) {
//            console.log(event);
//            event_object.google_event_id = event.id;
//            save_events_after_google_inserted(id, event_object);
//            return event_object.id;
//        });
//    }

function check_if_local_storage_set() {
    if (localStorage.getItem("js-calendar-events") === null) {
        return false;
    } else {
        return true;
    }
}

function check_if_local_storage_offline_set() {
    if (localStorage.getItem("js-calendar-offline-events") === null) {
        return false;
    } else {
        return true;
    }
}

function get_local_storage_data() {
    return JSON.parse(localStorage.getItem("js-calendar-events"));
}

function set_local_storage_data(event) {
    return localStorage.setItem("js-calendar-events", JSON.stringify(event));
}

function get_local_storage_offline_data() {
    return JSON.parse(localStorage.getItem("js-calendar-offline-events"));
}

function set_local_storage_offline_data(event) {
    return localStorage.setItem("js-calendar-offline-events", JSON.stringify(event));
}

function remove_local_storage_data() {
    if (check_if_local_storage_set())
        localStorage.removeItem('js-calendar-events');
}

function remove_local_storage_offline_data() {
    if (check_if_local_storage_offline_set())
        localStorage.removeItem('js-calendar-offline-events');
}

function get_local_storage_events_of_a_day(id) {
    if (check_if_local_storage_set()) {
        let local_storage_data = get_local_storage_data();

        if (typeof local_storage_data[id] == 'undefined' || local_storage_data[id] == null || local_storage_data[id] == '') {
            return false;
        } else {
            return local_storage_data[id];
        }
    } else {
        return false;
    }
}

function get_local_storage_offline_events_of_a_day(id) {
    if (check_if_local_storage_offline_set()) {
        let local_storage_data = get_local_storage_offline_data();

        if (typeof local_storage_data[id] == 'undefined' || local_storage_data[id] == null || local_storage_data[id] == '') {
            return false;
        } else {
            return local_storage_data[id];
        }
    } else {
        return false;
    }
}

function get_local_storage_events_count_of_a_day(id) {
    if (check_if_local_storage_set()) {
        let local_storage_data = get_local_storage_data();

        if (typeof local_storage_data[id] == 'undefined' || local_storage_data[id] == null || local_storage_data[id] == '') {
            return 0;
        } else {
            return local_storage_data[id].length;
        }
    } else {
        return 0;
    }
}

function get_local_storage_offline_events_count_of_a_day(id) {
    if (check_if_local_storage_offline_set()) {
        let local_storage_data = get_local_storage_offline_data();

        if (typeof local_storage_data[id] == 'undefined' || local_storage_data[id] == null || local_storage_data[id] == '') {
            return 0;
        } else {
            return local_storage_data[id].length;
        }
    } else {
        return 0;
    }
}

function insert_an_event(id, event) {
    let internet_connected = check_internet_connected();

    if (internet_connected) {
        let local_storage_offline_set = check_if_local_storage_offline_set();

        let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();

        if (isSignedIn) {
            let google_event_id = create_google_event(id, event);
//                console.log('Google event id: '+google_event_id);
        } else {
            let local_storage_object;

            if (local_storage_offline_set) {
                local_storage_object = get_local_storage_offline_data();
            } else {
                local_storage_object = new Object();
            }

            if (typeof local_storage_object[id] == 'undefined' || local_storage_object[id] == null || local_storage_object[id] == '') {
                local_storage_object[id] = [];
                local_storage_object[id].push(event);
            } else {
                local_storage_object[id].push(event);
            }

            set_local_storage_offline_data(local_storage_object);

            refresh_calendar();
        }
    } else {
        let local_storage_offline_set = check_if_local_storage_offline_set();

        let local_storage_object;

        if (local_storage_offline_set) {
            local_storage_object = get_local_storage_offline_data();
        } else {
            local_storage_object = new Object();
        }

        if (typeof local_storage_object[id] == 'undefined' || local_storage_object[id] == null || local_storage_object[id] == '') {
            local_storage_object[id] = [];
            local_storage_object[id].push(event);
        } else {
            local_storage_object[id].push(event);
        }

        set_local_storage_offline_data(local_storage_object);

        refresh_calendar();
    }

    let table_row = generate_modal_event_table_row(event);

    document.getElementById('js-calendar-events-list').appendChild(table_row);
}

function save_events_after_google_inserted(id, event) {
    //console.log('ID: '+id);
    let local_storage_set = check_if_local_storage_set();

    let local_storage_object;

    if (local_storage_set) {
        local_storage_object = get_local_storage_data();
    } else {
        local_storage_object = new Object();
    }
    if (typeof local_storage_object[id] == 'undefined' || local_storage_object[id] == null || local_storage_object[id] == '') {
        local_storage_object[id] = [];
        local_storage_object[id].push(event);
    } else {
        local_storage_object[id].push(event);
    }
//        console.log(local_storage_object);
    set_local_storage_data(local_storage_object);

    //console.log(local_storage_object);

    refresh_calendar();
}

function insert_offline_event_to_google() {
    if (check_internet_connected()) {
        let get_local_storage_offline_events = get_local_storage_offline_data();
        let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();

        if (typeof get_local_storage_offline_events === 'object' && isSignedIn) {
            get_local_storage_offline_events = Object.values(get_local_storage_offline_events);
            if (get_local_storage_offline_events.length > 0) {
                for (let i = 0; i < get_local_storage_offline_events.length; i++) {
                    let id = get_local_storage_offline_events[i];
//                        console.log(id);
                    for (let j = 0; j < get_local_storage_offline_events[i].length; j++) {
                        create_google_event(id, get_local_storage_offline_events[i][j]);
                    }
                }
                set_local_storage_offline_data({});
            }
        }
    }
}

function check_enter_key_pressed(e) {
    e = e || event;
    var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
    return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
}

let google_place_api_url = 'https://maps.googleapis.com/maps/api/js?key=' + window.calendar_options.API_KEY + '&libraries=places';

document.write("<script async defer type='text/javascript' src='" + google_place_api_url + "'><\/scr" + "ipt>");

//    let google_calendar_events = '';
//
//    document.write('<async defer src="https://apis.google.com/js/api.js"'+
//            +'onload="this.onload=function(){};handleClientLoad()"'+
//    +'onreadystatechange="if (this.readyState === "complete") this.onload()"><\/scr" + "ipt>');