<?php

    include_once("./utils/config.php");
    include_once("security.php");

    class DataExposer {

      private static function handler($key) : CurlHandle {
        $options = self::options($key); $handler = curl_init();
        $vector = Security::vectorgen();
        $encrypted_data = Security::encrypt($key, $vector);
        curl_setopt($handler, CURLOPT_URL, "http://$options[0]:$options[1]/api/v$options[2]/games");
        curl_setopt($handler, CURLOPT_TIMEOUT, $options[3]);
        curl_setopt($handler, CURLOPT_FORBID_REUSE, $options[4]);
        curl_setopt($handler, CURLOPT_RETURNTRANSFER, $options[5]);
        curl_setopt($handler, CURLOPT_POST, 1);
        curl_setopt($handler, CURLOPT_POSTFIELDS, "data=$encrypted_data&public_key=$vector");
        return $handler;
      }

      private static function options() : array {
        $config = Config::get()["app"]["curl-settings"];
        $global = Config::get()["global"];
        $connection_settings = $global["sub-modules"]["api"];
        $options = array(
          $connection_settings["ip"],
          $connection_settings["port"],
          $global["version"],
          $config["timeout"],
          $config["forbid-reuse"],
          $config["return-transfer"],
        );
        return $options;
      }

      public static function call() {
        $handler = self::handler($_GET["call_type"]);
        $data = curl_exec($handler);
        echo $data;
        curl_close($handler);
      }
    }

    DataExposer::call();
?>
