class WelcomeController < ApplicationController

  def index
    flash.now["success"] = "This is a success flash."
    flash.now["notice"] = "This is a notice flash."
    flash.now["warning"] = "This is a warning flash."
    flash.now["error"] = "This is an error flash."
  end
end