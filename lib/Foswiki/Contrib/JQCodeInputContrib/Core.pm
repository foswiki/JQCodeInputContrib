# Plugin for Foswiki - The Free and Open Source Wiki, https://foswiki.org/
#
# OpenAuthPlugin is Copyright (C) 2018 Michael Daum http://michaeldaumconsulting.com
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details, published at
# http://www.gnu.org/copyleft/gpl.html

package Foswiki::Contrib::JQCodeInputContrib::Core;
use strict;
use warnings;

use Foswiki::Plugins::JQueryPlugin::Plugin;
our @ISA = qw( Foswiki::Plugins::JQueryPlugin::Plugin );

sub new {
  my $class = shift;

  my $this = bless(
    $class->SUPER::new(
      name => 'CodeInput',
      version => '1.0',
      author => 'Michael Daum',
      homepage => 'https://foswiki.org/Extensions/JQCodeInputContrib',
      puburl => '%PUBURLPATH%/%SYSTEMWEB%/JQCodeInputContrib',
      css => ['jquery.codeinput.css'],
      javascript => ['jquery.codeinput.js'],
      dependencies => ['livequery'],
    ),
    $class
  );

  return $this;
}

1;
