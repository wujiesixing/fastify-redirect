#!/bin/bash

set -e

cd "$(dirname "$0")"

FILE="../src/countries.json"
TEMP_FILE="countryInfo.txt"
URL="https://download.geonames.org/export/dump/$TEMP_FILE"

cleanup() {
  rm -f "$TEMP_FILE"
  printf "\n清理：已删除临时文件。\n"
}

trap cleanup EXIT

printf "\n正在下载 $TEMP_FILE...\n"
if ! curl -L "$URL" -o "$TEMP_FILE"; then
  printf "\n错误：下载失败！\n"
  exit 1
fi

awk -F'\t' '
BEGIN {
  OFS = "\t";
  print "{";
  first = 1;
}

/^[^#]/ {
  # Escape backslashes first
  gsub(/\\/, "\\\\", $0);
  
  # Escape double quotes
  gsub(/"/, "\\\"", $0);

  if (!first) {
    printf ",\n";
  }
  first = 0;

  printf "  \"%s\": {\n", $1;
  printf "    \"ISO\": \"%s\",\n", $1;
  printf "    \"ISO3\": \"%s\",\n", $2;
  printf "    \"ISO_Numeric\": \"%s\",\n", $3;
  printf "    \"fips\": \"%s\",\n", $4;
  printf "    \"Country\": \"%s\",\n", $5;
  printf "    \"Capital\": \"%s\",\n", $6;
  printf "    \"Area_sq_km\": %d,\n", $7;
  printf "    \"Population\": %d,\n", $8;
  printf "    \"Continent\": \"%s\",\n", $9;
  printf "    \"tld\": \"%s\",\n", $10;
  printf "    \"CurrencyCode\": \"%s\",\n", $11;
  printf "    \"CurrencyName\": \"%s\",\n", $12;
  printf "    \"Phone\": \"%s\",\n", $13;
  printf "    \"PostalCodeFormat\": \"%s\",\n", $14;
  printf "    \"PostalCodeRegex\": \"%s\",\n", $15;
  printf "    \"Languages\": \"%s\",\n", $16;
  printf "    \"geonameid\": %d,\n", $17;
  printf "    \"neighbours\": \"%s\",\n", $18;
  printf "    \"EquivalentFipsCode\": \"%s\"\n", $19;
  printf "  }";
}

END {
  print "\n}";
}
' "$TEMP_FILE" > "$FILE"

printf "\n数据导入成功。\n"
