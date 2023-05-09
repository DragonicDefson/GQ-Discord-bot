<?php

    include_once("../api/config/app/config.php");

    class Config {

        public static function get() {
            $configuration = array(
                "global" => self::global(),
                "app" => AppConfig::get()
            );
            return $configuration;
        }

        private static function global() : mixed {
            return json_decode(file_get_contents("..\api\config\global\config.json"), true);
        }
    }

?>