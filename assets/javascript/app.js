var app = {
    is_started  : false,
    true_cnt    : 0,
    false_cnt   : 0,
    qn_cur      : 0,
    nxt_qn_delay: 4500,
    qn_timeout  : 25000,
    qn_cnt_down : this.qn_timeout / 1000,
    interval_id : -1,
    qn_timeout_id  : -1,
    ans_ids     : ["A","B","C","D"],
    questions   : [
        {
            content     : "What is the first letter in the Alphabet?",
            options     : ["A","F","O","K"],
            ans_id      : 0,
            user_ans_id : -1,
        },
        {
            content     : "What is the last letter in the Alphabet?",
            options     : ["A","Z","Q","W"],
            ans_id      : 1,
            user_ans_id : -1,
        },
        {
            content     : "How many letters in the english Alphabet?",
            options     : ["30","27","26","24"],
            ans_id      : 2,
            user_ans_id : -1,
        },
        {
            content     : "Which of the following is not true?",
            options     : ["1 === 1","2 == '2'",'"" === ""',"'xy' === 'yx'"],
            ans_id      : 3,
            user_ans_id : -1,
        },
    ],
    reset      : function(){
        app.true_cnt   = 0;
        app.false_cnt  = 0;
        app.qn_cur     = 0;
        app.interval_id= -1;
        app.qn_timeout_id = -1;
        app.questions.forEach(function(item){
            item.user_ans_id = -1;
        });
    },
    cnt_dn_handler  : function(){
        if(app.qn_cnt_down >= 0){
            app.qn_cnt_down--;
            $("#cnt-down").text(app.qn_cnt_down);
        }
    },
    reveal_correct_ans  : function(){
        var correct_ans = app.questions[app.qn_cur].ans_id;
        var user_ans = app.questions[app.qn_cur].user_ans_id;
        var comment = "";

        $("#"+app.ans_ids[correct_ans]).attr("class", "answer true-answer");

        if(user_ans !== -1){
            if(user_ans === correct_ans){
                comment = "Correct!";
                app.true_cnt++;
            }else{
                comment = "You were close, <span>" + app.ans_ids[correct_ans] + "</span> is the correct option!";
                $("#"+app.ans_ids[user_ans]).attr("class", "answer false-answer");
                app.false_cnt++;
            }
        }else{
            comment = "You missed it, (" + app.ans_ids[correct_ans] + ") is the correct option!";
        }

        var $comment_p = $("<p>");
        $comment_p.attr("class", "question-comment");
        $comment_p.html(comment);
        $(".question-counter").remove();
        $("#content").append($("<br>"));
        $("#content").prepend($comment_p);
    },
    ans_handler     : function(){
        if($(".question-comment").length === 0){
            clearInterval(app.interval_id);
            clearTimeout(app.qn_timeout_id);
            app.questions[app.qn_cur].user_ans_id = app.ans_ids.indexOf($(this).attr("id"));
            app.reveal_correct_ans();
            app.qn_cur++;
            setTimeout( app.update_content, app.nxt_qn_delay);
        }
    },
    timeout_handler : function(){
        if($(".question-comment").length === 0){
            clearInterval(app.interval_id);
            clearTimeout(app.qn_timeout_id);
            app.reveal_correct_ans();
            app.qn_cur++;
            setTimeout( app.update_content, app.nxt_qn_delay);
        }
    },
    action_handler  : function(){
        switch( $(this).attr("id")[0] ){
            case "r": //Restart
                app.reset();
                app.update_content();
                break;
            case "s": //Start
                app.is_started = true;
                app.update_content();
                break;
        }
    },
    update_content  : function(){
        if(app.is_started){
            if(app.qn_cur < app.questions.length){
                var $qn_container = $("<div>");

                var $qn_cnt_down = $("<p>");
                $qn_cnt_down.attr("class", "question-counter");
                $qn_cnt_down.html("Time Remaining: "+"<span id='cnt-down'>25</span>");

                var $qn_itself = $("<p>");
                $qn_itself.attr("class", "question-itself");
                $qn_itself.text(app.questions[app.qn_cur].content);

                $qn_container.append($qn_cnt_down);
                $qn_container.append($("<br>"));
                $qn_container.append($qn_itself);
                $qn_container.append($("<br>"));

                app.questions[app.qn_cur].options.forEach(function(item, index){
                    var $qn_optn = $("<p>");
                    $qn_optn.attr("class", "answer");
                    $qn_optn.attr("id", app.ans_ids[index]);
                    $qn_optn.html("<span>"+app.ans_ids[index]+"</span> "+item);
                    $qn_container.append($qn_optn);
                });

                $("#content").html($qn_container.html());

                app.qn_cnt_down     = Math.floor(app.qn_timeout / 1000);
                app.interval_id     = setInterval(app.cnt_dn_handler, 1000);
                app.qn_timeout_id   = setTimeout(app.timeout_handler, app.qn_timeout);
            }else{

                //show statistics and Restart
                var $true_ans_cnt   = $("<p>");
                var $false_ans_cnt  = $("<p>");
                var $un_ans_cnt     = $("<p>");
                $true_ans_cnt.attr("class", "statistics");
                $false_ans_cnt.attr("class", "statistics");
                $un_ans_cnt.attr("class", "statistics");
                $true_ans_cnt.text("Correct Questions: " + app.true_cnt + ".");
                $false_ans_cnt.text("Incorrect Questions: " + app.false_cnt + ".");
                $un_ans_cnt.text("Un-Answered Questions: " + (app.questions.length - app.false_cnt - app.true_cnt) + ".");

                var $restart_btn = $("<div>");
                $restart_btn.attr("class", "action");
                $restart_btn.attr("id", "restart");
                $restart_btn.text("Start Over Again!");
                $("#content").empty();
                $("#content").append($true_ans_cnt);
                $("#content").append($("<br>"));
                $("#content").append($false_ans_cnt);
                $("#content").append($("<br>"));
                $("#content").append($un_ans_cnt);
                $("#content").append($("<br>"));
                $("#content").append($restart_btn);
            }

        }else{
            // show the start button
            var $start_btn = $("<div>");
            $start_btn.attr("class", "action");
            $start_btn.attr("id", "start");
            $start_btn.text("Start!");
            $("#content").append($start_btn);
        }
    },
}
$(document).on("click", ".answer", app.ans_handler);
$(document).on("click", ".action", app.action_handler);
app.update_content();