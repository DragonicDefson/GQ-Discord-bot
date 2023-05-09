<?php

    include_once("./utils/config.php");

    class Security {

        public static function encrypt($data, $vector) {
            $config = Config::get()["app"]["encryption"];
            return bin2hex(openssl_encrypt($data, $config["type"], $config["private-key"], OPENSSL_RAW_DATA,  $vector));
        }

        public static function decrypt($data, $vector) {
            $config = Config::get()["app"]["encryption"];
            return hex2bin(openssl_decrypt($data, $config["type"], $config["private-key"], OPENSSL_RAW_DATA,  $vector));
        }

        public static function vectorgen() {
            return random_bytes(Config::get()["app"]["encryption"]["iv-length"]);
        }
    }

?>