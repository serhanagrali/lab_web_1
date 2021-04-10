<?php

function checkData($x, $y, $r)
{
    return in_array($x, array(-4, -3, -2, -1, 0, 1, 2, 3, 4)) &&
        is_numeric($y) && ($y > -3 && $y < 3) &&
        in_array($r, array(1, 1.5, 2, 2.5, 3));
}

function atRectangle($x, $y, $r)
{
    return (($x >= 0) && ($x <= $r / 2) && ($y >= 0) && ($y <= $r));
}

function atTriangle($x, $y, $r)
{
    return (($x <= 0) && ($y <= 0) && ($y >= -1/2*$x - $r / 2));
}

function atQuarterCircle($x, $y, $r)
{
    return (($x >= 0) && ($y <= 0) && (($x * $x + $y * $y) <= $r * $r));
}

function checkCoordinates($x, $y, $r)
{
    if (atRectangle($x, $y, $r) || atTriangle($x, $y, $r) || atQuarterCircle($x, $y, $r)) {
        return "<span style='color: green'>Да</span>";
    } else return "<span style='color: red'>Нет</span>";
}

session_start();
if (!isset($_SESSION["tableRows"])) {
    $_SESSION["tableRows"] = array();
}

function str_is_float($str){
  return preg_match('/^-?(?:\d+|\d*\.\d+)$/', $str);
}

date_default_timezone_set("Europe/Moscow");
if(isset($_GET['x'])
    && isset($_GET['y'])
    && isset($_GET['r'])
    && str_is_float($_GET['x'])
    && str_is_float($_GET['y'])
    && str_is_float($_GET['r'])){


    $x = (float)$_GET["x"];
    $y = (float)$_GET["y"];
    $r = (float)$_GET["r"];
    if (checkData($x, $y, $r)) {
        $coordsStatus = checkCoordinates($x, $y, $r);
        $currentTime = date("H : i : s");
        $benchmarkTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
        array_unshift($_SESSION["tableRows"], array('x' => $x, 'y' => $y, 'r' => $r,
         'coordsStatus' => $coordsStatus, 'currentTime' => $currentTime,
         'benchmarkTime' => $benchmarkTime));
    }
}

$html = "<table id='outputTable' border='1'><tr>
            <th>x</th>
            <th>y</th>
            <th>r</th>
            <th>Точка входит в ОДЗ</th>
            <th>Текущее время</th>
            <th>Время работы скрипта</th>
        </tr>";

// data rows
foreach($_SESSION["tableRows"] as $row){
    $html .= '<tr>';
    foreach($row as $key=>$value){
        $html .= "<td>" . $value . "</td>";
    }
    $html .= '</tr>';
}
$html .= '</table>';
echo $html;
