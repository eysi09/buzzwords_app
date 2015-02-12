module ApplicationHelper
  def include_public_javascripts
    # The loading order is important and not all files in public/javascripts
    # are being loaded.
    # TODO: Figure out with respect to require tree...
    javascript_include_tag *%w(
    ).map { |file| "/javascripts/#{file}" }
  end
end
