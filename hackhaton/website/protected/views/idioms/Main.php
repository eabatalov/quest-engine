<!DOCTYPE html>
<html class="html">
 <head>

  <meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
  <meta name="generator" content="7.1.329.244"/>
  <title>Profile</title>
  <!-- CSS -->
    <!--<link rel="stylesheet" type="text/css" href="/assets/idioms/css/site_global.css?417434784"/>
    <link rel="stylesheet" type="text/css" href="/assets/idioms/css/index.css?18673589" id="pagesheet"/>-->

    <link href="/assets/jquery-ui-1.10.3.custom/css/overcast/jquery-ui-1.10.3.custom.css" rel="stylesheet">
    <script src="/assets/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js"></script>
    <script src="/assets/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js"></script>

    <script src="/assets/jquery.json-2.4.js"></script>
    <!--<script src="/assets/idioms/scripts/museutils.js"></script>-->
    <script src="/assets/idioms/scripts/jquery.watch.js"></script>
    <!-- Latest compiled and minified CSS -->
    <!--<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">-->
    <!-- Optional theme -->
    <!--<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap-theme.min.css">-->
    <!-- Latest compiled and minified JavaScript -->
    <!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>-->
  <!-- Other scripts -->
  <script type="text/javascript">
   document.documentElement.className += ' js';
  </script>
  <style>
    /** {
        border-style: dashed;
        border-width: 1px;
        border-color: black;
    }*/

    .ans_img_a {
        background-color: #E6E6E6;
        /*display: block;
        background-size: 320px 90px;
        height: 90px;
        width: 320px;*/
    }

    .ans_img_a:hover {
        background-color: greenyellow;
    }
</style>
</head>
<body style="margin: 0px; background-color: #E6E6E6;">
    <div style="width: 964px; left: 434px; top:-3px; position: absolute;">
        <img style="z-index: 0;" src="/assets/idioms/images/header.png"/>
     </div>
    <div style="margin-left: auto; margin-right: auto; width: 960px; margin-top: 33px; background-color: white;">
        <img style="z-index: 1;" src="/assets/idioms/images/profile_page.png"/>
     </div>
     <div id="ach1_block" style="display: none; position: absolute; top: 517px; left: 805px;">
         <img src="/assets/idioms/images/head.png"/>
     </div>
     <div id="ach2_block" style="display: none; position: absolute; top: 600px; left: 805px;">
        <img src="/assets/idioms/images/space.png"/>
     </div>

     <div style="font-weight: bold; font-size: 22pt; font-family: arial; position: absolute; top: 882px; left: 990px;">
        <span id="english_points"></span>
     </div>

     <div style="font-weight: bold; font-size: 22pt; font-family: arial; position: absolute; top: 1350px; left: 1050px;">
        <span id="amazon_awards1"></span>
     </div>
<script type="text/javascript">
    function outputAchAnimationCB(achName) {
        $('#' + achName + '_block').toggle( 'bounce', { times: 2 }, 'slow', 'show' );
    }

    $(function() {
        <?php
        function outputAchAnimation($achName, $timeout) {
            echo "setTimeout(function() { outputAchAnimationCB('" . $achName . "'); }, " . strval($timeout) .");" . PHP_EOL;
        }
        foreach ($new_bages as $ix => $bageName) {
            outputAchAnimation($bageName, ($ix  + 1) * 1000);
        }
        ?>
        updatePointsCounter();
        updateRewards();
    });

    function updatePointsCounter() {
        pointsLeftToUpdateEnglish = <?php echo strval($new_points_english); ?>;
        currentEnglishPoints = 15;
        updateCurrentEnglishPoints();
        setTimeout(updatePointsCounterCB, 300)
    }
    
    function updatePointsCounterCB() {
        if (pointsLeftToUpdateEnglish > 0) {
            currentEnglishPoints += 1;
            pointsLeftToUpdateEnglish -= 1;
            updateCurrentEnglishPoints();
            setTimeout(updatePointsCounterCB, 300);
        }
    }

    function updateCurrentEnglishPoints() {
        $("#english_points").text(currentEnglishPoints.toString());
    }

    function updateRewards() {
        currentAmazonAwards = 3;
        updateAmazonAwards();

        $("#awards_congrat").dialog({ autoOpen: false,
            height: 300,
            width: "auto",
            close: function( event, ui ) { $("#goto_main").click(); },
            buttons: [
            {
              text: "Tell friends!",
              click: function() {
                $(this).dialog("close");
              }
            },
            {
              text: "Ok",
              click: function() {
                $(this).dialog("close");
              }
            }
            ]
        });
        if (currentEnglishPoints + pointsLeftToUpdateEnglish >= 21) {
            setTimeout(showRwardsCongrat, 3000);
        }
    }

    function showRwardsCongrat() {
        $("#awards_congrat").dialog("open");
        setTimeout(function() { currentAmazonAwards += 1; updateAmazonAwards(); }, 1000);
    }

    function updateAmazonAwards() {
        $("#amazon_awards1").text(currentAmazonAwards.toString() + " $");
        $("#amazon_awards2").text(currentAmazonAwards.toString() + " $");
    }
</script>

<div id="awards_congrat" title="New award!">
    <p style="font-size: 30pt;">You got 1$ for your learning from Amazon:
        <span id="amazon_awards2"></span></p>
</div>

</body>
</html>