#!/bin/bash

set -e

cd "$(dirname "$0")"

ENV="../.env"
URL="https://download.maxmind.com/geoip/databases/GeoLite2-Country/download"

cleanup() {
  rm -f GeoLite2-Country.tar.gz GeoLite2-Country.tar.gz.sha256
  printf "\n清理：已删除临时文件。\n"
}

trap cleanup EXIT

if [ -f $ENV ]; then
  source $ENV
else
  printf "\n错误：.env 不存在！\n"
  exit 1
fi

check_var() {
  local var_name="$1"
  if [ -z "${!var_name}" ]; then
    printf "\n错误：$var_name 不存在t!\n"
    exit 1
  fi
}

check_var "MAXMIND_ACCOUNT_ID"
check_var "MAXMIND_LICENSE_KEY"

for SUFFIX in tar.gz tar.gz.sha256; do
  printf "\n正在下载 GeoLite2-Country.%s...\n" "$SUFFIX"
  curl -L -u "$MAXMIND_ACCOUNT_ID:$MAXMIND_LICENSE_KEY" "$URL?suffix=$SUFFIX" -o "GeoLite2-Country.$SUFFIX"
done

downloaded_hash=$(sha256sum GeoLite2-Country.tar.gz | awk '{ print $1 }')
expected_hash=$(awk '{ print $1 }' GeoLite2-Country.tar.gz.sha256)

if [ "$downloaded_hash" != "$expected_hash" ]; then
  printf "\n错误：SHA256 验证失败！\n"
  exit 1
fi

printf "\nSHA256 验证成功。开始解压...\n"

tar --extract --file="GeoLite2-Country.tar.gz" --strip-components=1 --wildcards '*.mmdb'

printf "\n解压完成。\n"
