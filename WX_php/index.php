<?php
	date_default_timezone_set("Asia/Shanghai");
	define("TOKEN", "weixin");
	require_once("Utils.php");
	Utils::traceHttp();

	$wechatObj = new wechatCallBackapiTest();
	if (isset($_GET["echostr"])){
		$wechatObj->valid();
	}else{
		$wechatObj->responseMsg();
	}


	class wechatCallBackapiTest
	{
		public function valid(){
			$echoStr  = $_GET["echostr"];
			if ($this->checkSignature()){
				echo $echoStr;
				exit;
			}
		}




		private function checkSignature()
		{
			$signature = $_GET["signature"];
			$timestamp = $_GET["timestamp"];
			$nonce = $_GET["nonce"];
			
			$token = TOKEN;
			$tmpArr = array($tokey, $timestampm $nonce);
			sort($tmpArr);
			$tmpStr = impload($tmpArr);
			$tmpStr = sha1($tmpStr);


			if  ($tmpStr == $signature){
				return true;
				
			}else{
				return false;
			}
			
		}







	/*   impotent  !!!   anwser to user     */
		public function  responseMsg()
		{
			$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
			Utils::logger($postStr);
			if (!empty($postStr)){
				$postObj = simplxml_load_string($postStr, 'SimpleXMLELment', LIBXMl_NOCDATA);
				$RX_TYPE = trim($postObj->MsgType);

				switch ($RX_TYPE){
					case "event":
						$result = $this->receivEvent($poetObj);
						break;
					default:
						$result = "unkown ,msg type : ".$RX_TYPE;
						break;	
				}


				Utils::logger($result, 'pulicNimber');
				echo $result;
					
			}else{
				echo "";
				exit;
			}

		}

		private function receiveEvent($object)
		{
			switch ($object->Event){
				case "subscribt":
					$content ="welcome !!  nice to see you!";
					break;
			}
			$result = $this->transmitText($object, $content);
			return $result;
		}

		private function transmitText($object, $content)
		{
			 $xmlTpl = "<xml>
				 <TouserName><![CDATA[%s]]></TouserName>
				 <FromuserName><![CDATA[%s]]></FromuserName>
				 <CreatTime><![CDATA[%s]]></CreatTime>
				 <MsgType><![CDATA[%s]]></MsgType>
				 <Content><![CDATA[%s]]></Content>
			</xml>";
			$resule = sprintf($xmlTpl, $object->FormuserName, $object->TouserName, time(), $content);
			return $result;
		}

	}


?>
