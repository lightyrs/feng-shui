module ApplicationHelper

  def body_class
    @body_class ||= [controller.controller_name]
  end

  def h1
    @h1 ||= controller.controller_name.titleize
  end

  def subtitle
    @subtitle ||= ""
  end
end
