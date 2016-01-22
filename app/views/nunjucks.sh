#!/bin/bash
# sed -i '' 's/{{<\(.*\)}}/{% extends "\1.html" %}/g' index.html

FILES="*.html"
# FILES = "index.html"

sed -i '' 's/{{<[[:space:]]*\([^}]*\)[[:space:]]*}}/{% extends "\1.html" %}/g' $FILES

sed -i '' 's/{{<[ ]*\([a-zA-Z/]*\)[ ]*}}/{% extends "\1.html" %}/g' $FILES

sed -i '' 's/{{$\([^}]*\)}}/{% block \1 %}/g' $FILES

sed -i '' 's/{{\/\([^}]*\)}}/{% endblock %}/g' $FILES

sed -i '' 's/{{>\([^}]*\)}}/{% include "\1.html" %}/g' $FILES
