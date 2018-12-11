<?php

if ($_FILES["file"]["error"]>0)
{
	echo"Error : ".$_FILES["file"]["error"]."<br />";
}else(
	if ($_FILES["file"]["size"]<20000)
	{
		echo"<center>"
		echo"upload:".$_FILES["file"]["name"]."<br />";
		echo"Type:".$_FILES["file"]["type"]."<br />";
		echo"Size:".($_FILES["file"]["size"/1024])."<br />";
		echo"Stored in:".$_FILES["file"]["tmp_name"]."<br />";
	}else{
		echo"Error:".$_FILES["file"]["name"]."is too big !!"
	}	
)

echo "uploading..."


if (file_exists("upload/".$_FILES["file"]["name"]))
{
	echo $_FILES["file"]["name"]."already exists";
}else{
	move_uploaded_file($_FILES["file"]["tmp_name"],
	 "upload/".$_FILES["file"]["name"]);
	echo "Stored in:"."upload/".$_FILES["file"]["name"];
}

?>
