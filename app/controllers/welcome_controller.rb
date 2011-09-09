class WelcomeController < ApplicationController

  def index
    flash.now["success"] = "Testing is a success flash."
    flash.now["notice"] = "Testing is a notice flash."
    flash.now["warning"] = "This is a warning flash."
    flash.now["error"] = "This is an error flash."
  end
end