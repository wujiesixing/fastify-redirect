#!/bin/bash

set -e

cd "$(dirname "$0")"

TABLE="countries"
DATABASE="$TABLE.db"
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

if [ ! -f "$DATABASE" ]; then
  sqlite3 "$DATABASE" <<EOF
  CREATE TABLE $TABLE (
    ISO TEXT PRIMARY KEY NOT NULL,
    ISO3 TEXT,
    ISO_Numeric TEXT,
    fips TEXT,
    Country TEXT,
    Capital TEXT,
    Area_sq_km INTEGER,
    Population INTEGER,
    Continent TEXT,
    tld TEXT,
    CurrencyCode TEXT,
    CurrencyName TEXT,
    Phone TEXT,
    PostalCodeFormat TEXT,
    PostalCodeRegex TEXT,
    Languages TEXT,
    geonameid INTEGER,
    neighbours TEXT,
    EquivalentFipsCode TEXT
  );

  CREATE INDEX idx_continent ON $TABLE (Continent);
  CREATE INDEX idx_languages ON $TABLE (Languages);
EOF
else
  printf "\n数据库文件 $DATABASE 已存在，跳过创建表结构和索引步骤。\n"
fi

awk -F'\t' '
BEGIN {
  OFS = "\t";
}
/^[^#]/ {
  gsub(/"/, "", $0);  # Remove double quotes in the line
  gsub(/'\''/, "'\'''\''", $0);  # Escape single quotes in the line
  printf "INSERT OR REPLACE INTO %s (ISO, ISO3, ISO_Numeric, fips, Country, Capital, Area_sq_km, Population, Continent, tld, CurrencyCode, CurrencyName, Phone, PostalCodeFormat, PostalCodeRegex, Languages, geonameid, neighbours, EquivalentFipsCode) VALUES ('\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', %d, %d, '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'', %d, '\''%s'\'', '\''%s'\'');\n", "'"$TABLE"'", $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19;
}
' "$TEMP_FILE" | sqlite3 "$DATABASE" || { printf "\nsqlite3 执行失败！\n"; exit 1; }

printf "\n数据导入成功。\n"
