<?php

  class Navbar {
    public function get_config() {
      $configuration = file_get_contents('../config/configuration.json');
      return json_decode($configuration, true)['application'];
    }
    
    public function update_stats($key_value) {
      $configuration = $this->get_config();
      $url = $configuration['url'];
      $api_call = curl_init(null);
      if (gettype($api_call) == getType(false)) { } else {
        curl_setopt($api_call, CURLOPT_URL, $url . $key_value);
        curl_setopt($api_call, CURLOPT_TIMEOUT, 5);
        curl_setopt($api_call, CURLOPT_RETURNTRANSFER, 0);
        curl_setopt($api_call, CURLOPT_FORBID_REUSE, 1);
        $returned_data = curl_exec($api_call);
        if ($returned_data) {
          curl_close($api_call);
          return $returned_data;
        } else { curl_close($api_call); }
      }
    }
  }

  $navbar = new Navbar();
  $navbar->update_stats($_GET['call_type']);
  
?>
