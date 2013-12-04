<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
        <title><?php echo Yii::app()->name;?>
            <?php echo $this->pageTitle == EGPControllerBase::$DEFAULT_PAGE_TITLE ? "" : (" : " . $this->pageTitle)?>
        </title>
	<link rel="stylesheet" href="/media/css/style.css" type="text/css">
        <link href="/assets/jquery-ui-1.10.3.custom/css/overcast/jquery-ui-1.10.3.custom.css" rel="stylesheet">
	<script src="/assets/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js"></script>
	<script src="/assets/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js"></script>
        <script src="/assets/jquery.json-2.4.js"></script>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap-theme.min.css">
        <!-- Latest compiled and minified JavaScript -->
        <!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>-->
</head>
<body>

<style>
    * {
        border-style: dashed;
        border-width: 1px;
        border-color: black;
    }

    .ans_img_a {
        border-width: 0px;
        display: block;
        background-size: 320px 90px;
        height: 90px;
        width: 320px;
    }

    .ans_img_a:hover {
        border-width: 3px;
        border-color: greenyellow;
    }
</style>
<span class="course_name" style="font-size: 64pt;">
    English Idioms
</span>
<div class="course_content">
    <div id="progress_block">
        <div id="progressbar"></div>
    </div>    
    <div id="question_block">
        <div id="question_text_block">
            <span id="question_text" style="font-size: 30pt;"></span>
        </div>
        <div id="question_answers">
            <div class="question_answer">
                <span id="ans1_text"></span>
                <a id="ans1_img_a"  class="ans_img_a"></a>
            </div>
            <div class="question_answer">
                <span id="ans2_text"></span>
                <a id="ans2_img_a" class="ans_img_a"></a>
            </div>
            <div class="question_answer">
                <span id="ans3_text"></span>
                <a id="ans3_img_a" class="ans_img_a"></a>
            </div>
            <div class="question_answer">
                <span id="ans4_text"></span>
                <a id="ans4_img_a" class="ans_img_a"></a>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(function() {
        //Initial game state here
        questionList = [
            {
                "id" : 2,
                "text" : "Any accountant worth their ... should be aware of the latest changes in taxation.",
                "answers" : [
                    { "text" : "Salt.", "img" : "/assets/idioms/questions/2/salt.jpg" },
                    { "text" : "Spice.", "img" : "/assets/idioms/questions/2/spice.jpg" },
                    { "text" : "Pepper.", "img" : "/assets/idioms/questions/2/pepper.jpg" },
                    { "text" : "Butter.", "img" : "/assets/idioms/questions/2/butter.jpg" }
                ],
                "rightAnswer" : 1,
                "achivement" : null,
            },
            {
                "id" : 3,
                "text" : "Her attitude to the whole thing drives me crazy! It really ... me off!",
                "answers" : [
                    { "text" : "Ices.", "img" : "/assets/idioms/questions/3/ices.jpg" },
                    { "text" : "Sausages.", "img" : "/assets/idioms/questions/3/sausages.jpg" },
                    { "text" : "Butters.", "img" : "/assets/idioms/questions/2/butter.jpg" },
                    { "text" : "Cheeses.", "img" : "/assets/idioms/questions/3/cheeses.jpg" }
                ],
                "rightAnswer" : 4,
                "achivement" : null,
            },
            {
                "id" : 1,
                "text" : "I went scuba-diving for the first time last summer. \n\
I thought it was going to be a ..., \n\
but I soon realized that it was a lot more difficult than I'd expected.",
                "answers" : [
                    { "text" : "Mug of beer.", "img" : "/assets/idioms/questions/1/mug-of-beer.jpg" },
                    { "text" : "Cup of tea.", "img" : "/assets/idioms/questions/1/cup-of-tea.jpg" },
                    { "text" : "Piece of cake.", "img" : "/assets/idioms/questions/1/piece-of-cake.png" },
                    { "text" : "Can of coke.", "img" : "/assets/idioms/questions/1/can-of-coke.jpg" }
                ],
                "rightAnswer" : 3,
                "achivement" : null,
            },
            {
                "id" : 4,
                "text" : "Most   of my colleagues go for a drink after work on  \n\
Fridays  but I don't normally go. Going  on  a pub crawl is  not my  ... .",
                "answers" : [
                    { "text" : "Mug of beer.", "img" : "/assets/idioms/questions/1/mug-of-beer.jpg" },
                    { "text" : "Cup of tea.", "img" : "/assets/idioms/questions/1/cup-of-tea.jpg" },
                    { "text" : "Piece of cake.", "img" : "/assets/idioms/questions/1/piece-of-cake.png" },
                    { "text" : "Can of coke.", "img" : "/assets/idioms/questions/1/can-of-coke.jpg" }
                ],
                "rightAnswer" : 2,
                "achivement" : "brain+",
            },
            {
                "id" : 9,
                "text" :  "We'd planned to go away for the weekend, but my brother \n\
tripped over our cat on Saturday morning and broke his arm, and, naturally, it all went ... .",
                "answers" : [
                    { "text" : "Carrot-shaped.", "img" : "/assets/idioms/questions/4/carrot-shaped.jpg" },
                    { "text" : "Pear-shaped.", "img" : "/assets/idioms/questions/4/pear-shaped.jpg" },
                    { "text" : "Egg-shaped.", "img" : "/assets/idioms/questions/4/egg-shaped.jpg" },
                    { "text" : "Apple-shaped.", "img" : "/assets/idioms/questions/4/apple-shaped.jpg" }
                ],
                "rightAnswer" : 2,
                "achivement" : null,
            },
            {
                "id" : 5,
                "text" : "He's a very good and honest person. He's the ... of the earth.",
                "answers" : [
                    { "text" : "Pepper.", "img" : "/assets/idioms/questions/2/pepper.jpg" },
                    { "text" : "Flavour.", "img" : "/assets/idioms/questions/5/flavour.jpg" },
                    { "text" : "Salt.", "img" : "/assets/idioms/questions/2/salt.jpg" },
                    { "text" : "Butter.", "img" : "/assets/idioms/questions/2/butter.jpg" }
                ],
                "rightAnswer" : 3,
                "achivement" : null,
            },
            {
                "id" : 6,
                "text" : "Variety is the ... of life.",
                "answers" : [
                    { "text" : "Butter.", "img" : "/assets/idioms/questions/2/butter.jpg" },
                    { "text" : "Spice.", "img" : "/assets/idioms/questions/2/spice.jpg" },
                    { "text" : "Salt.", "img" : "/assets/idioms/questions/2/salt.jpg" },
                    { "text" : "Pepper.", "img" : "/assets/idioms/questions/2/pepper.jpg" }
                ],
                "rightAnswer" : 2,
                "achivement" : null,
            },
            {
                "id" : 7,
                "text" : "How dare you say such nasty things about Stewart? He's the best thing since ... !",
                "answers" : [
                    { "text" : "Strawberry jam.", "img" : "/assets/idioms/questions/6/strawberry-jam.jpg" },
                    { "text" : "Home-made cakes.", "img" : "/assets/idioms/questions/6/home-made-cakes.jpg" },
                    { "text" : "Cornflakes.", "img" : "/assets/idioms/questions/6/cornflakes.jpg" },
                    { "text" : "Sliced bread.", "img" : "/assets/idioms/questions/6/sliced-bread.jpg" }
                ],
                "rightAnswer" : 4,
                "achivement" : null,
            },
            {
                "id" : 8,
                "text" : "Did you see the way Lucy handled that angry customer? She was as cool as ... .",
                "answers" : [
                    { "text" : "Ice-cream.", "img" : "/assets/idioms/questions/7/ice-cream.jpg" },
                    { "text" : "a frozen fish", "img" : "/assets/idioms/questions/7/a-frozen-fish.jpg" },
                    { "text" : "Iced tea.", "img" : "/assets/idioms/questions/7/iced-tea.jpg" },
                    { "text" : "a cucumber.", "img" : "/assets/idioms/questions/7/a-cucumber.jpg" }
                ],
                "rightAnswer" : 4,
                "achivement" : null,
            },
            {
                "id" : 8,
                "text" : "His new video game is apparently very good as it's selling like ... .",
                "answers" : [
                    { "text" : "Hot dogs.", "img" : "/assets/idioms/questions/8/hot-dogs.jpg" },
                    { "text" : "Hot cakes.", "img" : "/assets/idioms/questions/8/hot-cakes.jpg" },
                    { "text" : "Hot chocolate.", "img" : "/assets/idioms/questions/8/hot-chocolate.jpg" },
                    { "text" : "Hot ketchup.", "img" : "/assets/idioms/questions/8/hot-ketchup.jpg" }
                ],
                "rightAnswer" : 2,
                "achivement" : null,
            },
        ];

        currentQuestionIx = 0;
        answers = [];
        setCurrentQuestion();

        $("#ans1_img_a").click(function() {
            onQuestionAnswerClick(1);
        });
        $("#ans2_img_a").click(function() {
            onQuestionAnswerClick(2);
        });
        $("#ans3_img_a").click(function() {
            onQuestionAnswerClick(3);
        });
        $("#ans4_img_a").click(function() {
            onQuestionAnswerClick(4);
        });

        rightAnsNum = 0;
        setProgressBar(0);
    });

    function updateProgressResults() {
        var currentQuestion = questionList[currentQuestionIx];
        var currentAnswer = answers[currentQuestionIx];
        if (currentAnswer)
            rightAnsNum += 1;
        setProgressBar(rightAnsNum);
    }

    function setProgressBar(val) {
        $("#progressbar").progressbar({
            value: val,
            max: questionList.length
        });
    }

    function onQuestionAnswerClick(ans_ix) {
        var currentQuestion = questionList[currentQuestionIx];
        if (currentQuestion.rightAnswer === ans_ix) {
            answers[currentQuestionIx] = true;
        } else {
            answers[currentQuestionIx] = false;
        }
        updateProgressResults();
        currentQuestionIx += 1;
        if (currentQuestionIx === questionList.length) {
            gameFinished();
        } else {
            setCurrentQuestion();
        }
    }

    function setCurrentQuestion() {
        var currentQuestion = questionList[currentQuestionIx];
        $("#question_text").text(currentQuestion.text);
        $("#ans1_text").text(currentQuestion.answers[0].text);
        $("#ans1_img_a").css("background-image", mkUrl(currentQuestion.answers[0].img));
        $("#ans2_text").text(currentQuestion.answers[1].text);
        $("#ans2_img_a").css("background-image", mkUrl(currentQuestion.answers[1].img));
        $("#ans3_text").text(currentQuestion.answers[2].text);
        $("#ans3_img_a").css("background-image", mkUrl(currentQuestion.answers[2].img));
        $("#ans4_text").text(currentQuestion.answers[3].text);
        $("#ans4_img_a").css("background-image", mkUrl(currentQuestion.answers[3].img));

        setAnsBorder(1, false);
        setAnsBorder(2, false);
        setAnsBorder(3, false);
        setAnsBorder(4, false);
        setAnsBorder( currentQuestion.rightAnswer, true);
    }

    function mkUrl(imageUrl) {
        return 'url(' + imageUrl + ')';
    }

    function setAnsBorder(ansNum, yes) {
        if (yes) {
            $("#ans" + ansNum.toString() + "_img_a").css("border-width", "3px");
            $("#ans" + ansNum.toString() + "_img_a").css("border-style", "solid");
            $("#ans" + ansNum.toString() + "_img_a").css("border-color", "green");
        } else {
            $("#ans" + ansNum.toString() + "_img_a").css("border-width", "0px");
        }
    }
