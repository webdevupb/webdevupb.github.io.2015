PUSH_TO_HISTORY        = true
DO_NOT_PUSH_TO_HISTORY = false

function update_frontend_schedule(data_as_text) {
  data_set = JSON.parse(data_as_text);
  $("#frontend_schedule").empty();
  for (var id in data_set["frontend"]) {
    schedule_item_data = data_set["frontend"][id];
    var context = {
      course_description: schedule_item_data["course_description"],
      course_instructor:  schedule_item_data["course_instructor"],
      course_date:        schedule_item_data["course_date"]
    };
    var schedule_item_template = $("#schedule_item").html();
    var schedule_item_source_code = _.template(schedule_item_template, context);
    $("#frontend_schedule").append(schedule_item_source_code);
  }
}

function update_backend_schedule(data_as_text) {
  data_set = JSON.parse(data_as_text);
  $("#backend_schedule").empty();
  for (var id in data_set["backend"]) {
    schedule_item_data = data_set["backend"][id];
    var context = {
      course_description: schedule_item_data["course_description"],
      course_instructor:  schedule_item_data["course_instructor"],
      course_date:        schedule_item_data["course_date"]
    };
    var schedule_item_template = $("#schedule_item").html();
    var schedule_item_source_code = _.template(schedule_item_template, context);
    $("#backend_schedule").append(schedule_item_source_code);
  }
}

function navigate(visualstate, push) {
  if (visualstate === "#frontend") {
    var ajax_options = {
      type: "GET",
      url: "/calendar.json?" + Math.round(new Date().getTime()),
      dataType: "text",
      success: update_frontend_schedule
    };
    $.ajax(ajax_options);
  }
  if (visualstate === "#backend") {
    var ajax_options = {
      type: "GET",
      url: "/calendar.json?" + Math.round(new Date().getTime()),
      dataType: "text",
      success: update_backend_schedule
    };
    $.ajax(ajax_options);
  }

  if (visualstate in {"#eg106": 1, "#eg306": 1}) {
    var acs_upb_images = {
      ".acs_upb_01": "images/directions/acs.upb.01.jpg",
      ".acs_upb_02": "images/directions/acs.upb.02.jpg",
      ".acs_upb_03": "images/directions/acs.upb.03.jpg",
      ".acs_upb_04": "images/directions/acs.upb.04.jpg",
      ".acs_upb_05": "images/directions/acs.upb.05.jpg",
      "#eg306_01"  : "images/directions/eg306.01.jpg",
      "#eg306_02"  : "images/directions/eg306.02.jpg",
      "#eg306_03"  : "images/directions/eg306.03.jpg",
      "#eg106_01"  : "images/directions/eg106.01.jpg",
      "#eg106_02"  : "images/directions/eg106.02.jpg",
      "#eg106_03"  : "images/directions/eg106.03.jpg"
    };
    for (var img_id in acs_upb_images) {
      $(img_id).attr("src", acs_upb_images[img_id]);
    }
  }

  $(".visualstate").hide();
  var css_selector_to_display = visualstate + "_content";
  $(css_selector_to_display).css({"display": "block", "opacity": 0}).animate({"opacity": 1}, 250);

  if ($("#menu").css("display") === "none") {
    $("#webdev_heading").hide();
    document.getElementById("top_of_content").scrollIntoView();
  } else {
    $("#webdev_heading").show();
    document.body.scrollIntoView();
  }

  if (visualstate !== "#acasa" && $("#menu").css("display") === "none") {
    $("#tap_target_acasa").show();
  } else {
    $("#tap_target_acasa").hide();
  }

  var base_url = window.location.href.split("#")[0];
  if (push) {
    history.pushState(css_selector_to_display, "/", base_url + visualstate);
  } else {
    history.replaceState(css_selector_to_display, "/", base_url + visualstate);
  }
}

$(".webdevmenuitem").on("click", function(e) {
  e.preventDefault();
  var target_visualstate = $(this).data("id");
  navigate(target_visualstate, PUSH_TO_HISTORY);
});

$("#menu_header").on("click", function(e) {
  e.preventDefault();
  navigate("#acasa", PUSH_TO_HISTORY);
});

$(window).on("popstate", function(event) {
  if (typeof event.state === "string") {
    $(".visualstate").hide();
    $(event.state).css({"display": "block", "opacity": 0}).animate({"opacity": 1}, 250);

    if ($("#menu").css("display") === "none") {
      $("#webdev_heading").hide();
    } else {
      $("#webdev_heading").show();
    }
  }
});

Zepto(function($) {
  var visualstate = "#" + window.location.href.split("#")[1];
  if ( $(visualstate + "_content")[0] ) {
    navigate(visualstate, DO_NOT_PUSH_TO_HISTORY);
  } else {
    navigate("#acasa", DO_NOT_PUSH_TO_HISTORY);
  }

  var all_images = {
    "#webdev_logo":     "images/logos/webdev_logo.png",
//  "#eaudeweb_logo":   "images/logos/eaudeweb_logo.png",
//  "#adobe_logo":      "images/logos/adobe_logo.png",
    "#arrow_hover":     "images/arrow-hover.png",
    "#gradient":        "images/gradient.png"
  };
  for (var img_id in all_images) {
    $(img_id).attr("src", all_images[img_id]);
  }
});

