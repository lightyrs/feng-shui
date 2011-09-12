# encoding: utf-8
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

  def flash_messages
    unless flash.blank? or flash.nil?
      output = ""
      flash.each do |name, msg|
        output += "<div class='alert-message flash #{name}'>
          <a class='close' href='#'> ×</a>
          <p><strong>#{name.capitalize}</strong> #{msg}</p>
        </div>"
      end
      raw output
    end
  end

  def tab_group(sections = {})
    output = ""
    sections.each_with_index do |(title, element), index|
      if index == 0
        output = "<li class='active'><a href='#' data-tab='#{element}'>#{title}</a></li>"
      else
        output += "<li><a href='#' data-tab='#{element}'>#{title}</a></li>"
      end
    end
    raw '<ul class="tabs">' + output + '</ul>'
  end

  def pill_group(sections = {})
    output = ""
    sections.each_with_index do |(title, element), index|
      if index == 0
        output = "<li class='active'><a href='#' data-pill='#{element}'>#{title}</a></li>"
      else
        output += "<li><a href='#' data-pill='#{element}'>#{title}</a></li>"
      end
    end
    raw '<ul class="pills">' + output + '</ul>'
  end
end
