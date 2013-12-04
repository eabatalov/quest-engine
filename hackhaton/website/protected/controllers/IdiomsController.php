<?php

/**
 * Description of IdiomsController
 *
 * @author eugene
 */
class IdiomsController extends CController {

    public function actionIndex() {
        $this->render("Index");
    }

    public function actionMain() {
        //echo var_dump($_POST["results"], true);
        $model = array(
            "new_points_english" => /*6*/0,
            "new_bages" => /*array("ach1", "ach2")*/ array()
        );
        $data = CJSON::decode($_POST["results"], TRUE);
        $bages = $data["bages"];
        $currentBagesCnt = 3; //like current profile state
        $currentBagesCnt += count($bages); //like improving english skills after game
        /*if ($currentBagesCnt > 5) {*/
            $model["new_points_english"] = count($bages) * 3;
            $model["new_bages"] = $bages;
        /*}*/
        $this->render("Main", $model);
    }
}
