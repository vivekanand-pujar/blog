+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = '{{ .Date }}'
draft = true
description = ''
tags = ['sanskrit']
comments = true

# The text being translated (delete the lines you don't need)
[work]
title = ''        # e.g. Bhagavad Gītā
author = ''       # traditional attribution
section = ''      # e.g. Chapter 2, verses 47–48
metre = ''        # e.g. anuṣṭubh
edition = ''      # the edition you translate from
+++

Introductory note (optional).

{{</* verse n="1" */>}}
Devanagari, one line per pāda or half-verse
---
IAST transliteration, same line breaks
---
Your translation (Markdown).
---
Optional note (Markdown). Delete this part and its --- if there is none.
{{</* /verse */>}}
