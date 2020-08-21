<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php"); ?>
<? global $APPLICATION; ?>
<? $APPLICATION->SetTitle("React with bitrix");?>

<p>123</p>
<script>console.log(1)</script>
<img src="https://place-hold.it/300x500" alt="" />
<img src="https://place-hold.it/300x500" alt="" width="300" height="500">

<Wrapper<? r_props(['style' => 'color:red;font-size:20px']) ?>>
    test
</Wrapper>

<div style="color:yellow" onclick="console.log(event)">
    HELLO!!!
</div>

<? require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");