</script>

<form style="display:none" action="/idioms/main" method="POST">
  <input type="text" value="" name="results" id="input_results"/>
  <input type="submit" id="goto_main"/>
</form>

<script type="text/javascript">
    $(function() {
        $("#game_results").dialog({ autoOpen: false,
            close: function( event, ui ) { $("#goto_main").click(); },
            buttons: [
            {
              text: "OK",
              click: function() {
                $(this).dialog("close");
              }
            }]
        });
    });

    function gameFinished() {
        var index;
        for (index = 0; index < questionList.length; ++index) {
            questionList[index].isAnsRight = answers[index];
        }
        $("#input_results").val($.toJSON(questionList));
        showGameResults();
    }

    function showGameResults() {
        //$.toJSON(questionList);
        var listItems = $("#game_results_list li");
        listItems.each(function(i, li) {
            if (i > questionList.length - 1)
                return false;
            if (questionList[i].isAnsRight)
                $(li).css("background-color", "greenyellow");
            else
                $(li).css("background-color", "pink");
        });

        $("#game_results").dialog("open");
    }
</script>

<div id="game_results" title="Game results">
    <h1>Game results!</h1>
    <ul class="list-group" id="game_results_list">
        <li class="list-group-item">1</li>
        <li class="list-group-item">2</li>
        <li class="list-group-item">3</li>
        <li class="list-group-item">4</li>
        <li class="list-group-item">5</li>
        <li class="list-group-item">6</li>
        <li class="list-group-item">7</li>
        <li class="list-group-item">8</li>
    </ul>
</div>

</body>
</html>