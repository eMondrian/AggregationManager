#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
ls $ROOT_DIR
for file in $ROOT_DIR/assets/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  sed -i 's|VITE_BE_BASE_PATH|'${VITE_BE_BASE_PATH}'|g' $file 

done

echo "Starting Nginx"
nginx -g 'daemon off;'