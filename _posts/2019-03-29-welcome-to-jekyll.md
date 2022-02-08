---
title: Migrate blog to github pages with jekyll
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
date: '2017-10-20 08:26:28 -0400'
categories: jekyll update
---

## 1. Markdown Lanuage:
https://guides.github.com/features/mastering-markdown/
To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary front matter. 

## 2. Work with Jekyll:

### 1) Commands to use:
```
ruby --version
gem install bundler
bundle install --force
bundle info "github-pages"
bundle info "jekyll-remote-theme"
bundle exec jekyll serve
To update::
If you followed our setup recommendations and installed Bundler, run bundle update github-pages or simply bundle update and all your gems will update to the latest versions.
If you don't have Bundler installed, run gem update github-pages
```

### 2) Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

## 3. Troubleshooting

* Your site is having problems building: You have an error on line 16 of your _config.yml file
https://codebeautify.org/yaml-validator

* Conversion error: Jekyll::Converters::Scss encountered an error while converting 'assets/css/main.scss': Invalid GBK character "\xE2" on line 54
windows users may got this issue,  open powershell, execute
```
Set-ExecutionPolicy RemoteSigned
New-Item -Path $Profile -ItemType file -Force
```
C:\Users\<yourname>\Documents\WindowsPowerShell\\Microsoft.PowerShell_profile.ps1
copy paste "chcp 65001 >$null"(without quote) inito it and save, then open up another powershell should do the trick
refer to https://williamwang.info/setup-jekyll-on-windows/

*  failed load  jekyll-xxxx plugin
try install it in your Gemfile and add it to the plugins array of _config.yml

## 4. Reference

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/